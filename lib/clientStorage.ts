// This file is for client-side use only and doesn't import any Node.js modules

// Constants
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

// Client-side placeholder for ensureStorageBucketExists
export const ensureStorageBucketExists = async (): Promise<void> => {
  console.warn('ensureStorageBucketExists is a server-side function and does nothing on the client');
  return Promise.resolve();
};
