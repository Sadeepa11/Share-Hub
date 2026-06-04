'use client';

import { useState } from 'react';
import { createPost } from '@/app/actions/posts';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreatePostPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createPost(formData);

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-app-border bg-app-cream text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors";
  const labelClass = "block text-sm font-medium text-app-green mb-2";

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-app-text-light hover:text-app-green transition-colors text-sm font-medium mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-app-green mb-2">Post an Item</h1>
        <p className="text-app-text-light">List an item you&apos;d like to donate to the community.</p>
      </div>

      <div className="bg-white rounded-2xl border border-app-border p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className={labelClass}>Item Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="e.g. Physics Textbook, 3rd Edition"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Select a category</option>
                  <option value="Books">Books &amp; Study Materials</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Dorm Essentials">Dorm Essentials</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-app-text-light">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className={labelClass}>Quantity Available</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                defaultValue="1"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>Item Image (Optional)</label>
            <div className="rounded-xl border border-app-border bg-app-cream p-4">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                capture="environment"
                className="w-full text-sm text-app-text-light file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-app-green file:text-white hover:file:bg-app-green-light file:transition-colors file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description &amp; Condition</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              placeholder="Describe the item, its condition, and any other relevant details..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-app-border">
            <Link
              href="/dashboard"
              className="px-6 py-3 text-app-text-light hover:text-app-green text-sm font-medium transition-colors w-full sm:w-auto text-center rounded-xl border border-app-border hover:border-app-green"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-app-orange hover:bg-app-orange-dark text-white px-8 py-3 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
