import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetCredits } from '../hooks/useQueries';
import ProfileSetupModal from './ProfileSetupModal';
import { Zap, Image, Video, LayoutGrid, Settings, CreditCard, LogOut, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: credits } = useGetCredits();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const navLinks = [
    { to: '/generate', label: 'Generate', icon: <Zap size={16} />, auth: true },
    { to: '/gallery', label: 'Gallery', icon: <LayoutGrid size={16} />, auth: true },
    { to: '/credits', label: 'Credits', icon: <CreditCard size={16} />, auth: true },
    { to: '/admin', label: 'Admin', icon: <Settings size={16} />, auth: true, adminOnly: true },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (!link.auth) return true;
    if (!isAuthenticated) return false;
    if (link.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 240)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden glow-cyan">
                <img
                  src="/assets/generated/app-logo.dim_256x256.png"
                  alt="AI Media Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-lg tracking-tight gradient-text hidden sm:block">
                AI Media Studio
              </span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {visibleLinks.map(link => (
                <button
                  key={link.to}
                  onClick={() => navigate({ to: link.to })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPath === link.to
                      ? 'text-primary bg-primary/10 glow-border-cyan border border-primary/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated && credits !== undefined && (
                <button
                  onClick={() => navigate({ to: '/credits' })}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-primary/20 text-sm font-mono"
                >
                  <Zap size={14} className="text-primary" />
                  <span className="text-primary font-semibold">{credits.toString()}</span>
                  <span className="text-muted-foreground">credits</span>
                </button>
              )}

              {isAuthenticated ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                    {userProfile?.name || 'User'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-border hover:border-destructive/50 hover:text-destructive gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  size="sm"
                  className="btn-primary hidden md:flex gap-2"
                >
                  <LogIn size={14} />
                  {isLoggingIn ? 'Connecting...' : 'Login'}
                </Button>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-surface-2 text-muted-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border glass">
            <div className="px-4 py-3 space-y-1">
              {visibleLinks.map(link => (
                <button
                  key={link.to}
                  onClick={() => { navigate({ to: link.to }); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentPath === link.to
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border">
                {isAuthenticated ? (
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={16} />
                    Logout ({userProfile?.name || 'User'})
                  </button>
                ) : (
                  <button
                    onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                    disabled={isLoggingIn}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium btn-primary"
                  >
                    <LogIn size={16} />
                    {isLoggingIn ? 'Connecting...' : 'Login'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border glass mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded overflow-hidden">
                <img src="/assets/generated/app-logo.dim_256x256.png" alt="logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-muted-foreground">
                AI Media Studio — Generate images & videos with AI
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Built with</span>
              <span className="text-red-400">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'ai-media-studio')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
