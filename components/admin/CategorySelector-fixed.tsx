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

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.map((cat: any) => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    setIsAdding(true);
    try {
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

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      // Refresh categories
      await fetchCategories();
      
      // Select the new category
      onChange(newCategory);
      
      // Reset form
      setNewCategory('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CategorySelector;
