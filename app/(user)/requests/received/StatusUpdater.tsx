'use client';

import { useState } from 'react';
import { updateRequestStatus } from '@/app/actions/requests';
import { RequestStatus } from '@/lib/db';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function StatusUpdater({ requestId, currentStatus }: { requestId: string, currentStatus: RequestStatus }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(newStatus: RequestStatus) {
    setIsLoading(true);
    const result = await updateRequestStatus(requestId, newStatus);
    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status updated to ${newStatus}`);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-app-green" />
      </div>
    );
  }

  const primaryBtn = "w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors bg-app-green text-white hover:bg-app-green-light";
  const secondaryBtn = "w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors border border-app-border text-app-green hover:bg-app-cream";

  if (currentStatus === 'Pending') {
    return (
      <div className="flex flex-col gap-2">
        <button onClick={() => handleUpdate('Confirmed')} className={primaryBtn}>
          Accept
        </button>
        <button onClick={() => handleUpdate('Rejected')} className={secondaryBtn}>
          Reject
        </button>
      </div>
    );
  }

  if (currentStatus === 'Confirmed') {
    return (
      <button onClick={() => handleUpdate('Packing')} className={primaryBtn}>
        Mark Packing
      </button>
    );
  }

  if (currentStatus === 'Packing') {
    return (
      <button onClick={() => handleUpdate('Shipping')} className={primaryBtn}>
        Mark Shipping
      </button>
    );
  }

  if (currentStatus === 'Shipping') {
    return (
      <button onClick={() => handleUpdate('Delivered')} className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors bg-app-orange text-white hover:bg-app-orange-dark">
        Mark Delivered
      </button>
    );
  }

  return (
    <div className="text-center w-full py-2.5 bg-app-cream text-app-text-light text-xs font-medium rounded-xl border border-app-border">
      Final: {currentStatus}
    </div>
  );
}
