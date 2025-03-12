import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';
import fs from 'fs';
import path from 'path';

const SetupDbPage: React.FC = () => {
  const [sql, setSql] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    // Load the SQL file content
    fetch('/api/get-sql-content?file=categories-schema-fixed.sql')
      .then(response => response.json())
      .then(data => {
        if (data.content) {
          setSql(data.content);
        }
      })
      .catch(error => {
        console.error('Error loading SQL file:', error);
        toast.error('Failed to load SQL file');
      });
  }, []);
  
  const handleExecuteSql = async () => {
    if (!sql.trim()) {
      toast.error('SQL query is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute SQL');
      }
      
      setResult(data);
      toast.success('SQL executed successfully');
      
      // Test categories API
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      console.log('Categories after setup:', categoriesData);
      
    } catch (error) {
      console.error('Error executing SQL:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <VaultLayout 
      title="Setup Database - Admin Dashboard"
      description="Set up the database tables for Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-5xl">
        <AdminNav />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Database Tables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                placeholder="Enter SQL query"
                rows={15}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleExecuteSql}
                disabled={isLoading || !sql.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  'Execute SQL'
                )}
              </Button>
            </div>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h3 className="font-medium mb-2">Result:</h3>
                <pre className="text-xs overflow-auto p-2 bg-white border rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VaultLayout>
  );
};

export default SetupDbPage;
