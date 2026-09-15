import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, PackageCheck, Truck, Check, XCircle } from 'lucide-react';

export default async function SentRequestsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const allRequests = await db.requests.findMany();
  const sentRequests = allRequests.filter(r => r.requesterId === session.userId).reverse();
  const posts = await db.posts.findMany();
  const users = await db.users.findMany();

  const STEPS = [
    { key: 'Pending', label: 'Requested', icon: Clock },
    { key: 'Confirmed', label: 'Accepted', icon: CheckCircle2 },
    { key: 'Packing', label: 'Packing', icon: PackageCheck },
    { key: 'Shipping', label: 'Shipping', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Check },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Packing': return 2;
      case 'Shipping': return 3;
      case 'Delivered': return 4;
      default: return -1;
    }
  };

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-app-text-light hover:text-app-green transition-colors text-sm font-medium mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8 pb-6 border-b border-app-border">
        <h1 className="font-serif text-3xl md:text-4xl text-app-green mb-1">Track Sent Requests</h1>
        <p className="text-app-text-light">Track the real-time progress and status of your requested items.</p>
      </div>

      {sentRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-app-border p-12 text-center">
          <p className="text-app-text-light mb-4">You haven&apos;t sent any donation requests yet.</p>
          <Link href="/posts" className="inline-block bg-app-orange text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-app-orange-dark transition-colors">
            Browse Available Donations
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sentRequests.map(req => {
            const post = posts.find(p => p.id === req.postId);
            const owner = users.find(u => u.id === req.ownerId);
            const currentStepIdx = getStepIndex(req.status);
            const isRejected = req.status === 'Rejected';

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-app-border p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-app-border pb-4 mb-6 gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-app-orange">Request #{req.id.slice(0, 8)}</span>
                    <h3 className="text-lg font-bold text-app-green mt-0.5">
                      {req.quantityRequested}x {post?.title || 'Donation Item'}
                    </h3>
                    <p className="text-xs text-app-text-light mt-0.5">
                      Offered by: <span className="font-medium text-app-green">{owner?.name || 'Donor'}</span> · Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                      isRejected ? 'bg-red-100 text-red-700 border border-red-200' :
                      req.status === 'Delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-app-orange/10 text-app-orange border border-app-orange/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                {isRejected ? (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center gap-3 text-red-700 mb-6">
                    <XCircle className="w-6 h-6 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Request Rejected</p>
                      <p className="text-xs text-red-600 mt-0.5">Unfortunately, the owner declined or canceled this request.</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-2 mb-6">
                    <div className="relative flex items-center justify-between">
                      {/* Connecting Background Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full" />
                      
                      {/* Active Progress Bar */}
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-app-orange -translate-y-1/2 z-0 rounded-full transition-all duration-500"
                        style={{
                          width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%`
                        }}
                      />

                      {/* Stepper Nodes */}
                      {STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center group">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                              isCompleted
                                ? 'bg-app-green border-app-green text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-app-orange/20 scale-110' : ''}`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold mt-2.5 transition-colors ${
                              isCompleted ? 'text-app-green' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Request Details Footer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-app-border/60 text-xs">
                  <div className="bg-app-cream p-3 rounded-xl border border-app-border">
                    <span className="text-app-text-light font-medium block mb-0.5">Delivery Address</span>
                    <span className="font-semibold text-app-green">{req.address}</span>
                  </div>
                  <div className="bg-app-cream p-3 rounded-xl border border-app-border">
                    <span className="text-app-text-light font-medium block mb-0.5">Contact Number</span>
                    <span className="font-semibold text-app-green">{req.mobileNumber}</span>
                  </div>
                  <div className="bg-app-cream p-3 rounded-xl border border-app-border sm:col-span-2 md:col-span-1">
                    <span className="text-app-text-light font-medium block mb-0.5">Last Updated</span>
                    <span className="font-semibold text-app-green">{new Date(req.updatedAt || req.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
