import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ManualCodeEntry = ({ onCodeSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Auto-format trip code as user types
  const formatTripCode = (value) => {
    // Remove all non-alphanumeric characters
    const cleaned = value?.replace(/[^A-Za-z0-9]/g, '')?.toUpperCase();
    
    // Add TRIP_ prefix if not present and format as TRIP_XXXXXX
    if (cleaned?.length > 0 && !cleaned?.startsWith('TRIP')) {
      return `TRIP_${cleaned?.slice(0, 6)}`;
    }
    
    if (cleaned?.startsWith('TRIP')) {
      const code = cleaned?.slice(4);
      return `TRIP_${code?.slice(0, 6)}`;
    }
    
    return cleaned;
  };

  const handleCodeChange = (e) => {
    const formattedCode = formatTripCode(e?.target?.value);
    setCode(formattedCode);
    setError('');
  };

  const validateCode = async (tripCode) => {
    setIsValidating(true);
    
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validCodes = ['TRIP_ABC123', 'TRIP_XYZ789', 'TRIP_DEF456'];
    const isValid = validCodes?.includes(tripCode);
    
    setIsValidating(false);
    
    if (isValid) {
      onCodeSubmit(tripCode);
    } else {
      setError('Invalid trip code. Please check and try again.');
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!code) {
      setError('Please enter a trip code');
      return;
    }
    
    if (code?.length < 10) {
      setError('Trip code must be at least 6 characters');
      return;
    }
    
    validateCode(code);
  };

  // Auto-validate when code reaches full length
  useEffect(() => {
    if (code?.length === 10 && code?.startsWith('TRIP_')) {
      const timer = setTimeout(() => {
        validateCode(code);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [code]);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <Icon name="Hash" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Enter Trip Code</h3>
          <p className="text-sm text-muted-foreground">
            Type the unique code shared by your trip organizer
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            label="Trip Code"
            placeholder="TRIP_XXXXXX"
            value={code}
            onChange={handleCodeChange}
            error={error}
            disabled={isLoading || isValidating}
            className="font-mono text-center text-lg tracking-wider"
            maxLength={10}
          />
          
          {isValidating && (
            <div className="absolute right-3 top-9 flex items-center">
              <Icon name="Loader2" size={16} className="text-primary animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Info" size={12} className="mr-1" />
            <span>Format: TRIP_ABC123</span>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Icon name="Shield" size={12} className="mr-1" />
            <span>Codes are case-insensitive</span>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!code || code?.length < 10 || isLoading || isValidating}
          loading={isLoading || isValidating}
        >
          {isValidating ? 'Validating...' : 'Join Trip'}
        </Button>
      </form>
      {/* Example codes for demo */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Demo codes to try:</p>
        <div className="flex flex-wrap gap-2">
          {['TRIP_ABC123', 'TRIP_XYZ789', 'TRIP_DEF456']?.map((demoCode) => (
            <button
              key={demoCode}
              onClick={() => setCode(demoCode)}
              className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs font-mono transition-colors"
              disabled={isLoading || isValidating}
            >
              {demoCode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManualCodeEntry;