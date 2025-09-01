import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ className = '' }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'create',
      label: 'Create Trip',
      icon: 'Plus',
      description: 'Start a new trip',
      color: 'bg-primary',
      textColor: 'text-white',
      onClick: () => navigate('/create-trip')
    },
    {
      id: 'join',
      label: 'Join Trip',
      icon: 'UserPlus',
      description: 'Use invite code',
      color: 'bg-accent',
      textColor: 'text-white',
      onClick: () => navigate('/join-trip')
    },
    {
      id: 'upload',
      label: 'Quick Upload',
      icon: 'Upload',
      description: 'Add to recent trip',
      color: 'bg-warning',
      textColor: 'text-white',
      onClick: () => navigate('/upload-media')
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {quickActions?.map((action) => (
        <Button
          key={action?.id}
          variant="ghost"
          onClick={action?.onClick}
          className={`${action?.color} ${action?.textColor} hover:opacity-90 h-auto p-4 flex-col space-y-2 group transition-all duration-200 hover:scale-105`}
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <Icon name={action?.icon} size={24} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm">{action?.label}</div>
            <div className="text-xs opacity-80">{action?.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;