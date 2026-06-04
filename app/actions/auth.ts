'use server';

import { db } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await db.users.findByEmail(email);

  if (!user || user.password !== password) {
    return { error: 'Invalid email or password' };
  }

  if (user.status === 'blocked') {
    return { error: 'Your account has been blocked by an administrator' };
  }

  await createSession(user.id, user.role);

  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  const existingUser = await db.users.findByEmail(email);
  if (existingUser) {
    return { error: 'Email is already registered' };
  }

  const user = await db.users.create({
    name,
    email,
    password, // Plain text for simplicity as requested/noted
    role: 'user',
    status: 'active',
  });

  await createSession(user.id, user.role);
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
