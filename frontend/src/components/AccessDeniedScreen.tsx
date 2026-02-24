import { useNavigate } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
          <ShieldX size={28} className="text-destructive" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this area. This section is restricted to administrators only.
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="w-full border-border hover:border-primary/50"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
