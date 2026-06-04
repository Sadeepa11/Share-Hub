import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EditPostForm from './EditPostForm';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Next 15 awaits params
  const { id } = await params;
  const post = await db.posts.findById(id);

  if (!post || post.userId !== session.userId) {
    redirect('/posts/manage');
  }

  return <EditPostForm post={post} />;
}
