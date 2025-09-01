import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTripContext } from '../../components/ui/TripContextProvider';
import MediaDisplay from './components/MediaDisplay';
import MediaHeader from './components/MediaHeader';
import MediaInfo from './components/MediaInfo';
import CommentsSection from './components/CommentsSection';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ShareDialog from './components/ShareDialog';

const MediaViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeTrip } = useTripContext();
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showUI, setShowUI] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState([]);

  // Mock media data - in real app this would come from API
  const mockMediaData = [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      caption: 'Beautiful sunset at the beach during our first day!',
      uploader: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      uploadedAt: '2025-08-15T18:30:00Z',
      location: 'Malibu Beach, CA',
      fileSize: 2457600,
      width: 1200,
      height: 800,
      likes: 12,
      exif: {
        camera: 'iPhone 15 Pro',
        aperture: '1.8',
        shutterSpeed: '1/120',
        iso: '100'
      }
    },
    {
      id: '2',
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      caption: 'Amazing waves crashing on the shore',
      uploader: {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      uploadedAt: '2025-08-15T19:15:00Z',
      location: 'Malibu Beach, CA',
      fileSize: 1048576,
      width: 1280,
      height: 720,
      duration: '0:30',
      format: 'MP4',
      likes: 8
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
      caption: 'Group photo at the pier',
      uploader: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      uploadedAt: '2025-08-16T10:45:00Z',
      location: 'Santa Monica Pier, CA',
      fileSize: 3145728,
      width: 1200,
      height: 800,
      likes: 15,
      exif: {
        camera: 'Canon EOS R5',
        aperture: '2.8',
        shutterSpeed: '1/250',
        iso: '200'
      }
    }
  ];

  // Mock comments data
  const mockComments = [
    {
      id: '1',
      text: 'This is absolutely stunning! The colors are incredible.',
      author: {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      createdAt: '2025-08-15T19:00:00Z',
      mediaId: '1'
    },
    {
      id: '2',
      text: 'Perfect timing for this shot! Love the golden hour lighting.',
      author: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      createdAt: '2025-08-15T20:30:00Z',
      mediaId: '1'
    }
  ];

  // Current user mock data
  const currentUser = {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  };

  const currentMedia = mockMediaData?.[currentMediaIndex];
  const mediaComments = mockComments?.filter(comment => comment?.mediaId === currentMedia?.id);

  // Initialize media index from URL params
  useEffect(() => {
    const mediaId = searchParams?.get('id');
    if (mediaId) {
      const index = mockMediaData?.findIndex(media => media?.id === mediaId);
      if (index !== -1) {
        setCurrentMediaIndex(index);
      }
    }
  }, [searchParams]);

  // Update URL when media changes
  useEffect(() => {
    if (currentMedia) {
      const newParams = new URLSearchParams(searchParams);
      newParams?.set('id', currentMedia?.id);
      navigate(`/media-viewer?${newParams?.toString()}`, { replace: true });
    }
  }, [currentMediaIndex, currentMedia, navigate, searchParams]);

  // Load comments for current media
  useEffect(() => {
    if (currentMedia) {
      setComments(mediaComments);
    }
  }, [currentMedia?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e?.key) {
        case 'ArrowLeft':
          e?.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e?.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e?.preventDefault();
          navigate('/trip-gallery');
          break;
        case ' ':
          e?.preventDefault();
          setShowUI(!showUI);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUI, navigate]);

  // Auto-hide UI after inactivity
  useEffect(() => {
    let timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      if (showUI) {
        timeout = setTimeout(() => {
          setShowUI(false);
        }, 3000);
      }
    };

    const handleActivity = () => {
      if (!showUI) {
        setShowUI(true);
      }
      resetTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    resetTimeout();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [showUI]);

  const handlePrevious = useCallback(() => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  }, [currentMediaIndex]);

  const handleNext = useCallback(() => {
    if (currentMediaIndex < mockMediaData?.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  }, [currentMediaIndex, mockMediaData?.length]);

  const handleToggleUI = () => {
    setShowUI(!showUI);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentMedia?.url);
      const blob = await response?.blob();
      const url = window.URL?.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trip-${currentMedia?.type}-${currentMedia?.id}`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      window.URL?.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from mock data and navigate
      if (mockMediaData?.length === 1) {
        navigate('/trip-gallery');
      } else if (currentMediaIndex === mockMediaData?.length - 1) {
        setCurrentMediaIndex(currentMediaIndex - 1);
      }
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (comment) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setComments(prev => [...prev, comment]);
  };

  // Check if user can delete this media
  const canDelete = currentMedia?.uploader?.id === currentUser?.id || 
                   activeTrip?.permissions?.canManage;

  if (!currentMedia) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Media not found</p>
          <button
            onClick={() => navigate('/trip-gallery')}
            className="text-primary hover:underline"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Media Display */}
      <MediaDisplay
        media={currentMedia}
        onPrevious={currentMediaIndex > 0 ? handlePrevious : null}
        onNext={currentMediaIndex < mockMediaData?.length - 1 ? handleNext : null}
        onToggleUI={handleToggleUI}
        showUI={showUI}
        className="absolute inset-0"
      />
      {/* Header */}
      <MediaHeader
        currentIndex={currentMediaIndex + 1}
        totalCount={mockMediaData?.length}
        onDownload={handleDownload}
        onShare={handleShare}
        onDelete={handleDelete}
        canDelete={canDelete}
        showUI={showUI}
      />
      {/* Media Info */}
      <MediaInfo
        media={currentMedia}
        showUI={showUI}
      />
      {/* Comments Section - Only visible on mobile when UI is shown */}
      {showUI && (
        <div className="absolute bottom-0 left-0 right-0 md:hidden">
          <CommentsSection
            mediaId={currentMedia?.id}
            comments={comments}
            onAddComment={handleAddComment}
            currentUser={currentUser}
            className="max-h-96"
          />
        </div>
      )}
      {/* Desktop Comments Sidebar */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-80 bg-background border-l border-border">
        <CommentsSection
          mediaId={currentMedia?.id}
          comments={comments}
          onAddComment={handleAddComment}
          currentUser={currentUser}
          className="h-full"
        />
      </div>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        mediaType={currentMedia?.type}
        isDeleting={isDeleting}
      />
      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        media={currentMedia}
      />
    </div>
  );
};

export default MediaViewer;