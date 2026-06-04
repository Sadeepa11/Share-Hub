import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import DeletePostButton from './DeletePostButton';
import Image from 'next/image';

export default async function ManagePostsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const allPosts = await db.posts.findMany();
  const myPosts = allPosts.filter(p => p.userId === session.userId).reverse();

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-app-text-light hover:text-app-green transition-colors text-sm font-medium mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-app-border">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-app-green mb-1">Manage Posts</h1>
          <p className="text-app-text-light">View and manage the items you have listed.</p>
        </div>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-app-orange text-white text-sm font-semibold rounded-xl hover:bg-app-orange-dark transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </Link>
      </div>

      {myPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-app-border p-12 text-center">
          <p className="text-app-text-light">You haven&apos;t posted any items yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-app-border p-5 flex flex-col md:flex-row gap-5 hover:shadow-md hover:shadow-app-green/5 transition-shadow">
              {post.imageUrl && (
                <div className="relative w-full md:w-36 h-36 rounded-xl overflow-hidden shrink-0">
                  <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-app-green/10 text-app-green text-xs font-medium px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-app-text-light">Qty: {post.quantity}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-auto ${
                      post.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-app-green mb-1.5">{post.title}</h3>
                  <p className="text-app-text-light text-sm line-clamp-2 leading-relaxed">{post.description}</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <Link
                    href={`/posts/${post.id}`}
                    className="px-4 py-2 border border-app-border text-app-green text-xs font-medium rounded-lg hover:bg-app-cream transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="px-4 py-2 border border-app-border text-app-green text-xs font-medium rounded-lg hover:bg-app-cream transition-colors"
                  >
                    Edit
                  </Link>
                  <DeletePostButton postId={post.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
