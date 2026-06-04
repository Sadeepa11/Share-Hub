import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StatusUpdater from './StatusUpdater';

export default async function ReceivedRequestsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const allRequests = await db.requests.findMany();
  const receivedRequests = allRequests.filter(r => r.ownerId === session.userId).reverse();
  const posts = await db.posts.findMany();
  const users = await db.users.findMany();

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-app-text-light hover:text-app-green transition-colors text-sm font-medium mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8 pb-6 border-b border-app-border">
        <h1 className="font-serif text-3xl md:text-4xl text-app-green mb-1">Received Requests</h1>
        <p className="text-app-text-light">Manage people asking for your items.</p>
      </div>

      {receivedRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-app-border p-12 text-center">
          <p className="text-app-text-light">You haven&apos;t received any requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {receivedRequests.map(req => {
            const post = posts.find(p => p.id === req.postId);
            const requester = users.find(u => u.id === req.requesterId);

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-app-border p-6 flex flex-col md:flex-row gap-6 hover:shadow-md hover:shadow-app-green/5 transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      req.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      req.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                      req.status === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                      'bg-app-orange/10 text-app-orange'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-app-text-light">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-base font-semibold text-app-green mb-1">
                    <span className="text-app-text-light font-normal">{requester?.name || 'Unknown User'} requested </span>
                    {req.quantityRequested}x{' '}
                    <span className="text-app-text-light font-normal">of </span>
                    {post?.title || 'Unknown Item'}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-app-cream rounded-xl p-3 border border-app-border">
                      <p className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-1">Mobile</p>
                      <p className="text-sm text-app-green font-medium">{req.mobileNumber}</p>
                    </div>
                    <div className="bg-app-cream rounded-xl p-3 border border-app-border">
                      <p className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-1">NIC</p>
                      <p className="text-sm text-app-green font-medium">{req.nic}</p>
                    </div>
                    <div className="bg-app-cream rounded-xl p-3 border border-app-border sm:col-span-1">
                      <p className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-1">Address</p>
                      <p className="text-sm text-app-green font-medium">{req.address}</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-app-cream rounded-xl p-3 border-l-4 border-app-orange">
                    <p className="text-xs font-semibold text-app-text-light uppercase tracking-wider mb-1">Reason</p>
                    <p className="text-sm text-app-green italic">&ldquo;{req.reason}&rdquo;</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:w-52 justify-center border-t md:border-t-0 md:border-l border-app-border pt-5 md:pt-0 md:pl-6">
                  <StatusUpdater requestId={req.id} currentStatus={req.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
