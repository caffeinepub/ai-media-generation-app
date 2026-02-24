import { useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreditCard, CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function StripeConfigSetup() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();

  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState<string[]>(['US', 'CA', 'GB']);
  const [newCountry, setNewCountry] = useState('');

  if (isLoading) return null;
  if (isConfigured) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-subtle border border-emerald-glow/20 text-sm">
        <CheckCircle size={16} className="text-emerald-glow" />
        <span className="text-foreground font-medium">Stripe is configured and active</span>
      </div>
    );
  }

  const handleAddCountry = () => {
    const code = newCountry.trim().toUpperCase();
    if (code.length === 2 && !countries.includes(code)) {
      setCountries([...countries, code]);
      setNewCountry('');
    }
  };

  const handleRemoveCountry = (code: string) => {
    setCountries(countries.filter(c => c !== code));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim() || countries.length === 0) return;
    try {
      await setConfig.mutateAsync({ secretKey: secretKey.trim(), allowedCountries: countries });
      toast.success('Stripe configured successfully!');
    } catch (err: unknown) {
      toast.error(`Failed to configure Stripe: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Card className="glass-card border-amber-glow/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-glow">
          <CreditCard size={18} />
          Configure Stripe Payments
        </CardTitle>
        <CardDescription>
          Set up Stripe to enable credit purchases for users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_..."
              className="bg-surface-2 border-border font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Allowed Countries</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {countries.map(code => (
                <span
                  key={code}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-3 text-xs font-mono"
                >
                  {code}
                  <button type="button" onClick={() => handleRemoveCountry(code)} className="text-muted-foreground hover:text-destructive">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value.toUpperCase())}
                placeholder="US"
                maxLength={2}
                className="bg-surface-2 border-border font-mono text-sm w-24"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCountry())}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCountry}>
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!secretKey.trim() || countries.length === 0 || setConfig.isPending}
            className="w-full btn-primary"
          >
            {setConfig.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Configuring...
              </span>
            ) : (
              'Save Stripe Configuration'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
