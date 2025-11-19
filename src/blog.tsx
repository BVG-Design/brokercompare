
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => base44.entities.BlogPost.filter({ published: true }, '-published_date'),
    initialData: [],
  });

  const categoryColors = {
    industry_news: "bg-blue-100 text-blue-700",
    broker_tips: "bg-green-100 text-green-700",
    product_reviews: "bg-purple-100 text-purple-700",
    case_studies: "bg-orange-100 text-orange-700",
    guides: "bg-indigo-100 text-indigo-700",
    sponsored_post: "bg-yellow-100 text-yellow-700"
  };

  const categoryLabels = {
    industry_news: "Industry News",
    broker_tips: "Broker Tips",
    product_reviews: "Product Reviews",
    case_studies: "Case Studies",
    guides: "Guides",
    sponsored_post: "Sponsored Post"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            BrokerMatch Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Insights, tips, and industry news for finance brokers
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">We're working on great content for you. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-200 hover:border-[#05d8b5]">
                {post.featured_image && (
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.slice(0, 2).map(cat => (
                        <Badge key={cat} className={`${categoryColors[cat]} text-xs`}>
                          {categoryLabels[cat] || cat}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#132847] mb-3 group-hover:text-[#05d8b5] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.published_date && format(new Date(post.published_date), "MMM d, yyyy")}
                    </div>
                    {post.view_count > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count}
                      </div>
                    )}
                  </div>
                  {post.author && (
                    <p className="text-xs text-gray-500 mt-2">By {post.author}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
