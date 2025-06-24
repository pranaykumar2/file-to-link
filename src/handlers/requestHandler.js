/**
 * Main request handler for Filestream-CF
 * Routes requests to appropriate handlers based on path
 */

import { getConfig, getError } from '../utils/config.js';
import { createErrorResponse } from '../utils/helpers.js';
import { handleApiRequest } from './apiHandler.js';
import { handleFileRequest } from './fileHandler.js';
import { handleUIRequest } from './uiHandler.js';

/**
 * Handle incoming requests and route to appropriate handlers
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
export async function handleRequest(event) {
  const { request } = event;
  const url = new URL(request.url);
  const config = getConfig();
  
  // Handle preflight requests for CORS
  if (request.method === 'OPTIONS') {
    return handleCorsRequest(request);
  }
  
  // Check if method is allowed
  if (!config.ALLOWED_METHODS.includes(request.method)) {
    return createErrorResponse(getError('ERROR_405'), 405);
  }
  
  try {
    // Route to appropriate handler based on path
    if (url.pathname === config.BOT_WEBHOOK || 
        url.pathname === '/registerWebhook' || 
        url.pathname === '/unregisterWebhook' || 
        url.pathname === '/getMe') {
      return await handleApiRequest(event);
    }
    
    // File request (with file parameter)
    if (url.searchParams.has('file')) {
      return await handleFileRequest(event);
    }
    
    // UI request (main page, no file parameter)
    return await handleUIRequest(event);
  } catch (error) {
    console.error('Unhandled error:', error);
    return createErrorResponse(getError('ERROR_500'), 500);
  }
}

/**
 * Handle CORS preflight requests
 * @param {Request} request - The incoming request
 * @returns {Response} CORS preflight response
 */
function handleCorsRequest(request) {
  const config = getConfig();
  
  // Extract the origin from the request
  const origin = request.headers.get('Origin') || '*';
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}