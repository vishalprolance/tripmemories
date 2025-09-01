import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const MemberInvitation = ({ inviteList, onInviteListChange }) => {
  const [currentInvite, setCurrentInvite] = useState('');
  const [inviteType, setInviteType] = useState('email');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex?.test(phone);
  };

  const handleAddInvite = () => {
    if (!currentInvite?.trim()) return;

    const isValid = inviteType === 'email' 
      ? validateEmail(currentInvite) 
      : validatePhone(currentInvite);

    if (!isValid) return;

    const isDuplicate = inviteList?.some(
      invite => invite?.value?.toLowerCase() === currentInvite?.toLowerCase()
    );

    if (isDuplicate) return;

    const newInvite = {
      id: Date.now()?.toString(),
      type: inviteType,
      value: currentInvite?.trim(),
      status: 'pending'
    };

    onInviteListChange([...inviteList, newInvite]);
    setCurrentInvite('');
  };

  const handleRemoveInvite = (inviteId) => {
    onInviteListChange(inviteList?.filter(invite => invite?.id !== inviteId));
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      e?.preventDefault();
      handleAddInvite();
    }
  };

  const getInputError = () => {
    if (!currentInvite?.trim()) return '';
    
    const isValid = inviteType === 'email' 
      ? validateEmail(currentInvite) 
      : validatePhone(currentInvite);
    
    if (!isValid) {
      return inviteType === 'email' ?'Please enter a valid email address' :'Please enter a valid phone number';
    }

    const isDuplicate = inviteList?.some(
      invite => invite?.value?.toLowerCase() === currentInvite?.toLowerCase()
    );

    if (isDuplicate) {
      return 'This contact has already been added';
    }

    return '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Invite Members
          <span className="text-muted-foreground ml-1">(Optional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-4">
          Add friends by email or phone number. They'll receive an invitation after the trip is created.
        </p>
      </div>
      {/* Invite Type Toggle */}
      <div className="flex bg-muted rounded-lg p-1">
        <button
          type="button"
          onClick={() => setInviteType('email')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            inviteType === 'email' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Mail" size={16} className="inline mr-2" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setInviteType('phone')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            inviteType === 'phone' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Phone" size={16} className="inline mr-2" />
          Phone
        </button>
      </div>
      {/* Add Invite Input */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            type={inviteType === 'email' ? 'email' : 'tel'}
            placeholder={inviteType === 'email' ? 'friend@example.com' : '+1 (555) 123-4567'}
            value={currentInvite}
            onChange={(e) => setCurrentInvite(e?.target?.value)}
            onKeyPress={handleKeyPress}
            error={getInputError()}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddInvite}
          disabled={!currentInvite?.trim() || !!getInputError()}
          iconName="Plus"
          className="shrink-0"
        >
          Add
        </Button>
      </div>
      {/* Invite List */}
      {inviteList?.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Pending Invitations ({inviteList?.length})
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {inviteList?.map((invite) => (
              <div
                key={invite?.id}
                className="flex items-center justify-between bg-muted/50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={invite?.type === 'email' ? 'Mail' : 'Phone'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm text-foreground">
                    {invite?.value}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveInvite(invite?.id)}
                  iconName="X"
                  className="text-muted-foreground hover:text-error"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Info Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-primary">
            <p className="font-medium mb-1">Invitation Process</p>
            <p>
              Invitations will be sent automatically after the trip is created. 
              Members can also join later using the trip's invite link or QR code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInvitation;