import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const AdvancedSettings = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fileSizeOptions = [
    { value: '50', label: '50 MB per file' },
    { value: '100', label: '100 MB per file' },
    { value: '200', label: '200 MB per file' },
    { value: '500', label: '500 MB per file' },
    { value: 'unlimited', label: 'No limit' }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-foreground">
          Advanced Settings
        </span>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="space-y-6 pt-2 border-t border-border">
          {/* File Size Limit */}
          <div>
            <Select
              label="File Size Limit"
              description="Maximum size allowed for uploaded photos and videos"
              options={fileSizeOptions}
              value={settings?.fileSizeLimit}
              onChange={(value) => handleSettingChange('fileSizeLimit', value)}
              className="mb-4"
            />
          </div>

          {/* Download Permissions */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Download Permissions
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Allow members to download original files"
                description="Members can save full-resolution photos and videos to their devices"
                checked={settings?.allowDownload}
                onChange={(e) => handleSettingChange('allowDownload', e?.target?.checked)}
              />
              <Checkbox
                label="Allow bulk downloads"
                description="Members can download multiple files at once as ZIP archives"
                checked={settings?.allowBulkDownload}
                onChange={(e) => handleSettingChange('allowBulkDownload', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Security Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Security Options
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Enable end-to-end encryption"
                description="Encrypt all uploaded media files for maximum privacy"
                checked={settings?.enableEncryption}
                onChange={(e) => handleSettingChange('enableEncryption', e?.target?.checked)}
              />
              <Checkbox
                label="Require approval for new members"
                description="Trip admins must approve new member requests"
                checked={settings?.requireApproval}
                onChange={(e) => handleSettingChange('requireApproval', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Auto-Organization */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Auto-Organization
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Auto-sort by date"
                description="Automatically organize photos by the date they were taken"
                checked={settings?.autoSortByDate}
                onChange={(e) => handleSettingChange('autoSortByDate', e?.target?.checked)}
              />
              <Checkbox
                label="Auto-sort by location"
                description="Group photos by location using GPS data when available"
                checked={settings?.autoSortByLocation}
                onChange={(e) => handleSettingChange('autoSortByLocation', e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettings;