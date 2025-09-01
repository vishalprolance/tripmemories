import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  threshold = 80,
  className = '' 
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef();
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      setCanPull(true);
      startY.current = e?.touches?.[0]?.clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (!canPull || isRefreshing) return;

    currentY.current = e?.touches?.[0]?.clientY;
    const distance = Math.max(0, currentY?.current - startY?.current);
    
    if (distance > 0 && window.scrollY === 0) {
      e?.preventDefault();
      setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh?.();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setCanPull(false);
  };

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    container?.addEventListener('touchstart', handleTouchStart, { passive: false });
    container?.addEventListener('touchmove', handleTouchMove, { passive: false });
    container?.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canPull, isRefreshing, pullDistance, threshold]);

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out z-50"
        style={{
          transform: `translateY(${Math.max(-60, pullDistance - 60)}px)`,
          opacity: pullDistance > 20 ? 1 : 0
        }}
      >
        <div className="bg-background border border-border rounded-full p-3 shadow-elevation-2">
          {isRefreshing ? (
            <Icon 
              name="Loader2" 
              size={20} 
              className="text-primary animate-spin" 
            />
          ) : (
            <Icon 
              name="ArrowDown" 
              size={20} 
              className={`text-primary transition-transform duration-200 ${
                shouldTrigger ? 'rotate-180' : ''
              }`}
              style={{
                transform: `rotate(${shouldTrigger ? 180 : refreshProgress * 180}deg)`
              }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;