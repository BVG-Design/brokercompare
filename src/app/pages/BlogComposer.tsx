import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Eye, Monitor, Tablet, Smartphone, ArrowLeft, Clock, Settings, X } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { debounce } from "lodash";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import BlogEditor from "../components/blog/BlogEditor";
import BlogPreview from "../components/blog/BlogPreview";
import PublishingSettings from "../components/blog/PublishingSettings";

export default function BlogPostComposer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  const [user, setUser] = useState(null);
  const [previewMode, setPreviewMode] = useState(null); // null, "full", "mobile", "tablet", "desktop"
  const [showSettings, setShowSettings] = useState(false);
  const autoSaveInterval = useRef(null);

  // Post state
  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    author: "",
    categories: [],
    tags: [],
    published: false,
    published_date: "",
    scheduled_publish_date: "",
    meta_title: "",
    meta_description: "",
    focus_keyword: "",
    reading_time: 0,
    toc_enabled: true,
    toc_position: "left",
    content_width: "medium"
  });

  const [lastSaved, setLastSaved] = useState(null);

  // Check auth
  useEffect(() => {
    base44.auth.me().then(u => {
      if (u.role !== 'admin') {
        navigate(createPageUrl('Home'));
      }
      setUser(u);
      if (!postData.author) {
        setPostData(prev => ({ ...prev, author: u.full_name || u.email }));
      }
    }).catch(() => {
      navigate(createPageUrl('Home'));
    });
  }, [navigate, postData.author]);

  // Load existing post
  const { data: existingPost, isLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0] || null;
    },
    enabled: !!postId,
  });

  useEffect(() => {
    if (existingPost) {
      setPostData({
        ...existingPost,
        categories: existingPost.categories || []
      });
    }
  }, [existingPost]);

  // Auto-generate slug from title
  useEffect(() => {
    if (postData.title && !postId) {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setPostData(prev => ({ ...prev, slug }));
    }
  }, [postData.title, postId]);

  // Calculate reading time
  useEffect(() => {
    const text = postData.content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);
    setPostData(prev => ({ ...prev, reading_time: readingTime }));
  }, [postData.content]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (postId) {
        return await base44.entities.BlogPost.update(postId, data);
      } else {
        return await base44.entities.BlogPost.create(data);
      }
    },
    onSuccess: (savedPost) => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      setLastSaved(new Date());
      toast.success("Post saved successfully");
      
      if (!postId && savedPost.id) {
        window.history.replaceState({}, '', createPageUrl(`BlogPostComposer?id=${savedPost.id}`));
      }
    },
    onError: () => {
      toast.error("Failed to save post");
    }
  });

  // Auto-save every 30 seconds
  const debouncedSave = useRef(
    debounce((data) => {
      if (data.title && data.content) {
        saveMutation.mutate({ ...data, published: false });
      }
    }, 500)
  ).current;

  useEffect(() => {
    autoSaveInterval.current = setInterval(() => {
      if (postData.title && postData.content) {
        debouncedSave(postData);
      }
    }, 30000);

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [postData, debouncedSave]);

  const handleSave = () => {
    saveMutation.mutate(postData);
  };

  const handlePublish = () => {
    if (!postData.title || !postData.content) {
      toast.error("Title and content are required");
      return;
    }
    
    saveMutation.mutate({
      ...postData,
      published: true,
      published_date: postData.published_date || new Date().toISOString().split('T')[0]
    });
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Close Preview
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                    className="h-8 px-2"
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "tablet" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("tablet")}
                    className="h-8 px-2"
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                    className="h-8 px-2"
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full flex justify-center ${
          previewMode === "mobile" ? "p-4" : previewMode === "tablet" ? "p-8" : ""
        }`}>
          <div className={
            previewMode === "mobile" ? "max-w-[375px] w-full border-x border-gray-300 bg-white" :
            previewMode === "tablet" ? "max-w-[768px] w-full border-x border-gray-300 bg-white" :
            "w-full"
          }>
            <BlogPreview postData={postData} fullWidth={previewMode === "desktop"} />
          </div>
        </div>
      </div>
    );
  }

  // Editor Mode (Google Doc style)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header Bar */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(createPageUrl('AdminDashboard'))}
              >
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
                    <PublishingSettings postData={postData} setPostData={setPostData} />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode("desktop")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saveMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={saveMutation.isPending}
                className="bg-[#132847] hover:bg-[#1a3a5f]"
              >
                {postData.published ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor Area - Google Doc Style */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg shadow-lg min-h-screen p-12">
          {/* Title Input - Large and Prominent */}
          <Input
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            placeholder="Untitled"
            className="text-4xl font-bold border-0 focus-visible:ring-0 px-0 mb-8 placeholder:text-gray-300"
          />

          {/* Editor */}
          <BlogEditor postData={postData} setPostData={setPostData} />
        </div>
      </div>
    </div>
  );
}
