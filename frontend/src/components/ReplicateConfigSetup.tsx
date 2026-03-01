import React, { useState } from 'react';
import { useHasReplicateApiKey, useSetReplicateApiKey } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Eye, EyeOff, Key, CheckCircle, AlertTriangle, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ReplicateConfigSetup() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { data: hasKey, isLoading } = useHasReplicateApiKey();
  const setReplicateApiKey = useSetReplicateApiKey();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key.');
      return;
    }
    try {
      await setReplicateApiKey.mutateAsync(apiKey.trim());
      toast.success('Replicate API key saved successfully!');
      setApiKey('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save API key.');
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl glass-amber flex items-center justify-center">
          <Key size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-white/80 font-semibold text-sm">Replicate API</h3>
          <p className="text-white/40 text-xs">Configure AI generation backend</p>
        </div>
        <div className="ml-auto">
          {isLoading ? (
            <span className="badge-amber">Checking...</span>
          ) : hasKey ? (
            <span className="badge-emerald flex items-center gap-1">
              <CheckCircle size={10} />
              Configured
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(220,50,50,0.15)', color: 'oklch(0.65 0.18 25)', border: '1px solid rgba(220,50,50,0.25)' }}>
              <AlertTriangle size={10} />
              Not Set
            </span>
          )}
        </div>
      </div>

      {!hasKey && !isLoading && (
        <div className="p-4 mx-5 mt-5 rounded-xl border border-amber-500/20"
          style={{ background: 'rgba(255,180,50,0.06)' }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-400/80 text-xs leading-relaxed">
              No Replicate API key is configured. Image and video generation will not work until you add a valid key.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="replicate-key" className="text-white/50 text-xs font-medium uppercase tracking-wider">
            {hasKey ? 'Update API Key' : 'API Key'}
          </Label>
          <div className="relative">
            <Input
              id="replicate-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="r8_xxxxxxxxxxxxxxxxxxxx"
              className="input-glass rounded-xl pr-10 font-mono text-sm"
              disabled={setReplicateApiKey.isPending}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-amber-400 transition-colors"
            >
              {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={setReplicateApiKey.isPending || !apiKey.trim()}
          className="w-full btn-amber flex items-center justify-center gap-2 py-3 rounded-xl text-sm disabled:opacity-50"
        >
          {setReplicateApiKey.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={15} />
              Save API Key
            </>
          )}
        </button>
      </form>
    </div>
  );
}
