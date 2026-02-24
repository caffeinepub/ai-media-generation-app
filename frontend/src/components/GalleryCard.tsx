import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Image, Video, ExternalLink, Play } from 'lucide-react';

interface GalleryCardProps {
  url: string;
  index: number;
}

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov') || lower.includes('video');
}

export default function GalleryCard({ url, index }: GalleryCardProps) {
  const [imageError, setImageError] = useState(false);
  const isVideo = isVideoUrl(url);

  return (
    <div className="glass-card rounded-xl overflow-hidden group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      {/* Media Preview */}
      <div className="relative aspect-square bg-surface-1 overflow-hidden">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={url}
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
              onMouseLeave={(e) => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-0 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                <Play size={20} className="text-white ml-1" />
              </div>
            </div>
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Image size={32} className="opacity-30" />
            <span className="text-xs">Preview unavailable</span>
          </div>
        ) : (
          <img
            src={url}
            alt={`Generated media ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 right-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-medium hover:bg-black/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
              Open
            </a>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-xs gap-1 ${isVideo ? 'border-accent/30 text-accent' : 'border-primary/30 text-primary'}`}
          >
            {isVideo ? <Video size={10} /> : <Image size={10} />}
            {isVideo ? 'Video' : 'Image'}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">#{index + 1}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate font-mono" title={url}>
          {url.length > 50 ? url.substring(0, 50) + '...' : url}
        </p>
      </div>
    </div>
  );
}
