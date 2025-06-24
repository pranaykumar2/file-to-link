/**
 * Filestream-CF: A secure file sharing Telegram bot using Cloudflare Workers
 * @version 2.0.0
 * @author Original: Vauth, Enhanced: pranaykumar2
 * @license MIT
 */

import { handleRequest } from './handlers/requestHandler.js';
import { initializeConfig } from './utils/config.js';

// Initialize global configuration
initializeConfig();

// Register the fetch event handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});