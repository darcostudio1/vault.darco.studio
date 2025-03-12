import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Menu, X, Settings } from 'lucide-react';
import { ModeToggle } from '../mode-toggle';
import { cn } from '../../lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '../ui/sheet';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // Get current page title based on route
  const getPageTitle = () => {
    const path = router.pathname;
    const slug = router.query.slug as string;
    
    if (path === '/') return 'The Vault';
    if (path === '/all-components') return 'All Components';
    if (path === '/category/[slug]' && slug) {
      return formatCategoryName(slug);
    }
    if (path === '/component/[slug]' && slug) {
      return 'Component Details';
    }
    
    return 'The Vault';
  };
  
  // Format category name for display (convert slug to title case)
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="sticky top-0 z-30">
      <div className={cn(
        "flex h-16 items-center justify-end px-4 md:px-6",
      )}>
        <div className="flex items-center gap-2">
          {/* Desktop search form - now opens the modal */}
          <div className="relative hidden md:block">
            <Input
              type="search"
              placeholder="Search components..."
              className="w-[200px] lg:w-[300px] cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          
          {/* Admin button */}
          <Button
            size="sm"
            className="hidden md:flex gap-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            asChild
            data-component-name="LinkComponent"
          >
            <Link href="/admin/manage-components">
              <Settings className="h-4 w-4" />
              Manage Components
            </Link>
          </Button>
          
          {/* Mobile admin button */}
          <Button
            size="icon"
            className="md:hidden transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            asChild
            data-component-name="LinkComponent"
          >
            <Link href="/admin/manage-components">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Manage Components</span>
            </Link>
          </Button>
          
          {/* Theme toggle */}
          <ModeToggle />
          
          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      {/* Search Modal */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="top" className="w-full sm:max-w-md mx-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Search Components</SheetTitle>
            <SheetDescription>
              Find components by name, category, or description
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search components..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <SheetClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </SheetClose>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </header>
  );
}
