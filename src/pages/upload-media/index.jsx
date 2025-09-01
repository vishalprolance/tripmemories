import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContextualHeader from '../../components/ui/ContextualHeader';
import BottomTabNavigation from '../../components/ui/BottomTabNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useTripContext } from '../../components/ui/TripContextProvider';
import DropZone from './components/DropZone';
import SelectedMediaGrid from './components/SelectedMediaGrid';
import UploadProgress from './components/UploadProgress';
import QualitySettings from './components/QualitySettings';
import AlbumAssignment from './components/AlbumAssignment';

const UploadMedia = () => {
  const navigate = useNavigate();
  const { activeTrip, updateMediaCount } = useTripContext();
  
  // File management state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(null);
  
  // Settings state
  const [preserveOriginal, setPreserveOriginal] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('high');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  
  // Auto suggestions based on EXIF data simulation
  const [autoSuggestions] = useState([
    {
      id: 'beach-day',
      name: 'Beach Day Activities',
      description: 'Based on GPS location: Malibu Beach',
      icon: 'MapPin',
      confidence: 95
    },
    {
      id: 'sunset-photos',
      name: 'Sunset Collection',
      description: 'Based on timestamp: 6:30-7:45 PM',
      icon: 'Sunset',
      confidence: 88
    },
    {
      id: 'group-shots',
      name: 'Group Photos',
      description: 'Based on face detection: 4+ people',
      icon: 'Users',
      confidence: 82
    }
  ]);

  // Redirect if no active trip
  useEffect(() => {
    if (!activeTrip) {
      navigate('/trip-dashboard');
    }
  }, [activeTrip, navigate]);

  const handleFilesSelected = (files) => {
    const validFiles = files?.filter(file => {
      const isValidType = file?.type?.startsWith('image/') || file?.type?.startsWith('video/');
      const isValidSize = file?.size <= 100 * 1024 * 1024; // 100MB limit
      return isValidType && isValidSize;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev?.filter((_, i) => i !== index));
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);
    setFailedFiles([]);
    
    const totalFiles = selectedFiles?.length;
    const uploadedFilesList = [];
    const failedFilesList = [];
    
    for (let i = 0; i < totalFiles; i++) {
      if (isPaused) {
        // Wait for resume
        while (isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      const file = selectedFiles?.[i];
      const progress = ((i + 1) / totalFiles) * 100;
      
      // Simulate upload time based on file size
      const uploadTime = Math.max(500, file?.size / (1024 * 1024) * 200); // 200ms per MB
      const steps = 20;
      const stepTime = uploadTime / steps;
      
      for (let step = 0; step < steps; step++) {
        if (isPaused) {
          while (isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, stepTime));
        const fileProgress = ((step + 1) / steps) * (100 / totalFiles);
        const currentProgress = (i / totalFiles) * 100 + fileProgress;
        setUploadProgress(currentProgress);
        
        // Update estimated time
        const remainingFiles = totalFiles - i - (step + 1) / steps;
        const avgTimePerFile = uploadTime;
        setEstimatedTime(remainingFiles * avgTimePerFile / 1000);
      }
      
      // Simulate success/failure (95% success rate)
      if (Math.random() > 0.05) {
        uploadedFilesList?.push(file);
        setUploadedFiles([...uploadedFilesList]);
      } else {
        failedFilesList?.push({ ...file, error: 'Network error occurred' });
        setFailedFiles([...failedFilesList]);
      }
    }
    
    setUploadProgress(100);
    setIsUploading(false);
    setEstimatedTime(null);
    
    // Update trip media count
    if (activeTrip && uploadedFilesList?.length > 0) {
      updateMediaCount(activeTrip?.id, uploadedFilesList?.length);
    }
    
    // Clear selected files after successful upload
    if (uploadedFilesList?.length > 0) {
      setTimeout(() => {
        setSelectedFiles([]);
        setUploadedFiles([]);
        setFailedFiles([]);
      }, 3000);
    }
  };

  const handleStartUpload = () => {
    if (selectedFiles?.length === 0) return;
    simulateUpload();
  };

  const handlePauseUpload = () => {
    setIsPaused(true);
  };

  const handleResumeUpload = () => {
    setIsPaused(false);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setIsPaused(false);
    setUploadProgress(0);
    setEstimatedTime(null);
  };

  const handleCreateNewAlbum = () => {
    // This would typically open a modal or navigate to album creation
    console.log('Create new album functionality');
  };

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active trip selected</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/trip-dashboard')}
            className="mt-4"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ContextualHeader
        title={`Upload to ${activeTrip?.name}`}
        showBack={true}
        tripContext={activeTrip}
      />
      <main className="pb-20 px-4 py-6 space-y-6">
        {/* Upload Drop Zone */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          disabled={isUploading}
        />
        
        {/* Selected Media Grid */}
        <SelectedMediaGrid
          files={selectedFiles}
          onRemoveFile={handleRemoveFile}
        />
        
        {/* Upload Progress */}
        <UploadProgress
          isUploading={isUploading}
          progress={uploadProgress}
          uploadedFiles={uploadedFiles}
          failedFiles={failedFiles}
          onPause={handlePauseUpload}
          onResume={handleResumeUpload}
          onCancel={handleCancelUpload}
          isPaused={isPaused}
          estimatedTime={estimatedTime}
        />
        
        {/* Quality Settings */}
        <QualitySettings
          preserveOriginal={preserveOriginal}
          onPreserveOriginalChange={setPreserveOriginal}
          compressionLevel={compressionLevel}
          onCompressionLevelChange={setCompressionLevel}
        />
        
        {/* Album Assignment */}
        <AlbumAssignment
          selectedAlbum={selectedAlbum}
          onAlbumChange={setSelectedAlbum}
          onCreateNewAlbum={handleCreateNewAlbum}
          autoSuggestions={autoSuggestions}
        />
        
        {/* Upload Actions */}
        {selectedFiles?.length > 0 && !isUploading && (
          <div className="sticky bottom-20 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {selectedFiles?.length} files ready to upload
              </div>
              <div className="text-sm font-medium text-foreground">
                {preserveOriginal ? 'Original Quality' : `${compressionLevel} Quality`}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
                className="flex-1"
                iconName="X"
                iconPosition="left"
              >
                Clear All
              </Button>
              <Button
                variant="default"
                onClick={handleStartUpload}
                className="flex-1"
                iconName="Upload"
                iconPosition="left"
                disabled={selectedFiles?.length === 0}
              >
                Start Upload
              </Button>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {uploadedFiles?.length > 0 && !isUploading && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <div>
                <p className="font-medium text-foreground">
                  Upload Complete!
                </p>
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles?.length} files uploaded successfully to {activeTrip?.name}
                </p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/trip-gallery')}
                iconName="Images"
                iconPosition="left"
              >
                View Gallery
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUploadedFiles([]);
                  setFailedFiles([]);
                }}
                iconName="X"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </main>
      <BottomTabNavigation />
    </div>
  );
};

export default UploadMedia;