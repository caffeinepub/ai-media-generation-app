import React, { useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Eye, EyeOff, CreditCard, CheckCircle, Plus, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEFAULT_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK'];

export default function StripeConfigSetup() {
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [countries, setCountries] = useState<string[]>(DEFAULT_COUNTRIES);
  const [newCountry, setNewCountry] = useState('');
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setStripeConfiguration = useSetStripeConfiguration();

  if (isConfigured) return null;

  const handleAddCountry = () => {
    const code = newCountry.trim().toUpperCase();
    if (code.length === 2 && !countries.includes(code)) {
      setCountries([...countries, code]);
      setNewCountry('');
    } else {
      toast.error('Enter a valid 2-letter country code not already in the list.');
    }
  };

  const handleRemoveCountry = (code: string) => {
    setCountries(countries.filter((c) => c !== code));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error('Please enter a Stripe secret key.');
      return;
    }
    if (countries.length === 0) {
      toast.error('Please add at least one allowed country.');
      return;
    }
    try {
      await setStripeConfiguration.mutateAsync({ secretKey: secretKey.trim(), allowedCountries: countries });
      toast.success('Stripe configured successfully!');
      setSecretKey('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to configure Stripe.');
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-gold flex items-center justify-center">
          <CreditCard size={16} className="text-gold-500" />
        </div>
        <div>
          <h3 className="text-white/80 font-semibold text-sm">Stripe Payments</h3>
          <p className="text-white/40 text-xs">Configure payment processing</p>
        </div>
        <div className="ml-auto">
          {isLoading ? (
            <span className="badge-amber">Checking...</span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(220,50,50,0.15)', color: 'oklch(0.65 0.18 25)', border: '1px solid rgba(220,50,50,0.25)' }}>
              Not Configured
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="p-5 space-y-5">
        {/* Secret key */}
        <div className="space-y-2">
          <Label htmlFor="stripe-key" className="text-white/50 text-xs font-medium uppercase tracking-wider">
            Stripe Secret Key
          </Label>
          <div className="relative">
            <Input
              id="stripe-key"
              type={showKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_xxxxxxxxxxxxxxxxxxxx"
              className="input-glass rounded-xl pr-10 font-mono text-sm"
              disabled={setStripeConfiguration.isPending}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold-400 transition-colors"
            >
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Allowed countries */}
        <div className="space-y-3">
          <Label className="text-white/50 text-xs font-medium uppercase tracking-wider">
            Allowed Countries
          </Label>
          <div className="flex flex-wrap gap-2">
            {countries.map((code) => (
              <span key={code} className="badge-gold flex items-center gap-1.5">
                {code}
                <button
                  type="button"
                  onClick={() => handleRemoveCountry(code)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="US"
              maxLength={2}
              className="input-glass rounded-xl w-20 text-center font-mono text-sm uppercase"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCountry())}
            />
            <button
              type="button"
              onClick={handleAddCountry}
              className="btn-gold flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={setStripeConfiguration.isPending || !secretKey.trim()}
          className="w-full btn-gold flex items-center justify-center gap-2 py-3 rounded-xl text-sm disabled:opacity-50"
        >
          {setStripeConfiguration.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Configuring...
            </>
          ) : (
            <>
              <Save size={15} />
              Save Stripe Configuration
            </>
          )}
        </button>
      </form>
    </div>
  );
}
