import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../ui/button';
import { PlusCircle, List, Home, Database } from 'lucide-react';

const AdminNav: React.FC = () => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <div className="bg-muted p-4 rounded-lg mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">Admin Dashboard</h2>
        <div className="flex space-x-2">
          <Button 
            size="sm"
            asChild
            className="gap-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Site
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm"
          asChild
          className={`gap-2 ${
            isActive('/admin/add-component') 
              ? "border-primary" 
              : ""
          } transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`}
          data-component-name="LinkComponent"
        >
          <Link href="/admin/add-component">
            <PlusCircle className="h-4 w-4" />
            Add Component
          </Link>
        </Button>
        
        <Button 
          size="sm"
          asChild
          className={`gap-2 ${
            isActive('/admin/manage-components') 
              ? "border-primary" 
              : ""
          } transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`}
          data-component-name="LinkComponent"
        >
          <Link href="/admin/manage-components">
            <List className="h-4 w-4" />
            Manage Components
          </Link>
        </Button>
        
        <Button 
          size="sm"
          asChild
          className={`gap-2 ${
            isActive('/admin/database-setup') 
              ? "border-primary" 
              : ""
          } transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground`}
          data-component-name="LinkComponent"
        >
          <Link href="/admin/database-setup">
            <Database className="h-4 w-4" />
            Database Setup
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminNav;
