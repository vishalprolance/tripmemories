import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MediaGrid = ({ 
  mediaItems = [], 
  loading = false, 
  onLoadMore, 
  hasMore = true,
  selectedFilter = 'all',
  onMediaSelect,
  selectedMedia = []
}) => {
  const navigate = useNavigate();
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef();
  const lastMediaRef = useRef();

  // Infinite scroll observer
  const lastMediaElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef?.current) observerRef?.current?.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        onLoadMore?.().finally(() => setLoadingMore(false));
      }
    });
    if (node) observerRef?.current?.observe(node);
  }, [loading, hasMore, loadingMore, onLoadMore]);

  const handleMediaClick = (media, index) => {
    if (selectedMedia?.length > 0) {
      // Selection mode - toggle selection
      onMediaSelect?.(media);
    } else {
      // Normal mode - open media viewer
      navigate('/media-viewer', { 
        state: { 
          mediaId: media?.id, 
          mediaList: mediaItems,
          currentIndex: index 
        } 
      });
    }
  };

  const handleLongPress = (media) => {
    onMediaSelect?.(media);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date?.toLocaleDateString();
  };

  const isSelected = (media) => {
    return selectedMedia?.some(item => item?.id === media?.id);
  };

  // Group media by date
  const groupedMedia = mediaItems?.reduce((groups, media) => {
    const date = new Date(media.timestamp)?.toDateString();
    if (!groups?.[date]) {
      groups[date] = [];
    }
    groups?.[date]?.push(media);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMedia)?.sort((a, b) => new Date(b) - new Date(a));

  if (loading && mediaItems?.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
        {Array.from({ length: 12 })?.map((_, index) => (
          <div key={index} className="aspect-square bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (mediaItems?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Images" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No photos yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Start capturing memories by uploading your first photos and videos
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {sortedDates?.map((date, dateIndex) => (
        <div key={date} className="mb-6">
          {/* Date Header */}
          <div className="sticky top-14 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 mb-3 z-10">
            <h3 className="text-sm font-semibold text-foreground">
              {formatTimestamp(new Date(date))}
            </h3>
            <p className="text-xs text-muted-foreground">
              {groupedMedia?.[date]?.length} {groupedMedia?.[date]?.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 px-4">
            {groupedMedia?.[date]?.map((media, mediaIndex) => {
              const globalIndex = sortedDates?.slice(0, dateIndex)?.reduce((acc, d) => acc + groupedMedia?.[d]?.length, 0) + mediaIndex;
              const isLastItem = dateIndex === sortedDates?.length - 1 && mediaIndex === groupedMedia?.[date]?.length - 1;
              
              return (
                <div
                  key={media?.id}
                  ref={isLastItem ? lastMediaElementRef : null}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 ${
                    isSelected(media) 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' :'hover:scale-105'
                  }`}
                  onClick={() => handleMediaClick(media, globalIndex)}
                  onContextMenu={(e) => {
                    e?.preventDefault();
                    handleLongPress(media);
                  }}
                  onTouchStart={(e) => {
                    const touchStartTime = Date.now();
                    const touchTimer = setTimeout(() => {
                      handleLongPress(media);
                    }, 500);
                    
                    const handleTouchEnd = () => {
                      clearTimeout(touchTimer);
                      document.removeEventListener('touchend', handleTouchEnd);
                    };
                    
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                >
                  {/* Media Thumbnail */}
                  <Image
                    src={media?.thumbnailUrl}
                    alt={`Media by ${media?.uploader?.name}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Video Indicator */}
                  {media?.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                        <Icon name="Play" size={16} color="white" />
                      </div>
                    </div>
                  )}
                  {/* Selection Indicator */}
                  {selectedMedia?.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected(media)
                          ? 'bg-primary border-primary' :'bg-black/20 border-white'
                      }`}>
                        {isSelected(media) && (
                          <Icon name="Check" size={14} color="white" />
                        )}
                      </div>
                    </div>
                  )}
                  {/* Uploader Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={media?.uploader?.avatar}
                        alt={media?.uploader?.name}
                        className="w-5 h-5 rounded-full border border-white/20"
                      />
                      <span className="text-white text-xs font-medium truncate">
                        {media?.uploader?.name}
                      </span>
                    </div>
                  </div>
                  {/* Metadata Overlay (Desktop) */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                    <div className="flex items-center space-x-1">
                      {media?.location && (
                        <div className="bg-black/50 rounded px-1.5 py-0.5">
                          <Icon name="MapPin" size={10} color="white" />
                        </div>
                      )}
                      {media?.isNew && (
                        <div className="bg-primary rounded px-1.5 py-0.5">
                          <span className="text-white text-xs font-medium">New</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}
      {/* End of Content */}
      {!hasMore && mediaItems?.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            You've reached the end of your memories
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;