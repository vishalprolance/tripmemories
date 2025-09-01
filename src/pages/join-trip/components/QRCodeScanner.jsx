import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeScanner = ({ onCodeDetected, isActive, onToggle }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices?.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please enable camera permissions.');
      setHasPermission(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection for demo purposes
    const mockCodes = ['TRIP_ABC123', 'TRIP_XYZ789', 'TRIP_DEF456'];
    const randomCode = mockCodes?.[Math.floor(Math.random() * mockCodes?.length)];
    onCodeDetected(randomCode);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Scan QR Code</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8"
          aria-label={isActive ? 'Close scanner' : 'Open scanner'}
        >
          <Icon name={isActive ? 'X' : 'QrCode'} size={20} />
        </Button>
      </div>

      {!isActive ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="QrCode" size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            Tap to scan a QR code from your trip invitation
          </p>
          <Button onClick={onToggle} variant="outline">
            <Icon name="Camera" size={16} className="mr-2" />
            Start Scanner
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} className="text-error" />
              </div>
              <p className="text-error text-sm mb-4">{error}</p>
              <Button onClick={startCamera} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Scanner Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                    
                    {/* Scanning line animation */}
                    <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary opacity-75 animate-pulse" />
                  </div>
                </div>

                {/* Status indicator */}
                {isScanning && (
                  <div className="absolute top-4 left-4 bg-success/90 text-success-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <div className="w-2 h-2 bg-success-foreground rounded-full mr-2 animate-pulse" />
                    Scanning...
                  </div>
                )}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Position the QR code within the frame
                </p>
                <p className="text-xs text-muted-foreground">
                  Make sure the code is well-lit and clearly visible
                </p>
              </div>

              {/* Demo button for testing */}
              <div className="pt-4 border-t border-border">
                <Button
                  onClick={simulateQRDetection}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="text-xs"
                >
                  <Icon name="Zap" size={14} className="mr-2" />
                  Simulate QR Detection (Demo)
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;