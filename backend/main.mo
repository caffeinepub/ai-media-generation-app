import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profiles
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
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
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

  // Generations
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
  public shared ({ caller }) func generateImage(prompt : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate images");
    };
    incrementGenerations(caller);
    let result = await OutCall.httpGetRequest(prompt, [], transform);
    saveToGallery(caller, result);
    result;
  };

  public shared ({ caller }) func generateVideo(prompt : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate videos");
    };
    incrementGenerations(caller);
    let result = await OutCall.httpGetRequest(prompt, [], transform);
    saveToGallery(caller, result);
    result;
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
    configuration := ?config;
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
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
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
    [];
  };

  public shared ({ caller }) func adjustUserCredits(_user : Principal, _amount : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this function");
    };
  };

  public shared ({ caller }) func addUserCredits(_amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this function");
    };
  };
};
