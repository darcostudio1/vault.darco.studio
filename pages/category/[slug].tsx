import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import VaultLayout from '../../components/layout/VaultLayout';
import ComponentGrid from '../../components/ComponentGrid';
import { getComponentsByCategory, getAllCategories } from '../../data/componentRegistry';
import { fadeIn, staggerFadeIn } from '../../utils/animations';

// Helper function to convert slug to display name
const slugToDisplayName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Map slugs to category names
const categoryMap: Record<string, string> = {
  'utilities-scripts': 'Utilities & Scripts',
  'buttons': 'Buttons',
  'cursor-animations': 'Cursor Animations',
  'video-audio': 'Video & Audio',
  'scroll-animations': 'Scroll Animations',
  'sliders-marquees': 'Sliders & Marquees',
  'dropdowns-information': 'Dropdowns & Information',
  'gimmicks': 'Gimmicks',
  'forms': 'Forms',
  'gallery-images': 'Gallery & Images',
  'hover-interactions': 'Hover Interactions',
  'navigation': 'Navigation',
  'page-transitions': 'Page Transitions',
  'sections': 'Sections',
  'filters-sorting': 'Filters & Sorting',
  'loaders': 'Loaders'
};

interface CategoryPageProps {
  components: any[];
  categoryName: string;
  categorySlug: string;
}

export default function CategoryPage({ components, categoryName, categorySlug }: CategoryPageProps) {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  
  // Add animations when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && headerRef.current) {
      // Animate header elements
      const headerTitle = headerRef.current.querySelector('h1');
      const headerDescription = headerRef.current.querySelector('p');
      
      if (headerTitle) fadeIn(headerTitle as Element, 0.2, 0.6);
      if (headerDescription) fadeIn(headerDescription as Element, 0.4, 0.6);
    }
  }, []);
  
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return (
      <VaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
        </div>
      </VaultLayout>
    );
  }
  
  return (
    <VaultLayout 
      title={`${categoryName} — The Vault`}
      description={`Browse our collection of ${categoryName.toLowerCase()} components and resources`}
    >
      <div className="vault-main" data-barba="container" data-barba-namespace={`category-${categorySlug}`}>
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold mb-2 opacity-0">{categoryName}</h1>
          <p className="text-secondary opacity-0">
            Browse our collection of {categoryName.toLowerCase()} components and resources
          </p>
        </div>
        
        <ComponentGrid 
          components={components} 
          title="" 
          category={categorySlug}
        />
      </div>
    </VaultLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all categories from the component registry
  const categories = getAllCategories();
  
  // Get the paths we want to pre-render based on categories
  const paths = Object.keys(categoryMap).map((slug) => ({
    params: { slug },
  }));
  
  // We'll pre-render only these paths at build time.
  // { fallback: true } means other routes will be generated at runtime.
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }: { params?: { slug?: string } }) => {
  const slug = params?.slug || '';
  const categoryName = categoryMap[slug] || slugToDisplayName(slug);
  
  // Get components by category using the componentRegistry
  const filteredComponents = getComponentsByCategory(slug);
  
  // If no matching category is found, return 404
  if (!categoryMap[slug]) {
    return {
      notFound: true,
    };
  }
  
  // Pass category data to the page via props
  return {
    props: {
      components: filteredComponents,
      categoryName,
      categorySlug: slug,
    },
    // Re-generate the page at most once per day
    revalidate: 86400,
  };
};
