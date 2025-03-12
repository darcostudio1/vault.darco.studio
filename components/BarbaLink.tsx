import React from 'react';
import Link, { LinkProps } from 'next/link';

interface BarbaLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  'data-barba-prevent'?: string;
}

/**
 * Custom Link component that works with Barba.js
 * Adds data-barba attribute to links for smooth page transitions
 */
const BarbaLink: React.FC<BarbaLinkProps> = ({ 
  href, 
  children, 
  className = '', 
  'data-barba-prevent': barbaPrevent,
  ...props 
}) => {
  // Determine if this is an external link
  const isExternal = typeof href === 'string' && (href.startsWith('http') || href.startsWith('mailto:'));
  
  // For external links, use a regular anchor tag
  if (isExternal) {
    return (
      <a 
        href={href as string} 
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // For internal links, use Next.js Link with Barba.js attributes and legacyBehavior
  return (
    <Link href={href} legacyBehavior {...props}>
      <a 
        className={className} 
        data-barba-prevent={barbaPrevent}
      >
        {children}
      </a>
    </Link>
  );
};

export default BarbaLink; 