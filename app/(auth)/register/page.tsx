'use client';

import { useState } from 'react';
import Link from 'next/link';
import { register } from '@/app/actions/auth';
import toast from 'react-hot-toast';
import { Loader2, Leaf } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await register(formData);

    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-cream py-12 px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-app-green rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-app-orange" />
            </div>
            <span className="font-bold text-2xl text-app-green">
              Share<span className="text-app-orange">Hub</span>
            </span>
          </Link>
          <h2 className="font-serif text-3xl text-app-green mb-2">Create your account</h2>
          <p className="text-app-text-light text-sm">Join the donation community</p>
        </div>

        <div className="bg-white rounded-2xl border border-app-border p-8 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-app-green mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-cream text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-app-green mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-cream text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-app-green mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-xl border border-app-border bg-app-cream text-app-green text-sm focus:border-app-green focus:ring-2 focus:ring-app-green/10 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 text-sm font-semibold text-white bg-app-orange hover:bg-app-orange-dark rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-app-text-light">
          Already have an account?{' '}
          <Link href="/login" className="text-app-green font-semibold hover:text-app-green-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
