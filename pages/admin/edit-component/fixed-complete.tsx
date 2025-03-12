import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Component } from '@/types/Component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
import { getCustomComponents, updateCustomComponent } from '@/services/componentService';
import AdminNav from '@/components/admin/AdminNav';
import VaultLayout from '@/components/layout/VaultLayout';
import { TagInput } from '@/components/TagInput';
import CategorySelector from '@/components/admin/CategorySelector';
import MediaUploader from '@/components/admin/MediaUploader';
import { getMediaType, ensureStorageBucketExists } from '@/lib/clientStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';

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
  
  // Load component on mount
  useEffect(() => {
    if (!id) return;
    
    const fetchComponent = async () => {
      try {
        setIsLoading(true);
        const components = await getCustomComponents();
        const comp = components.find(c => c.id === id);
        
        if (comp) {
          setComponent(comp);
          setTitle(comp.title || '');
          setSlug(comp.slug || '');
          setDescription(comp.description || '');
          setCategory(comp.category || '');
          setDate(comp.date || '');
          setFeatured(comp.featured || false);
          setAuthor(comp.author || '');
          setExternalSourceUrl(comp.externalSourceUrl || '');
          setImplementation(comp.implementation || '');
          setMoreInformation(comp.moreInformation || '');
          setPreviewImage(comp.previewImage || '');
          setPreviewVideo(comp.previewVideo || '');
          setMediaType(comp.mediaType || 'image');
          setTags(comp.tags || []);
          setHtmlContent(comp.htmlContent || '');
          setCssContent(comp.cssContent || '');
          setJsContent(comp.jsContent || '');
          
          // Check if it's a Supabase component
          setIsSupabaseComponent(!!comp.id && !comp.id.startsWith('local_'));
        } else {
          toast.error('Component not found');
          router.push('/admin/components');
        }
      } catch (error) {
        console.error('Error fetching component:', error);
        toast.error('Error loading component');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComponent();
  }, [id, router]);
  
  const handleSave = async () => {
    if (!component) return;
    
    try {
      setIsSaving(true);
      
      // Client-side placeholder that doesn't actually do anything
      await ensureStorageBucketExists();
      
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
        mediaType,
        tags,
        htmlContent,
        cssContent,
        jsContent,
        updatedAt: new Date().toISOString()
      };
      
      await updateCustomComponent(updatedComponent);
      toast.success('Component updated successfully');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Error updating component');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMediaUpload = (url: string, type: 'image' | 'video') => {
    if (type === 'image') {
      setPreviewImage(url);
      setMediaType('image');
    } else if (type === 'video') {
      setPreviewVideo(url);
      setMediaType('video');
    }
  };
  
  return (
    <VaultLayout title={`Edit Component - ${title || 'Loading...'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/components" className="inline-flex items-center">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Components
            </Button>
          </Link>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || isSaving}
          >
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
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Component Title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input 
                      id="slug" 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)} 
                      placeholder="component-slug"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Brief description of the component"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <CategorySelector 
                      selectedCategory={category}
                      onCategoryChange={setCategory}
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input 
                      id="author" 
                      value={author} 
                      onChange={(e) => setAuthor(e.target.value)} 
                      placeholder="Component author"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="externalSourceUrl">External Source URL</Label>
                    <Input 
                      id="externalSourceUrl" 
                      value={externalSourceUrl} 
                      onChange={(e) => setExternalSourceUrl(e.target.value)} 
                      placeholder="https://example.com/source"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={featured} 
                    onCheckedChange={setFeatured} 
                  />
                  <Label htmlFor="featured">Featured Component</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput 
                    tags={tags} 
                    setTags={setTags} 
                    placeholder="Add tags..."
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MediaUploader 
                  componentId={id as string} 
                  onUploadComplete={handleMediaUpload}
                  existingImage={previewImage}
                  existingVideo={previewVideo}
                  mediaType={mediaType}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="implementation" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="implementation">Implementation</TabsTrigger>
                    <TabsTrigger value="moreInfo">Additional Information</TabsTrigger>
                  </TabsList>
                  <TabsContent value="implementation" className="space-y-4">
                    <Textarea 
                      value={implementation} 
                      onChange={(e) => setImplementation(e.target.value)} 
                      placeholder="Describe how to implement this component..."
                      rows={10}
                    />
                  </TabsContent>
                  <TabsContent value="moreInfo" className="space-y-4">
                    <Textarea 
                      value={moreInformation} 
                      onChange={(e) => setMoreInformation(e.target.value)} 
                      placeholder="Additional information about this component..."
                      rows={10}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="space-y-4 min-h-[300px]">
                    <CodeEditor
                      value={htmlContent}
                      onChange={setHtmlContent}
                      language="html"
                      height="300px"
                    />
                  </TabsContent>
                  <TabsContent value="css" className="space-y-4 min-h-[300px]">
                    <CodeEditor
                      value={cssContent}
                      onChange={setCssContent}
                      language="css"
                      height="300px"
                    />
                  </TabsContent>
                  <TabsContent value="js" className="space-y-4 min-h-[300px]">
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
          </div>
        )}
      </div>
    </VaultLayout>
  );
};

export default EditComponentPage;
