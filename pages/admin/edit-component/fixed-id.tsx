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
import { ArrowLeft, Save, Loader2, Upload } from 'lucide-react';
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
    
    // Only auto-generate slug if it hasn't been manually edited or is empty
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
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
          js: jsContent
        }
      };
      
      if (isSupabaseComponent) {
        // Update in Supabase
        const response = await fetch(`/api/components/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            component: updatedComponent,
            tags,
            content: {
              html: htmlContent,
              css: cssContent,
              js: jsContent
            }
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update component in Supabase');
        }
        
        toast.success('Component updated successfully in Supabase');
      } else {
        // Update in localStorage
        const success = updateCustomComponent(updatedComponent);
        
        if (!success) {
          throw new Error('Failed to update component in localStorage');
        }
        
        toast.success('Component updated successfully');
      }
      
      // Redirect back to manage components page
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
      title="Edit Component - Admin Dashboard"
      description="Edit a component in the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Component</h1>
          <Button 
            variant="outline" 
            asChild
            className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/admin/manage-components">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Components
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading component...</p>
          </div>
        ) : component ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
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
                        onChange={handleTitleChange} 
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      required 
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
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
                        required 
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
                  <CardTitle>Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="externalSourceUrl">External Source URL (optional)</Label>
                    <Input 
                      id="externalSourceUrl" 
                      value={externalSourceUrl} 
                      onChange={(e) => setExternalSourceUrl(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="implementation">Implementation</Label>
                    <Select 
                      value={implementation} 
                      onValueChange={setImplementation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select implementation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="moreInformation">More Information (optional)</Label>
                    <Textarea 
                      id="moreInformation" 
                      value={moreInformation} 
                      onChange={(e) => setMoreInformation(e.target.value)} 
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <TagInput 
                      tags={tags} 
                      setTags={setTags} 
                      placeholder="Add tags..." 
                    />
                    <p className="text-xs text-muted-foreground">
                      Press Enter or comma to add a tag
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview Media</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Upload preview images and videos for your component
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Preview Image</Label>
                      {previewImage ? (
                        <div className="relative border rounded-lg overflow-hidden h-48">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setPreviewImage('')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload an image</p>
                          <input 
                            id="imageUpload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setPreviewImage(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      )}
                      <Input 
                        placeholder="Or enter image URL directly"
                        value={previewImage} 
                        onChange={(e) => setPreviewImage(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Preview Video</Label>
                      {previewVideo ? (
                        <div className="relative border rounded-lg overflow-hidden h-48">
                          <video 
                            src={previewVideo} 
                            controls
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="sm"
                              onClick={() => setPreviewVideo('')}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => document.getElementById('videoUpload')?.click()}
                        >
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload a video</p>
                          <input 
                            id="videoUpload" 
                            type="file" 
                            accept="video/*" 
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setPreviewVideo(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      )}
                      <Input 
                        placeholder="Or enter video URL directly"
                        value={previewVideo} 
                        onChange={(e) => setPreviewVideo(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Component Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="htmlContent">HTML</Label>
                    <Textarea 
                      id="htmlContent" 
                      value={htmlContent} 
                      onChange={(e) => setHtmlContent(e.target.value)} 
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cssContent">CSS</Label>
                    <Textarea 
                      id="cssContent" 
                      value={cssContent} 
                      onChange={(e) => setCssContent(e.target.value)} 
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jsContent">JavaScript</Label>
                    <Textarea 
                      id="jsContent" 
                      value={jsContent} 
                      onChange={(e) => setJsContent(e.target.value)} 
                      className="font-mono text-sm"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
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
                      Save Component
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p>Component not found</p>
            <Button 
              variant="outline" 
              asChild
              className="mt-4"
            >
              <Link href="/admin/manage-components">
                Back to Components
              </Link>
            </Button>
          </div>
        )}
      </div>
    </VaultLayout>
  );
};

export default EditComponentPage;
