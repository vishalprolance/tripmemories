import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useTripContext } from './TripContextProvider';

const MediaUploadFAB = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTrip, updateMediaCount } = useTripContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Show FAB on gallery and dashboard pages
  const shouldShow = ['/trip-gallery', '/trip-dashboard']?.includes(location?.pathname) && activeTrip;

  const handleFABClick = () => {
    if (location?.pathname === '/trip-gallery') {
      // Quick upload from gallery
      fileInputRef?.current?.click();
    } else {
      // Navigate to upload page from dashboard
      navigate('/upload-media');
    }
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event?.target?.files);
    if (files?.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Update media count in trip context
      updateMediaCount(activeTrip?.id, files?.length);

      // Reset state
      setUploadProgress(0);
      setIsUploading(false);
      
      // Clear file input
      event.target.value = '';
      
      // Show success feedback (could be a toast notification)
      console.log(`Successfully uploaded ${files?.length} files`);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />
      {/* Floating Action Button */}
      <div 
        className={`fixed bottom-20 right-4 z-upload-fab ${className}`}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Button
          onClick={handleFABClick}
          disabled={isUploading}
          className={`h-14 w-14 rounded-full shadow-elevation-3 transition-all duration-200 ease-smooth hover:shadow-elevation-4 hover:scale-105 ${
            isUploading ? 'bg-muted' : 'bg-primary hover:bg-primary/90'
          }`}
          aria-label={location?.pathname === '/trip-gallery' ? 'Quick upload media' : 'Go to upload page'}
        >
          {isUploading ? (
            <div className="relative">
              <Icon name="Loader2" size={24} color="white" className="animate-spin" />
              <div 
                className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white"
                style={{
                  transform: `rotate(${uploadProgress * 3.6}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
          ) : (
            <Icon 
              name={location?.pathname === '/trip-gallery' ? 'Camera' : 'Plus'} 
              size={24} 
              color="white" 
            />
          )}
        </Button>

        {/* Upload Progress Indicator */}
        {isUploading && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-1 shadow-elevation-2 animate-scale-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-medium text-popover-foreground">
                Uploading... {uploadProgress}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MediaUploadFAB;