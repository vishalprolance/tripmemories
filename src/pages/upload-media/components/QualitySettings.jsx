import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const QualitySettings = ({ 
  preserveOriginal, 
  onPreserveOriginalChange, 
  compressionLevel, 
  onCompressionLevelChange,
  className = '' 
}) => {
  const compressionOptions = [
    {
      value: 'high',
      label: 'High Quality',
      description: 'Minimal compression, ~80% of original size',
      storageImpact: 'High storage usage'
    },
    {
      value: 'medium',
      label: 'Balanced',
      description: 'Good quality with compression, ~50% of original size',
      storageImpact: 'Medium storage usage'
    },
    {
      value: 'low',
      label: 'Optimized',
      description: 'Optimized for sharing, ~30% of original size',
      storageImpact: 'Low storage usage'
    }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon name="Settings" size={20} className="text-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Quality Settings</h3>
      </div>
      {/* Original Quality Toggle */}
      <div className="space-y-3">
        <Checkbox
          checked={preserveOriginal}
          onChange={(e) => onPreserveOriginalChange(e?.target?.checked)}
          label="Preserve Original Quality"
          description="Keep photos and videos in their original resolution and quality"
        />
        
        {preserveOriginal && (
          <div className="ml-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Original Quality Enabled</p>
                <p className="text-muted-foreground">
                  Files will be stored without compression. This provides the best quality but uses more storage space.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Compression Options */}
      {!preserveOriginal && (
        <div className="space-y-3">
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-foreground mb-3">Compression Level</h4>
            <div className="space-y-3">
              {compressionOptions?.map((option) => (
                <label
                  key={option?.value}
                  className={`
                    flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all
                    ${compressionLevel === option?.value 
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="compressionLevel"
                    value={option?.value}
                    checked={compressionLevel === option?.value}
                    onChange={(e) => onCompressionLevelChange(e?.target?.value)}
                    className="mt-1 h-4 w-4 text-primary border-border focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{option?.label}</p>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${option?.value === 'high' ? 'bg-error/10 text-error' : ''}
                        ${option?.value === 'medium' ? 'bg-warning/10 text-warning' : ''}
                        ${option?.value === 'low' ? 'bg-success/10 text-success' : ''}
                      `}>
                        {option?.storageImpact}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option?.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Storage Impact Visualization */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estimated storage per 100 photos:</span>
          <span className="font-medium text-foreground">
            {preserveOriginal ? '~2.5 GB' : 
             compressionLevel === 'high' ? '~2.0 GB' :
             compressionLevel === 'medium' ? '~1.2 GB' : '~750 MB'}
          </span>
        </div>
        
        <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="HardDrive" size={14} />
          <span>Based on average 25MP photos</span>
        </div>
      </div>
    </div>
  );
};

export default QualitySettings;