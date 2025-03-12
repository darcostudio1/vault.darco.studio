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
  const [externalScripts, setExternalScripts] = useState('');
  
  // Load component on mount
  useEffect(() => {
    // Ensure Supabase storage bucket exists
    ensureStorageBucketExists();
    
    if (!id) return;
    
    const loadComponent = async () => {
      setIsLoading(true);
      try {
        // First check if it's a custom component
        const customComponents = getCustomComponents();
        const customComponent = customComponents.find(comp => comp.id === id);
        
        if (customComponent) {
          // It's a custom component from localStorage
          setComponent(customComponent);
          populateFormFields(customComponent);
          setIsSupabaseComponent(false);
        } else {
          // Try to fetch from Supabase
          const response = await fetch(`/api/components/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch component');
          }
          
          const supabaseComponent = await response.json();
          setComponent(supabaseComponent);
          populateFormFields(supabaseComponent);
          setIsSupabaseComponent(true);
        }
      } catch (error) {
        console.error('Error loading component:', error);
        toast.error('Failed to load component. Please try again.');
        router.push('/admin/manage-components');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComponent();
  }, [id, router]);
  
  // Populate form fields with component data
  const populateFormFields = (comp: Component) => {
    setTitle(comp.title || '');
    setSlug(comp.slug || '');
    setDescription(comp.description || '');
    setCategory(comp.category || '');
    setDate(comp.date || '');
    setFeatured(comp.featured || false);
    setAuthor(comp.author || '');
    setExternalSourceUrl(comp.externalSourceUrl || comp.external_source_url || '');
    setImplementation(comp.implementation || '');
    setMoreInformation(comp.moreInformation || comp.more_information || '');
    setPreviewImage(comp.previewImage || comp.preview_image || '');
    setPreviewVideo(comp.previewVideo || comp.preview_video || '');
    setMediaType((comp.mediaType || comp.media_type || 'image') as 'image' | 'video' | 'unknown');
    
    // Handle tags
    if (comp.tags && Array.isArray(comp.tags)) {
      setTags(comp.tags);
    } else if (comp.component_tags && Array.isArray(comp.component_tags)) {
      // Extract tags from component_tags relationship
      const extractedTags = comp.component_tags
        .map((ct: any) => ct.tags?.name)
        .filter(Boolean);
      setTags(extractedTags);
    } else {
      setTags([]);
    }
    
    // Handle content
    if (comp.content) {
      setHtmlContent(comp.content.html || '');
      setCssContent(comp.content.css || '');
      setJsContent(comp.content.js || '');
      setExternalScripts(comp.content.externalScripts || comp.content.external_scripts || '');
    } else if (comp.component_content) {
      // Find the content entries
      const htmlEntry = Array.isArray(comp.component_content) 
        ? comp.component_content.find((c: any) => c.type === 'html')
        : null;
      const cssEntry = Array.isArray(comp.component_content)
        ? comp.component_content.find((c: any) => c.type === 'css')
        : null;
      const jsEntry = Array.isArray(comp.component_content)
        ? comp.component_content.find((c: any) => c.type === 'js')
        : null;
      const externalEntry = Array.isArray(comp.component_content)
        ? comp.component_content.find((c: any) => c.type === 'external')
        : null;
      
      setHtmlContent(htmlEntry?.content || '');
      setCssContent(cssEntry?.content || '');
      setJsContent(jsEntry?.content || '');
      setExternalScripts(externalEntry?.content || '');
    }
  };
  
  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };
  
  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if it hasn't been manually edited or is empty
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  // Handle preview image change
  const handlePreviewImageChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewImage(url);
    if (type !== 'unknown') {
      setMediaType(type);
    }
  };
  
  // Handle preview video change
  const handlePreviewVideoChange = (url: string, type: 'image' | 'video' | 'unknown') => {
    setPreviewVideo(url);
    if (type !== 'unknown') {
      setMediaType(type);
    }
  };
  
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
        external_source_url: externalSourceUrl,
        implementation,
        moreInformation,
        more_information: moreInformation,
        previewImage,
        preview_image: previewImage,
        previewVideo,
        preview_video: previewVideo,
        mediaType,
        media_type: mediaType,
        tags,
        content: {
          html: htmlContent,
          css: cssContent,
          js: jsContent,
          externalScripts: externalScripts,
          external_scripts: externalScripts
        }
      };
      
      if (isSupabaseComponent) {
        // Update in Supabase
        const response = await fetch(`/api/components/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedComponent),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update component');
        }
        
        toast.success('Component updated successfully');
      } else {
        // Update in localStorage
        const success = await updateCustomComponent(updatedComponent);
        
        if (success) {
          toast.success('Component updated successfully');
        } else {
          throw new Error('Failed to update component');
        }
      }
      
      // Navigate back to manage components
      router.push('/admin/manage-components');
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <VaultLayout 
      title={`Edit ${title || 'Component'} - Admin Dashboard`}
      description="Edit a component in the Darco Studio Vault"
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
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading component...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Edit the basic details for the component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder="Component title"
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
                    placeholder="Component description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Category</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <TagInput
                    value={tags}
                    onChange={setTags}
                    placeholder="Add tags..."
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
              </CardContent>
            </Card>
            
            {/* Preview Media */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Media</CardTitle>
                <CardDescription>
                  Upload preview images or videos for the component
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
            
            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Edit additional details about the component
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="externalSourceUrl">External Source URL</Label>
                  <Input
                    id="externalSourceUrl"
                    value={externalSourceUrl}
                    onChange={(e) => setExternalSourceUrl(e.target.value)}
                    placeholder="https://example.com/source"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementation">Implementation Notes</Label>
                  <Textarea
                    id="implementation"
                    value={implementation}
                    onChange={(e) => setImplementation(e.target.value)}
                    placeholder="Notes on how to implement this component"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="moreInformation">More Information</Label>
                  <Textarea
                    id="moreInformation"
                    value={moreInformation}
                    onChange={(e) => setMoreInformation(e.target.value)}
                    placeholder="Additional information about the component"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Component Code */}
            <Card>
              <CardHeader>
                <CardTitle>Component Code</CardTitle>
                <CardDescription>
                  Edit the code for the component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                    <TabsTrigger value="external">External Scripts</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="html">
                    <CodeEditor
                      language="html"
                      value={htmlContent}
                      onChange={setHtmlContent}
                      placeholder="Enter HTML code here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="css">
                    <CodeEditor
                      language="css"
                      value={cssContent}
                      onChange={setCssContent}
                      placeholder="Enter CSS code here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="js">
                    <CodeEditor
                      language="javascript"
                      value={jsContent}
                      onChange={setJsContent}
                      placeholder="Enter JavaScript code here..."
                    />
                  </TabsContent>
                  
                  <TabsContent value="external">
                    <CodeEditor
                      language="html"
                      value={externalScripts}
                      onChange={setExternalScripts}
                      placeholder="Enter external script tags here..."
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Add external script and stylesheet links here (e.g., CDN links)
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
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
          </form>
        )}
      </div>
    </VaultLayout>
  );
};

export default EditComponentPage;
