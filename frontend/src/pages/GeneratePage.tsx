import ProtectedRoute from '../components/ProtectedRoute';
import GenerationTab from '../components/GenerationTab';
import { useGetCredits } from '../hooks/useQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Image, Video, AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const GENERATION_COST = 500;

function GenerateContent() {
  const { data: credits, isLoading: creditsLoading } = useGetCredits();
  const navigate = useNavigate();

  const hasEnoughCredits = credits !== undefined && credits >= BigInt(GENERATION_COST);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Generate Media</h1>
        <p className="text-muted-foreground">Create AI-powered images and videos from text prompts</p>
      </div>

      {/* Credit Balance Card */}
      <div className={`glass-card rounded-xl p-4 mb-6 flex items-center justify-between ${hasEnoughCredits ? 'border-primary/20' : 'border-destructive/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasEnoughCredits ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            <Zap size={18} className={hasEnoughCredits ? 'text-primary' : 'text-destructive'} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credit Balance</p>
            <p className={`text-xl font-bold font-mono ${hasEnoughCredits ? 'text-primary' : 'text-destructive'}`}>
              {creditsLoading ? '...' : credits?.toString() ?? '0'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Cost per generation</p>
          <p className="text-sm font-semibold font-mono text-foreground">{GENERATION_COST} credits</p>
        </div>
      </div>

      {/* Low credits warning */}
      {!creditsLoading && !hasEnoughCredits && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-subtle border border-amber-glow/20 mb-6">
          <AlertTriangle size={18} className="text-amber-glow flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Not enough credits</p>
            <p className="text-xs text-muted-foreground">You need at least {GENERATION_COST} credits to generate media.</p>
          </div>
          <button
            onClick={() => navigate({ to: '/credits' })}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            Buy Credits →
          </button>
        </div>
      )}

      {/* Generation Tabs */}
      <div className="glass-card rounded-2xl p-6">
        <Tabs defaultValue="image">
          <TabsList className="w-full mb-6 bg-surface-2 p-1 rounded-xl">
            <TabsTrigger
              value="image"
              className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/30 rounded-lg"
            >
              <Image size={16} />
              Image
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="flex-1 gap-2 data-[state=active]:bg-accent/10 data-[state=active]:text-accent data-[state=active]:border data-[state=active]:border-accent/30 rounded-lg"
            >
              <Video size={16} />
              Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image">
            <GenerationTab mediaType="image" credits={credits} />
          </TabsContent>

          <TabsContent value="video">
            <GenerationTab mediaType="video" credits={credits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <ProtectedRoute>
      <GenerateContent />
    </ProtectedRoute>
  );
}
