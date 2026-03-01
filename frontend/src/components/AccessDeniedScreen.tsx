import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX, ArrowLeft, Lock } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="bg-gradient-dark min-h-screen flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(220,50,50,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="relative glass rounded-3xl p-12 max-w-md w-full text-center border border-red-500/10">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.2)' }}>
          <ShieldX size={36} className="text-red-400" />
        </div>

        <div className="badge-amber inline-flex items-center gap-1.5 mb-4">
          <Lock size={12} />
          Access Restricted
        </div>

        <h1 className="text-2xl font-display font-bold text-white/90 mb-3">
          Access Denied
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          You don't have permission to access this area. This section is restricted to administrators only.
        </p>

        <Link
          to="/"
          className="btn-amber inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm shadow-glow-amber"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
