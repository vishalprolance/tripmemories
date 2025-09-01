import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const AlbumAssignment = ({ 
  selectedAlbum, 
  onAlbumChange, 
  onCreateNewAlbum,
  autoSuggestions = [],
  className = '' 
}) => {
  const albumOptions = [
    { value: '', label: 'Select an album', disabled: true },
    { value: 'new', label: '+ Create New Album' },
    { value: 'auto', label: 'Auto-organize by date' },
    ...autoSuggestions?.map(suggestion => ({
      value: suggestion?.id,
      label: suggestion?.name,
      description: suggestion?.description
    })),
    { value: 'day1', label: 'Day 1 - Arrival' },
    { value: 'day2', label: 'Day 2 - Beach Activities' },
    { value: 'day3', label: 'Day 3 - City Tour' },
    { value: 'day4', label: 'Day 4 - Adventure Sports' },
    { value: 'day5', label: 'Day 5 - Departure' }
  ];

  const getAlbumIcon = (albumValue) => {
    switch (albumValue) {
      case 'new':
        return 'Plus';
      case 'auto':
        return 'Calendar';
      default:
        return 'FolderOpen';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="FolderOpen" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Album Assignment</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Info"
          className="text-muted-foreground"
          aria-label="Album assignment help"
        />
      </div>
      {/* Album Selection */}
      <div className="space-y-3">
        <Select
          label="Choose Album"
          description="Organize your uploads into albums for better management"
          options={albumOptions}
          value={selectedAlbum}
          onChange={onAlbumChange}
          placeholder="Select an album..."
          searchable
        />
        
        {selectedAlbum === 'new' && (
          <div className="p-3 bg-muted rounded-lg">
            <Button
              variant="outline"
              iconName="Plus"
              iconPosition="left"
              onClick={onCreateNewAlbum}
              className="w-full"
            >
              Create New Album
            </Button>
          </div>
        )}
        
        {selectedAlbum === 'auto' && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Sparkles" size={16} className="text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Smart Organization</p>
                <p className="text-muted-foreground">
                  Photos will be automatically grouped by date and location using EXIF data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Auto Suggestions */}
      {autoSuggestions?.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} />
            <span>Smart Suggestions</span>
          </h4>
          <div className="space-y-2">
            {autoSuggestions?.slice(0, 3)?.map((suggestion) => (
              <button
                key={suggestion?.id}
                onClick={() => onAlbumChange(suggestion?.id)}
                className={`
                  w-full text-left p-3 border rounded-lg transition-all
                  ${selectedAlbum === suggestion?.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{suggestion?.name}</p>
                    <p className="text-sm text-muted-foreground">{suggestion?.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name={suggestion?.icon || 'Calendar'} size={14} />
                    <span>{suggestion?.confidence}% match</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Album Preview */}
      {selectedAlbum && selectedAlbum !== 'new' && selectedAlbum !== 'auto' && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name={getAlbumIcon(selectedAlbum)} size={14} />
              <span>Selected album:</span>
            </div>
            <span className="font-medium text-foreground">
              {albumOptions?.find(opt => opt?.value === selectedAlbum)?.label}
            </span>
          </div>
          
          <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Images" size={12} />
              <span>24 photos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Video" size={12} />
              <span>6 videos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Last updated 2 hours ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumAssignment;