import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import GenerationTab from '../components/GenerationTab';
import { Image, Video, Sparkles, Infinity } from 'lucide-react';

function GenerateContent() {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  return (
    <div className="bg-gradient-dark min-h-screen py-10">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, rgba(255,180,50,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, rgba(80,200,120,0.2) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="badge-amber inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={12} />
            AI Generation Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white/90 mb-3">
            Create <span className="text-gradient-amber">Stunning Media</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Describe what you want to create and let AI bring your vision to life.
          </p>
        </div>

        {/* Credits info */}
        <div className="glass-gold rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-amber flex items-center justify-center">
              <Sparkles size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-white/90 font-semibold text-sm">Generation Credits</p>
              <p className="text-white/50 text-xs">No limits on your creativity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
            <Infinity size={16} className="text-amber-400" />
            <span className="text-amber-400 font-bold text-sm">Unlimited</span>
          </div>
        </div>

        {/* Tab selector */}
        <div className="glass rounded-2xl p-1.5 mb-6 flex gap-1.5">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'image'
                ? 'glass-amber text-amber-400 shadow-glow-amber'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
            }`}
          >
            <Image size={17} />
            Image Generation
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === 'video'
                ? 'glass-emerald text-emerald-400 shadow-glow-emerald'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
            }`}
          >
            <Video size={17} />
            Video Generation
          </button>
        </div>

        {/* Generation tab content */}
        <div className="glass rounded-2xl p-6 sm:p-8">
          <GenerationTab type={activeTab} />
        </div>

        {/* Tips */}
        <div className="mt-6 glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">💡 Prompt Tips</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tip: 'Be specific', desc: 'Include details about style, lighting, and mood.' },
              { tip: 'Use adjectives', desc: 'Words like "cinematic", "photorealistic", "vibrant" help.' },
              { tip: 'Add context', desc: 'Mention the setting, time of day, or artistic style.' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl p-3">
                <p className="text-amber-400 text-xs font-semibold mb-1">{item.tip}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
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
