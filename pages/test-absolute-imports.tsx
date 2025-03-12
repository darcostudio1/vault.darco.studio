import React from 'react';
import { Button } from '@/components/ui/button';

const TestAbsoluteImportsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Test Absolute Imports</h1>
      <p>This page tests that absolute imports with @ prefix are working correctly.</p>
      <Button>Test Button</Button>
    </div>
  );
};

export default TestAbsoluteImportsPage;
