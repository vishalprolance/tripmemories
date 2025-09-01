import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TripCoverUpload = ({ coverImage, onImageChange, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    
    const file = e?.dataTransfer?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef?.current?.click();
  };

  const handleRemoveImage = () => {
    onImageChange(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Cover Photo
        <span className="text-muted-foreground ml-1">(Optional)</span>
      </label>
      
      <div
        className={`relative w-full h-48 border-2 border-dashed rounded-lg transition-all duration-200 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-error bg-error/5' :'border-border bg-muted/30 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {coverImage ? (
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={coverImage}
              alt="Trip cover preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUploadClick}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full cursor-pointer"
            onClick={handleUploadClick}
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Icon name="Camera" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              Add a cover photo
            </p>
            <p className="text-xs text-muted-foreground text-center px-4">
              Drag and drop or click to select from your device
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-error flex items-center">
          <Icon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default TripCoverUpload;