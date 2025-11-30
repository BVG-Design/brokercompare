"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface BlogEditorProps {
  postData: { content: string } & Record<string, any>;
  setPostData: (data: any) => void;
}

export default function BlogEditor({ postData, setPostData }: BlogEditorProps) {
  return (
    <div>
      <Textarea
        className="min-h-[700px] text-base leading-7"
        value={postData.content}
        onChange={(event) =>
          setPostData({
            ...postData,
            content: event.target.value,
          })
        }
        placeholder="Start writing..."
      />
      <p className="text-sm text-muted-foreground mt-2">
        Basic formatting is supported using HTML tags. Your content will render
        in the preview exactly as entered here.
      </p>
    </div>
  );
}
