import db from './db';
import { v4 as uuidv4 } from 'uuid';
// Import server-side functions conditionally to avoid client-side imports of 'fs'
let serverStorage: any = null;

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

// Dynamically import server-side storage functions only when needed (server-side only)
const getServerStorage = async () => {
  if (typeof window === 'undefined' && !serverStorage) {
    // We're on the server, so it's safe to import
    serverStorage = await import('./serverFileStorage');
  }
  return serverStorage;
};

// Upload a file to local storage (previously Supabase)
export const uploadMediaToSupabase = async (
  fileData: File | Blob | Buffer | Uint8Array,
  componentId: string = 'default',
  originalFilename: string = 'file.jpg',
  mimeType: string = 'application/octet-stream'
): Promise<{ url: string; path: string; mediaType: 'image' | 'video' | 'unknown'; error?: any }> => {
  try {
    // This function should only be called from API routes
    if (typeof window !== 'undefined') {
      throw new Error('uploadMediaToSupabase should only be called from server-side code');
    }
    
    const storage = await getServerStorage();
    return await storage.saveFileToLocal(fileData, componentId, originalFilename, mimeType);
  } catch (error) {
    console.error('Error uploading media:', error);
    return {
      url: '',
      path: '',
      mediaType: 'unknown',
      error
    };
  }
};

// Delete a file from local storage (previously Supabase)
export const deleteMediaFromSupabase = async (fileUrl: string): Promise<boolean> => {
  try {
    // This function should only be called from API routes
    if (typeof window !== 'undefined') {
      throw new Error('deleteMediaFromSupabase should only be called from server-side code');
    }
    
    const storage = await getServerStorage();
    return await storage.deleteFileFromLocal(fileUrl);
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
};

// Get the media type from a file or URL
export const getMediaType = (fileOrUrl: File | string): 'image' | 'video' | 'unknown' => {
  // If it's a File object
  if (typeof fileOrUrl !== 'string') {
    const file = fileOrUrl as File;
    return getFileTypeFromMimeType(file.type);
  }
  
  // If it's a URL string
  const url = fileOrUrl as string;
  if (url.includes('/images/')) return 'image';
  if (url.includes('/videos/')) return 'video';
  
  // Try to determine by file extension
  if (isImageFile(url)) return 'image';
  if (isVideoFile(url)) return 'video';
  
  return 'unknown';
};

// Create storage directories if they don't exist (previously for Supabase)
export const ensureStorageBucketExists = async (): Promise<void> => {
  // This function should only be called from API routes
  if (typeof window !== 'undefined') {
    console.warn('ensureStorageBucketExists should only be called from server-side code');
    return;
  }
  
  const storage = await getServerStorage();
  await storage.ensureDirectoriesExist();
};
