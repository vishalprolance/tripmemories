import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareDialog = ({ 
  isOpen, 
  onClose, 
  media,
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  if (!isOpen) return null;

  const shareUrl = `${window.location?.origin}/media-viewer?id=${media?.id}`;

  const shareOptions = [
    { id: 'link', name: 'Copy Link', icon: 'Link', description: 'Share via link' },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', description: 'Share on WhatsApp' },
    { id: 'telegram', name: 'Telegram', icon: 'Send', description: 'Share on Telegram' },
    { id: 'email', name: 'Email', icon: 'Mail', description: 'Share via email' },
    { id: 'download', name: 'Download & Share', icon: 'Download', description: 'Download to device' }
  ];

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (option) => {
    switch (option?.id) {
      case 'link':
        handleCopyLink();
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=Check out this ${media?.type} from our trip! ${shareUrl}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=Check out this ${media?.type} from our trip!`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Trip ${media?.type}&body=Check out this ${media?.type} from our trip: ${shareUrl}`, '_blank');
        break;
      case 'download':
        // Trigger download
        const link = document.createElement('a');
        link.href = media?.url;
        link.download = `trip-${media?.type}-${media?.id}`;
        link?.click();
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-end md:items-center justify-center p-4 z-50 ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-t-lg md:rounded-lg shadow-elevation-3 w-full max-w-md animate-slide-up md:animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Share" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Share {media?.type === 'video' ? 'Video' : 'Photo'}
              </h2>
              <p className="text-sm text-muted-foreground">
                by {media?.uploader?.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
            aria-label="Close share dialog"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Share Link */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 text-sm"
              label="Share Link"
            />
            <Button
              variant={copied ? "success" : "outline"}
              size="icon"
              onClick={handleCopyLink}
              className="flex-shrink-0"
              aria-label="Copy link"
            >
              <Icon name={copied ? "Check" : "Copy"} size={16} />
            </Button>
          </div>
          {copied && (
            <p className="text-success text-xs mt-2 flex items-center">
              <Icon name="Check" size={12} className="mr-1" />
              Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Share Options */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Share via</h3>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions?.map((option) => (
              <button
                key={option?.id}
                onClick={() => handleShare(option)}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={option?.icon} size={16} className="text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground">{option?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{option?.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;