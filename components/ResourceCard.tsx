import { 
  BookmarkIcon, 
  ClockIcon, 
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody, CardFooter, Chip, Link } from '@heroui/react';
import BarbaLink from './BarbaLink';

interface ResourceCardProps {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  className?: string;
}

// Function to get a color for a tag
const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    'HTML': 'warning',
    'CSS': 'primary',
    'JavaScript': 'warning',
    'TypeScript': 'primary',
    'React': 'secondary',
    'Next.js': 'default',
    'Node.js': 'success',
    'Layout': 'secondary',
    'Responsive': 'secondary',
    'Grid': 'primary',
    'Flexbox': 'primary',
    'Animation': 'danger',
    'API': 'success',
    'Frontend': 'danger',
    'Backend': 'success',
    'Database': 'warning',
    'Authentication': 'danger',
    'Performance': 'success',
    'Accessibility': 'secondary',
  };
  
  return colors[tag] || 'default';
};

export default function ResourceCard({ 
  title, 
  description, 
  tags, 
  slug,
  className = ''
}: ResourceCardProps) {
  return (
    <BarbaLink href={`/resource/${slug}`} className="block">
      <Card 
        className={`group hover:shadow-md transition-all duration-300 ${className}`}
        isPressable
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center">
            <BookmarkIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h2>
          </div>
          <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </CardHeader>
        
        <CardBody>
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.slice(0, 4).map((tag) => (
              <Chip 
                key={tag} 
                color={getTagColor(tag) as any}
                size="sm"
                variant="flat"
              >
                {tag}
              </Chip>
            ))}
            {tags.length > 4 && (
              <Chip 
                size="sm"
                variant="flat"
              >
                +{tags.length - 4} more
              </Chip>
            )}
          </div>
        </CardBody>
        
        <CardFooter className="bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </BarbaLink>
  );
} 