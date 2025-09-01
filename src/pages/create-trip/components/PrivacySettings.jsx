import React from 'react';
import Icon from '../../../components/AppIcon';

const PrivacySettings = ({ privacyMode, onPrivacyChange }) => {
  const privacyOptions = [
    {
      value: 'private',
      label: 'Private',
      description: 'Only invited members can join and view content',
      icon: 'Lock'
    },
    {
      value: 'invite-only',
      label: 'Invite Only',
      description: 'Members can invite others, but content remains private',
      icon: 'UserPlus'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Privacy Settings
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Choose who can access your trip photos and videos
        </p>
      </div>
      <div className="space-y-3">
        {privacyOptions?.map((option) => (
          <div
            key={option?.value}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              privacyMode === option?.value
                ? 'border-primary bg-primary/5' :'border-border bg-background hover:border-primary/50'
            }`}
            onClick={() => onPrivacyChange(option?.value)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                privacyMode === option?.value
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {privacyMode === option?.value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={option?.icon} 
                    size={16} 
                    className={privacyMode === option?.value ? 'text-primary' : 'text-muted-foreground'} 
                  />
                  <span className="text-sm font-medium text-foreground">
                    {option?.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {option?.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacySettings;