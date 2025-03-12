import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import VaultLayout from '../../components/layout/VaultLayout';
import AdminNav from '../../components/admin/AdminNav';
import MediaUploader from '../../components/admin/MediaUploader';
import { v4 as uuidv4 } from 'uuid';

const TestLocalUploadPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [componentId, setComponentId] = useState<string>('');
  
  // Initialize component ID on client side only to avoid hydration mismatch
  useEffect(() => {
    setComponentId(uuidv4());
  }, []);
  
  // Handle image change
  const handleImageChange = (url: string, mediaType: 'image' | 'video' | 'unknown') => {
    if (mediaType === 'image') {
      setImageUrl(url);
    }
  };
  
  // Handle video change
  const handleVideoChange = (url: string, mediaType: 'image' | 'video' | 'unknown') => {
    if (mediaType === 'video') {
      setVideoUrl(url);
    }
  };
  
  // Generate a new component ID
  const handleNewComponentId = () => {
    setComponentId(uuidv4());
  };
  
  return (
    <VaultLayout title="Test Local Upload - Admin Dashboard">
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Test Local Media Upload</h1>
          <Button variant="outline" onClick={handleNewComponentId}>
            Generate New Component ID
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component Information</CardTitle>
            <CardDescription>
              This is a test page for local media uploads. Files will be stored in the public/uploads directory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">
              <strong>Component ID:</strong> {componentId || 'Generating...'}
            </p>
            <p className="text-sm mb-2">
              <strong>Image URL:</strong> {imageUrl || 'None'}
            </p>
            <p className="text-sm mb-2">
              <strong>Video URL:</strong> {videoUrl || 'None'}
            </p>
          </CardContent>
        </Card>
        
        {componentId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Image Uploader</CardTitle>
                <CardDescription>
                  Upload an image file to test local storage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaUploader
                  label="Upload Image"
                  initialMediaUrl={imageUrl}
                  onMediaChange={handleImageChange}
                  componentId={componentId}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Uploader</CardTitle>
                <CardDescription>
                  Upload a video file to test local storage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MediaUploader
                  label="Upload Video"
                  initialMediaUrl={videoUrl}
                  onMediaChange={handleVideoChange}
                  componentId={componentId}
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        {(imageUrl || videoUrl) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Preview of uploaded media files.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {imageUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Image Preview</h3>
                  <div className="rounded-md overflow-hidden border border-border aspect-video">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {videoUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Video Preview</h3>
                  <div className="rounded-md overflow-hidden border border-border aspect-video">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </VaultLayout>
  );
};

export default TestLocalUploadPage;
