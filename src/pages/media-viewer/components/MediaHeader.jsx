import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MediaHeader = ({ 
  currentIndex, 
  totalCount, 
  onDownload, 
  onShare, 
  onDelete,
  canDelete = false,
  showUI = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/trip-gallery');
  };

  if (!showUI) return null;

  return (
    <header 
      className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pt-safe-top z-20 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10 text-white hover:bg-white/20"
          aria-label="Back to gallery"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>

        {/* Center Section - Counter */}
        <div className="flex-1 text-center">
          <div className="inline-flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
            <Icon name="Image" size={16} color="white" />
            <span className="text-white font-medium text-sm">
              {currentIndex} of {totalCount}
            </span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1">
          {/* Share Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="h-10 w-10 text-white hover:bg-white/20"
            aria-label="Share media"
          >
            <Icon name="Share" size={18} />
          </Button>

          {/* Download Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDownload}
            className="h-10 w-10 text-white hover:bg-white/20"
            aria-label="Download media"
          >
            <Icon name="Download" size={18} />
          </Button>

          {/* Delete Button - Only if user has permission */}
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-10 w-10 text-white hover:bg-red-500/20"
              aria-label="Delete media"
            >
              <Icon name="Trash2" size={18} />
            </Button>
          )}

          {/* More Options */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-white hover:bg-white/20"
            aria-label="More options"
          >
            <Icon name="MoreVertical" size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MediaHeader;