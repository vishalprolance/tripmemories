import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ onSearch, placeholder = "Search trips..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e?.target?.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchTerm) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <div className={`transition-all duration-200 ${isExpanded ? 'w-full' : 'w-full'}`}>
        <div className="relative">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
          <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pl-10 pr-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions (if needed in future) */}
      {isExpanded && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-2 z-50 max-h-60 overflow-y-auto">
          {/* This can be expanded for search suggestions */}
          <div className="p-3 text-sm text-muted-foreground">
            Search results will appear here...
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;