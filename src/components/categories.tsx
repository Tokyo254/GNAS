import { useState } from 'react';
import { PREDEFINED_CATEGORIES, type Category, getCategoryColor } from '../constants/categories';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  maxSelection?: number;
  label?: string;
  required?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoriesChange,
  maxSelection,
  label = "Select Categories",
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = PREDEFINED_CATEGORIES.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (category: Category) => {
    if (selectedCategories.includes(category)) {
      // Remove category
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      // Add category (check max selection)
      if (maxSelection && selectedCategories.length >= maxSelection) {
        alert(`You can only select up to ${maxSelection} categories`);
        return;
      }
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    onCategoriesChange(selectedCategories.filter(category => category !== categoryToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
        {maxSelection && (
          <span className="text-xs text-gray-500 ml-2">
            ({selectedCategories.length}/{maxSelection} selected)
          </span>
        )}
      </label>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />

      {/* Selected Categories Preview */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(category => (
            <span
              key={category}
              className={`px-3 py-1 rounded-full text-xs border flex items-center gap-1 ${getCategoryColor(category as Category)}`}
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="hover:opacity-70 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
        {filteredCategories.map(category => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              className={`p-2 rounded-lg text-sm text-left transition-all border ${
                isSelected
                  ? getCategoryColor(category)
                  : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No categories found matching "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default CategorySelector;