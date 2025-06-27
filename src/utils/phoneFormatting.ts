/**
 * Phone number formatting utilities for Square API integration
 */

/**
 * Transforms a user-friendly phone number format to E.164 format required by Square
 * E.164: +{country code}{phone number without leading zeros or special characters}
 * 
 * @param phone The phone number to format (e.g., (415) 555-1234)
 * @returns The E.164 formatted phone number (e.g., +14155551234)
 */
export function formatPhoneForSquare(phone: string): string {
  // Strip all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Handle US numbers (most common case)
  if (digitsOnly.length === 10) {
    // Assume US number and add +1 country code
    return `+1${digitsOnly}`;
  } else if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
    // Already has US country code, just add + prefix
    return `+${digitsOnly}`;
  } else {
    // Handle other international numbers or return as-is with + prefix
    return `+${digitsOnly}`;
  }
}

/**
 * Formats a phone number for display in US format: (XXX) XXX-XXXX
 * 
 * @param phone The E.164 phone number (e.g., +14155551234)
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
  // Handle US phone numbers (most common case)
  if (phone.startsWith('+1') && phone.length === 12) {
    return `(${phone.substring(2, 5)}) ${phone.substring(5, 8)}-${phone.substring(8)}`;
  }
  
  // Return as-is for other formats
  return phone;
}

/**
 * Validates if a phone number has a valid format
 * 
 * @param phone The phone number to validate
 * @returns true if valid, false otherwise
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic validation - must have at least 10 digits
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Most countries have 10+ digit phone numbers including country code
  return digitsOnly.length >= 10;
}

/**
 * Creates a formatted phone input value as user types
 * 
 * @param value Current input value
 * @returns Formatted value with US formatting (XXX) XXX-XXXX
 */
export function formatPhoneInput(value: string): string {
  if (!value) return '';
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length < 4) {
    return digits;
  } else if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
}
