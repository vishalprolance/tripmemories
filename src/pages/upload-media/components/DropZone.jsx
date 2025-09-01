import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DropZone = ({ onFilesSelected, disabled, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e?.dataTransfer?.files);
    const mediaFiles = files?.filter(file => 
      file?.type?.startsWith('image/') || file?.type?.startsWith('video/')
    );
    
    if (mediaFiles?.length > 0) {
      onFilesSelected(mediaFiles);
    }
  }, [disabled, onFilesSelected]);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e?.target?.files);
    if (files?.length > 0) {
      onFilesSelected(files);
    }
    // Reset input value to allow selecting same files again
    e.target.value = '';
  }, [onFilesSelected]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef?.current?.click();
    }
  };

  const handleCameraCapture = () => {
    if (!disabled) {
      // Create a new input for camera capture
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*,video/*';
      cameraInput.capture = 'environment';
      cameraInput.multiple = true;
      cameraInput.onchange = (e) => {
        const files = Array.from(e?.target?.files);
        if (files?.length > 0) {
          onFilesSelected(files);
        }
      };
      cameraInput?.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-smooth min-h-[200px] flex flex-col items-center justify-center
          ${isDragOver 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="button"
        tabIndex={0}
        aria-label="Upload media files"
        onKeyDown={(e) => {
          if (e?.key === 'Enter' || e?.key === ' ') {
            e?.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Icon name="Upload" size={32} className="text-primary" />
          </div>
          <div className="p-3 bg-accent/10 rounded-full">
            <Icon name="Images" size={32} className="text-accent" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragOver ? 'Drop files here' : 'Upload Photos & Videos'}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-sm">
          Drag and drop your media files here, or click to browse your device
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button
            variant="default"
            iconName="FolderOpen"
            iconPosition="left"
            className="flex-1"
            disabled={disabled}
          >
            Browse Files
          </Button>
          
          <Button
            variant="outline"
            iconName="Camera"
            iconPosition="left"
            onClick={(e) => {
              e?.stopPropagation();
              handleCameraCapture();
            }}
            className="flex-1"
            disabled={disabled}
          >
            Camera
          </Button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Supports: JPEG, PNG, HEIC, MP4, MOV</p>
          <p>Max file size: 100MB per file</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;