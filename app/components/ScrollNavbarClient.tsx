'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { Leaf } from 'lucide-react';

export default function ScrollNavbarClient({ session }: { session: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSolid = !isHomePage || isScrolled;
  const positionClass = isHomePage ? 'fixed top-0 w-full' : 'sticky top-0 w-full';

  const navClasses = isSolid
    ? 'bg-white/95 backdrop-blur-md border-b border-app-border shadow-sm py-2'
    : 'bg-transparent py-4';

  return (
    <nav className={`${positionClass} z-50 transition-all duration-300 ${navClasses}`}>
      <div className="w-[90%] mx-auto">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-app-green rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-app-orange" />
            </div>
            <span className={`font-bold text-xl transition-colors duration-300 ${isSolid ? 'text-app-green' : 'text-white'}`}>
              Share<span className="text-app-orange">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Link
                  href={session.role === 'admin' ? '/admin' : '/dashboard'}
                  className={`text-sm font-medium transition-colors duration-300 ${isSolid ? 'text-app-text-light hover:text-app-green' : 'text-white/80 hover:text-white'}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/posts"
                  className={`text-sm font-medium transition-colors duration-300 ${isSolid ? 'text-app-text-light hover:text-app-green' : 'text-white/80 hover:text-white'}`}
                >
                  Browse Items
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-sm font-medium px-4 py-2 rounded-lg bg-app-cream text-app-green hover:bg-app-cream-dark transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors duration-300 ${isSolid ? 'text-app-text-light hover:text-app-green' : 'text-white/80 hover:text-white'}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-app-orange text-white text-sm font-semibold rounded-lg hover:bg-app-orange-dark transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
