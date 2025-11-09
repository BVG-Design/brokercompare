'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Clock,
  Settings,
  X,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import BlogEditor from '@/components/blog/BlogEditor';
import BlogPreview from '@/components/blog/BlogPreview';
import PublishingSettings from '@/components/blog/PublishingSettings';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function BlogPostComposer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [previewMode, setPreviewMode] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: '',
    categories: [],
    tags: [],
    published: false,
    published_date: '',
    scheduled_publish_date: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    reading_time: 0,
    toc_enabled: true,
    toc_position: 'left',
    content_width: 'medium',
  });

  // Mock user and data loading
  useEffect(() => {
    // Mock user
    const mockUser = {
      role: 'admin',
      full_name: 'Admin User',
      email: 'admin@example.com',
    };
    setUser(mockUser);
    setPostData((prev) => ({ ...prev, author: mockUser.full_name }));

    // Mock loading existing post
    if (postId) {
      // In a real app, you'd fetch this from your backend
      console.log(`Loading post with ID: ${postId}`);
      const existingPost = {
        id: postId,
        title: 'Existing Blog Post',
        content: '<p>This is the content of an existing blog post.</p>',
        categories: ['broker_tips'],
        // ... other fields
      };
      setPostData((prev) => ({ ...prev, ...existingPost }));
    }

    setIsLoading(false);
  }, [postId]);

  // Auto-generate slug
  useEffect(() => {
    if (postData.title && !postId) {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setPostData((prev) => ({ ...prev, slug }));
    }
  }, [postData.title, postId]);

  // Calculate reading time
  useEffect(() => {
    const text = postData.content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200);
    setPostData((prev) => ({ ...prev, reading_time: readingTime }));
  }, [postData.content]);

  // Mock save function
  const handleSave = async (publish = false) => {
    setIsSaving(true);
    console.log('Saving post...', { ...postData, published: publish });
    await new Promise((res) => setTimeout(res, 1000)); // Simulate async
    
    let newPostId = postId;
    if (!newPostId) {
      newPostId = `post_${Date.now()}`;
      router.replace(`/admin/blog/composer?id=${newPostId}`);
    }

    setLastSaved(new Date());
    toast({ title: 'Post saved successfully' });
    setIsSaving(false);
  };

  const handlePublish = () => {
    if (!postData.title || !postData.content) {
      toast({
        title: 'Error',
        description: 'Title and content are required to publish.',
        variant: 'destructive',
      });
      return;
    }
    handleSave(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Preview Mode
  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setPreviewMode(null)}>
                <X className="w-4 h-4 mr-2" />
                Close Preview
              </Button>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="h-8 px-2"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                  className="h-8 px-2"
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="h-8 px-2"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`w-full flex justify-center ${
            previewMode === 'mobile'
              ? 'p-4'
              : previewMode === 'tablet'
              ? 'p-8'
              : ''
          }`}
        >
          <div
            className={
              previewMode === 'mobile'
                ? 'max-w-[375px] w-full border-x border-gray-300 bg-white'
                : previewMode === 'tablet'
                ? 'max-w-[768px] w-full border-x border-gray-300 bg-white'
                : 'w-full'
            }
          >
            <BlogPreview
              postData={postData}
              fullWidth={previewMode === 'desktop'}
            />
          </div>
        </div>
      </div>
    );
  }

  // Editor Mode
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header Bar */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/admin')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                {lastSaved && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <span>{postData.reading_time} min read</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet open={showSettings} onOpenChange={setShowSettings}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Post Settings</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <PublishingSettings
                      postData={postData}
                      setPostData={setPostData}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode('desktop')}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSave(false)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={isSaving} className="bg-[#132847] hover:bg-[#1a3a5f]">
                {postData.published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg min-h-screen p-12">
          <Input
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
            placeholder="Untitled"
            className="text-4xl font-bold border-0 focus-visible:ring-0 px-0 mb-8 placeholder:text-gray-300"
          />
          <BlogEditor postData={postData} setPostData={setPostData} />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
