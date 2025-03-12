// This file contains utilities for client-side media handling
// No direct file system operations are performed here

import { v4 as uuidv4 } from 'uuid';

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
export const getFileTypeFromMimeType = (mimeType: string): 'image' | 'video' | 'unknown' => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return 'unknown';
};

// Generate a unique filename for storage
export const generateUniqueFilename = (originalFilename: string): string => {
  const ext = getFileExtension(originalFilename);
  return `${uuidv4()}.${ext}`;
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
