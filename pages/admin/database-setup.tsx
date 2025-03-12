import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { CheckCircle2, AlertCircle, Database, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import AdminNav from '../../components/admin/AdminNav';
import VaultLayout from '../../components/layout/VaultLayout';
import { migrateComponentsToDatabase } from '../../lib/migrationUtils';

interface DatabaseStatus {
  connected: boolean;
  message: string;
  error?: string;
}

interface SetupStatus {
  completed: boolean;
  message: string;
  error?: string;
  tablesCreated?: number;
}

interface MigrationStatus {
  completed: boolean;
  message: string;
  results?: any[];
  error?: string;
}

const DatabaseSetupPage: React.FC = () => {
  const [databaseStatus, setDatabaseStatus] = useState<DatabaseStatus>({
    connected: false,
    message: 'Checking database connection...'
  });
  
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    completed: false,
    message: 'Database tables not yet created'
  });
  
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    completed: false,
    message: 'Components not yet migrated from localStorage'
  });
  
  const [isLoading, setIsLoading] = useState({
    connection: true,
    setup: false,
    migration: false
  });

  // Check database connection on page load
  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  // Check database connection
  const checkDatabaseConnection = async () => {
    setIsLoading(prev => ({ ...prev, connection: true }));
    try {
      const response = await fetch('/api/check-connection');
      const data = await response.json();
      
      setDatabaseStatus({
        connected: data.connected,
        message: data.message,
        error: data.error
      });
      
      if (data.connected) {
        checkDatabaseSetup();
      }
    } catch (error) {
      setDatabaseStatus({
        connected: false,
        message: 'Failed to check database connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, connection: false }));
    }
  };

  // Check if database tables are set up
  const checkDatabaseSetup = async () => {
    try {
      const response = await fetch('/api/check-tables');
      const data = await response.json();
      
      setSetupStatus({
        completed: data.ready,
        message: data.message,
        error: data.error
      });
    } catch (error) {
      setSetupStatus({
        completed: false,
        message: 'Failed to check database setup',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Set up database tables
  const setupDatabase = async () => {
    setIsLoading(prev => ({ ...prev, setup: true }));
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      setSetupStatus({
        completed: data.success,
        message: data.message,
        tablesCreated: data.tablesCreated,
        error: data.error
      });
      
      if (data.success) {
        toast.success('Database tables created successfully');
      } else {
        toast.error('Failed to create database tables');
      }
    } catch (error) {
      setSetupStatus({
        completed: false,
        message: 'Failed to set up database',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to set up database');
    } finally {
      setIsLoading(prev => ({ ...prev, setup: false }));
    }
  };

  // Migrate components from localStorage to database
  const migrateComponents = async () => {
    setIsLoading(prev => ({ ...prev, migration: true }));
    try {
      const result = await migrateComponentsToDatabase();
      
      setMigrationStatus({
        completed: result.success,
        message: result.message,
        results: result.results,
        error: result.error
      });
      
      if (result.success) {
        toast.success('Components migrated successfully');
      } else {
        toast.error('Some components failed to migrate');
      }
    } catch (error) {
      setMigrationStatus({
        completed: false,
        message: 'Failed to migrate components',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to migrate components');
    } finally {
      setIsLoading(prev => ({ ...prev, migration: false }));
    }
  };

  // Count components in localStorage
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

  return (
    <VaultLayout
      title="Database Setup - Admin Dashboard"
      description="Set up and manage the MySQL database for Darco Studio Vault"
    >
      <div className="container mx-auto py-8 max-w-5xl">
        <AdminNav />
        
        <h1 className="text-3xl font-bold mb-8">Database Setup</h1>
        
        <div className="space-y-8">
          {/* Database Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Connection
              </CardTitle>
              <CardDescription>
                Connect to your MySQL database on A2Hosting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading.connection ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Checking connection...
                </div>
              ) : databaseStatus.connected ? (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>Connected</AlertTitle>
                  <AlertDescription>{databaseStatus.message}</AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>
                    {databaseStatus.message}
                    {databaseStatus.error && (
                      <div className="mt-2 text-sm text-destructive/80">
                        Error: {databaseStatus.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={checkDatabaseConnection}
                disabled={isLoading.connection}
                className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                {isLoading.connection ? 'Checking...' : 'Check Connection'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Database Tables Setup
              </CardTitle>
              <CardDescription>
                Create the necessary tables in your MySQL database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {setupStatus.completed ? (
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>Tables Created</AlertTitle>
                  <AlertDescription>{setupStatus.message}</AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertTitle>Tables Not Set Up</AlertTitle>
                  <AlertDescription>
                    {setupStatus.message}
                    {setupStatus.error && (
                      <div className="mt-2 text-sm text-yellow-500/80">
                        Error: {setupStatus.error}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={setupDatabase}
                disabled={isLoading.setup || !databaseStatus.connected}
                className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                {isLoading.setup ? 'Setting Up...' : 'Set Up Database Tables'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Data Migration */}
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
                  <span className="font-medium">{getLocalStorageComponentCount()}</span>
                </div>
                
                {migrationStatus.completed ? (
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Migration Completed</AlertTitle>
                    <AlertDescription>{migrationStatus.message}</AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Migration Required</AlertTitle>
                    <AlertDescription>
                      {migrationStatus.message}
                      {migrationStatus.error && (
                        <div className="mt-2 text-sm text-blue-500/80">
                          Error: {migrationStatus.error}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={migrateComponents}
                disabled={isLoading.migration || !setupStatus.completed || getLocalStorageComponentCount() === 0}
                className="transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                {isLoading.migration ? 'Migrating...' : 'Migrate Components'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </VaultLayout>
  );
};

export default DatabaseSetupPage;
