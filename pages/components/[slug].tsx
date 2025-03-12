import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import VaultLayout from '../../components/layout/VaultLayout';
import ComponentDetail from '../../components/ComponentDetail';
import { ComponentItem } from '../../components/ComponentGrid';

// Sample component data with additional details
const componentsData: (ComponentItem & {
  codeSnippets: { language: string; code: string; title: string }[];
  dependencies: string[];
  usage: string;
  relatedComponents?: string[];
})[] = [
  {
    id: '1',
    title: 'Animated Button',
    description: 'A customizable button component with smooth hover and click animations that provides visual feedback to users. Perfect for call-to-action elements and interactive UI components.',
    image: '/samples/animated-button.gif',
    tags: ['UI', 'Animation', 'Interactive'],
    slug: 'animated-button',
    category: 'animation',
    codeSnippets: [
      {
        language: 'jsx',
        title: 'React Component',
        code: `import React, { useState } from 'react';
import './AnimatedButton.css';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };
  
  return (
    <button
      className={\`animated-button \${variant} \${size} \${isPressed ? 'pressed' : ''} \${disabled ? 'disabled' : ''}\`}
      onClick={disabled ? undefined : onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
    >
      <span className="button-content">{children}</span>
      <span className="button-background"></span>
    </button>
  );
}`
      },
      {
        language: 'css',
        title: 'CSS Styles',
        code: `.animated-button {
  position: relative;
  overflow: hidden;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  outline: none;
}

.animated-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.animated-button.pressed {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-content {
  position: relative;
  z-index: 1;
}

.button-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #7000FF, #9B4DFF);
  z-index: 0;
  transition: opacity 0.3s ease;
}

/* Variants */
.animated-button.primary .button-background {
  background: linear-gradient(45deg, #7000FF, #9B4DFF);
}

.animated-button.secondary .button-background {
  background: linear-gradient(45deg, #3B82F6, #60A5FA);
}

.animated-button.outline {
  border: 2px solid #7000FF;
  background: transparent;
}

.animated-button.outline .button-background {
  opacity: 0;
}

.animated-button.outline:hover .button-background {
  opacity: 0.1;
}

/* Sizes */
.animated-button.small {
  padding: 8px 16px;
  font-size: 14px;
}

.animated-button.medium {
  padding: 12px 24px;
  font-size: 16px;
}

.animated-button.large {
  padding: 16px 32px;
  font-size: 18px;
}

/* Disabled state */
.animated-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}`
      },
      {
        language: 'jsx',
        title: 'Usage Example',
        code: `import AnimatedButton from './AnimatedButton';

function App() {
  return (
    <div className="container">
      <h2>Button Variants</h2>
      <div className="button-row">
        <AnimatedButton variant="primary">Primary Button</AnimatedButton>
        <AnimatedButton variant="secondary">Secondary Button</AnimatedButton>
        <AnimatedButton variant="outline">Outline Button</AnimatedButton>
      </div>
      
      <h2>Button Sizes</h2>
      <div className="button-row">
        <AnimatedButton size="small">Small Button</AnimatedButton>
        <AnimatedButton size="medium">Medium Button</AnimatedButton>
        <AnimatedButton size="large">Large Button</AnimatedButton>
      </div>
      
      <h2>Disabled State</h2>
      <AnimatedButton disabled>Disabled Button</AnimatedButton>
    </div>
  );
}`
      }
    ],
    dependencies: ['React', 'CSS'],
    usage: 'Use this component for interactive elements that need visual feedback. Perfect for primary actions, call-to-action buttons, and form submissions.',
    relatedComponents: ['Tooltip Component', 'Modal Dialog', 'Form Elements']
  },
  {
    id: '2',
    title: 'Card Grid Layout',
    description: 'Responsive grid layout for displaying cards with automatic sizing and responsive breakpoints. Optimized for various screen sizes and content types.',
    image: '/samples/card-grid.png',
    tags: ['Layout', 'Grid', 'Responsive'],
    slug: 'card-grid-layout',
    category: 'layout',
    codeSnippets: [
      {
        language: 'jsx',
        title: 'React Component',
        code: `import React from 'react';
import './CardGrid.css';

interface CardGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  minWidth?: number;
}

export default function CardGrid({
  children,
  columns = 3,
  gap = 24,
  minWidth = 300
}: CardGridProps) {
  return (
    <div 
      className="card-grid"
      style={{
        gridTemplateColumns: \`repeat(auto-fill, minmax(\${minWidth}px, 1fr))\`,
        gap: \`\${gap}px\`
      }}
    >
      {children}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={\`card \${className}\`}>
      {children}
    </div>
  );
}`
      },
      {
        language: 'css',
        title: 'CSS Styles',
        code: `.card-grid {
  display: grid;
  width: 100%;
}

.card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr !important;
  }
}`
      },
      {
        language: 'jsx',
        title: 'Usage Example',
        code: `import { CardGrid, Card } from './CardGrid';

function ProductsPage() {
  const products = [
    { id: 1, title: 'Product 1', image: '/product1.jpg', price: '$29.99' },
    { id: 2, title: 'Product 2', image: '/product2.jpg', price: '$39.99' },
    { id: 3, title: 'Product 3', image: '/product3.jpg', price: '$49.99' },
    { id: 4, title: 'Product 4', image: '/product4.jpg', price: '$59.99' },
    { id: 5, title: 'Product 5', image: '/product5.jpg', price: '$69.99' },
    { id: 6, title: 'Product 6', image: '/product6.jpg', price: '$79.99' },
  ];

  return (
    <div className="container">
      <h1>Our Products</h1>
      
      <CardGrid columns={3} gap={24} minWidth={300}>
        {products.map(product => (
          <Card key={product.id}>
            <img src={product.image} alt={product.title} />
            <div className="card-content">
              <h3>{product.title}</h3>
              <p>{product.price}</p>
              <button>Add to Cart</button>
            </div>
          </Card>
        ))}
      </CardGrid>
    </div>
  );
}`
      }
    ],
    dependencies: ['React', 'CSS'],
    usage: 'Use this component to display collections of items in a responsive grid layout. Perfect for product listings, image galleries, blog posts, and more.',
    relatedComponents: ['Image Gallery', 'Product Card', 'Blog Grid']
  },
  // Add other components with their details here
];

interface ComponentDetailPageProps {
  component: (typeof componentsData)[0];
}

export default function ComponentDetailPage({ component }: ComponentDetailPageProps) {
  const router = useRouter();
  
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
    <VaultLayout title={`${component.title} — DARCO Vault`} description={component.description}>
      <div className="vault-main">
        <ComponentDetail component={component} />
      </div>
    </VaultLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the paths we want to pre-render based on components
  const paths = componentsData.map((component) => ({
    params: { slug: component.slug },
  }));
  
  // We'll pre-render only these paths at build time.
  // { fallback: true } means other routes will be generated at runtime.
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }: { params?: { slug?: string } }) => {
  // Find the component that matches the slug
  const component = componentsData.find((c) => c.slug === params?.slug);
  
  // If no matching component is found, return 404
  if (!component) {
    return {
      notFound: true,
    };
  }
  
  // Pass component data to the page via props
  return {
    props: {
      component,
    },
    // Re-generate the page at most once per day
    revalidate: 86400,
  };
};
