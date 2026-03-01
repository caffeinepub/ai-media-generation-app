import React, { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Sparkles, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(true);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Profile created! Welcome to AI Media Studio.');
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save profile.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-amber border-amber-500/20 shadow-glow-amber max-w-md"
        style={{ background: 'oklch(0.14 0.015 60)', backdropFilter: 'blur(24px)' }}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl glass-amber flex items-center justify-center">
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
              <DialogTitle className="text-white/90 font-display text-xl">Welcome!</DialogTitle>
              <DialogDescription className="text-white/40 text-sm">
                Set up your creator profile to get started.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/60 text-sm font-medium flex items-center gap-2">
              <User size={14} className="text-amber-400" />
              Display Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="input-glass rounded-xl"
              autoFocus
              disabled={saveProfile.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full btn-amber flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {saveProfile.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Create Profile
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
