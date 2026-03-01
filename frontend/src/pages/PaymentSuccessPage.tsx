import React, { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';

export default function PaymentSuccessPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['credits'] });
  }, [queryClient]);

  return (
    <div className="bg-gradient-dark min-h-screen flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(80,200,120,0.4) 0%, transparent 70%)' }} />
      </div>

      <div className="relative glass-emerald rounded-3xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float"
          style={{ background: 'rgba(80,200,120,0.15)', border: '1px solid rgba(80,200,120,0.3)' }}>
          <CheckCircle size={40} className="text-emerald-400" />
        </div>

        <div className="badge-emerald inline-flex items-center gap-1.5 mb-4">
          <Sparkles size={12} />
          Payment Successful
        </div>

        <h1 className="text-2xl font-display font-bold text-white/90 mb-3">
          Credits <span className="text-gradient-emerald">Added!</span>
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Your payment was processed successfully. Your credits have been added to your account and you're ready to create amazing media.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/generate"
            className="btn-emerald inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm shadow-glow-emerald"
          >
            <Sparkles size={16} />
            Start Generating
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/gallery"
            className="glass inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm text-white/70 hover:text-white border border-white/10 transition-all"
          >
            <LayoutGrid size={16} />
            View Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
