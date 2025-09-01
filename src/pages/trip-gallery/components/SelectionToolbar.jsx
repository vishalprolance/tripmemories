import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SelectionToolbar = ({ 
  selectedCount = 0, 
  onClearSelection, 
  onDownload, 
  onShare, 
  onDelete,
  canDelete = false,
  className = '' 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className={`fixed top-14 left-0 right-0 bg-primary text-primary-foreground shadow-elevation-2 z-30 animate-slide-up ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Count and Clear */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Icon name="X" size={18} />
          </Button>
          <span className="font-semibold">
            {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
          </span>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            aria-label="Share selected items"
          >
            <Icon name="Share" size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onDownload}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            aria-label="Download selected items"
          >
            <Icon name="Download" size={18} />
          </Button>

          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-primary-foreground hover:bg-red-500/20"
              aria-label="Delete selected items"
            >
              <Icon name="Trash2" size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectionToolbar;