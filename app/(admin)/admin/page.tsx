import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users, Package, InboxIcon, ShieldIcon } from 'lucide-react';
import AdminUserActions from './AdminUserActions';

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect('/login');

  const users = await db.users.findMany();
  const posts = await db.posts.findMany();
  const requests = await db.requests.findMany();

  const activeUsers = users.filter(u => u.role === 'user');
  const availablePosts = posts.filter(p => p.status === 'available');

  const stats = [
    { label: 'Total Users', value: activeUsers.length, icon: Users, color: 'bg-app-green' },
    { label: 'Active Posts', value: availablePosts.length, icon: Package, color: 'bg-app-orange' },
    { label: 'Total Requests', value: requests.length, icon: InboxIcon, color: 'bg-app-green-lighter' },
  ];

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-app-border">
        <div className="w-10 h-10 bg-app-green rounded-xl flex items-center justify-center">
          <ShieldIcon className="w-5 h-5 text-app-orange" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-app-green">Admin Panel</h1>
          <p className="text-app-text-light text-sm">System overview and user management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-app-border p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-app-text-light text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-app-green">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-app-border overflow-hidden">
        <div className="px-6 py-5 border-b border-app-border">
          <h2 className="text-lg font-semibold text-app-green">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-app-border bg-app-cream">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-app-text-light">Name</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-app-text-light">Email</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-app-text-light">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-app-text-light text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {activeUsers.map(u => (
                <tr key={u.id} className="hover:bg-app-cream/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-app-green">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-app-text-light">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AdminUserActions userId={u.id} currentStatus={u.status} />
                  </td>
                </tr>
              ))}
              {activeUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-app-text-light text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
