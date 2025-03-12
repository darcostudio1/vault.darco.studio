import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { saveFileToLocal, deleteFileFromLocal, getMediaType as getLocalMediaType } from './serverFileStorage';

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

// Upload a file to local storage (previously Supabase)
export const uploadMediaToSupabase = async (
  fileData: File | Blob | Buffer | Uint8Array,
  componentId: string = 'default',
  originalFilename: string = 'file.jpg',
  mimeType: string = 'application/octet-stream'
): Promise<{ url: string; path: string; mediaType: 'image' | 'video' | 'unknown'; error?: any }> => {
  try {
    // Ensure storage is ready (compatibility function)
    await ensureStorageBucketExists();
    
    // Convert File/Blob to Buffer if needed
    let buffer: Buffer;
    if (fileData instanceof Buffer) {
      buffer = fileData;
    } else if (fileData instanceof Uint8Array) {
      buffer = Buffer.from(fileData);
    } else if (typeof window !== 'undefined' && (fileData instanceof Blob || fileData instanceof File)) {
      // This is client-side code, we'll need to handle this differently
      // For compatibility, return a dummy response that will be handled by the client
      console.warn('Client-side file upload detected. This should be handled by the upload API endpoint.');
      return { 
        url: '/api/upload/local', 
        path: '', 
        mediaType: getFileTypeFromMimeType(mimeType) 
      };
    } else {
      throw new Error('Unsupported file data type');
    }
    
    // Use local storage implementation
    return await saveFileToLocal(
      buffer,
      componentId,
      originalFilename,
      mimeType
    );
  } catch (error) {
    console.error('Error uploading file to local storage:', error);
    return { url: '', path: '', mediaType: 'unknown', error };
  }
};

// Delete a file from local storage (previously Supabase)
export const deleteMediaFromSupabase = async (fileUrl: string): Promise<boolean> => {
  try {
    // Check if this is a local URL or a Supabase URL
    if (fileUrl.startsWith('/uploads/')) {
      // Local URL, use local delete function
      return await deleteFileFromLocal(fileUrl);
    } else if (fileUrl.includes(STORAGE_BUCKET)) {
      // This is a legacy Supabase URL
      console.warn('Attempting to delete a Supabase URL. This operation is no longer supported.');
      return false;
    } else {
      // Unknown URL format
      console.warn('Unknown URL format for deletion:', fileUrl);
      return false;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
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

// Create storage directories if they don't exist (previously for Supabase)
export const ensureStorageBucketExists = async (): Promise<void> => {
  // This is now a no-op for client-side code
  // The actual directory creation happens in the API routes
  return Promise.resolve();
};
