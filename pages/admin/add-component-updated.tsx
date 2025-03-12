import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, ArrowLeft, Save } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';
import CategorySelector from '../../components/admin/CategorySelector';
import MediaUploader from '../../components/admin/MediaUploader';
import { ensureStorageBucketExists } from '../../lib/supabaseStorage';

interface FormData {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  featured: boolean;
  tags: string[];
  author: string;
  slug: string;
  externalSourceUrl: string;
  implementation: string;
  moreInformation: string;
  content: {
    externalScripts: string;
    html: string;
    css: string;
    js: string;
  };
  previewImage: string;
  previewVideo: string;
  mediaType: 'image' | 'video' | 'unknown';
}

const AddComponentPage: React.FC = () => {
  const router = useRouter();
  const [componentId, setComponentId] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    featured: false,
    tags: [],
    author: 'Darco Studio',
    slug: '',
    externalSourceUrl: '',
    implementation: '',
    moreInformation: '',
    content: {
      externalScripts: '',
      html: '',
      css: '',
      js: ''
    },
    previewImage: '',
    previewVideo: '',
    mediaType: 'unknown',
  });
  
  const [tagInput, setTagInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ensure Supabase storage bucket exists on component mount
  useEffect(() => {
    ensureStorageBucketExists();
    // Generate a component ID for file uploads
    setComponentId(uuidv4());
  }, []);
  
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug,
        id: slug
      }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle content changes (code editors)
  const handleContentChange = (contentType: keyof FormData['content'], value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [contentType]: value
      }
    }));
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle preview image change
  const handlePreviewImageChange = (url: string, mediaType: 'image' | 'video' | 'unknown') => {
    setFormData(prev => ({
      ...prev,
      previewImage: url,
      mediaType: mediaType
    }));
  };
  
  // Handle preview video change
  const handlePreviewVideoChange = (url: string, mediaType: 'image' | 'video' | 'unknown') => {
    setFormData(prev => ({
      ...prev,
      previewVideo: url,
      mediaType: mediaType
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add component');
      }
      
      const data = await response.json();
      
      toast.success('Component added successfully');
      
      // Redirect to component page
      router.push(`/admin/manage-components`);
    } catch (error) {
      console.error('Error adding component:', error);
      toast.error('Failed to add component');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <VaultLayout 
      title="Add Component - Admin Dashboard"
      description="Add a new component to the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Add Component</h1>
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
                Enter the basic details for the component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Component title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="component-slug"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. Used in URLs.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Component description"
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <CategorySelector 
                    selectedCategory={formData.category} 
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <div 
                        key={tag}
                        className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Component</Label>
              </div>
            </CardContent>
          </Card>
          
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
                  onMediaChange={handlePreviewImageChange}
                  componentId={componentId}
                />
                
                <MediaUploader
                  label="Preview Video"
                  onMediaChange={handlePreviewVideoChange}
                  componentId={componentId}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Add more details about the component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="externalSourceUrl">External Source URL</Label>
                <Input
                  id="externalSourceUrl"
                  name="externalSourceUrl"
                  value={formData.externalSourceUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/source"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="implementation">Implementation Notes</Label>
                <Textarea
                  id="implementation"
                  name="implementation"
                  value={formData.implementation}
                  onChange={handleInputChange}
                  placeholder="Notes on how to implement this component"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moreInformation">More Information</Label>
                <Textarea
                  id="moreInformation"
                  name="moreInformation"
                  value={formData.moreInformation}
                  onChange={handleInputChange}
                  placeholder="Additional information about the component"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Component Code</CardTitle>
              <CardDescription>
                Add the code for the component
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
                    value={formData.content.html}
                    onChange={(value) => handleContentChange('html', value)}
                    placeholder="Enter HTML code here..."
                  />
                </TabsContent>
                
                <TabsContent value="css">
                  <CodeEditor
                    language="css"
                    value={formData.content.css}
                    onChange={(value) => handleContentChange('css', value)}
                    placeholder="Enter CSS code here..."
                  />
                </TabsContent>
                
                <TabsContent value="js">
                  <CodeEditor
                    language="javascript"
                    value={formData.content.js}
                    onChange={(value) => handleContentChange('js', value)}
                    placeholder="Enter JavaScript code here..."
                  />
                </TabsContent>
                
                <TabsContent value="external">
                  <CodeEditor
                    language="html"
                    value={formData.content.externalScripts}
                    onChange={(value) => handleContentChange('externalScripts', value)}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
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
        </form>
      </div>
    </VaultLayout>
  );
};

export default AddComponentPage;
