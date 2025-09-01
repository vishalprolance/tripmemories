import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  mediaType = 'media',
  isDeleting = false,
  className = '' 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-elevation-3 w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 pb-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <Icon name="Trash2" size={20} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Delete {mediaType === 'video' ? 'Video' : 'Photo'}
            </h2>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-4">
          <p className="text-foreground">
            Are you sure you want to delete this {mediaType === 'video' ? 'video' : 'photo'}? 
            It will be permanently removed from the trip gallery and cannot be recovered.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={isDeleting}
            iconName="Trash2"
            iconPosition="left"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;