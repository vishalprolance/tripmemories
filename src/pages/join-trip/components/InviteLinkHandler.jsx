import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const InviteLinkHandler = ({ onLinkProcessed, isLoading }) => {
  const [inviteUrl, setInviteUrl] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const location = useLocation();

  // Check for invite link in URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const inviteCode = urlParams.get('invite');
    const tripId = urlParams.get('trip');
    
    if (inviteCode || tripId) {
      setAutoDetected(true);
      const detectedUrl = `https://tripmemories.app/join?invite=${inviteCode || tripId}`;
      setInviteUrl(detectedUrl);
      processInviteLink(detectedUrl);
    }
  }, [location]);

  const extractTripCode = (url) => {
    try {
      const urlObj = new URL(url);
      const inviteParam = urlObj.searchParams.get('invite');
      const tripParam = urlObj.searchParams.get('trip');
      return inviteParam || tripParam;
    } catch {
      // Try to extract code from various URL patterns
      const patterns = [
        /invite[=/]([A-Za-z0-9_]+)/i,
        /trip[=/]([A-Za-z0-9_]+)/i,
        /join[=/]([A-Za-z0-9_]+)/i
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
      
      return null;
    }
  };

  const processInviteLink = async (url) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const tripCode = extractTripCode(url);
      
      if (!tripCode) {
        throw new Error('Invalid invite link format');
      }
      
      // Simulate API call to validate invite link
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - accept certain patterns
      const validCodes = ['ABC123', 'XYZ789', 'DEF456', 'TRIP_ABC123', 'TRIP_XYZ789'];
      const isValid = validCodes.some(code => 
        tripCode.includes(code) || code.includes(tripCode)
      );
      
      if (isValid) {
        onLinkProcessed(tripCode);
      } else {
        throw new Error('Invite link has expired or is invalid');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUrlChange = (e) => {
    setInviteUrl(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inviteUrl.trim()) {
      setError('Please enter an invite link');
      return;
    }
    
    processInviteLink(inviteUrl.trim());
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.includes('tripmemories') || text.includes('invite') || text.includes('join')) {
        setInviteUrl(text);
        processInviteLink(text);
      } else {
        setError('Clipboard does not contain a valid invite link');
      }
    } catch (err) {
      setError('Unable to access clipboard');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
          <Icon name="Link" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Invite Link</h3>
          <p className="text-sm text-muted-foreground">
            {autoDetected ? 'Link detected automatically' : 'Paste the invite link you received'}
          </p>
        </div>
      </div>

      {autoDetected && (
        <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center text-success">
            <Icon name="CheckCircle" size={16} className="mr-2" />
            <span className="text-sm font-medium">Invite link detected!</span>
          </div>
          <p className="text-xs text-success/80 mt-1">
            Processing your invitation automatically...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="url"
            label="Invite Link"
            placeholder="https://tripmemories.app/join?invite=..."
            value={inviteUrl}
            onChange={handleUrlChange}
            error={error}
            disabled={isLoading || isProcessing}
            className="pr-12"
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={pasteFromClipboard}
            className="absolute right-2 top-8 h-8 w-8"
            disabled={isLoading || isProcessing}
            aria-label="Paste from clipboard"
          >
            <Icon name="Clipboard" size={16} />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="mr-1" />
            <span>Links are usually shared via message or email</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Clock" size={12} className="mr-1" />
            <span>Invite links may expire after 7 days</span>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!inviteUrl.trim() || isLoading || isProcessing}
          loading={isLoading || isProcessing}
        >
          {isProcessing ? 'Processing Link...' : 'Join via Link'}
        </Button>
      </form>

      {/* Example links for demo */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Demo links to try:</p>
        <div className="space-y-1">
          {[
            'https://tripmemories.app/join?invite=ABC123',
            'https://tripmemories.app/join?trip=XYZ789'
          ].map((demoLink, index) => (
            <button
              key={index}
              onClick={() => setInviteUrl(demoLink)}
              className="block w-full text-left px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs font-mono transition-colors truncate"
              disabled={isLoading || isProcessing}
            >
              {demoLink}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InviteLinkHandler;