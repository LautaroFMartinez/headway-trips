// Simple in-memory rate limiter
// For production at scale, consider using Redis or Upstash

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean every minute

export interface RateLimitConfig {
  // Maximum number of requests allowed in the window
  limit: number;
  // Time window in seconds
  windowInSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Whether the request is allowed and rate limit info
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowInSeconds * 1000;
  const key = identifier;

  const entry = rateLimitMap.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      resetIn: config.windowInSeconds,
    };
  }

  // Check if over limit
  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(key, entry);

  return {
    success: true,
    remaining: config.limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Get client identifier from request
 * Tries to get real IP from various headers
 */
export function getClientIdentifier(request: Request): string {
  const headers = new Headers(request.headers);

  // Try various headers that might contain the real IP
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // Fallback to a generic identifier
  return 'unknown-client';
}

// Preset configurations for different endpoints
export const RATE_LIMITS = {
  // Contact form: 5 requests per 15 minutes
  contact: {
    limit: 5,
    windowInSeconds: 900, // 15 minutes
  },
  // Quote requests: 10 requests per 15 minutes
  quotes: {
    limit: 10,
    windowInSeconds: 900, // 15 minutes
  },
  // API general: 100 requests per minute
  api: {
    limit: 100,
    windowInSeconds: 60,
  },
  // PDF generation: 20 requests per minute
  pdf: {
    limit: 20,
    windowInSeconds: 60,
  },
} as const;
