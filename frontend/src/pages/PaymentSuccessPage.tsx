import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate credits to refresh balance after successful payment
    queryClient.invalidateQueries({ queryKey: ['credits'] });
  }, [queryClient]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
            <CheckCircle size={36} className="text-primary" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your credits have been added to your account. You're ready to create amazing AI media!
          </p>
        </div>

        <div className="glass rounded-xl p-4 flex items-center justify-center gap-2">
          <Zap size={18} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Credits added to your balance</span>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/generate' })}
            className="w-full btn-primary gap-2"
          >
            <Zap size={16} />
            Start Generating
            <ArrowRight size={16} />
          </Button>
          <Button
            onClick={() => navigate({ to: '/credits' })}
            variant="outline"
            className="w-full border-border hover:border-primary/50"
          >
            View Credit Balance
          </Button>
        </div>
      </div>
    </div>
  );
}
