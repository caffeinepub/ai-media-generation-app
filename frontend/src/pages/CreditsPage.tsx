import ProtectedRoute from '../components/ProtectedRoute';
import { useGetCredits, useCreateCheckoutSession } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, Star, Rocket, Crown, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

const CREDIT_BUNDLES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 1000,
    price: 9.99,
    priceInCents: 999,
    icon: <Star size={24} />,
    color: 'border-primary/30 hover:border-primary/60',
    badge: null,
    description: '2 generations',
    perCredit: '$0.010',
  },
  {
    id: 'creator',
    name: 'Creator',
    credits: 5000,
    price: 39.99,
    priceInCents: 3999,
    icon: <Rocket size={24} />,
    color: 'border-accent/30 hover:border-accent/60',
    badge: 'Most Popular',
    description: '10 generations',
    perCredit: '$0.008',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 10000,
    price: 69.99,
    priceInCents: 6999,
    icon: <Crown size={24} />,
    color: 'border-amber-glow/30 hover:border-amber-glow/60',
    badge: 'Best Value',
    description: '20 generations',
    perCredit: '$0.007',
  },
];

function CreditsContent() {
  const { data: credits, isLoading: creditsLoading } = useGetCredits();
  const createCheckout = useCreateCheckoutSession();

  const handlePurchase = async (bundle: typeof CREDIT_BUNDLES[0]) => {
    try {
      const items: ShoppingItem[] = [
        {
          productName: `${bundle.name} Credit Bundle`,
          productDescription: `${bundle.credits} AI generation credits for AI Media Studio`,
          currency: 'usd',
          quantity: BigInt(1),
          priceInCents: BigInt(bundle.priceInCents),
        },
      ];

      const session = await createCheckout.mutateAsync(items);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (err: unknown) {
      toast.error(`Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-2">Purchase Credits</h1>
        <p className="text-muted-foreground">Power your AI creations with credit bundles</p>
      </div>

      {/* Current Balance */}
      <div className="glass-card rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <p className="text-3xl font-bold font-mono text-primary">
              {creditsLoading ? '...' : credits?.toString() ?? '0'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Each generation costs</p>
          <p className="text-lg font-bold font-mono text-foreground">500 credits</p>
          <p className="text-xs text-muted-foreground mt-1">
            ≈ {credits ? Math.floor(Number(credits) / 500) : 0} generations remaining
          </p>
        </div>
      </div>

      {/* Credit Bundles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {CREDIT_BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            className={`glass-card rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 relative ${bundle.color}`}
          >
            {bundle.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="btn-primary text-xs px-3 py-1 shadow-glow-cyan">
                  {bundle.badge}
                </Badge>
              </div>
            )}

            <div className="text-center space-y-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                bundle.id === 'starter' ? 'bg-primary/10 text-primary' :
                bundle.id === 'creator' ? 'bg-accent/10 text-accent' :
                'bg-amber-subtle text-amber-glow'
              }`}>
                {bundle.icon}
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground">{bundle.description}</p>
              </div>

              <div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-foreground">${bundle.price}</span>
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Zap size={12} className="text-primary" />
                  <span className="text-lg font-bold font-mono text-primary">{bundle.credits.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">credits</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{bundle.perCredit} per credit</p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-primary" />
                  <span>{Math.floor(bundle.credits / 500)} image/video generations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-primary" />
                  <span>Never expires</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-primary" />
                  <span>Instant delivery</span>
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(bundle)}
                disabled={createCheckout.isPending}
                className={`w-full font-semibold ${
                  bundle.id === 'starter' ? 'btn-primary' :
                  bundle.id === 'creator' ? 'btn-primary' :
                  'btn-primary'
                }`}
              >
                {createCheckout.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard size={14} />
                    Purchase
                  </span>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Security Note */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-sm text-muted-foreground">
        <CreditCard size={16} className="text-primary flex-shrink-0" />
        <span>Payments are processed securely by Stripe. We never store your payment information.</span>
      </div>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <ProtectedRoute>
      <CreditsContent />
    </ProtectedRoute>
  );
}
