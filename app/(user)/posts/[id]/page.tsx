import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Info } from 'lucide-react';
import RequestForm from './RequestForm';

export default async function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  const post = await db.posts.findById(id);

  if (!post) {
    notFound();
  }

  const owner = await db.users.findById(post.userId);
  const isOwner = session?.userId === post.userId;

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col bg-app-cream md:overflow-hidden animate-fade-in">
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-app-cream-dark flex items-center justify-center relative flex-shrink-0 md:rounded-r-3xl overflow-hidden">
          <Link
            href="/posts"
            className="absolute top-5 left-5 z-20 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all text-app-green border border-app-border group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="text-app-text-light text-sm font-medium">No Image</div>
          )}
        </div>

        {/* Right: Details & Request Form */}
        <div className="w-full md:w-1/2 md:h-full flex flex-col bg-white md:overflow-y-auto">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col min-h-full">
            <span className="inline-block bg-app-green/10 text-app-green px-3 py-1 rounded-full text-xs font-medium mb-5 w-fit">
              {post.category}
            </span>

            <h1 className="font-serif text-3xl lg:text-4xl text-app-green mb-3 leading-tight">{post.title}</h1>
            <p className="text-sm text-app-text-light mb-8">
              Donated by: <span className="font-semibold text-app-green">{owner?.name || 'Unknown'}</span>
            </p>

            <div className="mb-8 flex-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-app-text-light mb-3">Description</h3>
              <p className="text-app-green/80 whitespace-pre-wrap leading-relaxed">
                {post.description}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-app-border">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-app-text-light font-medium">Quantity Available</span>
                <span className="text-3xl font-bold text-app-green">{post.quantity}</span>
              </div>

              {isOwner ? (
                <div className="bg-app-cream rounded-xl p-4 flex items-start gap-3 border border-app-border">
                  <Info className="w-5 h-5 text-app-green shrink-0 mt-0.5" />
                  <p className="text-sm text-app-green/80">
                    This is your post. View requests for this item in your{' '}
                    <Link href="/requests/received" className="font-semibold text-app-orange hover:text-app-orange-dark underline underline-offset-2 transition-colors">
                      Dashboard
                    </Link>.
                  </p>
                </div>
              ) : post.status === 'available' ? (
                <RequestForm postId={post.id} availableQuantity={post.quantity} />
              ) : (
                <div className="w-full text-center py-4 bg-app-cream text-app-text-light text-sm font-medium rounded-xl border border-app-border">
                  This item is no longer available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
