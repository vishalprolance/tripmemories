import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MemberAvatars = ({ 
  members = [], 
  maxVisible = 4, 
  size = 'sm',
  onMemberClick,
  className = '' 
}) => {
  const visibleMembers = members?.slice(0, maxVisible);
  const remainingCount = Math.max(0, members?.length - maxVisible);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-1">
        {visibleMembers?.map((member, index) => (
          <button
            key={member?.id}
            onClick={() => onMemberClick?.(member)}
            className={`${sizeClasses?.[size]} rounded-full border-2 border-background overflow-hidden hover:scale-110 transition-transform duration-200 relative z-${10 - index}`}
            style={{ zIndex: 10 - index }}
            aria-label={`View ${member?.name}'s profile`}
          >
            <Image
              src={member?.avatar}
              alt={member?.name}
              className="w-full h-full object-cover"
            />
            
            {/* Online Status Indicator */}
            {member?.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-background rounded-full" />
            )}
            
            {/* Admin Badge */}
            {member?.role === 'admin' && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-warning border border-background rounded-full flex items-center justify-center">
                <Icon name="Crown" size={8} color="white" />
              </div>
            )}
          </button>
        ))}

        {/* Remaining Count */}
        {remainingCount > 0 && (
          <div className={`${sizeClasses?.[size]} rounded-full border-2 border-background bg-muted flex items-center justify-center`}>
            <span className={`${textSizeClasses?.[size]} font-semibold text-muted-foreground`}>
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
      {/* Member Count Text */}
      <span className="ml-3 text-sm text-muted-foreground">
        {members?.length} {members?.length === 1 ? 'member' : 'members'}
      </span>
    </div>
  );
};

export default MemberAvatars;