import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import '../styles/globals.css';
import '../styles/osmo-theme.css';
import '../styles/components.css';
import '../styles/loader.css';
import '../styles/sidebar.css';
import '../styles/layout.css';
import '../styles/content.css';

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize smooth scrolling and handle page loading
  useEffect(() => {
    if (isClient) {
      // Handle page loading
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isClient]);

  // Remove smooth scrolling effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('no-smooth-scroll');
    }
  }, []);

  // Disable smooth scrolling for users who prefer reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        document.documentElement.classList.add('no-smooth-scroll');
      }
    }
  }, []);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'The Vault',
    description: 'A collection of components, animations, and interactive elements for modern web applications.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <title>The Vault</title>
        <meta name="description" content="A collection of components, animations, and interactive elements for modern web applications." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
        <meta name="keywords" content="web development, components, animations, interactive elements, HTML, CSS, JavaScript, React, Next.js" />
        <meta name="robots" content="index, follow" />
        
        {/* Google Fonts Preload - Improves performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vault.darco.studio/" />
        <meta property="og:title" content="DARCO Vault" />
        <meta property="og:description" content="A platform to help creative developers work smarter, faster, and better. Access techniques, components, code, and tools." />
        <meta property="og:image" content="https://vault.darco.studio/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://vault.darco.studio/" />
        <meta name="twitter:title" content="DARCO Vault" />
        <meta name="twitter:description" content="A platform to help creative developers work smarter, faster, and better. Access techniques, components, code, and tools." />
        <meta name="twitter:image" content="https://vault.darco.studio/og-image.png" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      
      {/* External libraries - only load on client side */}
      {isClient && (
        <>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/SplitText.min.js" strategy="afterInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js" strategy="afterInteractive" />
        </>
      )}
      
      {/* Page loader */}
      {isLoading && (
        <div className="page-loader">
          <div className="loader-content">
            <div className="loader-spinner"></div>
            <div className="loader-text">Loading...</div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className={`app-container ${isLoading ? 'is-loading' : ''}`}>
        <Component {...pageProps} />
      </div>
      
      {/* Toaster for notifications */}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}