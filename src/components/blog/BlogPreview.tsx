import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import TableOfContents from "./TableOfContents";

export default function BlogPreview({ postData, fullWidth = false }) {
  // Extract TOC from content
  const tocItems = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = postData.content;
    const headers = tempDiv.querySelectorAll('h2, h3');
    
    return Array.from(headers).map((header, index) => {
      const id = `heading-${index}`;
      header.id = id;
      
      return {
        id,
        text: header.textContent,
        level: parseInt(header.tagName.charAt(1))
      };
    });
  }, [postData.content]);

  // Add IDs to headers in content
  const contentWithIds = useMemo(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = postData.content;
    const headers = tempDiv.querySelectorAll('h2, h3');
    
    headers.forEach((header, index) => {
      header.id = `heading-${index}`;
    });
    
    return tempDiv.innerHTML;
  }, [postData.content]);

  const widthClasses = {
    narrow: "max-w-2xl",
    medium: "max-w-4xl",
    wide: "max-w-5xl",
    full: "max-w-full"
  };

  const showSidebar = postData.toc_enabled && tocItems.length > 0 && (postData.toc_position === 'left' || postData.toc_position === 'right');
  const showTopTOC = postData.toc_enabled && tocItems.length > 0 && postData.toc_position === 'top';

  const categoryLabels = {
    industry_news: "Industry News",
    broker_tips: "Broker Tips",
    product_reviews: "Product Reviews",
    case_studies: "Case Studies",
    guides: "Guides",
    sponsored_post: "Sponsored Post"
  };

  const categoryColors = {
    industry_news: "bg-blue-100 text-blue-700",
    broker_tips: "bg-green-100 text-green-700",
    product_reviews: "bg-purple-100 text-purple-700",
    case_studies: "bg-orange-100 text-orange-700",
    guides: "bg-indigo-100 text-indigo-700",
    sponsored_post: "bg-yellow-100 text-yellow-700"
  };

  return (
    <div className="min-h-screen bg-white">
      <div className={`mx-auto py-12 px-6 ${fullWidth ? 'max-w-full' : widthClasses[postData.content_width]}`}>
        {/* Header */}
        <div className="mb-8">
          {postData.categories && postData.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {postData.categories.map(cat => (
                <Badge key={cat} className={categoryColors[cat] || "bg-gray-100 text-gray-700"}>
                  {categoryLabels[cat] || cat}
                </Badge>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#132847] mb-4">
            {postData.title || 'Untitled Post'}
          </h1>
          
          {postData.excerpt && (
            <p className="text-xl text-gray-600 mb-6">{postData.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {postData.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {postData.author}
              </div>
            )}
            {postData.published_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(postData.published_date), "MMM d, yyyy")}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {postData.reading_time} min read
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {postData.featured_image && (
          <div className="mb-12">
            <img 
              src={postData.featured_image} 
              alt={postData.title}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>
        )}

        {/* TOC at Top */}
        {showTopTOC && (
          <div className="mb-12">
            <TableOfContents items={tocItems} position="top" />
          </div>
        )}

        {/* Content with Sidebar TOC */}
        <div className={showSidebar ? "flex gap-12" : ""}>
          {/* Left Sidebar TOC */}
          {showSidebar && postData.toc_position === 'left' && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={tocItems} position="left" />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-[#132847] prose-a:text-[#ef4e23] prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {/* Tags */}
            {postData.tags && postData.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar TOC */}
          {showSidebar && postData.toc_position === 'right' && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={tocItems} position="right" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          scroll-margin-top: 6rem;
        }
        
        .prose h1 {
          font-size: 2.5em;
          margin: 1.5em 0 0.75em;
          line-height: 1.3;
        }
        
        .prose h2 {
          font-size: 2em;
          margin: 1.5em 0 0.75em;
          line-height: 1.3;
        }
        
        .prose h3 {
          font-size: 1.5em;
          margin: 1.25em 0 0.625em;
          line-height: 1.4;
        }
        
        .prose p {
          margin: 1em 0;
          line-height: 1.8;
        }
        
        .prose img {
          margin: 2em 0;
        }
        
        .prose iframe {
          width: 100%;
          height: 400px;
          margin: 2em 0;
          border-radius: 0.5rem;
        }
        
        .prose blockquote {
          border-left: 4px solid #ef4e23;
          padding-left: 1rem;
          margin: 1.5em 0;
          color: #4B5563;
          font-style: italic;
        }
        
        .prose code {
          background: #F3F4F6;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        
        .prose pre {
          background: #1F2937;
          color: #F9FAFB;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        
        .prose a {
          color: #ef4e23;
          text-decoration: underline;
        }
        
        .prose a:hover {
          color: #d63d15;
        }
        
        .prose ul, .prose ol {
          margin: 1.25em 0;
          padding-left: 1.5em;
        }
        
        .prose li {
          margin: 0.5em 0;
          line-height: 1.8;
        }
        
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
        }
        
        .prose table td, .prose table th {
          border: 1px solid #ddd;
          padding: 12px;
        }
        
        .prose table th {
          background-color: #f3f4f6;
          font-weight: 600;
          text-align: left;
        }
        
        .prose table tr:nth-child(even) {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}