/**
 * Helper utilities for Filestream-CF
 */

import { getConfig } from './config.js';

/**
 * Generate a UUID v4
 * @returns {string} - A random UUID
 */
export function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Return a formatted error response
 * @param {Object} errorData - Error data object
 * @param {number} statusCode - HTTP status code
 * @param {Object} headers - Additional headers
 * @returns {Response} - Formatted error response
 */
export function createErrorResponse(errorData, statusCode, headers = {}) {
  const config = getConfig();
  
  return new Response(JSON.stringify(errorData), { 
    status: statusCode, 
    headers: {
      ...config.HEADERS.API,
      ...headers
    } 
  });
}

/**
 * Create a successful JSON response
 * @param {Object} data - The data to include in the response
 * @param {number} status - HTTP status code (default: 200)
 * @param {Object} headers - Additional headers
 * @returns {Response} - Formatted JSON response
 */
export function createJsonResponse(data, status = 200, headers = {}) {
  const config = getConfig();
  
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      ...config.HEADERS.API,
      ...headers
    }
  });
}

/**
 * Validate content type of a file
 * @param {string} mimeType - MIME type to validate
 * @returns {boolean} - True if valid
 */
export function isValidContentType(mimeType) {
  // List of allowed MIME types (could be expanded)
  const allowedTypes = [
    /^image\/.+/,
    /^video\/.+/,
    /^audio\/.+/,
    /^application\/pdf$/,
    /^application\/zip$/,
    /^application\/x-zip-compressed$/,
    /^application\/json$/,
    /^application\/javascript$/,
    /^text\/.+/,
    /^application\/octet-stream$/
  ];
  
  return allowedTypes.some(pattern => pattern.test(mimeType));
}

/**
 * Sanitize a filename to make it safe for headers
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
export function sanitizeFilename(filename) {
  if (!filename) return 'unknown_file';
  
  // Remove path information
  let sanitized = filename.replace(/^.*[\\\/]/, '');
  
  // Remove or replace characters that could cause problems
  sanitized = sanitized
    .replace(/[^\w\s\.\-]/g, '_')  // Replace special chars with underscore
    .replace(/\s+/g, '_');         // Replace spaces with underscore
  
  return sanitized.substring(0, 255); // Limit length
}

/**
 * Format a file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate if a string is a valid Telegram bot token
 * @param {string} token - The token to validate
 * @returns {boolean} - True if valid
 */
export function isValidBotToken(token) {
  // Bot tokens are in the format: 123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi
  return /^\d+:[\w-]{35,}$/.test(token);
}

/**
 * Validate if a number is a valid Telegram channel ID
 * @param {string|number} channelId - The channel ID to validate
 * @returns {boolean} - True if valid
 */
export function isValidChannelId(channelId) {
  // Channel IDs should start with -100 followed by numbers
  return /^-100\d{6,}$/.test(String(channelId));
}