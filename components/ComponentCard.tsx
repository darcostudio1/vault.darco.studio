import React, { useState } from 'react';
import Link from 'next/link';
import { Component } from '../types/Component';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ComponentCardProps {
  component: Component;
  index: number;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const [isHovering, setIsHovering] = useState(false);
  // Generate a slug if it doesn't exist
  const slug = component.slug || component.id;
  
  // Handle mouse enter/leave for video playback
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Handle both field naming conventions (camelCase and snake_case)
  const previewImage = component.previewImage || component.preview_image;
  const previewVideo = component.previewVideo || component.preview_video;
  
  return (
    <Link href={`/resource/${slug}`} className="block transition-all hover:scale-[1.02]">
      <Card 
        className="h-full overflow-hidden border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-video w-full overflow-hidden bg-muted relative">
          {component.category && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="capitalize">
                {component.category}
              </Badge>
            </div>
          )}
          {previewImage ? (
            <div className="h-full w-full">
              {isHovering && previewVideo ? (
                <video 
                  src={previewVideo}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={component.title}
                />
              ) : (
                <img 
                  src={previewImage} 
                  alt={component.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
              {component.title.charAt(0)}
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1 text-xl">{component.title}</CardTitle>
            <ArrowRight className={`h-5 w-5 transition-all duration-300 ${isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
          </div>
        </CardHeader>
        
        {/* CardContent removed as requested */}
        
        <CardFooter className="flex items-center justify-between p-4 pt-0 text-xs text-muted-foreground">
          {/* Tags removed as requested */}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ComponentCard;
