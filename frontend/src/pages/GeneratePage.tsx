import ProtectedRoute from '../components/ProtectedRoute';
import GenerationTab from '../components/GenerationTab';
import { useGetCredits } from '../hooks/useQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Image, Video } from 'lucide-react';

function GenerateContent() {
  const { data: credits, isLoading: creditsLoading } = useGetCredits();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Generate Media</h1>
        <p className="text-muted-foreground">Create AI-powered images and videos from text prompts</p>
      </div>

      {/* Credit Balance Card */}
      <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-between border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
            <Zap size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credit Balance</p>
            <p className="text-xl font-bold font-mono text-primary">
              {creditsLoading ? '...' : credits?.toString() ?? '0'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Unlimited generations</p>
          <p className="text-sm font-semibold font-mono text-foreground">∞</p>
        </div>
      </div>

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
            <GenerationTab mediaType="image" />
          </TabsContent>

          <TabsContent value="video">
            <GenerationTab mediaType="video" />
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
