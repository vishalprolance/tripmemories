import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import MediaUploadFAB from '../../components/ui/MediaUploadFAB';
import { useTripContext } from '../../components/ui/TripContextProvider';
import MediaGrid from './components/MediaGrid';
import FilterChips from './components/FilterChips';
import SelectionToolbar from './components/SelectionToolbar';
import MemberAvatars from './components/MemberAvatars';
import PullToRefresh from './components/PullToRefresh';
import EmptyGalleryState from './components/EmptyGalleryState';

const TripGallery = () => {
  const location = useLocation();
  const { activeTrip, updateMediaCount } = useTripContext();
  
  // State management
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock media data
  const mockMediaData = [
    {
      id: '1',
      type: 'photo',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      uploader: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        isOnline: true,
        role: 'admin'
      },
      timestamp: new Date('2025-08-20T14:30:00'),
      location: 'Malibu Beach, CA',
      isNew: true,
      isFavorite: false
    },
    {
      id: '2',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
      uploader: {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        isOnline: false,
        role: 'member'
      },
      timestamp: new Date('2025-08-20T12:15:00'),
      location: 'Malibu Beach, CA',
      isNew: true,
      isFavorite: true
    },
    {
      id: '3',
      type: 'photo',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
      uploader: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        isOnline: true,
        role: 'member'
      },
      timestamp: new Date('2025-08-20T10:45:00'),
      location: 'Malibu Beach, CA',
      isNew: false,
      isFavorite: false
    },
    {
      id: '4',
      type: 'photo',
      thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
      uploader: {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        isOnline: false,
        role: 'member'
      },
      timestamp: new Date('2025-08-19T16:20:00'),
      location: 'Santa Monica Pier, CA',
      isNew: false,
      isFavorite: true
    },
    {
      id: '5',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=1200&h=800&fit=crop',
      uploader: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        isOnline: true,
        role: 'admin'
      },
      timestamp: new Date('2025-08-19T14:10:00'),
      location: 'Santa Monica Pier, CA',
      isNew: false,
      isFavorite: false
    },
    {
      id: '6',
      type: 'photo',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=400&h=400&fit=crop',
      fullUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1200&h=800&fit=crop',
      uploader: {
        id: '5',
        name: 'David Kim',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        isOnline: true,
        role: 'member'
      },
      timestamp: new Date('2025-08-19T11:30:00'),
      location: 'Venice Beach, CA',
      isNew: false,
      isFavorite: true
    }
  ];

  // Initialize media data
  useEffect(() => {
    const loadInitialMedia = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMediaItems(mockMediaData);
      setLoading(false);
    };

    loadInitialMedia();
  }, []);

  // Filter media based on selected filter
  const filteredMedia = mediaItems?.filter(item => {
    switch (selectedFilter) {
      case 'photos':
        return item?.type === 'photo';
      case 'videos':
        return item?.type === 'video';
      case 'recent':
        const twoDaysAgo = new Date();
        twoDaysAgo?.setDate(twoDaysAgo?.getDate() - 2);
        return item?.timestamp > twoDaysAgo;
      case 'favorites':
        return item?.isFavorite;
      default:
        return true;
    }
  });

  // Calculate media statistics
  const mediaStats = {
    total: mediaItems?.length,
    photos: mediaItems?.filter(item => item?.type === 'photo')?.length,
    videos: mediaItems?.filter(item => item?.type === 'video')?.length,
    recent: mediaItems?.filter(item => {
      const twoDaysAgo = new Date();
      twoDaysAgo?.setDate(twoDaysAgo?.getDate() - 2);
      return item?.timestamp > twoDaysAgo;
    })?.length,
    favorites: mediaItems?.filter(item => item?.isFavorite)?.length
  };

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    setSelectedMedia([]); // Clear selection when changing filters
  };

  // Handle media selection
  const handleMediaSelect = (media) => {
    setSelectedMedia(prev => {
      const isSelected = prev?.some(item => item?.id === media?.id);
      if (isSelected) {
        return prev?.filter(item => item?.id !== media?.id);
      } else {
        return [...prev, media];
      }
    });
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedMedia([]);
  };

  // Handle bulk actions
  const handleDownload = async () => {
    console.log('Downloading', selectedMedia?.length, 'items');
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSelectedMedia([]);
  };

  const handleShare = async () => {
    console.log('Sharing', selectedMedia?.length, 'items');
    // Simulate share process
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedMedia?.length} photos from ${activeTrip?.name}`,
          text: 'Check out these amazing memories from our trip!',
          url: window.location?.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    }
    setSelectedMedia([]);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedMedia?.length} items?`)) {
      console.log('Deleting', selectedMedia?.length, 'items');
      // Simulate delete process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove deleted items from media list
      const deletedIds = selectedMedia?.map(item => item?.id);
      setMediaItems(prev => prev?.filter(item => !deletedIds?.includes(item?.id)));
      setSelectedMedia([]);
      
      // Update trip media count
      updateMediaCount(activeTrip?.id, -selectedMedia?.length);
    }
  };

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    // Simulate loading more media
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, we'll just set hasMore to false after first load
    setHasMore(false);
  }, []);

  // Handle pull to refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add some new mock items
    const newItems = [
      {
        id: `new-${Date.now()}`,
        type: 'photo',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        uploader: {
          id: '1',
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
          isOnline: true,
          role: 'admin'
        },
        timestamp: new Date(),
        location: 'Malibu Beach, CA',
        isNew: true,
        isFavorite: false
      }
    ];
    
    setMediaItems(prev => [...newItems, ...prev]);
    setRefreshing(false);
  }, []);

  // Handle member click
  const handleMemberClick = (member) => {
    console.log('Viewing member profile:', member?.name);
    // Could navigate to member profile or show member's media
  };

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-background">
        <ContextualHeader showBack title="Trip Gallery" />
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">No active trip selected</p>
        </div>
        <BottomTabNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualHeader
        showBack
        title={activeTrip?.name}
        tripContext={{
          name: activeTrip?.name,
          location: activeTrip?.location,
          dates: activeTrip?.dates,
          memberCount: activeTrip?.memberCount
        }}
      />
      {/* Selection Toolbar */}
      <SelectionToolbar
        selectedCount={selectedMedia?.length}
        onClearSelection={handleClearSelection}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={handleDelete}
        canDelete={activeTrip?.permissions?.canDelete}
      />
      {/* Filter Chips */}
      <FilterChips
        activeFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        mediaStats={mediaStats}
      />
      {/* Member Avatars */}
      <div className="px-4 py-3 border-b border-border">
        <MemberAvatars
          members={activeTrip?.members}
          maxVisible={5}
          size="sm"
          onMemberClick={handleMemberClick}
        />
      </div>
      {/* Main Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        {filteredMedia?.length === 0 && !loading ? (
          <EmptyGalleryState
            tripName={activeTrip?.name}
            canUpload={activeTrip?.permissions?.canUpload}
          />
        ) : (
          <MediaGrid
            mediaItems={filteredMedia}
            loading={loading}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            selectedFilter={selectedFilter}
            onMediaSelect={handleMediaSelect}
            selectedMedia={selectedMedia}
          />
        )}
      </PullToRefresh>
      {/* Upload FAB */}
      <MediaUploadFAB />
      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default TripGallery;