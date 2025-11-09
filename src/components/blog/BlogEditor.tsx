'use client';
import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToast } from '@/hooks/use-toast';

// Mock file upload function
const mockUploadFile = async (file) => {
  console.log('Uploading file:', file.name);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const url = URL.createObjectURL(file);
  console.log('File available at:', url);
  return { file_url: url };
};

export default function BlogEditor({ postData, setPostData }) {
  const quillRef = useRef(null);
  const { toast } = useToast();

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      if (!file) return;

      try {
        toast({ title: 'Uploading image...' });
        const { file_url } = await mockUploadFile(file);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', file_url);
        toast({ title: 'Image uploaded successfully' });
      } catch (error) {
        toast({ title: 'Failed to upload image', variant: 'destructive' });
      }
    };
  };

  const videoHandler = () => {
    const url = prompt(
      'Enter YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID):'
    );
    if (!url) return;

    try {
      let videoUrl = url;

      if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        if (videoId) {
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) {
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
        }
      } else if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) {
          videoUrl = `https://player.vimeo.com/video/${videoId}`;
        }
      }

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'video', videoUrl);
      toast({ title: 'Video embedded successfully' });
    } catch (error) {
      toast({
        title: 'Failed to embed video',
        description: 'Please check the URL format.',
        variant: 'destructive',
      });
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'blockquote',
    'code-block',
    'align',
  ];

  return (
    <div>
      <div className="google-doc-editor">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={postData.content}
          onChange={(content) => setPostData({ ...postData, content })}
          modules={modules}
          formats={formats}
          placeholder="Start writing..."
          className="border-0"
        />
      </div>

      <style jsx global>{`
        .google-doc-editor .ql-container {
          font-size: 16px;
          min-height: 700px;
          border: none !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .google-doc-editor .ql-editor {
          min-height: 700px;
          line-height: 1.8;
          padding: 0;
        }
        .google-doc-editor .ql-toolbar {
          position: sticky;
          top: 128px; /* Adjusted for main header + composer header */
          background: white;
          z-index: 10;
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 12px 0;
          margin: 0 -12px 20px -12px;
        }
        .google-doc-editor .ql-editor h1 {
          font-size: 2.5em;
          font-weight: bold;
          margin: 1.5em 0 0.75em;
          line-height: 1.3;
        }
        .google-doc-editor .ql-editor h2 {
          font-size: 2em;
          font-weight: bold;
          margin: 1.5em 0 0.75em;
          line-height: 1.3;
        }
        .google-doc-editor .ql-editor h3 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1.25em 0 0.625em;
          line-height: 1.4;
        }
        .google-doc-editor .ql-editor h4 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1.25em 0 0.625em;
        }
        .google-doc-editor .ql-editor p {
          margin: 1em 0;
          line-height: 1.8;
        }
        .google-doc-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2em 0;
          border-radius: 8px;
        }
        .google-doc-editor .ql-editor .ql-video {
          width: 100%;
          height: 400px;
          margin: 2em 0;
          border-radius: 8px;
        }
        .google-doc-editor .ql-editor blockquote {
          border-left: 4px solid #ef4e23;
          padding-left: 1em;
          margin: 1.5em 0;
          color: #666;
          font-style: italic;
        }
        .google-doc-editor .ql-editor a {
          color: #ef4e23;
          text-decoration: underline;
        }
        .google-doc-editor .ql-editor ul,
        .google-doc-editor .ql-editor ol {
          padding-left: 1.5em;
          margin: 1.25em 0;
        }
        .google-doc-editor .ql-editor li {
          margin: 0.5em 0;
          line-height: 1.8;
        }
        .google-doc-editor .ql-editor.ql-blank::before {
          color: #d1d5db;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
