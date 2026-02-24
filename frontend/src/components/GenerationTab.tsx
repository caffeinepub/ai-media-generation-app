import { useState } from 'react';
import { useGenerateImage, useGenerateVideo } from '../hooks/useQueries';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Image, Video, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type MediaType = 'image' | 'video';
type Status = 'idle' | 'processing' | 'complete' | 'error';

interface GenerationTabProps {
  mediaType: MediaType;
}

export default function GenerationTab({ mediaType }: GenerationTabProps) {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateImage = useGenerateImage();
  const generateVideo = useGenerateVideo();

  const isImage = mediaType === 'image';
  const mutation = isImage ? generateImage : generateVideo;
  const isProcessing = status === 'processing';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus('processing');
    setResultUrl(null);
    setErrorMessage(null);

    try {
      const url = await mutation.mutateAsync(prompt.trim());
      setResultUrl(url);
      setStatus('complete');
      toast.success(`${isImage ? 'Image' : 'Video'} generated successfully!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setErrorMessage(message);
      setStatus('error');
      toast.error(`Generation failed: ${message}`);
    }
  };

  const statusConfig = {
    idle: { label: 'Ready', color: 'text-muted-foreground', icon: null },
    processing: { label: 'Generating...', color: 'text-primary', icon: <Loader2 size={14} className="animate-spin" /> },
    complete: { label: 'Complete', color: 'text-emerald-glow', icon: <CheckCircle size={14} /> },
    error: { label: 'Error', color: 'text-destructive', icon: <AlertCircle size={14} /> },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm font-medium ${currentStatus.color}`}>
          {currentStatus.icon}
          <span>{currentStatus.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isImage ? (
            <Badge variant="outline" className="border-primary/30 text-primary gap-1">
              <Image size={12} /> Image
            </Badge>
          ) : (
            <Badge variant="outline" className="border-accent/30 text-accent gap-1">
              <Video size={12} /> Video
            </Badge>
          )}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          Describe what you want to create
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            isImage
              ? 'A futuristic cityscape at night with neon lights reflecting on wet streets...'
              : 'A timelapse of clouds moving over mountain peaks at golden hour...'
          }
          className="min-h-[120px] bg-surface-2 border-border focus:border-primary/50 resize-none text-sm leading-relaxed scrollbar-thin"
          disabled={isProcessing}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{prompt.length} characters</span>
          <span>Be descriptive for better results</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isProcessing}
        className="w-full btn-primary h-12 text-base font-semibold"
      >
        {isProcessing ? (
          <span className="flex items-center gap-3">
            <Loader2 size={18} className="animate-spin" />
            Generating {isImage ? 'Image' : 'Video'}...
          </span>
        ) : (
          <span className="flex items-center gap-3">
            <Zap size={18} />
            Generate {isImage ? 'Image' : 'Video'}
          </span>
        )}
      </Button>

      {/* Processing Animation */}
      {isProcessing && (
        <div className="glass-card rounded-xl p-6 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
              {isImage ? <Image size={16} className="text-primary" /> : <Video size={16} className="text-primary" />}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI is working its magic...</p>
            <p className="text-xs text-muted-foreground mt-1">This may take 30-60 seconds</p>
          </div>
          <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent shimmer rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Result Display */}
      {status === 'complete' && resultUrl && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-glow" />
              Generation Complete
            </span>
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Open in new tab ↗
            </a>
          </div>
          <div className="p-4">
            {isImage ? (
              <img
                src={resultUrl}
                alt={prompt}
                className="w-full rounded-lg object-contain max-h-[500px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23111" width="400" height="300"/><text fill="%23666" x="50%" y="50%" text-anchor="middle">Image unavailable</text></svg>';
                }}
              />
            ) : (
              <video
                src={resultUrl}
                controls
                className="w-full rounded-lg max-h-[500px]"
                autoPlay
                muted
              >
                Your browser does not support video playback.
              </video>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {status === 'error' && errorMessage && (
        <div className="glass-card rounded-xl p-4 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Generation Failed</p>
              <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
