import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadProgress = ({ 
  isUploading, 
  progress, 
  uploadedFiles, 
  failedFiles, 
  onPause, 
  onResume, 
  onCancel,
  isPaused = false,
  estimatedTime = null,
  className = '' 
}) => {
  const formatTime = (seconds) => {
    if (!seconds || seconds === Infinity) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Icon name="Upload" size={16} className="text-primary animate-pulse" />;
      case 'completed':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'failed':
        return <Icon name="XCircle" size={16} className="text-error" />;
      case 'paused':
        return <Icon name="Pause" size={16} className="text-warning" />;
      default:
        return <Icon name="Clock" size={16} className="text-muted-foreground" />;
    }
  };

  if (!isUploading && uploadedFiles?.length === 0 && failedFiles?.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Progress */}
      {isUploading && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {isPaused ? 'Upload Paused' : 'Uploading Media'}
            </h3>
            <div className="flex items-center space-x-2">
              {!isPaused ? (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Pause"
                  onClick={onPause}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Play"
                  onClick={onResume}
                  className="text-primary hover:text-primary/80"
                >
                  Resume
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onCancel}
                className="text-muted-foreground hover:text-error"
              >
                Cancel
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
              {estimatedTime && (
                <span className="text-muted-foreground">
                  {formatTime(estimatedTime)} remaining
                </span>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out ${
                  isPaused ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Upload Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Icon name="Upload" size={14} />
                <span>Uploading</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Wifi" size={14} />
                <span>High quality</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} />
              <span>Secure transfer</span>
            </div>
          </div>
        </div>
      )}
      {/* File Status List */}
      {(uploadedFiles?.length > 0 || failedFiles?.length > 0) && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-foreground">Upload Status</h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {/* Completed Files */}
            {uploadedFiles?.map((file, index) => (
              <div
                key={`completed-${index}`}
                className="flex items-center justify-between p-2 bg-success/5 border border-success/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon('completed')}
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {file?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded successfully
                    </p>
                  </div>
                </div>
                <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
              </div>
            ))}
            
            {/* Failed Files */}
            {failedFiles?.map((file, index) => (
              <div
                key={`failed-${index}`}
                className="flex items-center justify-between p-2 bg-error/5 border border-error/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon('failed')}
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {file?.name}
                    </p>
                    <p className="text-xs text-error">
                      {file?.error || 'Upload failed'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="RotateCcw"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Retry upload"
                />
              </div>
            ))}
          </div>
          
          {/* Summary */}
          {(uploadedFiles?.length > 0 || failedFiles?.length > 0) && (
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  {uploadedFiles?.length > 0 && (
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="CheckCircle" size={14} />
                      <span>{uploadedFiles?.length} completed</span>
                    </div>
                  )}
                  {failedFiles?.length > 0 && (
                    <div className="flex items-center space-x-1 text-error">
                      <Icon name="XCircle" size={14} />
                      <span>{failedFiles?.length} failed</span>
                    </div>
                  )}
                </div>
                {failedFiles?.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    className="text-xs"
                  >
                    Retry Failed
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadProgress;