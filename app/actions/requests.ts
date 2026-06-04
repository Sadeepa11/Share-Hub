'use server';

import { db, RequestStatus } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createRequest(postId: string, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const quantityStr = formData.get('quantityRequested') as string;
  const reason = formData.get('reason') as string;
  const mobileNumber = formData.get('mobileNumber') as string;
  const address = formData.get('address') as string;
  const nic = formData.get('nic') as string;

  if (!quantityStr || !reason || !mobileNumber || !address || !nic) {
    return { error: 'All fields are required' };
  }

  const quantityRequested = parseInt(quantityStr, 10);

  const post = await db.posts.findById(postId);
  if (!post) return { error: 'Post not found' };
  if (post.status !== 'available') return { error: 'Item is no longer available' };
  if (quantityRequested > post.quantity) return { error: 'Requested quantity exceeds available quantity' };
  if (post.userId === session.userId) return { error: 'You cannot request your own item' };

  await db.requests.create({
    postId,
    requesterId: session.userId as string,
    ownerId: post.userId,
    quantityRequested,
    reason,
    mobileNumber,
    address,
    nic,
  });

  revalidatePath('/posts');
  revalidatePath('/requests/sent');
  return { success: true };
}

export async function updateRequestStatus(requestId: string, newStatus: RequestStatus) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const request = await db.requests.findById(requestId);
  if (!request) return { error: 'Request not found' };

  if (request.ownerId !== session.userId && session.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  await db.requests.update(requestId, { status: newStatus });

  // If confirmed, update post quantity logic could go here
  // For simplicity, we just mark status updates.
  
  revalidatePath('/requests/received');
  revalidatePath('/dashboard');
  return { success: true };
}
