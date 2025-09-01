import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../../components/ui/TripContextProvider';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import MediaUploadFAB from '../../components/ui/MediaUploadFAB';
import QRCodeScanner from './components/QRCodeScanner';
import ManualCodeEntry from './components/ManualCodeEntry';
import InviteLinkHandler from './components/InviteLinkHandler';
import TripPreviewCard from './components/TripPreviewCard';
import JoinMethodTabs from './components/JoinMethodTabs';
import Icon from '../../components/AppIcon';

const JoinTripPage = () => {
  const navigate = useNavigate();
  const { joinTrip, loading, error } = useTripContext();
  const [activeMethod, setActiveMethod] = useState('code');
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [detectedCode, setDetectedCode] = useState('');
  const [tripPreview, setTripPreview] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Mock trip data for preview
  const mockTripData = {
    'ABC123': {
      name: 'Summer Beach Vacation',
      location: 'Malibu, California',
      dates: 'Aug 15-22, 2025',
      memberCount: 6,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop',
      adminName: 'Sarah Johnson',
      adminAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      description: 'Join us for an amazing week at the beach! We\'ll be staying in a beautiful beachfront house with plenty of space for everyone.',
      isPrivate: true
    },
    'XYZ789': {
      name: 'Mountain Hiking Adventure',
      location: 'Yosemite National Park',
      dates: 'Sep 5-8, 2025',
      memberCount: 4,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      adminName: 'Mike Chen',
      adminAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      description: 'Epic hiking adventure through Yosemite\'s most scenic trails. Bring your camera!',
      isPrivate: true
    },
    'DEF456': {
      name: 'City Explorer Weekend',
      location: 'San Francisco, CA',
      dates: 'Oct 12-14, 2025',
      memberCount: 8,
      coverImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
      adminName: 'Alex Rivera',
      adminAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      description: 'Exploring the best of San Francisco - from Golden Gate to Fisherman\'s Wharf!',
      isPrivate: false
    }
  };

  const handleCodeDetected = (code) => {
    setDetectedCode(code);
    setQrScannerActive(false);
    
    // Extract the actual code part
    const codeKey = code?.replace('TRIP_', '');
    const preview = mockTripData?.[codeKey];
    
    if (preview) {
      setTripPreview(preview);
      setJoinError('');
    } else {
      setJoinError('Trip not found. Please check the code and try again.');
    }
  };

  const handleCodeSubmit = (code) => {
    handleCodeDetected(code);
  };

  const handleLinkProcessed = (linkCode) => {
    handleCodeDetected(`TRIP_${linkCode}`);
  };

  const handleJoinConfirm = async () => {
    if (!tripPreview) return;
    
    setIsJoining(true);
    setJoinError('');
    
    try {
      await joinTrip(detectedCode);
      
      // Navigate to trip gallery with success message
      navigate('/trip-gallery', {
        state: {
          welcomeMessage: `Welcome to ${tripPreview?.name}!`,
          isNewMember: true
        }
      });
    } catch (err) {
      setJoinError('Failed to join trip. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCancelPreview = () => {
    setTripPreview(null);
    setDetectedCode('');
    setJoinError('');
  };

  const handleMethodChange = (method) => {
    setActiveMethod(method);
    setTripPreview(null);
    setDetectedCode('');
    setJoinError('');
    setQrScannerActive(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader 
        title="Join Trip"
        showBack={true}
      />

      <main className="pb-20 px-4 py-6">
        {!tripPreview ? (
          <div className="max-w-md mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="UserPlus" size={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Join a Trip
              </h1>
              <p className="text-muted-foreground">
                Enter a trip code, scan a QR code, or use an invite link to join your friends' trip
              </p>
            </div>

            {/* Method Selection Tabs */}
            <JoinMethodTabs 
              activeMethod={activeMethod}
              onMethodChange={handleMethodChange}
            />

            {/* Error Display */}
            {(joinError || error) && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center text-error">
                  <Icon name="AlertCircle" size={16} className="mr-2" />
                  <span className="text-sm font-medium">
                    {joinError || error}
                  </span>
                </div>
              </div>
            )}

            {/* Join Methods */}
            <div className="space-y-6">
              {activeMethod === 'qr' && (
                <QRCodeScanner
                  onCodeDetected={handleCodeDetected}
                  isActive={qrScannerActive}
                  onToggle={() => setQrScannerActive(!qrScannerActive)}
                />
              )}

              {activeMethod === 'code' && (
                <ManualCodeEntry
                  onCodeSubmit={handleCodeSubmit}
                  isLoading={loading}
                />
              )}

              {activeMethod === 'link' && (
                <InviteLinkHandler
                  onLinkProcessed={handleLinkProcessed}
                  isLoading={loading}
                />
              )}
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <Icon name="HelpCircle" size={16} className="mr-2" />
                Need Help?
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Ask the trip organizer to share the invite link or QR code</p>
                <p>• Make sure you have the correct trip code format (TRIP_XXXXXX)</p>
                <p>• Check that the invite link hasn't expired</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <TripPreviewCard
              tripData={tripPreview}
              onJoinConfirm={handleJoinConfirm}
              onCancel={handleCancelPreview}
              isJoining={isJoining}
            />
          </div>
        )}
      </main>

      <BottomTabNavigation />
      <MediaUploadFAB />
    </div>
  );
};

export default JoinTripPage;