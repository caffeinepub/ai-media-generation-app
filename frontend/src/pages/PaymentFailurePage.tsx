import React from 'react';
import { Link } from '@tanstack/react-router';
import { XCircle, RefreshCw, Home, CreditCard } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="bg-gradient-dark min-h-screen flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(220,50,50,0.25) 0%, transparent 70%)' }} />
      </div>

      <div className="relative glass rounded-3xl p-12 max-w-md w-full text-center border border-red-500/10">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.2)' }}>
          <XCircle size={40} className="text-red-400" />
        </div>

        <div className="badge-amber inline-flex items-center gap-1.5 mb-4">
          <CreditCard size={12} />
          Payment Failed
        </div>

        <h1 className="text-2xl font-display font-bold text-white/90 mb-3">
          Payment <span className="text-gradient-amber">Unsuccessful</span>
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Your payment could not be processed. No charges were made to your account. Please try again or use a different payment method.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/credits"
            className="btn-amber inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm shadow-glow-amber"
          >
            <RefreshCw size={16} />
            Try Again
          </Link>
          <Link
            to="/"
            className="glass inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm text-white/70 hover:text-white border border-white/10 transition-all"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
