import React, { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { useGetAllUsers, useIsCallerAdmin } from '../hooks/useQueries';
import ReplicateConfigSetup from '../components/ReplicateConfigSetup';
import StripeConfigSetup from '../components/StripeConfigSetup';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Users, BarChart3, Shield, Zap } from 'lucide-react';

function AdminContent() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'config'>('overview');

  if (adminLoading) {
    return (
      <div className="bg-gradient-dark min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const totalGenerations = users?.reduce((sum, [, count]) => sum + Number(count), 0) ?? 0;

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'config', label: 'Configuration', icon: <Settings size={16} /> },
  ];

  return (
    <div className="bg-gradient-dark min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="badge-amber inline-flex items-center gap-1.5 mb-3">
            <Shield size={12} />
            Admin Panel
          </div>
          <h1 className="text-3xl font-display font-bold text-white/90">
            Dashboard <span className="text-gradient-amber">Control</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Manage users, configurations, and platform settings.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="glass rounded-2xl p-2 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as typeof activeSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'glass-amber text-amber-400 shadow-glow-amber'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Overview */}
            {activeSection === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Users', value: users?.length ?? 0, icon: <Users size={20} />, glassClass: 'glass-amber', iconClass: 'text-amber-400' },
                    { label: 'Total Generations', value: totalGenerations, icon: <Zap size={20} />, glassClass: 'glass-emerald', iconClass: 'text-emerald-400' },
                    { label: 'Avg per User', value: users?.length ? Math.round(totalGenerations / users.length) : 0, icon: <BarChart3 size={20} />, glassClass: 'glass-gold', iconClass: 'text-amber-300' },
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.glassClass} rounded-2xl p-6`}>
                      <div className={`${stat.iconClass} mb-3`}>{stat.icon}</div>
                      <div className="text-3xl font-display font-bold text-white/90">{stat.value}</div>
                      <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-white/70 font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-amber-400" />
                    Platform Overview
                  </h3>
                  <p className="text-white/40 text-sm">
                    The platform is running smoothly. Use the sidebar to manage users and configure integrations.
                  </p>
                </div>
              </>
            )}

            {/* Users */}
            {activeSection === 'users' && (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
                  <Users size={16} className="text-amber-400" />
                  <h3 className="text-white/80 font-semibold">User Management</h3>
                  {users && (
                    <span className="badge-amber ml-auto">{users.length} users</span>
                  )}
                </div>
                {usersLoading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full shimmer rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.06] hover:bg-transparent">
                        <TableHead className="text-white/40 font-medium">#</TableHead>
                        <TableHead className="text-white/40 font-medium">Principal ID</TableHead>
                        <TableHead className="text-white/40 font-medium text-right">Generations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map(([principal, count], index) => (
                        <TableRow key={principal.toString()} className="border-white/[0.04] hover:bg-white/[0.02]">
                          <TableCell className="text-white/30 text-xs font-mono">{index + 1}</TableCell>
                          <TableCell className="text-white/60 text-xs font-mono truncate max-w-xs">
                            {principal.toString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="badge-amber">{Number(count)}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!users || users.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-white/30 py-8 text-sm">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}

            {/* Configuration */}
            {activeSection === 'config' && (
              <div className="space-y-6">
                <ReplicateConfigSetup />
                <StripeConfigSetup />
              </div>
            )}
          </div>
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
