'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';

const mockPosts = [
  {
    id: 'post1',
    title: '5 Ways to Boost Your Brokerage in 2024',
    excerpt:
      'Discover the top strategies to increase your leads and close more deals this year.',
    published: true,
    categories: ['broker_tips'],
    view_count: 1204,
    reading_time: 5,
    featured_image: 'https://picsum.photos/seed/blog1/200/150',
  },
  {
    id: 'post2',
    title: 'Review: The Best CRM for Mortgage Brokers',
    excerpt: 'We take a deep dive into the top CRM platforms on the market.',
    published: false,
    categories: ['product_reviews', 'crm_systems'],
    view_count: 0,
    reading_time: 8,
    featured_image: 'https://picsum.photos/seed/blog2/200/150',
  },
];

export default function BlogManagement() {
  const router = useRouter();
  const [posts, setPosts] = React.useState(mockPosts);
  const [isLoading, setIsLoading] = React.useState(false);

  const categoryLabels = {
    industry_news: 'Industry News',
    broker_tips: 'Broker Tips',
    product_reviews: 'Product Reviews',
    case_studies: 'Case Studies',
    guides: 'Guides',
    sponsored_post: 'Sponsored Post',
    crm_systems: 'CRM Systems',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#132847]">Blog Management</CardTitle>
          <Button
            className="bg-[#132847] hover:bg-[#1a3a5f]"
            onClick={() => router.push('/admin/blog/composer')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No blog posts yet</p>
            <Button
              onClick={() => router.push('/admin/blog/composer')}
              variant="outline"
            >
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#132847] mb-1 truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <Badge
                        className={
                          post.published ? 'bg-green-500' : 'bg-gray-500'
                        }
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                      {post.categories && post.categories.length > 0 && (
                        <>
                          {post.categories.map((cat) => (
                            <Badge key={cat} variant="outline">
                              {categoryLabels[cat] || cat}
                            </Badge>
                          ))}
                        </>
                      )}
                      <span className="text-gray-500">
                        {post.view_count || 0} views
                      </span>
                      <span className="text-gray-500">
                        {post.reading_time || 0} min read
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/blog/composer?id=${post.id}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
