import React from 'react';
import Icon from '../../../components/AppIcon';

const JoinMethodTabs = ({ activeMethod, onMethodChange }) => {
  const methods = [
    {
      id: 'qr',
      label: 'QR Code',
      icon: 'QrCode',
      description: 'Scan QR code'
    },
    {
      id: 'code',
      label: 'Trip Code',
      icon: 'Hash',
      description: 'Enter code manually'
    },
    {
      id: 'link',
      label: 'Invite Link',
      icon: 'Link',
      description: 'Paste invite URL'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex bg-muted rounded-lg p-1">
        {methods?.map((method) => (
          <button
            key={method?.id}
            onClick={() => onMethodChange(method?.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-md transition-all duration-200 ${
              activeMethod === method?.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-pressed={activeMethod === method?.id}
          >
            <Icon 
              name={method?.icon} 
              size={20} 
              className={`mb-1 ${
                activeMethod === method?.id ? 'text-primary' : ''
              }`}
            />
            <span className="text-xs font-medium">{method?.label}</span>
            <span className="text-xs opacity-75 hidden sm:block">
              {method?.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default JoinMethodTabs;