import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ 
  activeFilter = 'all', 
  onFilterChange, 
  mediaStats = {},
  className = '' 
}) => {
  const filters = [
    {
      id: 'all',
      label: 'All',
      icon: 'Grid3X3',
      count: mediaStats?.total || 0
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: 'Image',
      count: mediaStats?.photos || 0
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: 'Video',
      count: mediaStats?.videos || 0
    },
    {
      id: 'recent',
      label: 'Recent',
      icon: 'Clock',
      count: mediaStats?.recent || 0
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: 'Heart',
      count: mediaStats?.favorites || 0
    }
  ];

  return (
    <div className={`sticky top-14 bg-background/95 backdrop-blur-sm border-b border-border z-20 ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {filters?.map((filter) => (
            <Button
              key={filter?.id}
              variant={activeFilter === filter?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter?.id)}
              className={`flex-shrink-0 transition-all duration-200 ${
                activeFilter === filter?.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'hover:bg-muted'
              }`}
            >
              <Icon 
                name={filter?.icon} 
                size={14} 
                className="mr-1.5" 
              />
              <span className="font-medium">{filter?.label}</span>
              {filter?.count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeFilter === filter?.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {filter?.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;