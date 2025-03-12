import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Component } from '../../types/Component';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Search, Eye, Home, Loader2 } from 'lucide-react';
import { getCustomComponents, deleteCustomComponent } from '../../services/componentService';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';

const ManageComponentsPage: React.FC = () => {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [componentToDelete, setComponentToDelete] = useState<Component | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load components on mount
  useEffect(() => {
    const loadComponents = async () => {
      setIsLoading(true);
      try {
        // Fetch components from Supabase
        const response = await fetch('/api/components');
        if (!response.ok) {
          throw new Error('Failed to fetch components from Supabase');
        }
        const supabaseComponents = await response.json();
        
        // Get custom components from localStorage
        const customComponents = getCustomComponents();
        
        // Combine both sources
        const allComponents = [...supabaseComponents, ...customComponents];
        
        // Sort by date (most recent first)
        allComponents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setComponents(allComponents);
      } catch (error) {
        console.error('Error loading components:', error);
        toast.error('Failed to load components. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComponents();
    
    // Add event listener for storage changes (in case components are added/edited in another tab)
    window.addEventListener('storage', () => {
      loadComponents();
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);
  
  // Filter components based on search term
  const filteredComponents = components.filter(comp => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      comp.title.toLowerCase().includes(searchLower) ||
      comp.description.toLowerCase().includes(searchLower) ||
      comp.category.toLowerCase().includes(searchLower) ||
      (comp.tags && comp.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });
  
  // Handle component deletion
  const handleDelete = async () => {
    if (!componentToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Check if it's a custom component (from localStorage) or Supabase component
      const isCustomComponent = typeof componentToDelete.id === 'string' && !componentToDelete.id.includes('-');
      
      if (isCustomComponent) {
        // Delete from localStorage
        const success = await deleteCustomComponent(componentToDelete.id);
        
        if (success) {
          setComponents(prev => prev.filter(comp => comp.id !== componentToDelete.id));
          toast.success(`${componentToDelete.title} has been deleted successfully.`);
        } else {
          toast.error("Failed to delete component. Please try again.");
        }
      } else {
        // Delete from Supabase
        const response = await fetch(`/api/components/${componentToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setComponents(prev => prev.filter(comp => comp.id !== componentToDelete.id));
          toast.success(`${componentToDelete.title} has been deleted successfully.`);
        } else {
          toast.error("Failed to delete component from database. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
      setComponentToDelete(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Determine if a component is from Supabase or custom
  const getComponentSource = (component: Component) => {
    // This is a simple heuristic - adjust based on your actual ID format
    return typeof component.id === 'string' && component.id.includes('-') ? 'Supabase' : 'Custom';
  };
  
  return (
    <VaultLayout 
      title="Manage Components - Admin Dashboard"
      description="Manage custom components in the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Components</h1>
          <Button 
            asChild 
            className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            data-component-name="LinkComponent"
          >
            <Link href="/admin/add-component">
              <Plus className="h-4 w-4" /> Add Component
            </Link>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Manage all components in the vault, including those from Supabase and custom components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Loading components...</h3>
                </div>
              ) : filteredComponents.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Added</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Source</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComponents.map((component) => (
                        <tr key={component.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">{component.title}</td>
                          <td className="p-4">{component.category}</td>
                          <td className="p-4">{formatDate(component.date)}</td>
                          <td className="p-4">{getComponentSource(component)}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 p-0"
                              >
                                <Link href={`/resource/${component.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 p-0"
                              >
                                <Link href={`/admin/edit-component/${component.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-full h-8 w-8 p-0"
                                  onClick={() => {
                                    setComponentToDelete(component);
                                    setIsAlertOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-component-name="ManageComponentsPage">
                  <div className="text-4xl mb-4">📦</div>
                  {searchTerm ? (
                    <>
                      <h3 className="text-xl font-semibold mb-2">No matching components</h3>
                      <p className="text-muted-foreground mb-6 max-w-md">
                        We couldn't find any components matching your search criteria.
                        Try adjusting your search term.
                      </p>
                      <Button 
                        onClick={() => setSearchTerm('')}
                        className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold mb-2">No components found</h3>
                      <p className="text-muted-foreground mb-6 max-w-md" data-component-name="ManageComponentsPage">
                        There are no components in the vault yet.
                        Get started by adding your first component.
                      </p>
                      <Button 
                        asChild 
                        className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                        data-component-name="LinkComponent"
                      >
                        <Link href="/admin/add-component">
                          <Plus className="h-4 w-4" /> Add Component
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            asChild 
            className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            data-component-name="LinkComponent"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the component
              <strong>{componentToDelete ? ` "${componentToDelete.title}"` : ''}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setComponentToDelete(null);
              }}
              className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </VaultLayout>
  );
};

export default ManageComponentsPage;
