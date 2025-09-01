import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import { useTripContext } from '../../components/ui/TripContextProvider';
import CreateTripForm from './components/CreateTripForm';

const CreateTrip = () => {
  const navigate = useNavigate();
  const { createTrip } = useTripContext();
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async (formData) => {
    setLoading(true);
    
    try {
      // Prepare trip data for creation
      const tripData = {
        name: formData.name.trim(),
        coverImage: formData.coverImage || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop`,
        location: 'Location TBD',
        dates: 'Dates TBD',
        privacyMode: formData.privacyMode,
        settings: formData.advancedSettings,
        inviteList: formData.inviteList,
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Create the trip using context
      const newTrip = await createTrip(tripData);
      
      // Navigate to the new trip's gallery
      navigate('/trip-gallery', { 
        state: { 
          tripCreated: true,
          tripName: newTrip.name,
          showOnboarding: true
        }
      });
      
    } catch (error) {
      console.error('Failed to create trip:', error);
      // Error handling could include showing a toast notification
    } finally {
      setLoading(false);
    }
  };

  const headerActions = [
    {
      icon: 'HelpCircle',
      label: 'Help',
      onClick: () => {
        // Could open help modal or navigate to help page
        console.log('Show help');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ContextualHeader
        title="Create Trip"
        showBack={true}
        actions={headerActions}
      />

      {/* Main Content */}
      <main className="pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Page Introduction */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create a New Trip
            </h1>
            <p className="text-muted-foreground">
              Set up a private space for sharing photos and videos with your travel companions. 
              Customize privacy settings and invite friends to join your memory collection.
            </p>
          </div>

          {/* Create Trip Form */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <CreateTripForm
              onSubmit={handleCreateTrip}
              loading={loading}
            />
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              💡 Pro Tips
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Choose a descriptive name that all trip members will recognize</li>
              <li>• Cover photos help distinguish between multiple trips</li>
              <li>• You can always modify settings and add members later</li>
              <li>• Enable encryption for maximum privacy of sensitive content</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomTabNavigation />
    </div>
  );
};

export default CreateTrip;