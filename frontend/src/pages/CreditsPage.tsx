import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { ShoppingItem } from '../backend';
import { toast } from 'sonner';
import { CreditCard, Zap, Star, Crown, Check, Sparkles, ArrowRight } from 'lucide-react';

const creditBundles = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: '$4.99',
    priceInCents: 499n,
    description: 'Perfect for trying out AI generation',
    features: ['100 image generations', '20 video generations', 'Standard quality', 'Gallery storage'],
    icon: <Zap size={24} />,
    accent: 'amber',
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    credits: 500,
    price: '$19.99',
    priceInCents: 1999n,
    description: 'For regular creators and enthusiasts',
    features: ['500 image generations', '100 video generations', 'High quality output', 'Priority processing', 'Gallery storage'],
    icon: <Star size={24} />,
    accent: 'gold',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 2000,
    price: '$59.99',
    priceInCents: 5999n,
    description: 'For professionals and power users',
    features: ['2000 image generations', '400 video generations', 'Ultra-high quality', 'Priority processing', 'Advanced models', 'API access'],
    icon: <Crown size={24} />,
    accent: 'emerald',
    popular: false,
  },
];

const accentMap: Record<string, { glass: string; icon: string; btn: string; badge: string; check: string }> = {
  amber: { glass: 'glass-amber', icon: 'text-amber-400', btn: 'btn-amber', badge: 'badge-amber', check: 'text-amber-400' },
  gold: { glass: 'glass-gold', icon: 'text-amber-300', btn: 'btn-gold', badge: 'badge-gold', check: 'text-amber-300' },
  emerald: { glass: 'glass-emerald', icon: 'text-emerald-400', btn: 'btn-emerald', badge: 'badge-emerald', check: 'text-emerald-400' },
};

function CreditsContent() {
  const createCheckoutSession = useCreateCheckoutSession();

  const handlePurchase = async (bundle: typeof creditBundles[0]) => {
    try {
      const items: ShoppingItem[] = [{
        productName: `${bundle.name} Credits Bundle`,
        productDescription: bundle.description,
        quantity: 1n,
        priceInCents: bundle.priceInCents,
        currency: 'usd',
      }];
      const session = await createCheckoutSession.mutateAsync(items);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  return (
    <div className="bg-gradient-dark min-h-screen py-10">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(220,180,60,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, rgba(80,200,120,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-gold inline-flex items-center gap-1.5 mb-4">
            <CreditCard size={12} />
            Credit Bundles
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white/90 mb-4">
            Power Up Your <span className="text-gradient-gold">Creativity</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Choose the perfect credit bundle for your creative needs. All plans include gallery storage and high-quality AI generation.
          </p>
        </div>

        {/* Bundle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {creditBundles.map((bundle) => {
            const ac = accentMap[bundle.accent];
            return (
              <div
                key={bundle.id}
                className={`relative ${ac.glass} rounded-2xl p-7 card-hover flex flex-col ${
                  bundle.popular ? 'ring-1 ring-amber-500/40' : ''
                }`}
              >
                {bundle.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-gold flex items-center gap-1 shadow-glow-gold">
                      <Star size={10} />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center mb-5 ${ac.icon}`}>
                  {bundle.icon}
                </div>

                <h3 className="text-xl font-display font-bold text-white/90 mb-1">{bundle.name}</h3>
                <p className="text-white/40 text-sm mb-5">{bundle.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-display font-bold text-gradient-amber">{bundle.price}</span>
                  <span className="text-white/40 text-sm ml-2">one-time</span>
                </div>

                <div className="space-y-2.5 mb-8 flex-1">
                  {bundle.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check size={14} className={ac.check} />
                      <span className="text-white/60 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(bundle)}
                  disabled={createCheckoutSession.isPending}
                  className={`w-full ${ac.btn} flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm disabled:opacity-50`}
                >
                  {createCheckoutSession.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Get {bundle.name}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security note */}
        <div className="glass rounded-2xl p-5 flex items-center gap-4 text-center justify-center">
          <CreditCard size={18} className="text-amber-400 flex-shrink-0" />
          <p className="text-white/40 text-sm">
            Payments are processed securely via <span className="text-amber-400 font-medium">Stripe</span>. Your payment information is never stored on our servers.
          </p>
        </div>
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
