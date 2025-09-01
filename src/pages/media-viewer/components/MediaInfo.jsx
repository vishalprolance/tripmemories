import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MediaInfo = ({ 
  media, 
  showUI = true,
  className = '' 
}) => {
  const [showMetadata, setShowMetadata] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showUI) return null;

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-safe-bottom z-20 ${className}`}>
      {/* Main Info */}
      <div className="flex items-start space-x-3 mb-4">
        {/* Uploader Avatar */}
        <Image
          src={media?.uploader?.avatar}
          alt={media?.uploader?.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        {/* Media Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-white font-medium text-sm">
              {media?.uploader?.name}
            </span>
            <span className="text-white/60 text-xs">
              {formatDate(media?.uploadedAt)}
            </span>
          </div>
          
          {media?.caption && (
            <p className="text-white/90 text-sm leading-relaxed mb-2">
              {media?.caption}
            </p>
          )}

          {media?.location && (
            <div className="flex items-center space-x-1 text-white/70 text-xs">
              <Icon name="MapPin" size={12} />
              <span>{media?.location}</span>
            </div>
          )}
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
            aria-label="Like media"
          >
            <Icon name="Heart" size={16} />
            <span className="text-xs">{media?.likes || 0}</span>
          </button>
          
          <button
            className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
            aria-label="Comment on media"
          >
            <Icon name="MessageCircle" size={16} />
            <span className="text-xs">{media?.comments?.length || 0}</span>
          </button>
        </div>
      </div>
      {/* Metadata Toggle */}
      <div className="border-t border-white/20 pt-3">
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="flex items-center justify-between w-full text-white/70 hover:text-white transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={14} />
            <span className="text-xs font-medium">Media Details</span>
          </div>
          <Icon 
            name={showMetadata ? "ChevronUp" : "ChevronDown"} 
            size={14} 
            className="transition-transform duration-200"
          />
        </button>

        {/* Expanded Metadata */}
        {showMetadata && (
          <div className="mt-3 space-y-2 animate-slide-up">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/50 block">File Size</span>
                <span className="text-white">{formatFileSize(media?.fileSize)}</span>
              </div>
              <div>
                <span className="text-white/50 block">Dimensions</span>
                <span className="text-white">{media?.width} × {media?.height}</span>
              </div>
              {media?.type === 'image' && media?.exif && (
                <>
                  <div>
                    <span className="text-white/50 block">Camera</span>
                    <span className="text-white">{media?.exif?.camera || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Settings</span>
                    <span className="text-white">
                      {media?.exif?.aperture && `f/${media?.exif?.aperture}`}
                      {media?.exif?.shutterSpeed && ` • ${media?.exif?.shutterSpeed}s`}
                      {media?.exif?.iso && ` • ISO ${media?.exif?.iso}`}
                    </span>
                  </div>
                </>
              )}
              {media?.type === 'video' && (
                <>
                  <div>
                    <span className="text-white/50 block">Duration</span>
                    <span className="text-white">{media?.duration || '0:00'}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Format</span>
                    <span className="text-white">{media?.format || 'MP4'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaInfo;