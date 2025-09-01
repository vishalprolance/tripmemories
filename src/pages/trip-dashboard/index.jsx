import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import MediaUploadFAB from '../../components/ui/MediaUploadFAB';
import { useTripContext } from '../../components/ui/TripContextProvider';

import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import TripGrid from './components/TripGrid';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TripDashboard = () => {
  const navigate = useNavigate();
  const { userTrips, loading, switchTrip } = useTripContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Mock recent activities data
  const recentActivities = [
    {
      id: '1',
      type: 'upload',
      user: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      description: 'uploaded 5 new photos',
      tripName: 'Summer Beach Vacation',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      mediaPreview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      type: 'join',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      },
      description: 'joined the trip',
      tripName: 'Mountain Hiking Adventure',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: '3',
      type: 'upload',
      user: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      description: 'shared a video',
      tripName: 'City Explorer Weekend',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      mediaPreview: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop'
    }
  ];

  // Filter trips based on search term
  useEffect(() => {
    if (!searchTerm?.trim()) {
      setFilteredTrips(userTrips);
    } else {
      const filtered = userTrips?.filter(trip =>
        trip?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        trip?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredTrips(filtered);
    }
  }, [userTrips, searchTerm]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Handle trip management actions
  const handleTripManage = (tripId, action) => {
    switch (action) {
      case 'view':
        switchTrip(tripId);
        navigate('/trip-gallery');
        break;
      case 'edit':
        navigate(`/edit-trip/${tripId}`);
        break;
      case 'invite':
        navigate(`/invite-members/${tripId}`);
        break;
      case 'leave':
        // Handle leave trip logic
        console.log('Leave trip:', tripId);
        break;
      default:
        break;
    }
  };

  // Handle create trip
  const handleCreateTrip = () => {
    navigate('/create-trip');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualHeader
        title="My Trips"
        actions={[
          { icon: 'Search', label: 'Search', onClick: () => {} },
          { icon: 'Plus', label: 'Create Trip', onClick: handleCreateTrip }
        ]}
      />
      {/* Main Content */}
      <main className="pb-20 safe-area-bottom">
        {/* Pull to Refresh Indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4 bg-muted/50">
            <Icon name="Loader2" size={20} className="animate-spin mr-2 text-primary" />
            <span className="text-sm text-muted-foreground">Refreshing trips...</span>
          </div>
        )}

        <div className="px-4 py-6 space-y-6">
          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search trips by name or location..."
          />

          {/* Quick Actions - Show when user has trips */}
          {userTrips?.length > 0 && showQuickActions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickActions(false)}
                  className="h-8 w-8"
                  aria-label="Hide quick actions"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              <QuickActions />
            </div>
          )}

          {/* Trips Section */}
          {userTrips?.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {/* Trips Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {searchTerm ? 'Search Results' : 'Your Trips'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredTrips?.length} {filteredTrips?.length === 1 ? 'trip' : 'trips'}
                    {searchTerm && ` found for "${searchTerm}"`}
                  </p>
                </div>
                
                {!searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    iconName={isRefreshing ? 'Loader2' : 'RefreshCw'}
                    iconPosition="left"
                    className={isRefreshing ? 'animate-spin' : ''}
                  >
                    Refresh
                  </Button>
                )}
              </div>

              {/* Trip Grid */}
              <TripGrid
                trips={filteredTrips}
                onTripManage={handleTripManage}
                loading={loading}
              />

              {/* No Search Results */}
              {searchTerm && filteredTrips?.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">No trips found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try searching with different keywords
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    iconName="X"
                    iconPosition="left"
                  >
                    Clear Search
                  </Button>
                </div>
              )}

              {/* Recent Activity */}
              {!searchTerm && filteredTrips?.length > 0 && (
                <RecentActivity
                  activities={recentActivities}
                  className="mt-8"
                />
              )}
            </div>
          )}
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomTabNavigation />
      {/* Floating Action Button */}
      <MediaUploadFAB />
    </div>
  );
};

export default TripDashboard;