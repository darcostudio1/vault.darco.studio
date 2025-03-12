import React from 'react';
import VaultLayout from '../components/layout/VaultLayout';
import { TagInput } from '../components/TagInput';
import CategorySelector from '../components/admin/CategorySelector';
import MediaUploader from '../components/admin/MediaUploader';
import { ensureStorageBucketExists } from '../lib/supabaseStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import CodeEditor from '../components/CodeEditor';

const TestImportsPage: React.FC = () => {
  return (
    <VaultLayout title="Test Imports">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Test Imports Page</h1>
        <p>This page tests that all imports are working correctly.</p>
      </div>
    </VaultLayout>
  );
};

export default TestImportsPage;
