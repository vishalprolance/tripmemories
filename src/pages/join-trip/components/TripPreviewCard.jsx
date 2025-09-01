import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TripPreviewCard = ({ tripData, onJoinConfirm, onCancel, isJoining }) => {
  if (!tripData) return null;

  const {
    name,
    location,
    dates,
    memberCount,
    coverImage,
    adminName,
    adminAvatar,
    description,
    isPrivate = true
  } = tripData;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-2 animate-scale-in">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={coverImage}
          alt={`${name} cover photo`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Privacy Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Icon name={isPrivate ? 'Lock' : 'Globe'} size={12} className="mr-1" />
            {isPrivate ? 'Private' : 'Public'}
          </div>
        </div>
        
        {/* Trip Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-white font-bold text-xl mb-1 drop-shadow-lg">
            {name}
          </h2>
          <div className="flex items-center text-white/90 text-sm">
            <Icon name="MapPin" size={14} className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="Calendar" size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dates</p>
              <p className="text-sm font-medium text-card-foreground">{dates}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
              <Icon name="Users" size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-medium text-card-foreground">
                {memberCount} {memberCount === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        </div>

        {/* Trip Admin */}
        <div className="flex items-center mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="relative">
            <Image
              src={adminAvatar}
              alt={`${adminName} avatar`}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Crown" size={10} color="white" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-card-foreground">{adminName}</p>
            <p className="text-xs text-muted-foreground">Trip Organizer</p>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isJoining}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onJoinConfirm}
            loading={isJoining}
            disabled={isJoining}
            className="flex-1"
          >
            {isJoining ? 'Joining...' : 'Join Trip'}
          </Button>
        </div>

        {/* Join Benefits */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">What you'll get:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Upload" size={12} className="mr-2 text-primary" />
              Upload photos &amp; videos
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Download" size={12} className="mr-2 text-primary" />
              Download all media
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Eye" size={12} className="mr-2 text-primary" />
              View trip gallery
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="MessageCircle" size={12} className="mr-2 text-primary" />
              Chat with members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPreviewCard;