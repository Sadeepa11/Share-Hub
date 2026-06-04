'use server';

import { db, PostStatus } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function createPost(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const quantityStr = formData.get('quantity') as string;
  const image = formData.get('image') as File | null;
  
  if (!title || !description || !category || !quantityStr) {
    return { error: 'All fields are required' };
  }

  const quantity = parseInt(quantityStr, 10);
  if (isNaN(quantity) || quantity <= 0) {
    return { error: 'Invalid quantity' };
  }

  let imageUrl: string | undefined = undefined;

  if (image && image.size > 0) {
    try {
      const userId = session.userId as string;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
      
      await mkdir(uploadDir, { recursive: true });
      
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${userId}/${filename}`;
    } catch (e) {
      console.error('Error uploading image:', e);
      return { error: 'Failed to upload image' };
    }
  }

  await db.posts.create({
    userId: session.userId as string,
    title,
    description,
    category,
    quantity,
    imageUrl,
  });

  revalidatePath('/posts');
  revalidatePath('/dashboard');
  redirect('/posts');
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const post = await db.posts.findById(postId);
  if (!post) return { error: 'Post not found' };

  if (post.userId !== session.userId && session.role !== 'admin') {
    return { error: 'Unauthorized to delete this post' };
  }

  await db.posts.delete(postId);
  revalidatePath('/posts');
  revalidatePath('/dashboard');
  revalidatePath('/posts/manage');
  revalidatePath('/admin');
}

export async function updatePost(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const postId = formData.get('postId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const quantityStr = formData.get('quantity') as string;
  const image = formData.get('image') as File | null;
  
  if (!postId || !title || !description || !category || !quantityStr) {
    return { error: 'All text fields are required' };
  }

  const post = await db.posts.findById(postId);
  if (!post) return { error: 'Post not found' };

  if (post.userId !== session.userId && session.role !== 'admin') {
    return { error: 'Unauthorized to edit this post' };
  }

  const quantity = parseInt(quantityStr, 10);
  if (isNaN(quantity) || quantity <= 0) {
    return { error: 'Invalid quantity' };
  }

  let imageUrl: string | undefined = post.imageUrl;

  if (image && image.size > 0) {
    try {
      const userId = session.userId as string;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
      
      await mkdir(uploadDir, { recursive: true });
      
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${userId}/${filename}`;
    } catch (e) {
      console.error('Error uploading image:', e);
      return { error: 'Failed to upload image' };
    }
  }

  await db.posts.update(postId, {
    title,
    description,
    category,
    quantity,
    imageUrl,
  });

  revalidatePath('/posts');
  revalidatePath(`/posts/${postId}`);
  revalidatePath('/posts/manage');
  revalidatePath('/dashboard');
  redirect('/posts/manage');
}
