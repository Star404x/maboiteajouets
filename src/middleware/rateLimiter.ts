import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

// In-memory store (for now; can be replaced with Redis)
const rateLimitStore: RateLimitStore = {};

/**
 * Simple rate limiter middleware
 * Limits requests per IP per time window
 */
export function rateLimit(options: {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: NextRequest) => string; // Custom key (default: IP)
} = { windowMs: 60000, maxRequests: 100 }) {
  return (handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) => {
    return async (request: NextRequest) => {
      // Generate rate limit key (IP or custom)
      const key = options.keyGenerator
        ? options.keyGenerator(request)
        : request.ip || 'unknown';

      const now = Date.now();
      const record = rateLimitStore[key];

      // Initialize or reset if window expired
      if (!record || now > record.resetTime) {
        rateLimitStore[key] = {
          count: 1,
          resetTime: now + options.windowMs,
        };
        return handler(request);
      }

      // Check if exceeded limit
      if (record.count >= options.maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((record.resetTime - now) / 1000)),
              'X-RateLimit-Limit': String(options.maxRequests),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(Math.ceil(record.resetTime / 1000)),
            },
          }
        );
      }

      // Increment counter
      record.count++;

      // Add rate limit headers to response
      const response = await handler(request);
      response.headers.set('X-RateLimit-Limit', String(options.maxRequests));
      response.headers.set('X-RateLimit-Remaining', String(options.maxRequests - record.count));
      response.headers.set('X-RateLimit-Reset', String(Math.ceil(record.resetTime / 1000)));

      return response;
    };
  };
}

/**
 * More permissive rate limiter for public endpoints
 * 100 requests per minute per IP
 */
export const publicRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

/**
 * Stricter rate limiter for auth endpoints
 * 5 requests per minute per IP (brute force protection)
 */
export const authRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
});

/**
 * Moderate rate limiter for API endpoints
 * 30 requests per minute per IP
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});
