'use client';

import { useState } from 'react';
import { deletePost } from '@/app/actions/posts';
import toast from 'react-hot-toast';
import { Loader2, Trash2 } from 'lucide-react';

export default function DeletePostButton({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setShowConfirm(false);
    const res = await deletePost(postId);
    setIsDeleting(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success('Post deleted successfully');
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="px-4 py-2 text-red-500 hover:bg-red-50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 border border-red-100 hover:border-red-200"
      >
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5" /> Delete</>}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-app-green/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-app-border p-8 max-w-sm w-full shadow-2xl animate-slide-in-up">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-serif text-2xl text-app-green mb-2">Delete Post</h3>
            <p className="text-app-text-light text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-app-border text-app-green text-sm font-semibold rounded-xl hover:bg-app-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
