/**
 * UI request handler for Filestream-CF
 * Serves the web interface for configuration and documentation
 */

import { getConfig } from '../utils/config.js';
import { configGenerator } from '../ui/configGenerator.js';

/**
 * Handle UI-related requests (main page, assets)
 * @param {Event} event - Cloudflare Worker event
 * @returns {Promise<Response>} HTTP response
 */
export async function handleUIRequest(event) {
  const { request } = event;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Serve configuration generator at root path
  if (path === '/' || path === '/index.html') {
    return new Response(configGenerator, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
  
  // Serve documentation page
  if (path === '/docs' || path === '/documentation') {
    return serveDocumentation();
  }
  
  // Serve about page
  if (path === '/about') {
    return serveAbout();
  }
  
  // Serve 404 page for unrecognized paths
  return serve404();
}

/**
 * Serve the documentation page
 * @returns {Response} HTTP response
 */
function serveDocumentation() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Filestream-CF - Documentation</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #111827;
          color: #f9fafb;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        a {
          color: #6366f1;
          text-decoration: underline;
        }
        a:hover {
          color: #4f46e5;
        }
        .card {
          background-color: #1f2937;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #374151;
        }
        .code {
          background-color: #111827;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
          font-family: monospace;
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="text-4xl font-bold mb-8">Filestream-CF Documentation</h1>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
          <p class="mb-4">Filestream-CF is a Telegram bot that allows you to share files through generated links. Files are stored in a Telegram channel and can be accessed via direct links, inline sharing, or through the bot.</p>
          <p class="mb-4">To get started, you'll need:</p>
          <ul class="list-disc list-inside mb-4">
            <li>A Telegram bot token (from <a href="https://t.me/botfather" target="_blank">@BotFather</a>)</li>
            <li>A Telegram channel where the bot is an admin</li>
            <li>A Cloudflare account for deploying the Worker</li>
          </ul>
          <p>Visit the <a href="/">Configuration Generator</a> to create your Worker code.</p>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Setting Up Your Bot</h2>
          <ol class="list-decimal list-inside mb-4 space-y-2">
            <li>Create a new bot with <a href="https://t.me/botfather" target="_blank">@BotFather</a></li>
            <li>Enable inline mode for your bot using the /setinline command</li>
            <li>Create a channel and add your bot as an administrator</li>
            <li>Get your user ID from <a href="https://t.me/username_to_id_bot" target="_blank">@username_to_id_bot</a></li>
            <li>Get your channel ID by forwarding a message from it to @username_to_id_bot</li>
            <li>Use the Configuration Generator to create your Worker code</li>
            <li>Deploy the code to Cloudflare Workers</li>
            <li>Visit your-worker-url.workers.dev/registerWebhook to set up the webhook</li>
          </ol>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Usage</h2>
          <p class="mb-4">Once set up, you can:</p>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Send any file to your bot to generate sharing links</li>
            <li>Use the inline mode to share files within Telegram chats</li>
            <li>Share direct download links for files up to 20MB</li>
            <li>Share streaming links for media files</li>
            <li>Share Telegram links for files of any size (up to 4GB)</li>
          </ul>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Security</h2>
          <p class="mb-4">Filestream-CF uses modern cryptography to secure file hashes:</p>
          <ul class="list-disc list-inside mb-4">
            <li>AES-GCM encryption for file hashes</li>
            <li>PBKDF2 key derivation with SHA-256</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Private mode option to restrict usage to the bot owner</li>
          </ul>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Technical Details</h2>
          <p class="mb-4">File size limitations:</p>
          <ul class="list-disc list-inside mb-4">
            <li>Telegram links: Up to 4GB</li>
            <li>Inline sharing: Up to 4GB</li>
            <li>Direct download/streaming: Up to 20MB (Cloudflare Workers limit)</li>
          </ul>
          <p class="mb-4">Example API usage:</p>
          <div class="code">
          GET /?file=YOUR_FILE_HASH           # Download file
          GET /?file=YOUR_FILE_HASH&mode=inline   # Stream file
          </div>
        </div>
        
        <p class="text-center text-gray-400 mt-8">
          <a href="/">Back to Home</a> | 
          <a href="/about">About</a> | 
          <a href="https://github.com/pranaykumar2/filestream-cf" target="_blank">GitHub</a>
        </p>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

/**
 * Serve the about page
 * @returns {Response} HTTP response
 */
function serveAbout() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Filestream-CF - About</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #111827;
          color: #f9fafb;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        a {
          color: #6366f1;
          text-decoration: underline;
        }
        a:hover {
          color: #4f46e5;
        }
        .card {
          background-color: #1f2937;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid #374151;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="text-4xl font-bold mb-8">About Filestream-CF</h1>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Project</h2>
          <p class="mb-4">Filestream-CF is an open-source project that provides a secure way to share files through Telegram using Cloudflare Workers. It allows you to create shareable links for files of any size, with multiple access methods.</p>
          <p>The project is designed to be easy to deploy, secure, and privacy-focused.</p>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Features</h2>
          <ul class="list-disc list-inside mb-4 space-y-2">
            <li>Secure file sharing through Telegram</li>
            <li>Multiple access methods (direct links, inline sharing, Telegram links)</li>
            <li>Modern cryptography for file hash security</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Responsive web interface for configuration</li>
            <li>Easy deployment to Cloudflare Workers</li>
            <li>No additional storage costs (files stored in Telegram)</li>
          </ul>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">Credits</h2>
          <p class="mb-4">Original project by <a href="https://github.com/vauth/filestream-cf" target="_blank">Vauth</a></p>
          <p class="mb-4">Enhanced version by <a href="https://github.com/pranaykumar2" target="_blank">pranaykumar2</a></p>
          <p>Special thanks to the Cloudflare Workers and Telegram Bot API teams for making this project possible.</p>
        </div>
        
        <div class="card">
          <h2 class="text-2xl font-semibold mb-4">License</h2>
          <p>This project is licensed under the MIT License - see the <a href="https://github.com/pranaykumar2/filestream-cf/blob/main/LICENSE" target="_blank">LICENSE</a> file for details.</p>
        </div>
        
        <p class="text-center text-gray-400 mt-8">
          <a href="/">Back to Home</a> | 
          <a href="/docs">Documentation</a> | 
          <a href="https://github.com/pranaykumar2/filestream-cf" target="_blank">GitHub</a>
        </p>
      </div>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

/**
 * Serve a 404 page
 * @returns {Response} HTTP response
 */
function serve404() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Page Not Found</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
          background-color: #111827;
          color: #f9fafb;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 600px;
          text-align: center;
          padding: 2rem;
        }
        a {
          color: #6366f1;
          text-decoration: underline;
        }
        a:hover {
          color: #4f46e5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="text-6xl font-bold mb-4">404</h1>
        <h2 class="text-2xl font-medium mb-6">Page Not Found</h2>
        <p class="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div>
          <a href="/" class="px-4 py-2 bg-indigo-600 text-white rounded-md no-underline hover:bg-indigo-700">Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `, {
    status: 404,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}