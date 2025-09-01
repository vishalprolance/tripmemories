import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyGalleryState = ({ 
  tripName = 'this trip',
  canUpload = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/upload-media');
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
          <Icon name="Camera" size={40} className="text-primary" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center animate-bounce">
          <Icon name="Plus" size={16} className="text-accent" />
        </div>
        <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center animate-pulse">
          <Icon name="Heart" size={12} className="text-warning" />
        </div>
      </div>
      {/* Content */}
      <h2 className="text-2xl font-bold text-foreground mb-3">
        No memories yet
      </h2>
      <p className="text-muted-foreground mb-2 max-w-sm">
        Start capturing and sharing amazing moments from <span className="font-semibold text-foreground">{tripName}</span>
      </p>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        Upload photos and videos to create a collaborative gallery that everyone can enjoy and contribute to.
      </p>
      {/* Actions */}
      {canUpload ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleUploadClick}
            className="px-6 py-3"
            iconName="Upload"
            iconPosition="left"
          >
            Upload First Photo
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Simulate camera access
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*,video/*';
              input.capture = 'environment';
              input.multiple = true;
              input.onchange = (e) => {
                if (e?.target?.files?.length > 0) {
                  navigate('/upload-media', { 
                    state: { files: Array.from(e?.target?.files) } 
                  });
                }
              };
              input?.click();
            }}
            className="px-6 py-3"
            iconName="Camera"
            iconPosition="left"
          >
            Take Photo
          </Button>
        </div>
      ) : (
        <div className="bg-muted rounded-lg p-4 max-w-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Lock" size={16} />
            <span className="text-sm">
              You don't have permission to upload media to this trip
            </span>
          </div>
        </div>
      )}
      {/* Tips */}
      <div className="mt-12 max-w-md">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Pro Tips:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Icon name="Smartphone" size={14} className="mt-0.5 flex-shrink-0" />
            <span>Upload directly from your phone's gallery</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Users" size={14} className="mt-0.5 flex-shrink-0" />
            <span>Everyone can contribute their photos</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Download" size={14} className="mt-0.5 flex-shrink-0" />
            <span>Download full-resolution originals</span>
          </div>
          <div className="flex items-start space-x-2">
            <Icon name="Calendar" size={14} className="mt-0.5 flex-shrink-0" />
            <span>Auto-organized by date and location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyGalleryState;