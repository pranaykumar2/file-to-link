/**
 * Rate limiter implementation for Filestream-CF
 */

import { getConfig, isFeatureEnabled } from './config.js';

// In-memory store for rate limiting (in production, use KV or Durable Objects)
const ipLimits = new Map();

/**
 * Check if a request exceeds the rate limit
 * @param {Request} request - The incoming request
 * @returns {Promise<boolean>} - True if rate limit is exceeded
 */
export async function isRateLimited(request) {
  // Skip if rate limiting is disabled
  if (!isFeatureEnabled('RATE_LIMITING')) {
    return false;
  }
  
  const config = getConfig();
  const clientIp = getClientIp(request);
  const now = Date.now();
  const limit = config.RATE_LIMIT.REQUESTS_PER_MINUTE;
  const window = config.RATE_LIMIT.WINDOW_MS;
  
  // Get or create rate limit record for this IP
  if (!ipLimits.has(clientIp)) {
    ipLimits.set(clientIp, {
      count: 1,
      timestamp: now
    });
    return false;
  }
  
  const record = ipLimits.get(clientIp);
  
  // Reset if outside window
  if (now - record.timestamp > window) {
    record.count = 1;
    record.timestamp = now;
    return false;
  }
  
  // Increment count and check
  record.count++;
  
  // Clean up old entries occasionally
  if (Math.random() < 0.01) {
    cleanupOldEntries(window);
  }
  
  return record.count > limit;
}

/**
 * Get client IP address from request
 * @param {Request} request - The incoming request
 * @returns {string} - Client IP address
 */
function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For') || 
         'unknown';
}

/**
 * Clean up expired rate limit entries
 * @param {number} window - Time window in milliseconds
 */
function cleanupOldEntries(window) {
  const now = Date.now();
  for (const [ip, data] of ipLimits.entries()) {
    if (now - data.timestamp > window * 2) {
      ipLimits.delete(ip);
    }
  }
}