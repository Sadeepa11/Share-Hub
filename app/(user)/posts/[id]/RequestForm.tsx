'use client';

import { useState } from 'react';
import { createRequest } from '@/app/actions/requests';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function RequestForm({ postId, availableQuantity }: { postId: string, availableQuantity: number }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await createRequest(postId, formData);

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Request sent successfully!');
      form.reset();
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-app-border bg-app-cream text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors";
  const labelClass = "block text-sm font-medium text-app-green mb-2";

  return (
    <div>
      <h3 className="text-lg font-semibold text-app-green mb-5">Request This Item</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quantityRequested" className={labelClass}>Quantity Needed</label>
          <input
            type="number"
            id="quantityRequested"
            name="quantityRequested"
            min="1"
            max={availableQuantity}
            defaultValue="1"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="mobileNumber" className={labelClass}>Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            required
            placeholder="e.g. 0771234567"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="nic" className={labelClass}>NIC Number</label>
          <input
            type="text"
            id="nic"
            name="nic"
            required
            placeholder="e.g. 123456789V"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <textarea
            id="address"
            name="address"
            rows={2}
            required
            placeholder="Your pickup / delivery address..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label htmlFor="reason" className={labelClass}>Why do you need this?</label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            required
            placeholder="Briefly explain..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-app-orange hover:bg-app-orange-dark text-white px-6 py-3 mb-5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Request'}
        </button>
      </form>
    </div>
  );
}
