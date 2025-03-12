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
import ComponentMigration from '../../components/admin/ComponentMigration';

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
          method: 'DELETE'
        });
        
        if (response.ok) {
          setComponents(prev => prev.filter(comp => comp.id !== componentToDelete.id));
          toast.success(`${componentToDelete.title} has been deleted successfully.`);
        } else {
          toast.error("Failed to delete component. Please try again.");
        }
      }
    } catch (error) {
      console.error('Error deleting component:', error);
      toast.error("Failed to delete component. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
      setComponentToDelete(null);
    }
  };
  
  return (
    <VaultLayout 
      title="Manage Components - Admin Dashboard"
      description="Manage all components in the Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-6xl">
        <AdminNav />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Components</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/add-component">
                <Plus className="mr-2 h-4 w-4" />
                Add Component
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Migration Card */}
        <div className="mb-8">
          <ComponentMigration />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Manage all components in the vault, including those from Supabase and custom components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading components...</p>
              </div>
            ) : filteredComponents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No components found</p>
                {searchTerm && (
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Date Added</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComponents.map((component) => (
                      <tr key={component.id} className="border-b">
                        <td className="py-3 px-4">{component.title}</td>
                        <td className="py-3 px-4">{component.category}</td>
                        <td className="py-3 px-4">{component.date}</td>
                        <td className="py-3 px-4">
                          {typeof component.id === 'string' && !component.id.includes('-') ? 'Local Storage' : 'Supabase'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              asChild
                            >
                              <Link href={`/component/${component.slug}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              asChild
                            >
                              <Link href={`/admin/edit-component/${component.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setComponentToDelete(component);
                                setIsAlertOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the component
                <strong> {componentToDelete?.title}</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </VaultLayout>
  );
};

export default ManageComponentsPage;
