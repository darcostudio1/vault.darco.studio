import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';
import MediaUploader from '../../components/admin/MediaUploader';
import { ensureStorageBucketExists } from '../../lib/supabaseStorage';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const TestMediaUploadPage: React.FC = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [testId] = useState(uuidv4());

  // Ensure storage bucket exists
  React.useEffect(() => {
    ensureStorageBucketExists();
  }, []);

  // Handle preview image change
  const handlePreviewImageChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewImage(url);
    toast.success('Preview image updated');
  };
  
  // Handle preview video change
  const handlePreviewVideoChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewVideo(url);
    toast.success('Preview video updated');
  };

  return (
    <VaultLayout 
      title="Test Media Upload - Admin Dashboard"
      description="Test the Supabase media upload functionality"
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Test Media Upload</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Supabase Media Upload</CardTitle>
              <CardDescription>
                This page allows you to test the Supabase media upload functionality.
                Upload images and videos to see how they are stored in Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  label="Preview Image"
                  initialMediaUrl={previewImage}
                  onMediaChange={handlePreviewImageChange}
                  componentId={testId}
                />
                
                <MediaUploader
                  label="Preview Video"
                  initialMediaUrl={previewVideo}
                  onMediaChange={handlePreviewVideoChange}
                  componentId={testId}
                />
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium mb-2">Test Information:</h3>
                <p className="text-xs mb-2">
                  <span className="font-medium">Test ID:</span> {testId}
                </p>
                {previewImage && (
                  <p className="text-xs mb-2">
                    <span className="font-medium">Preview Image URL:</span> {previewImage}
                  </p>
                )}
                {previewVideo && (
                  <p className="text-xs mb-2">
                    <span className="font-medium">Preview Video URL:</span> {previewVideo}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>
                How the Supabase media upload functionality works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Media Upload Process:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>User selects a file or provides a URL</li>
                  <li>If a file is selected, it's uploaded to Supabase Storage</li>
                  <li>A unique filename is generated using UUID</li>
                  <li>The file is stored in a folder structure based on the component ID and media type</li>
                  <li>The public URL is returned and stored in the component data</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Key Components:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><code>MediaUploader</code> - React component for uploading media</li>
                  <li><code>supabaseStorage.ts</code> - Utility functions for Supabase storage</li>
                  <li><code>uploadMediaToSupabase</code> - Function to upload media to Supabase</li>
                  <li><code>deleteMediaFromSupabase</code> - Function to delete media from Supabase</li>
                  <li><code>ensureStorageBucketExists</code> - Function to ensure the storage bucket exists</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VaultLayout>
  );
};

export default TestMediaUploadPage;
