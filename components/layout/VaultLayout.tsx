import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import { getAllComponents } from '../../data/componentRegistry';
import { cn } from '../../lib/utils';

interface VaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function VaultLayout({
  children,
  title = 'The Vault',
  description = 'A collection of components, animations, and interactive elements for modern web applications.',
}: VaultLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="flex flex-1">
          <Sidebar 
            isMobileMenuOpen={sidebarOpen} 
            setIsMobileMenuOpen={setSidebarOpen} 
            components={getAllComponents()}
            isCollapsed={sidebarCollapsed}
            setIsCollapsed={setSidebarCollapsed}
          />
          
          <div className="flex-1 flex flex-col">
            <Header toggleSidebar={toggleSidebar} />
            <main className={cn(
              "flex-1 transition-all duration-300",
              "bg-white dark:bg-black text-black dark:text-white",
              "lg:ml-[5rem]", 
              sidebarCollapsed ? "lg:ml-20" : "lg:ml-80" 
            )}>
              <div className="w-full py-6 md:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
