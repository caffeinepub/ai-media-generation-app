import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Zap, Image, Video, Shield, CreditCard, Sparkles, ArrowRight, Star } from 'lucide-react';

export default function IndexPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const features = [
    {
      icon: <Image size={24} className="text-primary" />,
      title: 'AI Image Generation',
      description: 'Create stunning images from text prompts using state-of-the-art Replicate models.',
      color: 'border-primary/20 bg-primary/5',
    },
    {
      icon: <Video size={24} className="text-accent" />,
      title: 'AI Video Generation',
      description: 'Transform your ideas into dynamic videos with cutting-edge AI technology.',
      color: 'border-accent/20 bg-accent/5',
    },
    {
      icon: <Shield size={24} className="text-amber-glow" />,
      title: 'Secure & Private',
      description: 'Powered by Internet Identity — your data stays yours, secured on the blockchain.',
      color: 'border-amber-glow/20 bg-amber-subtle',
    },
    {
      icon: <CreditCard size={24} className="text-primary" />,
      title: 'Credit System',
      description: 'Purchase credit bundles and generate media on demand. 500 credits per generation.',
      color: 'border-primary/20 bg-primary/5',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'oklch(0.82 0.18 175)' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{ background: 'oklch(0.75 0.20 160)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full opacity-6 blur-3xl" style={{ background: 'oklch(0.78 0.18 75)' }} />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 glow-cyan">
          <img
            src="/assets/generated/hero-banner.dim_1200x400.png"
            alt="AI Media Studio"
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent flex items-center">
            <div className="px-8 sm:px-12 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                  ✦ Powered by Replicate AI
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                <span className="gradient-text">Create</span>
                <br />
                <span className="text-foreground">Without Limits</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md">
                Generate stunning images and videos from text prompts using cutting-edge AI models.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 mb-16">
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate({ to: '/generate' })}
                className="btn-primary px-8 py-3 text-base font-semibold gap-2 h-auto"
              >
                <Zap size={18} />
                Start Generating
                <ArrowRight size={16} />
              </Button>
              <Button
                onClick={() => navigate({ to: '/gallery' })}
                variant="outline"
                className="px-8 py-3 text-base h-auto border-border hover:border-primary/50 gap-2"
              >
                <Star size={16} />
                View Gallery
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="btn-primary px-10 py-4 text-lg font-semibold gap-3 h-auto"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Get Started Free
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                Secured with Internet Identity — no passwords required
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16 max-w-lg mx-auto">
          {[
            { value: '500', label: 'Credits/Gen', unit: '' },
            { value: '2', label: 'Media Types', unit: '' },
            { value: '∞', label: 'Possibilities', unit: '' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`glass-card rounded-xl p-5 border ${feature.color} hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-2 text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center gradient-text mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Login Securely', desc: 'Connect with Internet Identity — no passwords, no email required.', icon: <Shield size={20} /> },
              { step: '02', title: 'Get Credits', desc: 'Purchase credit bundles via Stripe. Each generation costs 500 credits.', icon: <CreditCard size={20} /> },
              { step: '03', title: 'Generate Media', desc: 'Enter a prompt, hit generate, and watch AI create your vision.', icon: <Sparkles size={20} /> },
            ].map((item) => (
              <div key={item.step} className="glass-card rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10 font-mono">{item.step}</div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
