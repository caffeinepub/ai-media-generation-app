import { useState } from 'react';
import { useHasReplicateApiKey, useSetReplicateApiKey } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, XCircle, Key, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ReplicateConfigSetup() {
  const { data: hasKey, isLoading } = useHasReplicateApiKey();
  const setApiKey = useSetReplicateApiKey();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      toast.error('Please enter a valid API key');
      return;
    }
    try {
      await setApiKey.mutateAsync(trimmed);
      setApiKeyInput('');
      toast.success('Replicate API key saved successfully');
    } catch (err: unknown) {
      toast.error(`Failed to save API key: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Warning banner when key is not configured */}
      {!isLoading && !hasKey && (
        <div className="flex items-start gap-3 p-3 bg-amber-subtle border-b border-amber-glow/20">
          <AlertTriangle size={16} className="text-amber-glow flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-glow font-medium">
            Replicate API key is not configured. Media generation will not work until a key is set.
          </p>
        </div>
      )}

      <div className="p-4 border-b border-border flex items-center gap-2">
        <Key size={16} className="text-primary" />
        <h2 className="font-semibold text-foreground">Replicate API Key</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Checking...
            </span>
          ) : hasKey ? (
            <span className="flex items-center gap-1.5 text-sm text-emerald-glow font-medium">
              <CheckCircle size={14} />
              Configured ✓
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-destructive font-medium">
              <XCircle size={14} />
              Not Configured ✗
            </span>
          )}
        </div>

        {/* Key input */}
        <div className="space-y-2">
          <Label htmlFor="replicate-api-key" className="text-sm text-muted-foreground">
            {hasKey ? 'Rotate API Key' : 'Set API Key'}
          </Label>
          <div className="relative">
            <Input
              id="replicate-api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="r8_..."
              className="bg-surface-2 border-border focus:border-primary/50 pr-10 text-sm font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!apiKeyInput.trim() || setApiKey.isPending}
          className="w-full btn-primary text-sm"
          size="sm"
        >
          {setApiKey.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Key size={14} />
              Save API Key
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
