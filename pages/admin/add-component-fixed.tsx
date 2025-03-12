import React, { useState, useRef } from 'react';
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
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import CodeEditor from '../../components/CodeEditor';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';

const CATEGORIES = [
  'BUTTONS',
  'CARDS',
  'FORMS',
  'NAVIGATION',
  'LOADERS',
  'ANIMATIONS',
  'LAYOUTS',
  'OTHER'
];

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
  previewImage: string | null;
  previewVideo: string | null;
  mediaType: string | null;
}

const AddComponentPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
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
    previewImage: null,
    previewVideo: null,
    mediaType: null,
  });
  
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Handle code content changes
  const handleExternalScriptsChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        externalScripts: value
      }
    }));
  };

  const handleHtmlChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        html: value
      }
    }));
  };

  const handleCssChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        css: value
      }
    }));
  };

  const handleJsChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content!,
        js: value
      }
    }));
  };
  
  // Handle rich text content changes
  const handleRichTextChange = (name: 'implementation' | 'moreInformation', value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImageUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewVideoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewVideoUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'category'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Create a unique ID if not already set
      if (!formData.id) {
        setFormData(prev => ({
          ...prev,
          id: prev.slug || uuidv4().substring(0, 8)
        }));
      }
      
      // Handle image and video uploads
      // In a real implementation, you would upload these to a server or CDN
      // For now, we'll just use the file names and assume they'll be placed in the correct folders
      const imagePathPrefix = '/images/';
      const videoPathPrefix = '/videos/';
      const categoryFolder = formData.category?.toLowerCase();
      
      let imagePath = '';
      let videoPath = '';
      
      if (previewImageFile) {
        imagePath = `${imagePathPrefix}${categoryFolder}/${formData.slug}.${previewImageFile.name.split('.').pop()}`;
      }
      
      if (previewVideoFile) {
        videoPath = `${videoPathPrefix}${categoryFolder}/${formData.slug}.${previewVideoFile.name.split('.').pop()}`;
      }
      
      // Prepare the final component data
      const finalComponent = {
        ...formData,
        previewImage: imagePath || null,
        previewVideo: videoPath || null,
        mediaType: previewVideoFile ? 'video' : (previewImageFile ? 'image' : null),
        date: formData.date || new Date().toISOString().split('T')[0]
      };
      
      // Save to Supabase via API
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uuidv4(),
          title: finalComponent.title,
          slug: finalComponent.slug,
          description: finalComponent.description,
          category: finalComponent.category,
          date: finalComponent.date,
          featured: finalComponent.featured,
          author: finalComponent.author,
          externalSourceUrl: finalComponent.externalSourceUrl,
          implementation: finalComponent.implementation,
          moreInformation: finalComponent.moreInformation,
          previewImage: finalComponent.previewImage,
          previewVideo: finalComponent.previewVideo,
          mediaType: finalComponent.mediaType,
          content: finalComponent.content,
          tags: finalComponent.tags
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save component to Supabase');
      }
      
      // Show success message
      toast.success("Component added successfully to Supabase!");
      
      // Reset form
      setFormData({
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
        previewImage: null,
        previewVideo: null,
        mediaType: null,
      });
      setPreviewImageFile(null);
      setPreviewVideoFile(null);
      setPreviewImageUrl('');
      setPreviewVideoUrl('');
      setTagInput('');
      
      // Redirect to manage components page
      setTimeout(() => {
        router.push('/admin/manage-components');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving component:', error);
      toast.error("Failed to save component to Supabase");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <VaultLayout 
      title="Add New Component - Admin Dashboard"
      description="Add a new component to the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-5xl">
        <AdminNav />
        
        <h1 className="text-3xl font-bold mb-8">Add New Component</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about your component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Animated Button"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief description of your component"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="auto-generated-from-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs. Auto-generated from title but can be customized.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="externalSourceUrl">External Source URL</Label>
                <Input
                  id="externalSourceUrl"
                  name="externalSourceUrl"
                  value={formData.externalSourceUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/your-repo/component"
                />
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
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload preview images and videos for your component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Preview Image</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewImageUrl ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={previewImageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload an image</p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Preview Video</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    {previewVideoUrl ? (
                      <div className="relative w-full h-full">
                        <video 
                          src={previewVideoUrl} 
                          controls
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                          <p className="text-white">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload a video</p>
                      </>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add relevant tags to help users find your component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={handleTagInputChange}
                  placeholder="Add a tag (e.g., Animation, UI)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button 
                  type="button" 
                  onClick={addTag} 
                  className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <div 
                    key={tag} 
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center text-sm"
                  >
                    {tag}
                    <button 
                      type="button" 
                      className="ml-2 text-primary hover:text-primary/80"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.tags?.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Component Code</CardTitle>
              <CardDescription>
                Add the HTML, CSS, and JavaScript code for your component
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
                
                <TabsContent value="html" className="mt-0">
                  <div className="space-y-2">
                    <Label>HTML Code</Label>
                    <CodeEditor
                      value={formData.content?.html || ''}
                      onChange={handleHtmlChange}
                      language="html"
                      height="300px"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="css" className="mt-0">
                  <div className="space-y-2">
                    <Label>CSS Code</Label>
                    <CodeEditor
                      value={formData.content?.css || ''}
                      onChange={handleCssChange}
                      language="css"
                      height="300px"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="js" className="mt-0">
                  <div className="space-y-2">
                    <Label>JavaScript Code</Label>
                    <CodeEditor
                      value={formData.content?.js || ''}
                      onChange={handleJsChange}
                      language="javascript"
                      height="300px"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="external" className="mt-0">
                  <div className="space-y-2">
                    <Label>External Scripts</Label>
                    <Textarea
                      value={formData.content?.externalScripts || ''}
                      onChange={(e) => handleExternalScriptsChange(e.target.value)}
                      placeholder="<script src='https://example.com/script.js'></script>"
                      rows={5}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Add any external scripts or CDN links needed for your component
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Provide more details about your component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="implementation">Implementation</Label>
                <Select 
                  value={formData.implementation} 
                  onValueChange={(value) => handleSelectChange('implementation', value)}
                >
                  <SelectTrigger>
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
                  name="moreInformation"
                  value={formData.moreInformation}
                  onChange={handleInputChange}
                  placeholder="Additional details, usage instructions, or notes about your component"
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Your name or organization"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/')}
              className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
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
