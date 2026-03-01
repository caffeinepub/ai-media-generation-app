import React, { useState } from 'react';
import { ExternalLink, Image, Video, Play } from 'lucide-react';

interface GalleryCardProps {
  url: string;
  index: number;
}

function looksLikeVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi)(\?|$)/i.test(url) || url.includes('video');
}

export default function GalleryCard({ url, index }: GalleryCardProps) {
  const [hovered, setHovered] = useState(false);
  const isVideo = looksLikeVideo(url);

  return (
    <div
      className="glass rounded-2xl overflow-hidden card-hover group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media preview */}
      <div className="relative aspect-square overflow-hidden bg-surface-1">
        {isVideo ? (
          <video
            src={url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            muted
            loop
            playsInline
            autoPlay={hovered}
          />
        ) : (
          <img
            src={url}
            alt={`Generated media ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}

        {/* Hover overlay */}
        <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
          style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.85) 0%, rgba(10,8,5,0.3) 60%, transparent 100%)' }}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="glass-amber rounded-xl p-3 text-amber-400 hover:shadow-glow-amber transition-all duration-200 hover:scale-110"
          >
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          {isVideo ? (
            <span className="badge-emerald flex items-center gap-1">
              <Play size={10} />
              Video
            </span>
          ) : (
            <span className="badge-amber flex items-center gap-1">
              <Image size={10} />
              Image
            </span>
          )}
        </div>

        {/* Index badge */}
        <div className="absolute top-3 right-3">
          <span className="glass text-white/40 text-xs font-mono px-2 py-0.5 rounded-lg border border-white/[0.08]">
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isVideo ? (
              <Video size={14} className="text-emerald-400" />
            ) : (
              <Image size={14} className="text-amber-400" />
            )}
            <span className="text-white/60 text-xs font-medium">
              {isVideo ? 'Generated Video' : 'Generated Image'}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-amber-400 transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
