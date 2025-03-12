import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Component } from '../../types/Component';
import { Home, Menu, X, ChevronRight, ChevronDown, 
  HomeIcon,
  BoxIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  SettingsIcon,
  ActivityIcon,
  HelpCircleIcon,
  BarChart3Icon,
  LayoutIcon,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Sidebar as UISidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavHeader } from '../ui/sidebar';

interface SidebarProps {
  components: Component[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactElement;
  variant: 'default' | 'ghost';
  isActive?: boolean;
}

export default function Sidebar({
  components,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isCollapsed = false,
  setIsCollapsed = () => {}
}: SidebarProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Extract unique categories from components
  useEffect(() => {
    if (components && components.length > 0) {
      const uniqueCategories = Array.from(
        new Set(components.map(comp => comp.category))
      ).filter(Boolean).sort() as string[];

      setCategories(uniqueCategories);
    }
  }, [components]);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, return null
  if (!mounted) return null;

  // Check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/' && router.pathname === '/') {
      return true;
    }
    if (path !== '/' && router.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Navigation items
  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
      icon: <HomeIcon />,
      variant: isActivePath('/') ? 'default' : 'ghost',
      isActive: isActivePath('/')
    },
    {
      title: "Components",
      href: "/components",
      icon: <LayoutIcon />,
      variant: isActivePath('/components') ? 'default' : 'ghost',
      isActive: isActivePath('/components')
    },
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboardIcon />,
      variant: isActivePath('/dashboard') ? 'default' : 'ghost',
      isActive: isActivePath('/dashboard')
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3Icon />,
      variant: isActivePath('/analytics') ? 'default' : 'ghost',
      isActive: isActivePath('/analytics')
    },
    {
      title: "Resources",
      href: "/resources",
      icon: <PackageIcon />,
      variant: isActivePath('/resources') ? 'default' : 'ghost',
      isActive: isActivePath('/resources')
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <SettingsIcon />,
      variant: isActivePath('/settings') ? 'default' : 'ghost',
      isActive: isActivePath('/settings')
    },
    {
      title: "Help",
      href: "/help",
      icon: <HelpCircleIcon />,
      variant: isActivePath('/help') ? 'default' : 'ghost',
      isActive: isActivePath('/help')
    },
  ];

  // Process categories from components
  const categoriesArray = Array.from(
    new Set(components.map((component) => component.category))
  ).filter(Boolean).sort() as string[];

  // Create category objects with name, slug, and count
  const categoryObjects = categoriesArray.map(category => {
    const count = components.filter(comp => comp.category === category).length;
    return {
      name: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      count
    };
  });

  // Mobile sidebar
  const mobileSidebar = (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <img
              src="/ds-vault-logo.svg"
              alt="The Vault"
              className="h-3 dark:invert"
            />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="p-4">
            <div className="space-y-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    router.pathname === "/" && "bg-accent text-accent-foreground"
                  )}
                >
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1">
              {categoryObjects.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-between",
                      router.pathname === '/category/[slug]' &&
                      router.query.slug === category.slug && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Badge 
                      className="mr-2" 
                      variant="outline"
                      data-component-name="Badge"
                    >
                      {category.count}
                    </Badge>
                    {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className={cn(
      "hidden lg:block fixed top-4 left-4 z-50 rounded-xl border shadow-xl bg-background overflow-hidden",
      "h-[calc(100vh-2rem)]",
      isCollapsed ? "w-16" : "w-72"
    )}>
      <UISidebar
        variant="floating"
        isCollapsed={isCollapsed}
        className="h-full w-full"
      >
        <SidebarHeader className="flex justify-between items-center border-b bg-transparent py-5 px-6 h-20">
          <Link href="/" className={cn(
            "flex items-center",
            isCollapsed && "sr-only"
          )}>
            <img
              src="/ds-vault-logo.svg"
              alt="The Vault"
              className={cn(
                "h-6",
                "dark:invert"
              )}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </SidebarHeader>
        <SidebarContent className="bg-transparent">
          <ScrollArea className="flex-1">
            <div className={cn("px-4 py-3", isCollapsed && "px-2")}>
              <SidebarNav className="space-y-1.5">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full",
                      isCollapsed ? "justify-center px-0" : "justify-start",
                      router.pathname === "/" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <HomeIcon className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2 text-base">Home</span>}
                  </Button>
                </Link>
              </SidebarNav>
              <Separator className="my-4" />
              <SidebarNav className="space-y-1">
                {categoryObjects.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full h-8 justify-between",
                        isCollapsed ? "justify-center px-0" : "justify-between",
                        router.pathname === '/category/[slug]' &&
                        router.query.slug === category.slug && "bg-accent text-accent-foreground"
                      )}
                    >
                      {isCollapsed ? (
                        <BoxIcon className="h-4 w-4" />
                      ) : (
                        <>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className="mr-2 rounded-sm px-1 font-normal"
                              data-component-name="Badge"
                            >
                              {category.count}
                            </Badge>
                            <span className="text-sm font-light">{category.name}</span>
                          </div>
                        </>
                      )}
                    </Button>
                  </Link>
                ))}
              </SidebarNav>
            </div>
          </ScrollArea>
        </SidebarContent>
      </UISidebar>
    </div>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}
