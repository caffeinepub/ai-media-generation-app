import ProtectedRoute from '../components/ProtectedRoute';
import GalleryCard from '../components/GalleryCard';
import { useGetGallery } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid, Zap, Image } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

function GalleryContent() {
  const { data: gallery, isLoading } = useGetGallery();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">My Gallery</h1>
          <p className="text-muted-foreground">
            {gallery ? `${gallery.length} generated media items` : 'Your AI-generated media collection'}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/generate' })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-sm font-semibold"
        >
          <Zap size={16} />
          Generate More
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <Skeleton className="aspect-square w-full bg-surface-3" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-16 bg-surface-3" />
                <Skeleton className="h-3 w-full bg-surface-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!gallery || gallery.length === 0) && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <Image size={36} className="text-primary opacity-60" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No media yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Your generated images and videos will appear here. Start creating to build your collection!
          </p>
          <button
            onClick={() => navigate({ to: '/generate' })}
            className="flex items-center gap-2 px-6 py-3 rounded-xl btn-primary text-sm font-semibold"
          >
            <Zap size={16} />
            Generate Your First Media
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && gallery && gallery.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Showing {gallery.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...gallery].reverse().map((url, index) => (
              <GalleryCard key={`${url}-${index}`} url={url} index={gallery.length - 1 - index} />
            ))}
          </div>
        </>
      )}
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
