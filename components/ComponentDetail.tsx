import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentItem } from './ComponentGrid';

interface ComponentDetailProps {
  component: ComponentItem & {
    usage?: string;
    code?: string;
    documentation?: string;
    relatedComponents?: string[];
  };
}

export default function ComponentDetail({ component }: ComponentDetailProps) {
  const {
    title,
    description,
    image,
    tags,
    usage = 'import { Component } from "@darco/components";\n\n<Component prop="value" />',
    code = '<div className="component-example">\n  <h2>Example Component</h2>\n  <p>This is a sample implementation.</p>\n</div>',
    documentation = 'This component provides a standardized way to display content with consistent styling and behavior.',
    relatedComponents = []
  } = component;

  return (
    <div className="component-detail-container">
      <div className="component-detail-header">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-secondary text-lg mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span key={tag} className="component-tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <div className="component-detail">
        <div className="component-main">
          <div className="component-preview mb-8">
            <div className="bg-slate p-4 rounded-t-lg flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-center flex-1 text-secondary">Preview</div>
            </div>
            <div className="p-8 flex items-center justify-center bg-white">
              <Image 
                src={image} 
                alt={title} 
                width={400} 
                height={240} 
                className="max-w-full h-auto"
              />
            </div>
          </div>
          
          <div className="component-tabs mb-8">
            <div className="flex border-b border-slate">
              <button className="px-4 py-2 font-medium border-b-2 border-accent-color text-accent-color">
                Code
              </button>
              <button className="px-4 py-2 font-medium text-secondary">
                Documentation
              </button>
              <button className="px-4 py-2 font-medium text-secondary">
                Examples
              </button>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Usage</h3>
              <pre className="component-code mb-6">
                <code>{usage}</code>
              </pre>
              
              <h3 className="text-lg font-medium mb-3">Implementation</h3>
              <pre className="component-code">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        </div>
        
        <div className="component-sidebar">
          <div className="bg-slate bg-opacity-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Documentation</h3>
            <p className="text-secondary">{documentation}</p>
          </div>
          
          {relatedComponents.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Related Components</h3>
              <ul className="space-y-2">
                {relatedComponents.map((comp) => (
                  <li key={comp}>
                    <Link href={`/components/${comp.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="flex items-center p-3 rounded-md hover:bg-slate">
                        <span className="material-icons text-secondary mr-2">widgets</span>
                        <span>{comp}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Component Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Downloads</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Last Updated</span>
                <span className="font-medium">2 weeks ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Version</span>
                <span className="font-medium">1.2.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">License</span>
                <span className="font-medium">MIT</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="btn btn-primary w-full py-2 mb-3">
              <span className="material-icons mr-2">download</span>
              Download
            </button>
            <button className="btn btn-outline w-full py-2">
              <span className="material-icons mr-2">content_copy</span>
              Copy Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
