import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = () => {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  const handleJoinTrip = () => {
    navigate('/join-trip');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Icon name="Camera" size={32} color="white" />
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center animate-bounce">
          <Icon name="Users" size={16} className="text-accent" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center animate-pulse">
          <Icon name="Image" size={12} className="text-primary" />
        </div>
      </div>

      {/* Content */}
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Start Your First Trip
      </h2>
      
      <p className="text-muted-foreground text-base mb-8 max-w-sm leading-relaxed">
        Create a trip to start collecting and sharing memories with your friends, or join an existing trip with an invite code.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          onClick={handleCreateTrip}
          className="flex-1"
          iconName="Plus"
          iconPosition="left"
        >
          Create Trip
        </Button>
        
        <Button
          variant="outline"
          onClick={handleJoinTrip}
          className="flex-1"
          iconName="UserPlus"
          iconPosition="left"
        >
          Join Trip
        </Button>
      </div>

      {/* Features List */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Upload" size={20} className="text-primary" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Upload & Share</h3>
          <p className="text-sm text-muted-foreground">
            Share photos and videos in original quality
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Shield" size={20} className="text-accent" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Private & Secure</h3>
          <p className="text-sm text-muted-foreground">
            Only trip members can access your content
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-3">
            <Icon name="Smartphone" size={20} className="text-warning" />
          </div>
          <h3 className="font-medium text-foreground mb-1">Mobile First</h3>
          <p className="text-sm text-muted-foreground">
            Optimized for all your devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;