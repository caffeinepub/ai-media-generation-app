import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, ShoppingItem, StripeConfiguration, ReplicateError } from '../backend';
import { Principal } from '@dfinity/principal';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Credits ─────────────────────────────────────────────────────────────────

// Credits are limitless — return a static placeholder without a backend call.
export function useGetCredits() {
  return useQuery<bigint>({
    queryKey: ['credits'],
    queryFn: async () => BigInt(0),
    staleTime: Infinity,
  });
}

// ─── Generation ──────────────────────────────────────────────────────────────

export function useGenerateImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: string): Promise<ReplicateError> => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.generateImage(prompt);
      return result;
    },
    onSuccess: (result) => {
      // Only invalidate gallery on non-error results
      if (result.__kind__ !== 'ApiKeyMissing' && result.__kind__ !== 'Timeout' && result.__kind__ !== 'ParseError') {
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
      }
    },
  });
}

export function useGenerateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prompt: string): Promise<ReplicateError> => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.generateVideo(prompt);
      return result;
    },
    onSuccess: (result) => {
      // Only invalidate gallery on non-error results
      if (result.__kind__ !== 'ApiKeyMissing' && result.__kind__ !== 'Timeout' && result.__kind__ !== 'ParseError') {
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
      }
    },
  });
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export function useGetGallery() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery<Array<[Principal, bigint]>>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });
}

export function useAdjustUserCredits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, amount }: { user: Principal; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adjustUserCredits(user, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

// ─── Replicate ───────────────────────────────────────────────────────────────

export function useHasReplicateApiKey() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasReplicateApiKey'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasReplicateApiKey();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetReplicateApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (apiKey: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setReplicateApiKey(apiKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasReplicateApiKey'] });
    },
  });
}

// ─── Stripe ──────────────────────────────────────────────────────────────────

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useAddUserCredits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addUserCredits(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}
