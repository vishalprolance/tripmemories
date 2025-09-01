import React, { useState, useRef, useEffect } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MediaDisplay = ({ 
  media, 
  onPrevious, 
  onNext, 
  onToggleUI,
  showUI,
  className = '' 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const containerRef = useRef(null);
  const mediaRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef(0);

  useEffect(() => {
    // Reset zoom and pan when media changes
    setIsZoomed(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setIsLoading(true);
    setLoadProgress(0);
  }, [media?.id]);

  const handleMediaLoad = () => {
    setIsLoading(false);
    setLoadProgress(100);
  };

  const handleMediaProgress = (e) => {
    if (e?.lengthComputable) {
      const progress = (e?.loaded / e?.total) * 100;
      setLoadProgress(progress);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e?.touches?.[0];
    touchStartRef.current = {
      x: touch?.clientX,
      y: touch?.clientY,
      time: Date.now()
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e?.changedTouches?.[0];
    const deltaX = touch?.clientX - touchStartRef?.current?.x;
    const deltaY = touch?.clientY - touchStartRef?.current?.y;
    const deltaTime = Date.now() - touchStartRef?.current?.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Single tap detection
    if (distance < 10 && deltaTime < 300) {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef?.current;
      
      if (timeSinceLastTap < 300) {
        // Double tap - zoom
        handleDoubleTab();
      } else {
        // Single tap - toggle UI
        onToggleUI();
      }
      
      lastTapRef.current = now;
    }
    // Swipe detection
    else if (distance > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && onPrevious) {
        onPrevious();
      } else if (deltaX < 0 && onNext) {
        onNext();
      }
    }
  };

  const handleDoubleTab = () => {
    if (media?.type !== 'image') return;
    
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  const handleWheel = (e) => {
    if (media?.type !== 'image') return;
    
    e?.preventDefault();
    const delta = e?.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(1, Math.min(4, zoomLevel + delta));
    
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
    
    if (newZoom === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  const renderMedia = () => {
    if (media?.type === 'video') {
      return (
        <video
          ref={mediaRef}
          src={media?.url}
          controls
          className="max-w-full max-h-full object-contain"
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={handleMediaLoad}
          onProgress={handleMediaProgress}
          preload="metadata"
          playsInline
        >Your browser does not support video playback.
                  </video>
      );
    }

    return (
      <Image
        ref={mediaRef}
        src={media?.url}
        alt={media?.caption || `Photo by ${media?.uploader?.name}`}
        className="max-w-full max-h-full object-contain transition-transform duration-200 ease-smooth"
        style={{
          transform: `scale(${zoomLevel}) translate(${panPosition?.x}px, ${panPosition?.y}px)`,
          cursor: isZoomed ? 'grab' : 'zoom-in'
        }}
        onLoad={handleMediaLoad}
        onProgress={handleMediaProgress}
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black flex items-center justify-center overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center space-y-4">
            <Icon name="Loader2" size={32} color="white" className="animate-spin" />
            <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-white text-sm">
              {media?.type === 'video' ? 'Loading video...' : 'Loading image...'}
            </span>
          </div>
        </div>
      )}
      {/* Media Content */}
      <div className="w-full h-full flex items-center justify-center">
        {renderMedia()}
      </div>
      {/* Navigation Arrows - Desktop */}
      {showUI && (
        <>
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hidden md:flex"
              aria-label="Previous media"
            >
              <Icon name="ChevronLeft" size={24} color="white" />
            </button>
          )}
          
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hidden md:flex"
              aria-label="Next media"
            >
              <Icon name="ChevronRight" size={24} color="white" />
            </button>
          )}
        </>
      )}
      {/* Zoom Controls - Desktop */}
      {showUI && media?.type === 'image' && (
        <div className="absolute bottom-4 right-4 flex space-x-2 hidden md:flex">
          <button
            onClick={() => {
              const newZoom = Math.max(1, zoomLevel - 0.5);
              setZoomLevel(newZoom);
              setIsZoomed(newZoom > 1);
              if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
            }}
            disabled={zoomLevel <= 1}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 disabled:opacity-50 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Zoom out"
          >
            <Icon name="Minus" size={16} color="white" />
          </button>
          
          <div className="px-3 py-2 bg-black/50 rounded-full text-white text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </div>
          
          <button
            onClick={() => {
              const newZoom = Math.min(4, zoomLevel + 0.5);
              setZoomLevel(newZoom);
              setIsZoomed(newZoom > 1);
            }}
            disabled={zoomLevel >= 4}
            className="w-10 h-10 bg-black/50 hover:bg-black/70 disabled:opacity-50 rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Zoom in"
          >
            <Icon name="Plus" size={16} color="white" />
          </button>
        </div>
      )}
      {/* Touch Instructions */}
      {!isLoading && showUI && (
        <div className="absolute bottom-4 left-4 text-white/70 text-xs md:hidden">
          <div className="flex items-center space-x-4">
            <span>Tap to hide UI</span>
            {media?.type === 'image' && <span>Double-tap to zoom</span>}
            <span>Swipe to navigate</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;