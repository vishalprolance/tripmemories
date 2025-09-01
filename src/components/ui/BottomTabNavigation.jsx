import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomTabNavigation = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Trips',
      path: '/trip-dashboard',
      icon: 'Home',
      activeIcon: 'Home'
    },
    {
      label: 'Gallery',
      path: '/trip-gallery',
      icon: 'Images',
      activeIcon: 'Images'
    },
    {
      label: 'Upload',
      path: '/upload-media',
      icon: 'Plus',
      activeIcon: 'Plus'
    },
    {
      label: 'Join',
      path: '/join-trip',
      icon: 'UserPlus',
      activeIcon: 'UserPlus'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-bottom z-bottom-nav ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-4 py-2 pb-safe-bottom">
        {navigationItems?.map((item) => {
          const active = isActive(item?.path);
          
          return (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex flex-col items-center justify-center min-h-[44px] px-3 py-2 rounded-lg transition-all duration-200 ease-smooth ${
                active 
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={`Navigate to ${item?.label}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon 
                name={active ? item?.activeIcon : item?.icon} 
                size={20} 
                className="mb-1"
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-xs font-medium ${active ? 'font-semibold' : ''}`}>
                {item?.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNavigation;