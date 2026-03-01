import React, { useState, useRef } from 'react';
import { useGenerateImage, useGenerateVideo } from '../hooks/useQueries';
import { ReplicateError } from '../backend';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, AlertCircle, CheckCircle, RefreshCw, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationTabProps {
  type: 'image' | 'video';
}

function looksLikeUrl(s: string): boolean {
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:');
}

function mapReplicateErrorToMessage(error: ReplicateError): string {
  if (error.__kind__ === 'ApiKeyMissing') {
    return 'Replicate API key is not configured. Please contact the administrator.';
  }
  if (error.__kind__ === 'Timeout') {
    return 'The generation request timed out. Please try again.';
  }
  if (error.__kind__ === 'ParseError') {
    return `Failed to parse the generation response: ${error.ParseError}`;
  }
  if (error.__kind__ === 'ApiError') {
    return `API error: ${error.ApiError}`;
  }
  return 'An unknown error occurred. Please try again.';
}

const MAX_RETRIES = 3;

export default function GenerationTab({ type }: GenerationTabProps) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const generateImage = useGenerateImage();
  const generateVideo = useGenerateVideo();

  const isGenerating = generateImage.isPending || generateVideo.isPending;

  const handleGenerate = async (isRetry = false) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first.');
      return;
    }

    if (!isRetry) {
      idempotencyKeyRef.current = crypto.randomUUID();
      setRetryCount(0);
    }

    setError(null);
    setResult(null);

    try {
      let response: ReplicateError;
      if (type === 'image') {
        response = await generateImage.mutateAsync(prompt);
      } else {
        response = await generateVideo.mutateAsync(prompt);
      }

      // Check if the ApiError variant actually contains a URL (backend success pattern)
      if (response.__kind__ === 'ApiError' && looksLikeUrl(response.ApiError)) {
        setResult(response.ApiError);
        setRetryCount(0);
        toast.success(`${type === 'image' ? 'Image' : 'Video'} generated successfully!`);
        return;
      }

      // It's a real error
      const message = mapReplicateErrorToMessage(response);
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      if (newRetryCount < MAX_RETRIES) {
        setError(`${message} (Attempt ${newRetryCount}/${MAX_RETRIES})`);
      } else {
        setError(message);
        toast.error('Generation failed after multiple attempts.');
      }
    } catch (err: any) {
      const message = err?.message || 'An unexpected error occurred.';
      setError(message);
      toast.error(message);
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      handleGenerate(true);
    }
  };

  const isImage = type === 'image';

  return (
    <div className="space-y-6">
      {/* Prompt input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
          {isImage ? <Image size={14} className="text-amber-400" /> : <Video size={14} className="text-emerald-400" />}
          Your Prompt
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            isImage
              ? 'A cinematic portrait of a warrior in golden armor, dramatic lighting, photorealistic...'
              : 'A timelapse of a city at night with glowing lights and moving traffic, cinematic...'
          }
          className="input-glass min-h-[120px] resize-none rounded-xl text-sm leading-relaxed"
          disabled={isGenerating}
        />
        <p className="text-xs text-white/30 text-right">{prompt.length} characters</p>
      </div>

      {/* Generate button */}
      <button
        onClick={() => handleGenerate(false)}
        disabled={isGenerating || !prompt.trim()}
        className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          isImage ? 'btn-amber shadow-glow-amber' : 'btn-emerald shadow-glow-emerald'
        }`}
      >
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Generating {isImage ? 'Image' : 'Video'}...
          </>
        ) : (
          <>
            <Sparkles size={17} />
            Generate {isImage ? 'Image' : 'Video'}
          </>
        )}
      </button>

      {/* Error state */}
      {error && (
        <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium mb-1">Generation Failed</p>
              <p className="text-red-400/70 text-xs">{error}</p>
            </div>
            {retryCount < MAX_RETRIES && (
              <button
                onClick={handleRetry}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-amber-400 text-xs font-medium hover:shadow-glow-amber transition-all disabled:opacity-50"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
            <CheckCircle size={16} />
            Generation Complete!
          </div>
          <div className="glass-emerald rounded-xl overflow-hidden">
            {isImage ? (
              <img
                src={result}
                alt="Generated image"
                className="w-full object-contain max-h-96 rounded-xl"
              />
            ) : (
              <video
                src={result}
                controls
                className="w-full max-h-96 rounded-xl"
                autoPlay
                muted
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-white/30 text-xs font-mono truncate flex-1 mr-4">{result}</p>
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs flex-shrink-0"
            >
              Open Full Size
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
