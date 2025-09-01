import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const ContextualHeader = ({ 
  title = '',
  showBack = false,
  actions = [],
  className = '',
  tripContext = null
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const getPageTitle = () => {
    if (title) return title;
    
    switch (location?.pathname) {
      case '/trip-dashboard':
        return 'My Trips';
      case '/create-trip':
        return 'Create Trip';
      case '/join-trip':
        return 'Join Trip';
      case '/trip-gallery':
        return tripContext?.name || 'Trip Gallery';
      case '/media-viewer':
        return 'Media Viewer';
      case '/upload-media':
        return 'Upload Media';
      default:
        return 'TripMemories';
    }
  };

  const getContextualActions = () => {
    if (actions?.length > 0) return actions;
    
    switch (location?.pathname) {
      case '/trip-dashboard':
        return [
          { icon: 'Search', label: 'Search', onClick: () => {} },
          { icon: 'Plus', label: 'Create Trip', onClick: () => navigate('/create-trip') }
        ];
      case '/trip-gallery':
        return [
          { icon: 'Search', label: 'Search', onClick: () => {} },
          { icon: 'Users', label: 'Members', onClick: () => {} },
          { icon: 'Settings', label: 'Settings', onClick: () => {} }
        ];
      case '/media-viewer':
        return [
          { icon: 'Share', label: 'Share', onClick: () => {} },
          { icon: 'Download', label: 'Download', onClick: () => {} },
          { icon: 'MoreHorizontal', label: 'More', onClick: () => setShowMenu(!showMenu) }
        ];
      default:
        return [];
    }
  };

  const contextualActions = getContextualActions();
  const pageTitle = getPageTitle();

  return (
    <header 
      className={`sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border safe-area-top z-header ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between h-14 px-4 pt-safe-top">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9"
              aria-label="Go back"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Camera" size={18} color="white" />
              </div>
              <span className="font-semibold text-lg text-foreground hidden sm:block">
                TripMemories
              </span>
            </div>
          )}
        </div>

        {/* Center Section - Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {pageTitle}
          </h1>
          {tripContext && (
            <p className="text-xs text-muted-foreground truncate">
              {tripContext?.memberCount} members
            </p>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-1">
          {contextualActions?.slice(0, 2)?.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={action?.onClick}
              className="h-9 w-9"
              aria-label={action?.label}
            >
              <Icon name={action?.icon} size={20} />
            </Button>
          ))}
          
          {contextualActions?.length > 2 && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(!showMenu)}
                className="h-9 w-9"
                aria-label="More options"
                aria-expanded={showMenu}
              >
                <Icon name="MoreVertical" size={20} />
              </Button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevation-3 animate-scale-in z-contextual-menu">
                  {contextualActions?.slice(2)?.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action?.onClick();
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <Icon name={action?.icon} size={16} className="mr-3" />
                      {action?.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Trip Context Bar */}
      {tripContext && location?.pathname === '/trip-gallery' && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span>{tripContext?.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="Calendar" size={14} />
              <span>{tripContext?.dates}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ContextualHeader;