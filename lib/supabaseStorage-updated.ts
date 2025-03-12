import db from './db';
import { v4 as uuidv4 } from 'uuid';

// Constants
const STORAGE_BUCKET = 'component-media';
const IMAGE_FOLDER = 'images';
const VIDEO_FOLDER = 'videos';

// Helper to get file extension
const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper to determine if file is an image
const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const ext = getFileExtension(filename);
  return imageExtensions.includes(ext);
};

// Helper to determine if file is a video
const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
  const ext = getFileExtension(filename);
  return videoExtensions.includes(ext);
};

// Helper to determine file type from mime type
const getFileTypeFromMimeType = (mimeType: string): 'image' | 'video' | 'unknown' => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return 'unknown';
};

// Generate a unique filename for storage
const generateUniqueFilename = (originalFilename: string): string => {
  const ext = getFileExtension(originalFilename);
  return `${uuidv4()}.${ext}`;
};

// Upload a file to Supabase storage
export const uploadMediaToSupabase = async (
  fileData: File | Blob | Buffer | Uint8Array,
  componentId: string = 'default',
  originalFilename: string = 'file.jpg',
  mimeType: string = 'application/octet-stream'
): Promise<{ url: string; path: string; mediaType: 'image' | 'video' | 'unknown'; error?: any }> => {
  try {
    // Ensure storage bucket exists
    await ensureStorageBucketExists();
    
    // Determine file type
    let mediaType: 'image' | 'video' | 'unknown' = 'unknown';
    
    // Try to determine from mime type first
    mediaType = getFileTypeFromMimeType(mimeType);
    
    // If unknown, try to determine from filename
    if (mediaType === 'unknown') {
      if (isImageFile(originalFilename)) {
        mediaType = 'image';
      } else if (isVideoFile(originalFilename)) {
        mediaType = 'video';
      }
    }
    
    // Determine folder based on media type
    const folder = mediaType === 'image' ? IMAGE_FOLDER : 
                  mediaType === 'video' ? VIDEO_FOLDER : 
                  'other';
    
    const uniqueFilename = generateUniqueFilename(originalFilename);
    
    // Create path with component ID
    const filePath = `${folder}/${componentId}/${uniqueFilename}`;
    
    // Upload file to Supabase
    const { data, error } = await db.supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileData, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading to Supabase:', error);
      return { url: '', path: '', mediaType, error };
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = db.supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    
    return { 
      url: urlData.publicUrl, 
      path: filePath, 
      mediaType 
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    return { url: '', path: '', mediaType: 'unknown', error };
  }
};

// Delete a file from Supabase storage
export const deleteMediaFromSupabase = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    
    // The path should be in format: /storage/v1/object/public/bucket-name/path/to/file
    // We need to extract just the path/to/file part
    const bucketIndex = pathParts.findIndex(part => part === STORAGE_BUCKET);
    
    if (bucketIndex === -1) {
      throw new Error('Invalid file URL format');
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    // Delete the file
    const { error } = await db.supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    return false;
  }
};

// Get the media type from a file or URL
export const getMediaType = (fileOrUrl: File | string): 'image' | 'video' | 'unknown' => {
  if (typeof fileOrUrl === 'string') {
    // It's a URL
    if (fileOrUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i)) {
      return 'image';
    } else if (fileOrUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
      return 'video';
    }
    return 'unknown';
  } else {
    // It's a File
    if (isImageFile(fileOrUrl.name)) {
      return 'image';
    } else if (isVideoFile(fileOrUrl.name)) {
      return 'video';
    }
    return 'unknown';
  }
};

// Create Supabase storage bucket if it doesn't exist
export const ensureStorageBucketExists = async (): Promise<void> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await db.supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      // Create the bucket
      const { error } = await db.supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true
      });
      
      if (error) throw error;
      console.log(`Created storage bucket: ${STORAGE_BUCKET}`);
    }
  } catch (error) {
    console.error('Error ensuring storage bucket exists:', error);
  }
};
