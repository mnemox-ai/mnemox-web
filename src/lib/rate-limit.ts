import { createHash } from 'crypto';

/**
 * Simple in-memory rate limiter using a Map with TTL.
 * For production at scale, consider using Redis or Vercel KV.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on cold starts - acceptable for basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration constants
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const IP_HASH_SALT = process.env.IP_HASH_SALT;

if (!IP_HASH_SALT && process.env.NODE_ENV === 'production') {
  console.warn('[rate-limit] IP_HASH_SALT is not set. Using fallback salt.');
}

/**
 * Hash an IP address for privacy.
 */
export function hashIP(ip: string): string {
  const salt = IP_HASH_SALT || 'mnemox-default-salt';
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Extract client IP from request headers.
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown';
}

/**
 * Check if a request should be rate limited.
 * @returns Object with `limited` boolean and `remaining` count
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!entry || entry.resetAt < now) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { limited: false, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetIn: entry.resetAt - now,
    };
  }

  // Increment count
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetAt - now,
  };
}

/**
 * Convenience function for API routes.
 */
export function rateLimitRequest(
  request: Request,
  maxRequests?: number,
  windowMs?: number
): { limited: boolean; remaining: number; resetIn: number; ipHash: string } {
  const ip = getClientIP(request);
  const ipHash = hashIP(ip);
  const result = checkRateLimit(ipHash, maxRequests, windowMs);
  return { ...result, ipHash };
}
