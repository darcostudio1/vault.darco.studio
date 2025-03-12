import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Component } from '../../../types/Component';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getCustomComponents, updateCustomComponent } from '../../../services/componentService';
import AdminNav from '../../../components/admin/AdminNav';
import VaultLayout from '../../../components/layout/VaultLayout';
import { TagInput } from '../../../components/TagInput';
import CategorySelector from '../../../components/admin/CategorySelector';

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
  const [mediaType, setMediaType] = useState('image');
  const [tags, setTags] = useState<string[]>([]);
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [jsContent, setJsContent] = useState('');
  
  // Load component on mount
  useEffect(() => {
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
    setMediaType(comp.mediaType || comp.media_type || 'image');
    
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
      
      setHtmlContent(htmlEntry?.content || '');
      setCssContent(cssEntry?.content || '');
      setJsContent(jsEntry?.content || '');
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
    
    // Only auto-generate slug if it hasn't been manually edited
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedComponent = {
        id: id as string,
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
        content: {
          html: htmlContent,
          css: cssContent,
          js: jsContent
        }
      };
      
      if (isSupabaseComponent) {
        // Update in Supabase
        const response = await fetch(`/api/components/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedComponent)
        });
        
        if (!response.ok) {
          throw new Error('Failed to update component');
        }
        
        toast.success('Component updated successfully in Supabase!');
      } else {
        // Update in localStorage
        updateCustomComponent(updatedComponent);
        toast.success('Component updated successfully in localStorage!');
      }
      
      // Redirect back to manage components
      setTimeout(() => {
        router.push('/admin/manage-components');
      }, 1500);
    } catch (error) {
      console.error('Error updating component:', error);
      toast.error('Failed to update component. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <VaultLayout 
        title="Edit Component - Admin Dashboard"
        description="Edit a component in the Darco Studio Vault"
      >
        <div className="container mx-auto py-8 max-w-5xl">
          <AdminNav />
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading component...</span>
          </div>
        </div>
      </VaultLayout>
    );
  }
  
  return (
    <VaultLayout 
      title={`Edit ${title} - Admin Dashboard`}
      description="Edit a component in the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-5xl">
        <AdminNav />
        
        <div className="flex items-center mb-6">
          <Link href="/admin/manage-components">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Components
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Component</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Component title"
                    required
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Component description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <CategorySelector 
                    value={category}
                    onChange={setCategory}
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
                    placeholder="Author name"
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previewImage">Preview Image URL</Label>
                  <Input
                    id="previewImage"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder="/images/components/example.jpg"
                  />
                  {previewImage && (
                    <div className="mt-2 border rounded-md overflow-hidden h-32 w-full">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="previewVideo">Preview Video URL</Label>
                  <Input
                    id="previewVideo"
                    value={previewVideo}
                    onChange={(e) => setPreviewVideo(e.target.value)}
                    placeholder="/videos/components/example.mp4"
                  />
                  {previewVideo && (
                    <div className="mt-2 border rounded-md overflow-hidden h-32 w-full">
                      <video 
                        src={previewVideo} 
                        controls
                        className="h-full w-full object-contain"
                        onError={(e) => {
                          console.error('Video failed to load');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mediaType">Media Type</Label>
                <Select 
                  value={mediaType} 
                  onValueChange={setMediaType}
                >
                  <SelectTrigger id="mediaType">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <TagInput tags={tags} setTags={setTags} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Component Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="htmlContent">HTML</Label>
                <Textarea
                  id="htmlContent"
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<div>Your HTML here</div>"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cssContent">CSS</Label>
                <Textarea
                  id="cssContent"
                  value={cssContent}
                  onChange={(e) => setCssContent(e.target.value)}
                  placeholder=".your-class { property: value; }"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jsContent">JavaScript</Label>
                <Textarea
                  id="jsContent"
                  value={jsContent}
                  onChange={(e) => setJsContent(e.target.value)}
                  placeholder="function yourFunction() { ... }"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="implementation">Implementation</Label>
                <Select 
                  value={implementation} 
                  onValueChange={setImplementation}
                >
                  <SelectTrigger id="implementation">
                    <SelectValue placeholder="Select implementation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vanilla">Vanilla JS</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                    <SelectItem value="css-only">CSS Only</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moreInformation">More Information</Label>
                <Textarea
                  id="moreInformation"
                  value={moreInformation}
                  onChange={(e) => setMoreInformation(e.target.value)}
                  placeholder="Additional details about the component"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Link href="/admin/manage-components">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
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
