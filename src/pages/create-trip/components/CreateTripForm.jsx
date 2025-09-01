import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import TripCoverUpload from './TripCoverUpload';
import PrivacySettings from './PrivacySettings';
import AdvancedSettings from './AdvancedSettings';
import MemberInvitation from './MemberInvitation';

const CreateTripForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    coverImage: null,
    privacyMode: 'private',
    inviteList: [],
    advancedSettings: {
      fileSizeLimit: '100',
      allowDownload: true,
      allowBulkDownload: false,
      enableEncryption: false,
      requireApproval: false,
      autoSortByDate: true,
      autoSortByLocation: false
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Trip name is required';
    } else if (formData?.name?.trim()?.length < 3) {
      newErrors.name = 'Trip name must be at least 3 characters';
    } else if (formData?.name?.trim()?.length > 50) {
      newErrors.name = 'Trip name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleNameChange = (e) => {
    const value = e?.target?.value;
    setFormData(prev => ({ ...prev, name: value }));
    
    // Clear name error when user starts typing
    if (errors?.name && value?.trim()) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleCoverImageChange = (image) => {
    setFormData(prev => ({ ...prev, coverImage: image }));
  };

  const handlePrivacyChange = (mode) => {
    setFormData(prev => ({ ...prev, privacyMode: mode }));
  };

  const handleAdvancedSettingsChange = (settings) => {
    setFormData(prev => ({ 
      ...prev, 
      advancedSettings: settings 
    }));
  };

  const handleInviteListChange = (invites) => {
    setFormData(prev => ({ ...prev, inviteList: invites }));
  };

  const getCharacterCount = () => {
    return formData?.name?.length;
  };

  const isFormValid = () => {
    return formData?.name?.trim()?.length >= 3 && 
           formData?.name?.trim()?.length <= 50 && 
           Object.keys(errors)?.length === 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Trip Name */}
      <div>
        <Input
          label="Trip Name"
          type="text"
          placeholder="Enter trip name (e.g., Summer Beach Vacation)"
          value={formData?.name}
          onChange={handleNameChange}
          error={errors?.name}
          required
          maxLength={50}
          description={`${getCharacterCount()}/50 characters`}
          className="mb-4"
        />
      </div>
      {/* Cover Photo Upload */}
      <TripCoverUpload
        coverImage={formData?.coverImage}
        onImageChange={handleCoverImageChange}
        error={errors?.coverImage}
      />
      {/* Privacy Settings */}
      <PrivacySettings
        privacyMode={formData?.privacyMode}
        onPrivacyChange={handlePrivacyChange}
      />
      {/* Advanced Settings */}
      <AdvancedSettings
        settings={formData?.advancedSettings}
        onSettingsChange={handleAdvancedSettingsChange}
      />
      {/* Member Invitation */}
      <MemberInvitation
        inviteList={formData?.inviteList}
        onInviteListChange={handleInviteListChange}
      />
      {/* Submit Button */}
      <div className="pt-4 border-t border-border">
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!isFormValid() || loading}
          iconName="Plus"
          iconPosition="left"
        >
          {loading ? 'Creating Trip...' : 'Create Trip'}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center mt-3">
          By creating a trip, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default CreateTripForm;