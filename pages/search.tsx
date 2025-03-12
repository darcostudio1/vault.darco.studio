import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import VaultLayout from '../components/layout/VaultLayout';
import ComponentGrid from '../components/ComponentGrid';
import { Component } from '../types/Component';

// Import component data from registry
import { getAllComponents } from '../data/componentRegistry';

export default function SearchPage() {
  const router = useRouter();
  const { q: query, category, tag } = router.query;
  
  const [searchResults, setSearchResults] = useState<Component[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  
  useEffect(() => {
    if (router.isReady) {
      setIsSearching(true);
      
      // Simulate search delay
      setTimeout(() => {
        let results = getAllComponents();
        
        // Filter by search query
        if (query && typeof query === 'string') {
          const searchTerms = query.toLowerCase().split(' ');
          results = results.filter(component => {
            return searchTerms.every(term => 
              component.title.toLowerCase().includes(term) || 
              component.description.toLowerCase().includes(term) ||
              component.tags?.some(tag => tag.toLowerCase().includes(term))
            );
          });
        }
        
        // Filter by category
        if (category && typeof category === 'string') {
          results = results.filter(component => 
            component.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        // Filter by tag
        if (tag && typeof tag === 'string') {
          results = results.filter(component => 
            component.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
          );
        }
        
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    }
  }, [router.isReady, query, category, tag]);
  
  return (
    <VaultLayout 
      title={`Search Results for "${query || ''}" — DARCO Vault`}
      description="Search results for components, code snippets, and templates"
    >
      <div className="vault-main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isSearching ? 'Searching...' : `Search Results: ${query || 'All Components'}`}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {category && typeof category === 'string' && (
              <div className="search-filter">
                <span>Category: {category}</span>
                <button 
                  onClick={() => {
                    const { category, ...rest } = router.query;
                    router.push({ query: rest });
                  }}
                  aria-label="Remove category filter"
                >
                  <span className="material-icons text-[16px]">close</span>
                </button>
              </div>
            )}
            
            {tag && typeof tag === 'string' && (
              <div className="search-filter">
                <span>Tag: {tag}</span>
                <button 
                  onClick={() => {
                    const { tag, ...rest } = router.query;
                    router.push({ query: rest });
                  }}
                  aria-label="Remove tag filter"
                >
                  <span className="material-icons text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>
          
          <p className="text-secondary">
            {isSearching 
              ? 'Searching for components...' 
              : `Found ${searchResults.length} component${searchResults.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        {isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-color"></div>
          </div>
        ) : (
          <ComponentGrid components={searchResults} title="" />
        )}
      </div>
    </VaultLayout>
  );
}
