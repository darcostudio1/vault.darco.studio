import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ArrowRight, CircleAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { migrateComponentsToDatabase } from '../../lib/migrationUtils';

const ComponentMigration: React.FC = () => {
  const [localStorageCount, setLocalStorageCount] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);

  // Count components in localStorage on mount
  useEffect(() => {
    const count = getLocalStorageComponentCount();
    setLocalStorageCount(count);
  }, []);

  // Get count of components in localStorage
  const getLocalStorageComponentCount = () => {
    if (typeof window === 'undefined') return 0;
    
    const components = localStorage.getItem('customComponents');
    if (!components) return 0;
    
    try {
      return JSON.parse(components).length || 0;
    } catch (error) {
      return 0;
    }
  };

  // Migrate components from localStorage to database
  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateComponentsToDatabase();
      
      setMigrationResults(result);
      setMigrationComplete(result.success);
      
      if (result.success) {
        toast.success('Components migrated successfully');
        // Update the count after successful migration
        setLocalStorageCount(getLocalStorageComponentCount());
      } else {
        toast.error('Some components failed to migrate');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Failed to migrate components');
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Migrate Components
        </CardTitle>
        <CardDescription>
          Migrate components from localStorage to MySQL database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Components in localStorage:</span>
            <span className="font-medium">{localStorageCount}</span>
          </div>
          
          {!migrationComplete && localStorageCount > 0 && (
            <Alert variant="info" className="bg-blue-500/10 border-blue-500/20">
              <CircleAlert className="h-4 w-4 text-blue-500" />
              <AlertTitle>Migration Required</AlertTitle>
              <AlertDescription>
                Components not yet migrated from localStorage
              </AlertDescription>
            </Alert>
          )}
          
          {migrationComplete && (
            <Alert variant="success" className="bg-green-500/10 border-green-500/20">
              <CircleAlert className="h-4 w-4 text-green-500" />
              <AlertTitle>Migration Complete</AlertTitle>
              <AlertDescription>
                {migrationResults?.message || 'All components have been migrated successfully'}
              </AlertDescription>
            </Alert>
          )}
          
          {localStorageCount === 0 && !migrationComplete && (
            <Alert variant="default" className="bg-gray-500/10 border-gray-500/20">
              <CircleAlert className="h-4 w-4 text-gray-500" />
              <AlertTitle>No Components to Migrate</AlertTitle>
              <AlertDescription>
                There are no components in localStorage to migrate
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <div className="flex items-center p-6 pt-0">
        <Button
          onClick={handleMigration}
          disabled={isMigrating || localStorageCount === 0}
          className="ml-auto"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            'Migrate Components'
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ComponentMigration;
