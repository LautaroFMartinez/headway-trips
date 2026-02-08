import crypto from 'crypto';

const TOKEN_EXPIRY_HOURS = 48;

export function generateBookingToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getTokenExpiration(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + TOKEN_EXPIRY_HOURS);
  return expiration;
}
