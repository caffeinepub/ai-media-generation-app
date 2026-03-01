import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useGetGallery } from '../hooks/useQueries';
import GalleryCard from '../components/GalleryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid, Sparkles, Image } from 'lucide-react';
import { Link } from '@tanstack/react-router';

function GalleryContent() {
  const { data: gallery, isLoading } = useGetGallery();

  return (
    <div className="bg-gradient-dark min-h-screen py-10">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-80 h-80 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, rgba(220,180,60,0.25) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="badge-gold inline-flex items-center gap-1.5 mb-3">
              <LayoutGrid size={12} />
              Your Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white/90">
              My <span className="text-gradient-gold">Gallery</span>
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {gallery ? `${gallery.length} creation${gallery.length !== 1 ? 's' : ''}` : 'Loading...'}
            </p>
          </div>
          <Link
            to="/generate"
            className="btn-amber inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm shadow-glow-amber self-start sm:self-auto"
          >
            <Sparkles size={16} />
            Generate More
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-52 shimmer" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3 w-3/4 shimmer rounded" />
                  <Skeleton className="h-3 w-1/2 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!gallery || gallery.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 glass-amber rounded-3xl flex items-center justify-center mb-6 animate-float">
              <Image size={36} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white/80 mb-2">No creations yet</h3>
            <p className="text-white/40 text-sm max-w-sm mb-8">
              Your gallery is empty. Start generating images and videos to fill it with your creations.
            </p>
            <Link
              to="/generate"
              className="btn-amber inline-flex items-center gap-2 px-8 py-3.5 rounded-xl shadow-glow-amber"
            >
              <Sparkles size={18} />
              Create Your First Media
            </Link>
          </div>
        )}

        {/* Gallery grid */}
        {!isLoading && gallery && gallery.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {gallery.map((url, index) => (
              <GalleryCard key={index} url={url} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <ProtectedRoute>
      <GalleryContent />
    </ProtectedRoute>
  );
}
