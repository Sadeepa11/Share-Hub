'use client';

import { useState } from 'react';
import { blockUser, unblockUser } from '@/app/actions/admin';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function AdminUserActions({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleStatus() {
    setIsLoading(true);
    let result;
    if (currentStatus === 'active') {
      result = await blockUser(userId);
    } else {
      result = await unblockUser(userId);
    }

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`User ${currentStatus === 'active' ? 'blocked' : 'unblocked'} successfully`);
    }
  }

  return (
    <button
      onClick={handleToggleStatus}
      disabled={isLoading}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        currentStatus === 'active'
          ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
      }`}
    >
      {isLoading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
        : currentStatus === 'active' ? 'Block User' : 'Unblock User'
      }
    </button>
  );
}
