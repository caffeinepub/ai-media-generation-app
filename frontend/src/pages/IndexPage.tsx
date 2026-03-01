import React from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Sparkles, Zap, Image, Video, Shield, Globe, ArrowRight, Star, Play, Layers } from 'lucide-react';

export default function IndexPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: <Image size={24} />,
      title: 'AI Image Generation',
      description: 'Transform your text prompts into stunning, high-resolution images using state-of-the-art AI models.',
      accent: 'amber',
    },
    {
      icon: <Video size={24} />,
      title: 'AI Video Creation',
      description: 'Bring your ideas to life with AI-powered video generation from simple text descriptions.',
      accent: 'emerald',
    },
    {
      icon: <Shield size={24} />,
      title: 'Secure & Private',
      description: 'Built on the Internet Computer Protocol — your data is stored securely on-chain.',
      accent: 'gold',
    },
    {
      icon: <Globe size={24} />,
      title: 'Decentralized',
      description: 'No central servers, no data harvesting. Your creations belong to you, always.',
      accent: 'amber',
    },
    {
      icon: <Layers size={24} />,
      title: 'Personal Gallery',
      description: 'All your generated media is saved to your personal gallery, accessible anytime.',
      accent: 'emerald',
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Optimized generation pipeline delivers results in seconds, not minutes.',
      accent: 'gold',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Images Generated' },
    { value: '2K+', label: 'Videos Created' },
    { value: '500+', label: 'Active Creators' },
    { value: '99.9%', label: 'Uptime' },
  ];

  const accentClasses: Record<string, { glass: string; icon: string; badge: string }> = {
    amber: { glass: 'glass-amber', icon: 'text-amber-400', badge: 'badge-amber' },
    emerald: { glass: 'glass-emerald', icon: 'text-emerald-400', badge: 'badge-emerald' },
    gold: { glass: 'glass-gold', icon: 'text-gold-500', badge: 'badge-gold' },
  };

  return (
    <div className="bg-gradient-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(255,180,50,0.4) 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, rgba(80,200,120,0.3) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, rgba(220,180,60,0.5) 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Hero banner image */}
          <div className="relative mb-12 rounded-2xl overflow-hidden glass border border-white/[0.08] shadow-glass-lg">
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="AI Media Studio Hero"
              className="w-full h-48 sm:h-64 md:h-80 object-cover opacity-70"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-0/90 via-surface-0/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div className="badge-amber mb-4 inline-flex items-center gap-1.5">
                <Sparkles size={12} />
                Powered by Advanced AI
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-4">
                <span className="text-gradient-gold">Create</span>{' '}
                <span className="text-white/90">Stunning</span>
                <br />
                <span className="text-gradient-amber">Media with AI</span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                Transform your imagination into breathtaking images and videos using cutting-edge AI generation technology, secured on the Internet Computer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link
                    to="/generate"
                    className="btn-amber inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base shadow-glow-amber"
                  >
                    <Zap size={18} />
                    Start Generating
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={() => login()}
                    disabled={loginStatus === 'logging-in'}
                    className="btn-amber inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base shadow-glow-amber disabled:opacity-50"
                  >
                    {loginStatus === 'logging-in' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Get Started Free
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
                <Link
                  to="/gallery"
                  className="glass inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base text-white/80 hover:text-white border border-white/10 hover:border-amber-500/30 transition-all duration-200"
                >
                  <Play size={18} />
                  View Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="glass card-hover rounded-xl p-5 text-center">
                <div className="text-2xl font-display font-bold text-gradient-amber">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge-gold inline-flex items-center gap-1.5 mb-4">
              <Star size={12} />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white/90 mb-4">
              Everything You Need to{' '}
              <span className="text-gradient-amber">Create</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              A complete AI media generation platform with powerful tools and a seamless creative workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const ac = accentClasses[feature.accent];
              return (
                <div key={i} className={`${ac.glass} card-hover rounded-2xl p-6`}>
                  <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mb-4 ${ac.icon}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-white/90 font-display font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge-emerald inline-flex items-center gap-1.5 mb-4">
              <Zap size={12} />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white/90 mb-4">
              Create in <span className="text-gradient-emerald">Three Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Login Securely', desc: 'Connect with Internet Identity for a secure, passwordless experience.', accent: 'amber' },
              { step: '02', title: 'Write Your Prompt', desc: 'Describe the image or video you want to create in natural language.', accent: 'emerald' },
              { step: '03', title: 'Download & Share', desc: 'Your generated media is saved to your gallery, ready to download and share.', accent: 'gold' },
            ].map((item, i) => {
              const ac = accentClasses[item.accent];
              return (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px z-10"
                      style={{ background: 'linear-gradient(90deg, rgba(255,180,50,0.3), transparent)' }} />
                  )}
                  <div className={`${ac.glass} rounded-2xl p-8 text-center card-hover`}>
                    <div className={`text-5xl font-display font-bold ${ac.icon} opacity-30 mb-4`}>{item.step}</div>
                    <h3 className="text-white/90 font-display font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-amber rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,180,50,0.6) 0%, transparent 70%)' }} />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white/90 mb-4">
                  Ready to <span className="text-gradient-gold">Create?</span>
                </h2>
                <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of creators using AI to bring their visions to life. Start generating for free today.
                </p>
                <button
                  onClick={() => login()}
                  disabled={loginStatus === 'logging-in'}
                  className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg shadow-glow-gold disabled:opacity-50"
                >
                  <Sparkles size={20} />
                  Start Creating Now
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
