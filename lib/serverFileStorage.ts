// This file is for server-side use only (in API routes)
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Constants
const MEDIA_ROOT = path.join(process.cwd(), 'public', 'uploads');
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

// Ensure directories exist
export const ensureDirectoriesExist = async (): Promise<void> => {
  try {
    // Create main uploads directory if it doesn't exist
    if (!fs.existsSync(MEDIA_ROOT)) {
      fs.mkdirSync(MEDIA_ROOT, { recursive: true });
    }
    
    // Create images directory if it doesn't exist
    const imagesDir = path.join(MEDIA_ROOT, IMAGE_FOLDER);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Create videos directory if it doesn't exist
    const videosDir = path.join(MEDIA_ROOT, VIDEO_FOLDER);
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error ensuring directories exist:', error);
  }
};

// Save a file to local storage
export const saveFileToLocal = async (
  fileBuffer: Buffer,
  componentId: string = 'default',
  originalFilename: string = 'file.jpg',
  mimeType: string = 'application/octet-stream'
): Promise<{ url: string; path: string; mediaType: 'image' | 'video' | 'unknown'; error?: any }> => {
  try {
    // Ensure directories exist
    await ensureDirectoriesExist();
    
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
    
    // Create component directory if it doesn't exist
    const componentDir = path.join(MEDIA_ROOT, folder, componentId);
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }
    
    const uniqueFilename = generateUniqueFilename(originalFilename);
    
    // Create path with component ID
    const filePath = path.join(folder, componentId, uniqueFilename);
    const fullPath = path.join(MEDIA_ROOT, filePath);
    
    // Write file to disk
    fs.writeFileSync(fullPath, fileBuffer);
    
    // Return public URL (relative to /public)
    const publicUrl = `/uploads/${filePath.replace(/\\/g, '/')}`;
    
    return { 
      url: publicUrl, 
      path: filePath, 
      mediaType 
    };
  } catch (error) {
    console.error('Error saving file to local storage:', error);
    return { url: '', path: '', mediaType: 'unknown', error };
  }
};

// Delete a file from local storage
export const deleteFileFromLocal = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    // URL format: /uploads/folder/componentId/filename.ext
    const relativePath = fileUrl.replace('/uploads/', '');
    const fullPath = path.join(MEDIA_ROOT, relativePath);
    
    // Check if file exists
    if (fs.existsSync(fullPath)) {
      // Delete the file
      fs.unlinkSync(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file from local storage:', error);
    return false;
  }
};

// Get the media type from a file or URL
export const getMediaType = (fileOrUrl: string): 'image' | 'video' | 'unknown' => {
  // It's a URL
  if (fileOrUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i)) {
    return 'image';
  } else if (fileOrUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
    return 'video';
  }
  return 'unknown';
};
