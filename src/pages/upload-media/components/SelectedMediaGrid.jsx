import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SelectedMediaGrid = ({ files, onRemoveFile, className = '' }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const isVideo = (file) => file?.type?.startsWith('video/');

  if (files?.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Selected Media ({files?.length})
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={() => files?.forEach((_, index) => onRemoveFile(index))}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files?.map((file, index) => (
          <div
            key={`${file?.name}-${index}`}
            className="relative group bg-card border border-border rounded-lg overflow-hidden"
          >
            {/* Media Preview */}
            <div className="aspect-square relative bg-muted">
              {isVideo(file) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="p-4 bg-background/80 rounded-full">
                    <Icon name="Play" size={24} className="text-foreground" />
                  </div>
                </div>
              ) : (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file?.name}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* File Type Badge */}
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium text-foreground">
                  {isVideo(file) ? 'VIDEO' : 'PHOTO'}
                </div>
              </div>
              
              {/* Remove Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  iconName="X"
                  onClick={() => onRemoveFile(index)}
                  className="h-6 w-6 rounded-full"
                  aria-label={`Remove ${file?.name}`}
                />
              </div>
            </div>
            
            {/* File Info */}
            <div className="p-2 space-y-1">
              <p className="text-xs font-medium text-foreground truncate" title={file?.name}>
                {file?.name}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(file?.size)}</span>
                {isVideo(file) && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>--:--</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div className="text-sm">
          <span className="font-medium text-foreground">
            {files?.length} files selected
          </span>
          <span className="text-muted-foreground ml-2">
            ({formatFileSize(files?.reduce((total, file) => total + file?.size, 0))})
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Shield" size={14} />
          <span>Original quality preserved</span>
        </div>
      </div>
    </div>
  );
};

export default SelectedMediaGrid;