'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function blockUser(userId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  await db.users.update(userId, { status: 'blocked' });
  revalidatePath('/admin');
  return { success: true };
}

export async function unblockUser(userId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  await db.users.update(userId, { status: 'active' });
  revalidatePath('/admin');
  return { success: true };
}

export async function deletePostAdmin(postId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  await db.posts.delete(postId);
  revalidatePath('/admin');
  revalidatePath('/posts');
  return { success: true };
}
