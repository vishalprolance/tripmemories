import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RecentActivity = ({ activities = [], className = '' }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return 'Upload';
      case 'join': return 'UserPlus';
      case 'create': return 'Plus';
      case 'comment': return 'MessageCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'upload': return 'text-primary';
      case 'join': return 'text-accent';
      case 'create': return 'text-success';
      case 'comment': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  if (!activities || activities?.length === 0) {
    return (
      <div className={`bg-card border border-border rounded-xl p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Activity" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="font-medium text-card-foreground mb-2">No Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Activity from your trips will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground">Recent Activity</h3>
          <Icon name="Activity" size={18} className="text-muted-foreground" />
        </div>
      </div>
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {activities?.map((activity, index) => (
          <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start space-x-3">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={activity?.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activity?.user?.name}`}
                  alt={activity?.user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={getActivityIcon(activity?.type)} 
                    size={14} 
                    className={getActivityColor(activity?.type)}
                  />
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {activity?.user?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity?.description}
                </p>
                
                {/* Trip Context */}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Icon name="MapPin" size={12} className="mr-1" />
                  <span className="truncate">{activity?.tripName}</span>
                </div>
              </div>
              
              {/* Activity Media Preview */}
              {activity?.mediaPreview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={activity?.mediaPreview}
                    alt="Activity preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;