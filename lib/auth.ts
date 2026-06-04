import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { UserRole } from './db';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-sharehub-university-project'
);

export interface SessionPayload {
  userId: string;
  role: UserRole;
  expiresAt: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string, role: UserRole) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const session = await encrypt({ userId, role, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt),
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}
