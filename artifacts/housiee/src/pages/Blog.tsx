import { useListBlogPosts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Blog() {
  const { data: posts, isLoading } = useListBlogPosts();

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Insights & News</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden relative">
                      <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">{post.category}</div>
                    <h3 className="font-serif text-xl font-bold mb-3 line-clamp-2 group-hover:text-secondary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
