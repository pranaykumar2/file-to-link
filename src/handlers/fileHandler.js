/**
 * File request handler for Filestream-CF
 * Handles file retrieval and serving
 */

import { getConfig, getError } from '../utils/config.js';
import { createErrorResponse, sanitizeFilename } from '../utils/helpers.js';
import { isRateLimited } from '../utils/rateLimiter.js';
import { decryptMessageId } from '../utils/crypto.js';
import { TelegramBot } from '../services/telegramBot.js';

/**
 * Handle file-related requests
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
export async function handleFileRequest(event) {
  const { request } = event;
  const url = new URL(request.url);
  const config = getConfig();
  
  // Extract parameters
  const fileHash = url.searchParams.get('file');
  const mode = url.searchParams.get('mode') || 'attachment';
  
  // Validate mode parameter
  if (!['attachment', 'inline'].includes(mode)) {
    return createErrorResponse(getError('ERROR_408'), 400);
  }
  
  // Apply rate limiting
  if (await isRateLimited(request)) {
    return createErrorResponse(getError('ERROR_429'), 429);
  }
  
  try {
    // Decrypt file hash to get message ID
    const messageId = await decryptMessageId(fileHash);
    
    // Retrieve and serve the file
    return await retrieveAndServeFile(messageId, mode);
  } catch (error) {
    console.error('File retrieval error:', error);
    
    if (error.message === 'Invalid or tampered file hash') {
      return createErrorResponse(getError('ERROR_407'), 400);
    }
    
    return createErrorResponse({
      ok: false,
      error_code: 500,
      description: 'File retrieval failed: ' + error.message
    }, 500);
  }
}

/**
 * Retrieve a file from Telegram and serve it
 * @param {string} messageId - The message ID containing the file
 * @param {string} mode - Content disposition mode (attachment/inline)
 * @returns {Promise<Response>} - HTTP response with the file
 */
async function retrieveAndServeFile(messageId, mode) {
  const config = getConfig();
  const channelId = config.BOT_CHANNEL;
  
  try {
    // Get file info from Telegram by editing the message caption
    // This is a clever technique to retrieve file information without downloading it first
    const fileInfo = await retrieveFileInfo(channelId, messageId);
    
    if (fileInfo.error_code) {
      return createErrorResponse(fileInfo, fileInfo.error_code);
    }
    
    const { fileId, fileName, fileType, fileSize } = fileInfo;
    
    // Get file path from Telegram
    const file = await TelegramBot.getFile(fileId);
    
    if (file.error_code) {
      return createErrorResponse(file, file.error_code);
    }
    
    // Fetch the actual file data
    const fileData = await TelegramBot.fetchFile(file.file_path);
    
    // Serve the file with appropriate headers
    return new Response(fileData, {
      status: 200,
      headers: {
        "Content-Disposition": `${mode}; filename="${sanitizeFilename(fileName)}"`,
        "Content-Length": fileSize,
        "Content-Type": fileType,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
        ...config.HEADERS.FILE
      }
    });
  } catch (error) {
    console.error('File serving error:', error);
    throw error;
  }
}

/**
 * Retrieve file information from Telegram
 * @param {string|number} channelId - Channel ID
 * @param {string|number} messageId - Message ID
 * @returns {Promise<Object>} - File information
 */
async function retrieveFileInfo(channelId, messageId) {
  try {
    // Edit message caption with a random UUID to retrieve the message data
    const data = await TelegramBot.editMessageCaption(channelId, messageId, crypto.randomUUID());
    
    if (data.error_code) {
      return data;
    }
    
    // Extract file information based on message type
    let fileId, fileName, fileType, fileSize;
    
    if (data.document) {
      fileId = data.document.file_id;
      fileName = data.document.file_name;
      fileType = data.document.mime_type;
      fileSize = data.document.file_size;
    } else if (data.audio) {
      fileId = data.audio.file_id;
      fileName = data.audio.file_name;
      fileType = data.audio.mime_type;
      fileSize = data.audio.file_size;
    } else if (data.video) {
      fileId = data.video.file_id;
      fileName = data.video.file_name;
      fileType = data.video.mime_type;
      fileSize = data.video.file_size;
    } else if (data.photo) {
      const photoItem = data.photo[data.photo.length - 1]; // Get highest resolution
      fileId = photoItem.file_id;
      fileName = `${photoItem.file_unique_id}.jpg`;
      fileType = "image/jpeg";
      fileSize = photoItem.file_size;
    } else {
      return getError('ERROR_406');
    }
    
    return { fileId, fileName, fileType, fileSize };
  } catch (error) {
    console.error('Error retrieving file info:', error);
    throw new Error('Failed to retrieve file information');
  }
}