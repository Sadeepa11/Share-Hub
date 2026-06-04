'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const allowedPaths = ['/', '/dashboard', '/posts'];
  
  // Only show the navbar on the specific allowed pages
  if (!allowedPaths.includes(pathname)) {
    return null;
  }
  
  return <>{children}</>;
}
