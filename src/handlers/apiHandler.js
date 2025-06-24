/**
 * API request handler for Filestream-CF
 * Handles Telegram webhook and bot configuration endpoints
 */

import { getConfig, getError } from '../utils/config.js';
import { createErrorResponse, createJsonResponse } from '../utils/helpers.js';
import { TelegramBot } from '../services/telegramBot.js';

/**
 * Handle API-related requests (webhook, registration, etc.)
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
export async function handleApiRequest(event) {
  const { request } = event;
  const url = new URL(request.url);
  const config = getConfig();
  
  // Route to appropriate API handler
  switch (url.pathname) {
    case config.BOT_WEBHOOK:
      return await handleWebhook(event);
      
    case '/registerWebhook':
      return await registerWebhook(event);
      
    case '/unregisterWebhook':
      return await unregisterWebhook(event);
      
    case '/getMe':
      return await getMe(event);
      
    default:
      return createErrorResponse(getError('ERROR_404'), 404);
  }
}

/**
 * Handle incoming webhook requests from Telegram
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
async function handleWebhook(event) {
  try {
    return await TelegramBot.handleWebhook(event);
  } catch (error) {
    console.error('Webhook handling error:', error);
    return createErrorResponse(getError('ERROR_500'), 500);
  }
}

/**
 * Register the webhook URL with Telegram
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
async function registerWebhook(event) {
  try {
    const config = getConfig();
    const url = new URL(event.request.url);
    
    const response = await TelegramBot.registerWebhook(
      url,
      config.BOT_WEBHOOK,
      config.BOT_SECRET
    );
    
    return response;
  } catch (error) {
    console.error('Webhook registration error:', error);
    return createErrorResponse({
      ok: false,
      error_code: 500,
      description: 'Failed to register webhook: ' + error.message
    }, 500);
  }
}

/**
 * Unregister the webhook from Telegram
 * @returns {Promise<Response>} HTTP response
 */
async function unregisterWebhook() {
  try {
    return await TelegramBot.unregisterWebhook();
  } catch (error) {
    console.error('Webhook unregistration error:', error);
    return createErrorResponse({
      ok: false,
      error_code: 500,
      description: 'Failed to unregister webhook: ' + error.message
    }, 500);
  }
}

/**
 * Get information about the bot
 * @returns {Promise<Response>} HTTP response
 */
async function getMe() {
  try {
    const botInfo = await TelegramBot.getMe();
    return createJsonResponse(botInfo);
  } catch (error) {
    console.error('Get bot info error:', error);
    return createErrorResponse({
      ok: false,
      error_code: 500,
      description: 'Failed to get bot information: ' + error.message
    }, 500);
  }
}