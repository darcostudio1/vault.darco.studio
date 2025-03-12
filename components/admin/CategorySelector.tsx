import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Default categories to use until the API is working
const DEFAULT_CATEGORIES = [
  'Buttons',
  'Cards',
  'Forms',
  'Layouts',
  'Navigation',
  'Tables',
  'Typography',
  'Other'
];

const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  // Combine default and custom categories
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  
  // Add new category locally
  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    // Check if category already exists
    if (allCategories.includes(newCategory)) {
      // Select the existing category
      onChange(newCategory);
    } else {
      // Add new category to local state
      setCustomCategories(prev => [...prev, newCategory]);
      // Select the new category
      onChange(newCategory);
    }
    
    // Reset form
    setNewCategory('');
    setShowAddForm(false);
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
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
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
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addCategory}
                disabled={!newCategory.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
