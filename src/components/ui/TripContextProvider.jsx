import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripContextProvider');
  }
  return context;
};

const TripContextProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockTrips = [
      {
        id: '1',
        name: 'Summer Beach Vacation',
        location: 'Malibu, CA',
        dates: 'Aug 15-22, 2025',
        memberCount: 6,
        mediaCount: 127,
        coverImage: '/assets/images/trip-cover-1.jpg',
        members: [
          { id: '1', name: 'John Doe', avatar: '/assets/images/avatar-1.jpg', role: 'admin' },
          { id: '2', name: 'Jane Smith', avatar: '/assets/images/avatar-2.jpg', role: 'member' },
          { id: '3', name: 'Mike Johnson', avatar: '/assets/images/avatar-3.jpg', role: 'member' }
        ],
        permissions: {
          canUpload: true,
          canDelete: false,
          canInvite: true,
          canManage: false
        }
      },
      {
        id: '2',
        name: 'Mountain Hiking Adventure',
        location: 'Yosemite, CA',
        dates: 'Sep 5-8, 2025',
        memberCount: 4,
        mediaCount: 89,
        coverImage: '/assets/images/trip-cover-2.jpg',
        members: [
          { id: '1', name: 'John Doe', avatar: '/assets/images/avatar-1.jpg', role: 'member' },
          { id: '4', name: 'Sarah Wilson', avatar: '/assets/images/avatar-4.jpg', role: 'admin' }
        ],
        permissions: {
          canUpload: true,
          canDelete: false,
          canInvite: false,
          canManage: false
        }
      }
    ];
    
    setUserTrips(mockTrips);
    
    // Set active trip from localStorage or first trip
    const savedTripId = localStorage.getItem('activeTripId');
    if (savedTripId) {
      const savedTrip = mockTrips?.find(trip => trip?.id === savedTripId);
      if (savedTrip) {
        setActiveTrip(savedTrip);
      }
    }
  }, []);

  const switchTrip = (tripId) => {
    const trip = userTrips?.find(t => t?.id === tripId);
    if (trip) {
      setActiveTrip(trip);
      localStorage.setItem('activeTripId', tripId);
    }
  };

  const createTrip = async (tripData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTrip = {
        id: Date.now()?.toString(),
        ...tripData,
        memberCount: 1,
        mediaCount: 0,
        members: [
          { id: '1', name: 'John Doe', avatar: '/assets/images/avatar-1.jpg', role: 'admin' }
        ],
        permissions: {
          canUpload: true,
          canDelete: true,
          canInvite: true,
          canManage: true
        }
      };
      
      setUserTrips(prev => [...prev, newTrip]);
      setActiveTrip(newTrip);
      localStorage.setItem('activeTripId', newTrip?.id);
      
      return newTrip;
    } catch (err) {
      setError('Failed to create trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinTrip = async (inviteCode) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock trip data for joined trip
      const joinedTrip = {
        id: Date.now()?.toString(),
        name: 'City Explorer Weekend',
        location: 'San Francisco, CA',
        dates: 'Oct 12-14, 2025',
        memberCount: 8,
        mediaCount: 156,
        coverImage: '/assets/images/trip-cover-3.jpg',
        members: [
          { id: '1', name: 'John Doe', avatar: '/assets/images/avatar-1.jpg', role: 'member' },
          { id: '5', name: 'Alex Chen', avatar: '/assets/images/avatar-5.jpg', role: 'admin' }
        ],
        permissions: {
          canUpload: true,
          canDelete: false,
          canInvite: false,
          canManage: false
        }
      };
      
      setUserTrips(prev => [...prev, joinedTrip]);
      setActiveTrip(joinedTrip);
      localStorage.setItem('activeTripId', joinedTrip?.id);
      
      return joinedTrip;
    } catch (err) {
      setError('Failed to join trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTripPermissions = (tripId, permissions) => {
    setUserTrips(prev => 
      prev?.map(trip => 
        trip?.id === tripId 
          ? { ...trip, permissions: { ...trip?.permissions, ...permissions } }
          : trip
      )
    );
    
    if (activeTrip?.id === tripId) {
      setActiveTrip(prev => ({
        ...prev,
        permissions: { ...prev?.permissions, ...permissions }
      }));
    }
  };

  const addTripMember = (tripId, member) => {
    setUserTrips(prev => 
      prev?.map(trip => 
        trip?.id === tripId 
          ? { 
              ...trip, 
              members: [...trip?.members, member],
              memberCount: trip?.memberCount + 1
            }
          : trip
      )
    );
    
    if (activeTrip?.id === tripId) {
      setActiveTrip(prev => ({
        ...prev,
        members: [...prev?.members, member],
        memberCount: prev?.memberCount + 1
      }));
    }
  };

  const updateMediaCount = (tripId, count) => {
    setUserTrips(prev => 
      prev?.map(trip => 
        trip?.id === tripId 
          ? { ...trip, mediaCount: trip?.mediaCount + count }
          : trip
      )
    );
    
    if (activeTrip?.id === tripId) {
      setActiveTrip(prev => ({
        ...prev,
        mediaCount: prev?.mediaCount + count
      }));
    }
  };

  const value = {
    activeTrip,
    userTrips,
    loading,
    error,
    switchTrip,
    createTrip,
    joinTrip,
    updateTripPermissions,
    addTripMember,
    updateMediaCount,
    setError
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContextProvider;