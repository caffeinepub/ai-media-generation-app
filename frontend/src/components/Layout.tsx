import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Sparkles, Menu, X, Zap, Image, Video, LayoutGrid, CreditCard, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileSetupModal from './ProfileSetupModal';

export default function Layout() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/generate', label: 'Generate', icon: <Zap size={16} /> },
    { to: '/gallery', label: 'Gallery', icon: <LayoutGrid size={16} /> },
    { to: '/credits', label: 'Credits', icon: <CreditCard size={16} /> },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl glass-amber flex items-center justify-center group-hover:glow-amber transition-all duration-300">
                <img
                  src="/assets/generated/app-logo.dim_256x256.png"
                  alt="AI Media Studio"
                  className="w-7 h-7 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Sparkles size={18} className="hidden text-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gradient-amber font-display font-bold text-lg leading-none">
                  AI Media Studio
                </span>
                <span className="text-[10px] text-amber-500/60 font-mono leading-none mt-0.5">
                  Generate · Create · Inspire
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'glass-amber text-amber-400 shadow-glow-amber'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/admin')
                      ? 'glass-emerald text-emerald-400 shadow-glow-emerald'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/[0.05]'
                  }`}
                >
                  <Settings size={16} />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && userProfile && (
                <div className="glass px-3 py-1.5 rounded-lg">
                  <span className="text-xs text-white/50 font-mono">Welcome,</span>
                  <span className="text-xs text-amber-400 font-semibold ml-1">{userProfile.name}</span>
                </div>
              )}
              <button
                onClick={handleAuth}
                disabled={loginStatus === 'logging-in'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isAuthenticated
                    ? 'glass text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                    : 'btn-amber'
                } disabled:opacity-50`}
              >
                {loginStatus === 'logging-in' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : isAuthenticated ? (
                  <>
                    <LogOut size={15} />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    Login
                  </>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden glass p-2 rounded-lg text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t border-white/[0.06] px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'glass-amber text-amber-400'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'glass-emerald text-emerald-400'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Settings size={16} />
                Admin
              </Link>
            )}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                onClick={() => { handleAuth(); setMobileOpen(false); }}
                disabled={loginStatus === 'logging-in'}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isAuthenticated ? 'glass text-white/70 border border-white/10' : 'btn-amber'
                } disabled:opacity-50`}
              >
                {isAuthenticated ? (
                  <><LogOut size={15} /> Logout</>
                ) : (
                  <><LogIn size={15} /> Login</>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/[0.06] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg glass-amber flex items-center justify-center">
                <Sparkles size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gradient-amber">AI Media Studio</p>
                <p className="text-xs text-white/40">Generate images & videos with AI</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/40">
              <Link to="/generate" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Image size={12} /> Images
              </Link>
              <Link to="/generate" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Video size={12} /> Videos
              </Link>
              <Link to="/gallery" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <LayoutGrid size={12} /> Gallery
              </Link>
            </div>

            <div className="text-xs text-white/30 text-center">
              <p>© {new Date().getFullYear()} AI Media Studio. All rights reserved.</p>
              <p className="mt-1">
                Built with{' '}
                <span className="text-amber-500">♥</span>{' '}
                using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'ai-media-studio')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
