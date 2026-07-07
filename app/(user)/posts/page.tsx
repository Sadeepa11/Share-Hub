
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import SearchFilter from './SearchFilter';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  const params = await searchParams;
  const q = typeof params?.q === 'string' ? params.q.toLowerCase() : '';
  const category = typeof params?.category === 'string' ? params.category : '';

  const allPosts = await db.posts.findMany();
  let availablePosts = allPosts.filter(p => p.status === 'available');

  const categories = Array.from(new Set(availablePosts.map(p => p.category))).filter(Boolean);

  if (q) {
    availablePosts = availablePosts.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category) {
    availablePosts = availablePosts.filter(p => p.category === category);
  }

  return (
    <div className="w-[90%] mx-auto py-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-app-border">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-app-green">Browse Donations</h1>
          <p className="text-app-text-light mt-1">Curated items shared by the community.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-app-green/10 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-app-text-light">Available</p>
            <p className="text-xl font-bold text-app-green">{availablePosts.length}</p>
          </div>
          {session && (
            <Link
              href="/posts/create"
              className="px-5 py-2.5 bg-app-orange text-white text-sm font-semibold rounded-xl hover:bg-app-orange-dark transition-colors"
            >
              Post Item
            </Link>
          )}
        </div>
      </div>

      <SearchFilter categories={categories} />

      {availablePosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-app-border p-16 text-center">
          <div className="w-16 h-16 bg-app-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-app-green mb-2">No items available right now</h3>
          <p className="text-app-text-light mb-6 max-md mx-auto">Check back later or be the first to share something with the community.</p>
          <Link
            href="/posts/create"
            className="inline-block bg-app-orange text-white px-8 py-3 text-sm font-semibold rounded-xl hover:bg-app-orange-dark transition-colors"
          >
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePosts.map(post => (
            <Link key={post.id} href={`/posts/${post.id}`} className="group block bg-white rounded-2xl border border-app-border overflow-hidden hover:shadow-lg hover:shadow-app-green/5 transition-all hover:-translate-y-0.5">
              <div className="aspect-[4/3] bg-app-cream flex items-center justify-center relative overflow-hidden">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="text-app-text-light text-sm font-medium">No Image</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-app-green border border-app-border">
                  {post.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-app-green mb-1.5 group-hover:text-app-green-light transition-colors line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-app-text-light text-sm mb-4 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-app-text-light">
                    Qty: <span className="font-semibold text-app-green">{post.quantity}</span>
                  </div>
                  <span className="text-sm font-medium text-app-orange group-hover:text-app-orange-dark transition-colors">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
