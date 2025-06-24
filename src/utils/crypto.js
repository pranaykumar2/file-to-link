/**
 * Secure cryptography utilities for Filestream-CF
 * Uses Web Crypto API with AES-GCM for strong encryption
 */

import { getConfig } from './config.js';

/**
 * Encrypt a message ID securely
 * @param {string|number} messageId - The message ID to encrypt
 * @returns {Promise<string>} - URL-safe encrypted hash
 */
export async function encryptMessageId(messageId) {
  try {
    // Convert message ID to string
    const messageIdStr = messageId.toString();
    
    // Generate a random salt (16 bytes)
    const salt = crypto.randomUUID().slice(0, 16);
    
    // Prepare data for encryption
    const encoder = new TextEncoder();
    const messageData = encoder.encode(messageIdStr);
    
    // Derive encryption key from our secret and salt
    const key = await deriveKey(salt);
    
    // Generate a random initialization vector (IV) - 12 bytes is recommended for AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the message ID
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      messageData
    );
    
    // Combine salt, IV, and encrypted data into one array
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(encoder.encode(salt));
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    // Convert to URL-safe base64
    return toBase64Url(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message ID');
  }
}

/**
 * Decrypt an encrypted message ID
 * @param {string} encryptedHash - URL-safe encrypted hash
 * @returns {Promise<string>} - The original message ID
 */
export async function decryptMessageId(encryptedHash) {
  try {
    // Decode URL-safe base64
    const decoded = fromBase64Url(encryptedHash);
    
    // Extract salt, IV, and ciphertext
    const decoder = new TextDecoder();
    const salt = decoder.decode(decoded.slice(0, 16));
    const iv = decoded.slice(16, 28);
    const ciphertext = decoded.slice(28);
    
    // Derive key from salt
    const key = await deriveKey(salt);
    
    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    // Convert to string and return
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Invalid or tampered file hash');
  }
}

/**
 * Derive an encryption key from a salt using PBKDF2
 * @param {string} salt - The salt value
 * @returns {Promise<CryptoKey>} - The derived key
 * @private
 */
async function deriveKey(salt) {
  const { SIA_SECRET } = getConfig();
  const encoder = new TextEncoder();
  
  // Import the secret as a key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SIA_SECRET),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive a key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Convert a Uint8Array to URL-safe base64
 * @param {Uint8Array} buffer - The buffer to encode
 * @returns {string} - URL-safe base64 string
 * @private
 */
function toBase64Url(buffer) {
  // Convert to regular base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  // Make URL-safe by replacing characters and removing padding
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Convert URL-safe base64 to Uint8Array
 * @param {string} base64Url - URL-safe base64 string
 * @returns {Uint8Array} - Decoded data
 * @private
 */
function fromBase64Url(base64Url) {
  // Restore base64 standard characters
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }
  
  // Decode
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

/**
 * Generate a secure random string
 * @param {number} length - Length of the string
 * @param {boolean} alphanumericOnly - Whether to use only alphanumeric characters
 * @returns {string} - Random string
 */
export function generateSecureToken(length = 32, alphanumericOnly = false) {
  const charset = alphanumericOnly
    ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()[]{}|;:,.<>?';
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
}