import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TripCard = ({ trip, onManage }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    navigate('/trip-gallery', { state: { tripId: trip?.id } });
  };

  const handleLongPress = (e) => {
    e?.preventDefault();
    setShowMenu(true);
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    onManage(trip?.id, action);
  };

  const formatMemberCount = (count) => {
    return count === 1 ? '1 member' : `${count} members`;
  };

  const getActivityText = (activity) => {
    if (!activity) return 'No recent activity';
    
    const timeAgo = Math.floor((Date.now() - new Date(activity.timestamp)?.getTime()) / (1000 * 60 * 60));
    if (timeAgo < 1) return 'Active now';
    if (timeAgo < 24) return `${timeAgo}h ago`;
    return `${Math.floor(timeAgo / 24)}d ago`;
  };

  return (
    <div className="relative">
      <div
        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
        onClick={handleCardClick}
        onContextMenu={handleLongPress}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e?.key === 'Enter' || e?.key === ' ') {
            e?.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`Open ${trip?.name} trip`}
      >
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={trip?.coverImage || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop`}
            alt={`${trip?.name} cover`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Activity Badge */}
          {trip?.hasNewActivity && (
            <div className="absolute top-3 right-3 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />
          )}
          
          {/* Member Avatars Overlay */}
          <div className="absolute bottom-3 left-3 flex -space-x-2">
            {trip?.members?.slice(0, 3)?.map((member, index) => (
              <div
                key={member?.id}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-muted"
                style={{ zIndex: 10 - index }}
              >
                <Image
                  src={member?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member?.name}`}
                  alt={member?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {trip?.memberCount > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  +{trip?.memberCount - 3}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-card-foreground text-lg truncate flex-1 mr-2">
              {trip?.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e?.stopPropagation();
                setShowMenu(true);
              }}
              aria-label="Trip options"
            >
              <Icon name="MoreVertical" size={16} />
            </Button>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span className="truncate">{trip?.location}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Icon name="Users" size={14} className="mr-1" />
              <span>{formatMemberCount(trip?.memberCount)}</span>
            </div>
            
            <div className="flex items-center text-muted-foreground">
              <Icon name="Image" size={14} className="mr-1" />
              <span>{trip?.mediaCount || 0}</span>
            </div>
          </div>

          {trip?.recentActivity && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full mr-2" />
                <span>{getActivityText(trip?.recentActivity)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Context Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-popover border border-border rounded-lg shadow-elevation-3 min-w-48 animate-scale-in">
            <div className="py-2">
              <button
                onClick={() => handleMenuAction('view')}
                className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Eye" size={16} className="mr-3" />
                View Trip
              </button>
              <button
                onClick={() => handleMenuAction('edit')}
                className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="Edit" size={16} className="mr-3" />
                Edit Details
              </button>
              <button
                onClick={() => handleMenuAction('invite')}
                className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
              >
                <Icon name="UserPlus" size={16} className="mr-3" />
                Invite Members
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => handleMenuAction('leave')}
                className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Icon name="LogOut" size={16} className="mr-3" />
                Leave Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;