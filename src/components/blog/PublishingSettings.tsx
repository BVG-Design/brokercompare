<h3 className="text-lg font-semibold text-[#132847] mb-4">Layout Options</h3>
        
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label>Enable Table of Contents</Label>
    <Switch
      checked={postData.toc_enabled}
      onCheckedChange={(checked) => setPostData({ ...postData, toc_enabled: checked })}
    />
  </div>

  {postData.toc_enabled && (
    <>
      <div>
        <Label>TOC Position</Label>
        <Select 
          value={postData.toc_position} 
          onValueChange={(value) => setPostData({ ...postData, toc_position: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left Sidebar</SelectItem>
            <SelectItem value="right">Right Sidebar</SelectItem>
            <SelectItem value="top">Top Inline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )}

  <div>
    <Label>Content Width</Label>
    <Select 
      value={postData.content_width} 
      onValueChange={(value) => setPostData({ ...postData, content_width: value })}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="narrow">Narrow (600px)</SelectItem>
        <SelectItem value="medium">Medium (800px)</SelectItem>
        <SelectItem value="wide">Wide (1000px)</SelectItem>
        <SelectItem value="full">Full Width</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
</div>

{/* Schedule */}
<div className="pt-6 border-t">
<h3 className="text-lg font-semibold text-[#132847] mb-4">Scheduling</h3>

<div className="space-y-4">
  <div>
    <Label htmlFor="published_date">Published Date</Label>
    <Input
      id="published_date"
      type="date"
      value={postData.published_date}
      onChange={(e) => setPostData({ ...postData, published_date: e.target.value })}
    />
  </div>

  <div>
    <Label htmlFor="scheduled_publish_date">Schedule Publication</Label>
    <Input
      id="scheduled_publish_date"
      type="datetime-local"
      value={postData.scheduled_publish_date}
      onChange={(e) => setPostData({ ...postData, scheduled_publish_date: e.target.value })}
    />
    <p className="text-xs text-gray-500 mt-1">
      Leave empty to publish immediately
    </p>
  </div>
</div>
</div>
</div>
);
}