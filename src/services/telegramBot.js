/**
 * Telegram Bot API service for Filestream-CF
 */

import { getConfig } from '../utils/config.js';
import { createJsonResponse, generateUUID } from '../utils/helpers.js';
import { encryptMessageId } from '../utils/crypto.js';

/**
 * Telegram Bot API client
 */
export class TelegramBot {
  /**
   * Handle a webhook update from Telegram
   * @param {Event} event - Cloudflare Worker event
   * @returns {Response} - HTTP response
   */
  static async handleWebhook(event) {
    const { BOT_SECRET } = getConfig();
    
    // Verify webhook secret
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_SECRET) {
      return new Response('Unauthorized', { status: 403 });
    }
    
    try {
      // Process update
      const update = await event.request.json();
      event.waitUntil(this.processUpdate(event, update));
      
      return new Response('Ok');
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Bad Request', { status: 400 });
    }
  }
  
  /**
   * Process a Telegram update
   * @param {Event} event - Cloudflare Worker event
   * @param {Object} update - Telegram update object
   */
  static async processUpdate(event, update) {
    // Handle different types of updates
    if (update.inline_query) {
      await this.handleInlineQuery(event, update.inline_query);
    }
    
    if ('message' in update) {
      await this.handleMessage(event, update.message);
    }
  }
  
  /**
   * Handle an inline query
   * @param {Event} event - Cloudflare Worker event
   * @param {Object} inlineQuery - Telegram inline query
   */
  static async handleInlineQuery(event, inlineQuery) {
    const config = getConfig();
    const { PUBLIC_BOT, BOT_OWNER, BOT_CHANNEL } = config;
    
    // Check if bot is public or user is the owner
    if (!PUBLIC_BOT && inlineQuery.from.id != BOT_OWNER) {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return await this.answerInlineArticle(
        inlineQuery.id,
        "Access forbidden",
        "Deploy your own filestream-cf.",
        "*❌ Access forbidden.*\n📡 Deploy your own [filestream-cf](https://github.com/pranaykumar2/filestream-cf) bot.",
        buttons
      );
    }
    
    // Validate query format
    try {
      const messageId = await this.tryDecryptQuery(inlineQuery.query);
      if (!messageId) {
        throw new Error('Invalid query format');
      }
      
      // Get file info by editing message caption
      const data = await this.editMessageCaption(BOT_CHANNEL, messageId, await generateUUID());
      
      if (data.error_code) {
        const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
        return await this.answerInlineArticle(
          inlineQuery.id,
          "Error",
          data.description,
          data.description,
          buttons
        );
      }
      
      // Process different file types
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
        const photoIndex = data.photo.length - 1;
        fileId = data.photo[photoIndex].file_id;
        fileName = `${data.photo[photoIndex].file_unique_id}.jpg`;
        fileType = "image/jpeg";
        fileSize = data.photo[photoIndex].file_size;
      } else {
        throw new Error('Unsupported file type');
      }
      
      // Answer with appropriate inline result
      const buttons = [[{ text: "Send Again", switch_inline_query_current_chat: inlineQuery.query }]];
      
      if (fileType === "image/jpeg") {
        return await this.answerInlinePhoto(
          inlineQuery.id,
          fileName || "Photo",
          fileId,
          buttons
        );
      } else {
        return await this.answerInlineDocument(
          inlineQuery.id,
          fileName || "File",
          fileId,
          fileType,
          buttons
        );
      }
    } catch (error) {
      console.error('Inline query error:', error);
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return await this.answerInlineArticle(
        inlineQuery.id,
        "Error",
        "Invalid file hash or unsupported file type",
        "The file hash is invalid or the file type is not supported.",
        buttons
      );
    }
  }
  
  /**
   * Try to decrypt an inline query
   * @param {string} query - Inline query text
   * @returns {Promise<string|null>} - Decrypted message ID or null
   */
  static async tryDecryptQuery(query) {
    try {
      if (!query || query.trim() === '') {
        return null;
      }
      
      // Import the crypto module dynamically to avoid circular dependencies
      const { decryptMessageId } = await import('../utils/crypto.js');
      return await decryptMessageId(query);
    } catch (error) {
      console.error('Query decryption error:', error);
      return null;
    }
  }
  
  /**
   * Handle a message update
   * @param {Event} event - Cloudflare Worker event
   * @param {Object} message - Telegram message
   */
  static async handleMessage(event, message) {
    const config = getConfig();
    const { PUBLIC_BOT, BOT_OWNER, BOT_CHANNEL } = config;
    const url = new URL(event.request.url);
    let bot;
    
    try {
      bot = await this.getMe();
    } catch (error) {
      console.error('Error getting bot info:', error);
      return;
    }
    
    // Ignore messages from the bot itself
    if (message.via_bot && message.via_bot.username === bot.username) {
      return;
    }
    
    // Ignore channel messages
    if (message.chat.id.toString().includes("-100")) {
      return;
    }
    
    // Handle deep link starts (/start hash)
    if (message.text && message.text.startsWith("/start ")) {
      await this.handleStartCommand(message);
      return;
    }
    
    // Check if bot is public or user is the owner
    if (!PUBLIC_BOT && message.chat.id != BOT_OWNER) {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      await this.sendMessage(
        message.chat.id,
        message.message_id,
        "*❌ Access forbidden.*\n📡 Deploy your own [filestream-cf](https://github.com/pranaykumar2/filestream-cf) bot.",
        buttons
      );
      return;
    }
    
    // Process media files
    try {
      let fileId, fileName, fileType, fileSave;
      
      if (message.document) {
        fileId = message.document.file_id;
        fileName = message.document.file_name;
        fileType = message.document.mime_type.split("/")[0];
        fileSave = await this.sendDocument(BOT_CHANNEL, fileId);
      } else if (message.audio) {
        fileId = message.audio.file_id;
        fileName = message.audio.file_name;
        fileType = message.audio.mime_type.split("/")[0];
        fileSave = await this.sendDocument(BOT_CHANNEL, fileId);
      } else if (message.video) {
        fileId = message.video.file_id;
        fileName = message.video.file_name;
        fileType = message.video.mime_type.split("/")[0];
        fileSave = await this.sendDocument(BOT_CHANNEL, fileId);
      } else if (message.photo) {
        const photoIndex = message.photo.length - 1;
        fileId = message.photo[photoIndex].file_id;
        fileName = `${message.photo[photoIndex].file_unique_id}.jpg`;
        fileType = "image";
        fileSave = await this.sendPhoto(BOT_CHANNEL, fileId);
      } else {
        const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
        await this.sendMessage(
          message.chat.id,
          message.message_id,
          "Send me any file/video/gif/audio *(t<=4GB, e<=20MB)*.",
          buttons
        );
        return;
      }
      
      if (fileSave.error_code) {
        await this.sendMessage(
          message.chat.id,
          message.message_id,
          fileSave.description
        );
        return;
      }
      
      // Generate file hash and links
      const fileHash = await encryptMessageId(fileSave.message_id);
      const directLink = `${url.origin}/?file=${fileHash}`;
      const streamLink = `${url.origin}/?file=${fileHash}&mode=inline`;
      const telegramLink = `https://t.me/${bot.username}/?start=${fileHash}`;
      
      const buttons = [
        [
          { text: "Telegram Link", url: telegramLink },
          { text: "Inline Link", switch_inline_query: fileHash }
        ],
        [
          { text: "Stream Link", url: streamLink },
          { text: "Download Link", url: directLink }
        ]
      ];
      
      const messageText = `*🗂 File Name:* \`${fileName}\`\n*⚙️ File Hash:* \`${fileHash}\``;
      await this.sendMessage(message.chat.id, message.message_id, messageText, buttons);
    } catch (error) {
      console.error('Message handling error:', error);
      await this.sendMessage(
        message.chat.id,
        message.message_id,
        "*❌ Error:* Failed to process file."
      );
    }
  }
  
  /**
   * Handle /start command with deep link
   * @param {Object} message - Telegram message
   */
  static async handleStartCommand(message) {
    try {
      const config = getConfig();
      const fileHash = message.text.split("/start ")[1];
      
      // Import the crypto module dynamically to avoid circular dependencies
      const { decryptMessageId } = await import('../utils/crypto.js');
      
      try {
        const messageId = await decryptMessageId(fileHash);
        const data = await this.editMessageCaption(config.BOT_CHANNEL, messageId, generateUUID());
        
        if (data.error_code) {
          await this.sendMessage(
            message.chat.id,
            message.message_id,
            `*❌ Error:* ${data.description}`
          );
          return;
        }
        
        let fileId;
        
        if (data.document) {
          fileId = data.document.file_id;
          await this.sendDocument(message.chat.id, fileId);
        } else if (data.audio) {
          fileId = data.audio.file_id;
          await this.sendDocument(message.chat.id, fileId);
        } else if (data.video) {
          fileId = data.video.file_id;
          await this.sendDocument(message.chat.id, fileId);
        } else if (data.photo) {
          fileId = data.photo[data.photo.length - 1].file_id;
          await this.sendPhoto(message.chat.id, fileId);
        } else {
          await this.sendMessage(
            message.chat.id,
            message.message_id,
            "Bad Request: File not found"
          );
        }
      } catch (error) {
        console.error('Start command error:', error);
        await this.sendMessage(
          message.chat.id,
          message.message_id,
          "Invalid file hash. The file may have expired or been deleted."
        );
      }
    } catch (error) {
      console.error('Start command handling error:', error);
      await this.sendMessage(
        message.chat.id,
        message.message_id,
        "*❌ Error:* An unexpected error occurred."
      );
    }
  }
  
  /**
   * Register a webhook URL with Telegram
   * @param {URL} url - Base URL for the webhook
   * @param {string} suffix - Webhook path suffix
   * @param {string} secret - Webhook secret
   * @returns {Response} - HTTP response
   */
  static async registerWebhook(url, suffix, secret) {
    const { BOT_TOKEN } = getConfig();
    const webhookUrl = `${url.protocol}//${url.hostname}${suffix}`;
    
    console.log(`Registering webhook: ${webhookUrl}`);
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: webhookUrl,
            secret_token: secret
          })
        }
      );
      
      const data = await response.json();
      return createJsonResponse(data);
    } catch (error) {
      console.error('Error registering webhook:', error);
      return createJsonResponse({
        ok: false,
        description: 'Failed to register webhook: ' + error.message
      }, 500);
    }
  }
  
  /**
   * Unregister the webhook
   * @returns {Response} - HTTP response
   */
  static async unregisterWebhook() {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: ''
          })
        }
      );
      
      const data = await response.json();
      return createJsonResponse(data);
    } catch (error) {
      console.error('Error unregistering webhook:', error);
      return createJsonResponse({
        ok: false,
        description: 'Failed to unregister webhook: ' + error.message
      }, 500);
    }
  }
  
  /**
   * Get bot information
   * @returns {Object} - Bot information
   */
  static async getMe() {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
      return await response.json();
    } catch (error) {
      console.error('Error getting bot info:', error);
      return {
        ok: false,
        description: 'Failed to get bot information: ' + error.message
      };
    }
  }
  
  /**
   * Send a message
   * @param {number|string} chatId - Chat ID
   * @param {number|string} replyId - Message ID to reply to
   * @param {string} text - Message text
   * @param {Array} replyMarkup - Inline keyboard markup
   * @returns {Object} - API response
   */
  static async sendMessage(chatId, replyId, text, replyMarkup = []) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            reply_to_message_id: replyId,
            parse_mode: 'markdown',
            text,
            reply_markup: { inline_keyboard: replyMarkup }
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        ok: false,
        description: 'Failed to send message: ' + error.message
      };
    }
  }
  
  /**
   * Send a document
   * @param {number|string} chatId - Chat ID
   * @param {string} fileId - File ID
   * @returns {Object} - API response
   */
  static async sendDocument(chatId, fileId) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            document: fileId
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error sending document:', error);
      return {
        ok: false,
        description: 'Failed to send document: ' + error.message
      };
    }
  }
  
  /**
   * Send a photo
   * @param {number|string} chatId - Chat ID
   * @param {string} photoId - Photo ID
   * @returns {Object} - API response
   */
  static async sendPhoto(chatId, photoId) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            photo: photoId
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error sending photo:', error);
      return {
        ok: false,
        description: 'Failed to send photo: ' + error.message
      };
    }
  }
  
  /**
   * Edit message caption
   * @param {number|string} chatId - Chat ID
   * @param {number|string} messageId - Message ID
   * @param {string} caption - New caption
   * @returns {Object} - API response
   */
  static async editMessageCaption(chatId, messageId, caption) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/editMessageCaption`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            caption
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error editing message caption:', error);
      return {
        ok: false,
        error_code: 500,
        description: 'Failed to edit message caption: ' + error.message
      };
    }
  }
  
  /**
   * Get file information
   * @param {string} fileId - File ID
   * @returns {Object} - File information
   */
  static async getFile(fileId) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error getting file:', error);
      return {
        ok: false,
        error_code: 500,
        description: 'Failed to get file information: ' + error.message
      };
    }
  }
  
  /**
   * Fetch file content
   * @param {string} filePath - File path
   * @returns {ArrayBuffer} - File content
   */
  static async fetchFile(filePath) {
    const { BOT_TOKEN } = getConfig();
    
    try {
      const response = await fetch(
        `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`
      );
      
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error fetching file:', error);
      throw new Error('Failed to fetch file content: ' + error.message);
    }
  }
  
  /**
   * Answer inline query with an article
   * @param {string} queryId - Inline query ID
   * @param {string} title - Article title
   * @param {string} description - Article description
   * @param {string} text - Message text
   * @param {Array} replyMarkup - Inline keyboard markup
   * @param {string} id - Result ID
   * @returns {Object} - API response
   */
  static async answerInlineArticle(queryId, title, description, text, replyMarkup = [], id = '1') {
    const { BOT_TOKEN } = getConfig();
    
    const data = [{
      type: 'article',
      id,
      title,
      thumbnail_url: "https://i.ibb.co/5s8hhND/dac5fa134448.png",
      description,
      input_message_content: {
        message_text: text,
        parse_mode: 'markdown'
      },
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inline_query_id: queryId,
            results: data,
            cache_time: 1
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error answering inline query with article:', error);
      return {
        ok: false,
        description: 'Failed to answer inline query: ' + error.message
      };
    }
  }
  
  /**
   * Answer inline query with a document
   * @param {string} queryId - Inline query ID
   * @param {string} title - Document title
   * @param {string} fileId - Document file ID
   * @param {string} mimeType - Document MIME type
   * @param {Array} replyMarkup - Inline keyboard markup
   * @param {string} id - Result ID
   * @returns {Object} - API response
   */
  static async answerInlineDocument(queryId, title, fileId, mimeType, replyMarkup = [], id = '1') {
    const { BOT_TOKEN } = getConfig();
    
    const data = [{
      type: 'document',
      id,
      title,
      document_file_id: fileId,
      mime_type: mimeType,
      description: mimeType,
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inline_query_id: queryId,
            results: data,
            cache_time: 1
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error answering inline query with document:', error);
      return {
        ok: false,
        description: 'Failed to answer inline query: ' + error.message
      };
    }
  }
  
  /**
   * Answer inline query with a photo
   * @param {string} queryId - Inline query ID
   * @param {string} title - Photo title
   * @param {string} photoId - Photo file ID
   * @param {Array} replyMarkup - Inline keyboard markup
   * @param {string} id - Result ID
   * @returns {Object} - API response
   */
  static async answerInlinePhoto(queryId, title, photoId, replyMarkup = [], id = '1') {
    const { BOT_TOKEN } = getConfig();
    
    const data = [{
      type: 'photo',
      id,
      title,
      photo_file_id: photoId,
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inline_query_id: queryId,
            results: data,
            cache_time: 1
          })
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error answering inline query with photo:', error);
      return {
        ok: false,
        description: 'Failed to answer inline query: ' + error.message
      };
    }
  }
}