import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Loader2, X, Upload, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMediaToSupabase, getMediaType, ensureStorageBucketExists } from '../../lib/supabaseStorage';

interface MediaUploaderProps {
  initialMediaUrl?: string;
  onMediaChange: (url: string, mediaType: 'image' | 'video' | 'unknown') => void;
  componentId?: string;
  label?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  initialMediaUrl = '',
  onMediaChange,
  componentId = 'default',
  label = 'Upload Media'
}) => {
  const [mediaUrl, setMediaUrl] = useState<string>(initialMediaUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure storage bucket exists on mount
  useEffect(() => {
    ensureStorageBucketExists();
  }, []);
  
  // Update mediaUrl when initialMediaUrl changes
  useEffect(() => {
    if (initialMediaUrl !== mediaUrl) {
      setMediaUrl(initialMediaUrl);
    }
  }, [initialMediaUrl]);
  
  // Determine media type from URL
  const mediaType = mediaUrl ? getMediaType(mediaUrl) : 'unknown';
  
  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    await uploadFile(file);
  };
  
  // Handle file upload
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const { url, mediaType, error } = await uploadMediaToSupabase(
        file, 
        componentId,
        file.name,
        file.type
      );
      
      if (error) {
        throw error;
      }
      
      setMediaUrl(url);
      onMediaChange(url, mediaType);
      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    await uploadFile(file);
  }, [componentId]);
  
  // Handle URL input
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    setMediaUrl(urlInput);
    onMediaChange(urlInput, getMediaType(urlInput));
    setShowUrlInput(false);
    toast.success('Media URL updated');
  };
  
  // Remove media
  const handleRemoveMedia = () => {
    setMediaUrl('');
    onMediaChange('', 'unknown');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        {mediaUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveMedia}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      
      {!mediaUrl ? (
        <Card
          className={`border-2 border-dashed p-4 ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">Drag and drop or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports JPG, PNG, GIF, WEBP, MP4, WEBM
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    Select File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowUrlInput(true)}
                    disabled={isUploading}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Enter URL
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="relative rounded-md overflow-hidden border border-border aspect-video">
          {mediaType === 'image' && (
            <img
              src={mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}
          {mediaType === 'video' && (
            <video
              src={mediaUrl}
              controls
              className="w-full h-full object-contain bg-black"
            />
          )}
          {mediaType === 'unknown' && (
            <div className="flex items-center justify-center h-full bg-muted">
              <p className="text-muted-foreground">Unsupported media type</p>
            </div>
          )}
        </div>
      )}
      
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter media URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Save</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowUrlInput(false)}
          >
            Cancel
          </Button>
        </form>
      )}
      
      {mediaUrl && (
        <div className="text-xs text-muted-foreground truncate">
          <span className="font-medium">URL:</span> {mediaUrl}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
