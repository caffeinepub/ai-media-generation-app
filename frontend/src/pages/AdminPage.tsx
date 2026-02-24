import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import StripeConfigSetup from '../components/StripeConfigSetup';
import { useIsCallerAdmin, useGetAllUsers, useAdjustUserCredits } from '../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Users, Zap, Loader2, CheckCircle } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

function AdminContent() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const adjustCredits = useAdjustUserCredits();

  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState('');

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const handleAdjustCredits = async (principalStr: string) => {
    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid credit amount');
      return;
    }
    try {
      await adjustCredits.mutateAsync({
        user: Principal.fromText(principalStr),
        amount: BigInt(amount),
      });
      toast.success(`Credits updated to ${amount} for user`);
      setEditingUser(null);
      setCreditAmount('');
    } catch (err: unknown) {
      toast.error(`Failed to adjust credits: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-subtle border border-amber-glow/20 flex items-center justify-center">
          <Settings size={20} className="text-amber-glow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text-amber">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Manage users and system configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">Total Users</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">
                {usersLoading ? '...' : users?.length ?? 0}
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-primary" />
                <span className="text-xs text-muted-foreground">Total Credits</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">
                {usersLoading ? '...' : users?.reduce((sum, [, credits]) => sum + Number(credits), 0).toLocaleString() ?? 0}
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground">User Management</h2>
            </div>

            {usersLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-surface-3" />
                ))}
              </div>
            ) : !users || users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p>No users registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Principal</TableHead>
                      <TableHead className="text-muted-foreground">Credits</TableHead>
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(([principal, credits]) => {
                      const principalStr = principal.toString();
                      const isEditing = editingUser === principalStr;
                      return (
                        <TableRow key={principalStr} className="border-border hover:bg-surface-2/50">
                          <TableCell>
                            <span className="font-mono text-xs text-muted-foreground truncate block max-w-[200px]" title={principalStr}>
                              {principalStr.substring(0, 20)}...
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary/30 text-primary font-mono">
                              <Zap size={10} className="mr-1" />
                              {credits.toString()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  value={creditAmount}
                                  onChange={(e) => setCreditAmount(e.target.value)}
                                  placeholder="Amount"
                                  className="w-24 h-8 text-xs bg-surface-2 border-border"
                                  min="0"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAdjustCredits(principalStr)}
                                  disabled={adjustCredits.isPending}
                                  className="h-8 btn-primary text-xs"
                                >
                                  {adjustCredits.isPending ? (
                                    <Loader2 size={12} className="animate-spin" />
                                  ) : (
                                    <CheckCircle size={12} />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setEditingUser(null); setCreditAmount(''); }}
                                  className="h-8 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setEditingUser(principalStr); setCreditAmount(credits.toString()); }}
                                className="h-8 text-xs border-border hover:border-primary/50"
                              >
                                Adjust Credits
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <StripeConfigSetup />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
