import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Component } from '../../types/Component';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getCustomComponents, updateCustomComponent } from '../../services/componentService';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';
import { TagInput } from '../../components/TagInput';
import CategorySelector from '../../components/admin/CategorySelector';
import MediaUploader from '../../components/admin/MediaUploader';
import { ensureStorageBucketExists } from '../../lib/supabaseStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import CodeEditor from '../../components/CodeEditor';

const EditComponentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [component, setComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSupabaseComponent, setIsSupabaseComponent] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [featured, setFeatured] = useState(false);
  const [author, setAuthor] = useState('');
  const [externalSourceUrl, setExternalSourceUrl] = useState('');
  const [implementation, setImplementation] = useState('');
  const [moreInformation, setMoreInformation] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'unknown'>('image');
  const [tags, setTags] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  
  // Ensure storage bucket exists on component mount
  useEffect(() => {
    ensureStorageBucketExists();
  }, []);
  
  // Fetch component data
  useEffect(() => {
    const fetchComponent = async () => {
      if (id) {
        try {
          const components = await getCustomComponents();
          const foundComponent = components.find(c => c.id === id);
          
          if (foundComponent) {
            setComponent(foundComponent);
            setTitle(foundComponent.title || '');
            setSlug(foundComponent.slug || '');
            setDescription(foundComponent.description || '');
            setCategory(foundComponent.category || '');
            setDate(foundComponent.date || '');
            setFeatured(foundComponent.featured || false);
            setAuthor(foundComponent.author || '');
            setExternalSourceUrl(foundComponent.externalSourceUrl || '');
            setImplementation(foundComponent.implementation || '');
            setMoreInformation(foundComponent.moreInformation || '');
            setPreviewImage(foundComponent.previewImage || '');
            setPreviewVideo(foundComponent.previewVideo || '');
            setTags(foundComponent.tags || []);
            setHtmlContent(foundComponent.htmlContent || '');
            setCssContent(foundComponent.cssContent || '');
            setJsContent(foundComponent.jsContent || '');
            
            // Determine media type
            if (foundComponent.previewVideo) {
              setMediaType('video');
            } else if (foundComponent.previewImage) {
              setMediaType('image');
            } else {
              setMediaType('unknown');
            }
            
            // Check if it's a Supabase component
            setIsSupabaseComponent(foundComponent.isSupabaseComponent || false);
          } else {
            toast.error('Component not found');
            router.push('/admin');
          }
        } catch (error) {
          console.error('Error fetching component:', error);
          toast.error('Failed to load component');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchComponent();
  }, [id, router]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!component) return;
    
    setIsSaving(true);
    
    try {
      const updatedComponent: Component = {
        ...component,
        title,
        slug,
        description,
        category,
        date,
        featured,
        author,
        externalSourceUrl,
        implementation,
        moreInformation,
        previewImage,
        previewVideo,
        tags,
        htmlContent,
        cssContent,
        jsContent,
        updatedAt: new Date().toISOString(),
      };
      
      await updateCustomComponent(updatedComponent);
      toast.success('Component updated successfully');
      router.push('/admin');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setSlug(newSlug);
  };
  
  // Handle preview image change
  const handlePreviewImageChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewImage(url);
    if (type === 'image') {
      setMediaType('image');
    }
  };
  
  // Handle preview video change
  const handlePreviewVideoChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewVideo(url);
    if (type === 'video') {
      setMediaType('video');
    }
  };
  
  if (isLoading) {
    return (
      <VaultLayout title="Loading... - Admin Dashboard">
        <div className="container mx-auto py-8 max-w-6xl">
          <AdminNav />
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </VaultLayout>
    );
  }
  
  return (
    <VaultLayout 
      title={`Edit ${title} - Admin Dashboard`}
      description={`Edit component: ${title}`}
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Component</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Edit the basic information for this component.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => !slug && generateSlug()}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <CategorySelector
                    selectedCategory={category}
                    onCategoryChange={setCategory}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="externalSourceUrl">External Source URL</Label>
                  <Input
                    id="externalSourceUrl"
                    type="url"
                    value={externalSourceUrl}
                    onChange={(e) => setExternalSourceUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput
                    tags={tags}
                    setTags={setTags}
                    placeholder="Add tag..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Featured Component</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload or provide URLs for preview images and videos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MediaUploader
                  label="Preview Image"
                  initialMediaUrl={previewImage}
                  onMediaChange={handlePreviewImageChange}
                  componentId={id as string}
                />
                
                <MediaUploader
                  label="Preview Video"
                  initialMediaUrl={previewVideo}
                  onMediaChange={handlePreviewVideoChange}
                  componentId={id as string}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Edit the HTML, CSS, and JavaScript for this component.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="mt-4">
                  <CodeEditor
                    value={htmlContent}
                    onChange={setHtmlContent}
                    language="html"
                    height="300px"
                  />
                </TabsContent>
                <TabsContent value="css" className="mt-4">
                  <CodeEditor
                    value={cssContent}
                    onChange={setCssContent}
                    language="css"
                    height="300px"
                  />
                </TabsContent>
                <TabsContent value="js" className="mt-4">
                  <CodeEditor
                    value={jsContent}
                    onChange={setJsContent}
                    language="javascript"
                    height="300px"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Provide implementation details and additional information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="implementation">Implementation</Label>
                <Textarea
                  id="implementation"
                  value={implementation}
                  onChange={(e) => setImplementation(e.target.value)}
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moreInformation">More Information</Label>
                <Textarea
                  id="moreInformation"
                  value={moreInformation}
                  onChange={(e) => setMoreInformation(e.target.value)}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </VaultLayout>
  );
};

export default EditComponentPage;
