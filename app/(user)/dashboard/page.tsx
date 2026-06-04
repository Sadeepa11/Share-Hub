import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { Plus, ArrowRight, Package, Send, Inbox } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.users.findById(session.userId as string);
  const myPosts = (await db.posts.findMany()).filter(p => p.userId === session.userId);
  const myRequests = (await db.requests.findMany()).filter(r => r.requesterId === session.userId);
  const receivedRequests = (await db.requests.findMany()).filter(r => r.ownerId === session.userId);

  const stats = [
    { label: 'My Posts', value: myPosts.length, icon: Package, color: 'bg-app-green' },
    { label: 'Sent Requests', value: myRequests.length, icon: Send, color: 'bg-app-orange' },
    { label: 'Received Requests', value: receivedRequests.length, icon: Inbox, color: 'bg-app-green-lighter' },
  ];

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-app-green">Overview</h1>
          <p className="text-app-text-light mt-1">Welcome back, {user?.name}. Here is your donation activity.</p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 bg-app-orange text-white px-6 py-3 text-sm font-semibold rounded-xl hover:bg-app-orange-dark transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Link>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Received Requests */}
        <div className="bg-white rounded-2xl border border-app-border p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-app-green">Received Requests</h2>
            <Link href="/requests/received" className="text-sm text-app-orange font-medium hover:text-app-orange-dark flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {receivedRequests.length === 0 ? (
            <p className="text-app-text-light text-sm py-6 text-center">No requests received yet.</p>
          ) : (
            <ul className="space-y-3">
              {receivedRequests.slice(0, 5).map(req => {
                const post = myPosts.find(p => p.id === req.postId);
                return (
                  <li key={req.id} className="flex justify-between items-center p-3 rounded-xl bg-app-cream hover:bg-app-cream-dark transition-colors">
                    <div>
                      <p className="text-sm font-medium text-app-green">
                        {req.quantityRequested}x {post?.title || 'Unknown Item'}
                      </p>
                      <p className="text-xs text-app-text-light mt-0.5">Status: {req.status}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      req.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                      'bg-app-orange/10 text-app-orange'
                    }`}>
                      {req.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* My Recent Posts */}
        <div className="bg-white rounded-2xl border border-app-border p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-app-green">My Recent Posts</h2>
            <Link href="/posts/manage" className="text-sm text-app-orange font-medium hover:text-app-orange-dark flex items-center gap-1 transition-colors">
              Manage posts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {myPosts.length === 0 ? (
            <p className="text-app-text-light text-sm py-6 text-center">You haven&apos;t posted any items yet.</p>
          ) : (
            <ul className="space-y-3">
              {myPosts.slice(0, 5).map(post => (
                <li key={post.id} className="flex justify-between items-center p-3 rounded-xl bg-app-cream hover:bg-app-cream-dark transition-colors">
                  <div>
                    <p className="text-sm font-medium text-app-green">{post.title}</p>
                    <p className="text-xs text-app-text-light mt-0.5">Qty: {post.quantity} · {post.status}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    post.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
