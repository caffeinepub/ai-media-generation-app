import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Stripe "stripe/stripe";

module {
  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    generations : Map.Map<Principal, Nat>;
    galleries : Map.Map<Principal, [Text]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    configuration : ?Stripe.StripeConfiguration;
    GENERATION_COST : Nat; // This dropped field is now explicit
    creditBalances : Map.Map<Principal, Nat>; // This dropped field is now explicit
  };

  type NewActor = {
    generations : Map.Map<Principal, Nat>;
    galleries : Map.Map<Principal, [Text]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    configuration : ?Stripe.StripeConfiguration;
  };

  public func run(old : OldActor) : NewActor {
    {
      generations = old.generations;
      galleries = old.galleries;
      userProfiles = old.userProfiles;
      configuration = old.configuration;
    };
  };
};
