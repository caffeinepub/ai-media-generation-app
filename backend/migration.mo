import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Stripe "stripe/stripe";

module {
  public type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    generations : Map.Map<Principal, Nat>;
    galleries : Map.Map<Principal, [Text]>;
    configuration : ?Stripe.StripeConfiguration;
    // Removed Replicate config and error from old state
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
