import { getSession } from '@/lib/auth';
import ScrollNavbarClient from './ScrollNavbarClient';

export default async function Navbar() {
  const session = await getSession();

  return <ScrollNavbarClient session={session} />;
}
