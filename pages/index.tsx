import { GetServerSideProps } from 'next';
import VaultLayout from '../components/layout/VaultLayout';
import ComponentGrid from '../components/ComponentGrid';
import { Component } from '../types/Component';

interface HomeProps {
  components: Component[];
}

export default function Home({ components }: HomeProps) {
  return (
    <VaultLayout 
      title="The Vault — A Collection of Web Components and Animations"
      description="Browse our collection of web components, animations, and interactive elements for modern web applications"
    >
      <div className="page-content space-y-6" data-barba="container" data-barba-namespace="home">
        <div className="section space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Component Vault</h1>
          <p className="text-muted-foreground">
            DARCO STUDIO Private Collection of modern web components, animations, and interactive elements.
          </p>
        </div>
        
        <div className="space-y-6">
          {components.length > 0 ? (
            <ComponentGrid components={components} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                There are no components in the vault yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </VaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    // Use absolute URL with host from request or fallback to relative URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost:3001';
    const baseUrl = `${protocol}://${host}`;
    
    // Fetch all components, sorted by date (most recent first)
    const res = await fetch(`${baseUrl}/api/components`);
    const components = await res.json();
    
    return {
      props: {
        components,
      },
    };
  } catch (error) {
    console.error('Error fetching components:', error);
    return {
      props: {
        components: [],
      },
    };
  }
};
