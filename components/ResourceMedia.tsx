import { useState, useEffect, useRef, FC } from 'react';
import Image from 'next/image';

interface ResourceMediaProps {
  src: string;
  alt: string;
  type?: 'image' | 'video' | 'auto';
}

/**
 * ResourceMedia component that can display images, videos, or animated files
 * based on the file extension or explicit type setting
 */
const ResourceMedia: FC<ResourceMediaProps> = ({ 
  src, 
  alt,
  type = 'auto'
}) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine media type based on file extension if type is 'auto'
  const getMediaType = () => {
    if (type !== 'auto') return type;
    
    const extension = src.split('.').pop()?.toLowerCase();
    if (!extension) return 'image';
    
    if (['mp4', 'webm', 'mov'].includes(extension)) {
      return 'video';
    }
    
    return 'image';
  };
  
  const mediaType = getMediaType();

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);
  
  // Handle image loading errors
  const handleError = () => {
    console.error(`Failed to load media: ${src}`);
    setHasError(true);
  };

  // Show fallback if media fails to load
  if (hasError) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-background border border-border rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-muted-foreground">Media could not be loaded</p>
          <p className="text-xs text-muted-foreground mt-2">{src}</p>
        </div>
      </div>
    );
  }
  
  if (mediaType === 'video') {
    return (
      <div className="relative w-full h-80 md:h-[450px] lg:h-[500px] bg-background border border-border rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-label={alt}
          onError={handleError}
          controlsList="nodownload nofullscreen noremoteplayback"
        />
      </div>
    );
  }
  
  // Default to image (handles jpg, png, gif, avif, webp, etc.)
  return (
    <div className="relative w-full h-80 md:h-[450px] lg:h-[500px] bg-background border border-border rounded-lg overflow-hidden">
      <Image 
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        priority
      />
    </div>
  );
};

export default ResourceMedia;
