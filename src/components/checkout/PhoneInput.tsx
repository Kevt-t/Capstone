'use client';

import React, { useState } from 'react';
import { formatPhoneInput, isValidPhoneNumber } from '@/utils/phoneFormatting';

interface PhoneInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  required = true,
  className = '',
  placeholder = '(555) 123-4567'
}) => {
  const [touched, setTouched] = useState(false);
  const isValid = !required || !touched || isValidPhoneNumber(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format the phone number as the user types
    const rawValue = e.target.value;
    const formattedValue = formatPhoneInput(rawValue);
    
    // Pass both the formatted value and validity state
    onChange(formattedValue, isValidPhoneNumber(formattedValue));
  };

  return (
    <div className="form-field">
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
          !isValid ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        placeholder={placeholder}
        aria-invalid={!isValid}
        required={required}
      />
      
      {!isValid && (
        <p className="mt-1 text-sm text-red-500">
          Please enter a valid phone number
        </p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Format: (XXX) XXX-XXXX
      </p>
    </div>
  );
};

export default PhoneInput;
