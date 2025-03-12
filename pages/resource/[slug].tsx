import { useRouter } from 'next/router';
import { useState } from 'react';
import { Calendar, Folder, Tag, ChevronLeft } from 'lucide-react';
import { getComponentBySlug, getAllComponents } from '../../data/componentRegistry';
import CodeBlock from '../../components/CodeBlock';
import ResourceMedia from '../../components/ResourceMedia';
import VaultLayout from '../../components/layout/VaultLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../lib/utils';
import { Component } from '../../types/Component';
import Link from 'next/link';

type ResourcePageProps = {
  component: Component;
};

// Helper function to get the appropriate media source
function getMediaSource(component: Component): string {
  // First check for video if available (preferred)
  if (component.previewVideo) {
    return component.previewVideo;
  }
  
  // Then check for preview image
  if (component.previewImage) {
    return component.previewImage;
  }
  
  // Then check for generic media
  if (component.media) {
    return component.media;
  }
  
  // Fallback to placeholder
  return '/images/placeholders/placeholder-image.jpg';
}

// Helper function to determine media type
function getMediaType(component: Component): 'image' | 'video' | 'auto' {
  // If we're using a video source, set type to video
  if (component.previewVideo && getMediaSource(component) === component.previewVideo) {
    return 'video';
  }
  
  // If mediaType is explicitly set and we're not using a video source, respect it
  if (component.mediaType === 'video') {
    return 'video';
  }
  
  // Default to auto to let ResourceMedia component determine type based on file extension
  return 'auto';
}

export default function ResourcePage({ component }: ResourcePageProps) {
  const [activeTab, setActiveTab] = useState('html');
  const router = useRouter();

  // Debug logging
  console.log('Component data:', component);
  console.log('External source URL:', component?.externalSourceUrl);

  if (!component) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Component not found</h1>
        <p>The requested component could not be found.</p>
        <Button 
          onClick={() => router.push('/')}
          className="mt-4"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Default code content if not provided
  const codeContent = component.content || {
    externalScripts: component.dependencies ? component.dependencies.join('\n') : '# No external dependencies required',
    html: `<!-- ${component.title} HTML -->
<div class="${component.id.toLowerCase()}">
  <button class="${component.id.toLowerCase()}-button">
    ${component.title}
  </button>
</div>`,
    css: `/* ${component.title} CSS */
.${component.id.toLowerCase()} {
  display: flex;
  justify-content: center;
  align-items: center;
}

.${component.id.toLowerCase()}-button {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.${component.id.toLowerCase()}-button:hover {
  background-color: #2980b9}`,
    js: `// ${component.title} JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.${component.id.toLowerCase()}-button');
  
  if (button) {
    button.addEventListener('click', function() {
      alert('${component.title} button clicked!');
    });
  }
});`,
  };

  return (
    <VaultLayout
      title={`${component.title} — The Vault`}
      description={component.description}
    >
      <div className="w-full px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="mb-6">
              {component.category && (
                <Link 
                  href={`/category/${component.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors opacity-50"
                  data-component-name="LinkComponent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to {component.category.charAt(0).toUpperCase() + component.category.slice(1).toLowerCase()}
                </Link>
              )}
              <h1 className="text-3xl font-bold mb-2 text-foreground">{component.title}</h1>
              <p className="text-muted-foreground mb-4">{component.description}</p>
              
              {/* Featured Media (Image or Video) */}
              <div className="mb-8 rounded-lg overflow-hidden border border-border">
                <ResourceMedia 
                  src={getMediaSource(component)}
                  alt={component.title}
                  type={getMediaType(component)}
                />
              </div>
            </div>

            {/* Code Tabs */}
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="mb-2 w-full justify-evenly">
                {component.content?.externalScripts && (
                  <TabsTrigger value="externalScripts">Setup: External Scripts</TabsTrigger>
                )}
                <TabsTrigger value="html">Step 1: HTML</TabsTrigger>
                <TabsTrigger value="css">Step 2: CSS</TabsTrigger>
                <TabsTrigger value="js">Step 3: JavaScript</TabsTrigger>
                {component.dependencies && component.dependencies.length > 0 && (
                  <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                )}
              </TabsList>
              {component.content?.externalScripts && (
                <TabsContent value="externalScripts" className="mt-0">
                  <Card className="border-0">
                    <CardContent className="p-0">
                      <CodeBlock code={component.content?.externalScripts || ''} language="html" />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              <TabsContent value="html" className="mt-0">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <CodeBlock code={codeContent.html} language="html" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="css" className="mt-0">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <CodeBlock code={codeContent.css} language="css" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="js" className="mt-0">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <CodeBlock code={codeContent.js} language="javascript" />
                  </CardContent>
                </Card>
              </TabsContent>
              {component.dependencies && component.dependencies.length > 0 && (
                <TabsContent value="dependencies" className="mt-0">
                  <Card className="border-0">
                    <CardContent className="p-0">
                      <CodeBlock code={codeContent.externalScripts} language="html" />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {/* Implementation & More Information Section */}
            {((component.implementation && component.implementation.trim()) || 
              (component.moreInformation && component.moreInformation.trim())) && (
              <div className="mt-8 pt-8 pb-12 border-t border-border">
                <h2 className="text-2xl font-bold mb-8 text-foreground">Implementation & More Information</h2>
                
                {component.implementation && component.implementation.trim() && (
                  <div className="mb-6 border border-border rounded-md p-6">
                    <h3 className="text-xl font-semibold mb-6 text-foreground tracking-wide border-b border-border pb-3">Implementation</h3>
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:font-light prose-h4:text-sm prose-h4:font-light"
                      dangerouslySetInnerHTML={{ __html: component.implementation }}
                      style={{ '--tw-prose-headings': 'var(--tw-prose-body)', '--tw-prose-headings-font-weight': '300' } as React.CSSProperties}
                    />
                  </div>
                )}
                
                {component.moreInformation && component.moreInformation.trim() && (
                  <div className="mb-6 border border-border rounded-md p-6">
                    <h3 className="text-xl font-semibold mb-6 text-foreground tracking-wide border-b border-border pb-3">More Information</h3>
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none prose-p:font-light prose-h4:text-sm prose-h4:font-light"
                      dangerouslySetInnerHTML={{ __html: component.moreInformation }}
                      style={{ '--tw-prose-headings': 'var(--tw-prose-body)', '--tw-prose-headings-font-weight': '300' } as React.CSSProperties}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Resource Details */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="resource-right sticky top-[5.5rem] border border-border rounded-lg p-4 bg-card">
              <Card className="border-0 bg-transparent">
                <CardHeader className="px-4 py-3">
                  <CardTitle>Resource Details</CardTitle>
                  <CardDescription>Information about this component</CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-2 space-y-4">
                  {/* Date Created */}
                  <div>
                    <p className="font-medium mb-2 text-muted-foreground text-sm">{formatDate(component.date)}</p>
                  </div>
                  
                  <Separator />
                  
                  {/* Category */}
                  {component.category && (
                    <div>
                      <p className="font-medium mb-2 text-muted-foreground text-sm">{component.category.charAt(0).toUpperCase() + component.category.slice(1).toLowerCase()}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Tags */}
                  {component.tags && component.tags.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {component.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="px-4 py-3 flex-col items-start gap-2">
                  {component.demoUrl && (
                    <Button 
                      className="w-full"
                      onClick={() => window.open(component.demoUrl, '_blank')}
                    >
                      View Documentation
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 ml-2"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </Button>
                  )}
                  {component.externalSourceUrl && (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => window.open(component.externalSourceUrl, '_blank')}
                    >
                      View External Source
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-4 h-4 ml-2"
                      >
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Tags as Pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {component.dependencies && component.dependencies.map((dep: string) => (
                  <Badge key={dep} variant="outline">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </VaultLayout>
  );
}

export async function getStaticPaths() {
  const components = getAllComponents();
  const paths = components.map((component) => ({
    params: { slug: component.slug || component.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      component,
    },
  };
}