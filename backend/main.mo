import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Nat "mo:core/Nat";
import Migration "migration";

// Use migration mechanism for canister upgrades
(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Generations, Galleries
  let generations = Map.empty<Principal, Nat>();
  let galleries = Map.empty<Principal, [Text]>();

  func incrementGenerations(user : Principal) {
    let current = switch (generations.get(user)) {
      case (null) { 0 };
      case (?count) { count };
    };
    generations.add(user, current + 1);
  };

  // Replicate Integration
  type ReplicateConfig = {
    apiKey : Text;
    stubbed : Bool;
    lastStubbedUpdate : Int;
  };

  // Generation results
  public type Generation = {
    location : Principal;
    prompt : Text;
    imageType : { #image; #video; #audio };
    result : Text;
    timestamp : Int;
    status : GenerationStatus;
  };

  public type GenerationStatus = {
    #started;
    #done;
    #timeExpired;
    #costError;
    #unavailable;
    #failed : { error : Text };
  };

  var generationsMap = Map.empty<Nat, Generation>();
  var nextGenerationId = 1;
  var replicateConfig : ?ReplicateConfig = null;

  public type ReplicateError = {
    #ApiKeyMissing;
    #ApiError : Text;
    #Timeout;
    #ParseError : Text;
  };

  public type ReplicateModel = {
    modelVersion : Text;
    id : Text;
    name : Text;
    pricing : [ReplicatePricing];
  };

  public type ReplicatePricing = {
    inputUnitPrice : Float;
    outputUnitPrice : Float;
    lastUpdated : Int;
  };

  // hasReplicateApiKey is intentionally accessible to any caller (including guests)
  // so the frontend can check whether the key is configured before prompting admin setup.
  public query func hasReplicateApiKey() : async Bool {
    switch (replicateConfig) {
      case (?cf) { not (cf.apiKey.isEmpty()) };
      case (null) { false };
    };
  };

  public shared ({ caller }) func setReplicateApiKey(apiKey : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can update Replicate API key");
    };
    replicateConfig := ?{
      apiKey;
      stubbed = false;
      lastStubbedUpdate = 0;
    };
  };

  func getApiKey() : Text {
    switch (replicateConfig) {
      case (null) {
        Runtime.trap("Replicate API key is not configured. Please set it through the admin panel.");
      };
      case (?config) { config.apiKey };
    };
  };

  public shared ({ caller }) func generateImage(prompt : Text) : async ReplicateError {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate images");
    };
    incrementGenerations(caller);
    let result = await OutCall.httpGetRequest("https://stablediffusionapi.com/api/v3/text2img?prompt=" # prompt, [], transform);
    switch (result.size()) {
      case (0) { #Timeout };
      case (_) {
        saveToGallery(caller, result);
        #ApiError(result);
      };
    };
  };

  public shared ({ caller }) func generateVideo(prompt : Text) : async ReplicateError {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate videos");
    };
    incrementGenerations(caller);
    let result = await OutCall.httpGetRequest("https://stablediffusionapi.com/api/v3/text2img?prompt=" # prompt, [], transform);
    switch (result.size()) {
      case (0) { #Timeout };
      case (_) {
        saveToGallery(caller, result);
        #ApiError(result);
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func saveToGallery(user : Principal, url : Text) {
    let currentGallery = switch (galleries.get(user)) {
      case (null) { [] };
      case (?gallery) { gallery };
    };
    let updatedGallery = currentGallery.concat([url]);
    galleries.add(user, updatedGallery);
  };

  public query ({ caller }) func getGallery() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their gallery");
    };
    switch (galleries.get(caller)) {
      case (null) { [] };
      case (?gallery) { gallery };
    };
  };

  // Stripe Integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
    configuration := ?config;
  };

  // isStripeConfigured is intentionally accessible to any caller so the frontend
  // can check whether Stripe is set up before showing payment options.
  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  // getStripeSessionStatus retrieves payment session data and must be restricted
  // to authenticated users only to prevent unauthenticated probing of session IDs.
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check Stripe session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create a checkout session");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  // Admin Panel
  public query ({ caller }) func getAllUsers() : async [(Principal, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
    generations.toArray();
  };

  public shared ({ caller }) func adjustUserCredits(_user : Principal, _amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
  };

  public shared ({ caller }) func addUserCredits(_amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this function");
    };
  };
};
