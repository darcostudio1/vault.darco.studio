import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/categories');
      console.log('Categories API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories data:', data);
      
      if (Array.isArray(data)) {
        const categoryNames = data.map((cat: any) => cat.name || cat);
        console.log('Extracted category names:', categoryNames);
        setCategories(categoryNames);
      } else {
        console.error('Unexpected data format:', data);
        setError('Unexpected data format from API');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    setIsAdding(true);
    setError(null);
    try {
      console.log('Adding new category:', newCategory);
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory,
          slug: newCategory.toLowerCase().replace(/\s+/g, '-'),
          description: `${newCategory} components`,
        }),
      });
      
      console.log('Add category response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.status}`);
      }

      const result = await response.json();
      console.log('Add category result:', result);

      // Refresh categories
      await fetchCategories();
      
      // Select the new category
      onChange(newCategory);
      
      // Reset form
      setNewCategory('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
          Error: {error}
        </div>
      )}
      
      {!showAddForm ? (
        <div className="flex items-center space-x-2">
          <div className="flex-grow">
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No categories found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            +
          </Button>
        </div>
      ) : (
        <div className="border p-4 rounded-md shadow-sm">
          <h4 className="font-medium mb-2">Add New Category</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addCategory}
                disabled={!newCategory.trim() || isAdding}
              >
                {isAdding ? 'Adding...' : 'Add Category'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 text-xs rounded">
        <div>Debug Info:</div>
        <div>Categories: {categories.length ? categories.join(', ') : 'None'}</div>
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Current Value: {value || 'None'}</div>
      </div>
    </div>
  );
};

export default CategorySelector;
