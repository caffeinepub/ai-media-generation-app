import { useNavigate } from '@tanstack/react-router';
import { XCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto">
            <XCircle size={36} className="text-destructive" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-destructive mb-2">Payment Failed</h1>
          <p className="text-muted-foreground">
            Your payment was not completed. No charges were made to your account. Please try again.
          </p>
        </div>

        <div className="glass rounded-xl p-4 text-sm text-muted-foreground">
          If you continue to experience issues, please check your payment details or contact support.
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: '/credits' })}
            className="w-full btn-primary gap-2"
          >
            <CreditCard size={16} />
            Try Again
          </Button>
          <Button
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            className="w-full border-border hover:border-primary/50 gap-2"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
