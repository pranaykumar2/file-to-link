/**
 * Configuration generator UI for Filestream-CF
 */

export const configGenerator = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Filestream-CF: A secure file sharing Telegram bot using Cloudflare Workers">
  <meta property="og:title" content="Filestream-CF Generator">
  <meta property="og:description" content="Create your own secure file sharing Telegram bot with Cloudflare Workers">
  <meta property="og:url" content="https://github.com/pranaykumar2/filestream-cf">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Filestream-CF Generator">
  <link rel="icon" type="image/png" href="https://i.ibb.co/pQ0tSCj/1232b12e0a0c.png">
  <title>Filestream-CF Generator</title>

  <!-- Stylesheets -->
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css" rel="stylesheet">
  
  <style>
    :root {
      --color-primary: #6366f1;
      --color-primary-hover: #4f46e5;
      --color-secondary: #1f2937;
      --color-text: #f9fafb;
      --color-text-secondary: #9ca3af;
      --color-background: #111827;
      --color-card: #1f2937;
      --color-input: #374151;
      --color-border: #4b5563;
      --color-success: #10b981;
      --color-error: #ef4444;
      --color-warning: #f59e0b;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--color-background);
      color: var(--color-text);
      transition: background-color 0.3s, color 0.3s;
    }
    
    .app-container {
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .card {
      background-color: var(--color-card);
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      padding: 2rem;
      margin-bottom: 2rem;
      border: 1px solid var(--color-border);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .input-field {
      background-color: var(--color-input);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      width: 100%;
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    
    .input-field:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
    }
    
    .input-field.error {
      border-color: var(--color-error);
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: background-color 0.3s, transform 0.1s;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn:active {
      transform: translateY(1px);
    }
    
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
    }
    
    .btn-primary:hover {
      background-color: var(--color-primary-hover);
    }
    
    .btn-success {
      background-color: var(--color-success);
      color: white;
    }
    
    .tooltip {
      position: relative;
      display: inline-block;
      cursor: help;
    }
    
    .tooltip .tooltip-text {
      visibility: hidden;
      width: 250px;
      background-color: #2d3748;
      color: var(--color-text);
      text-align: left;
      border-radius: 0.5rem;
      padding: 1rem;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      font-size: 0.875rem;
      line-height: 1.4;
      border: 1px solid var(--color-border);
    }
    
    .tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .code-container {
      position: relative;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: rgba(55, 65, 81, 0.8);
      color: var(--color-text);
      border: none;
      border-radius: 0.25rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .copy-btn:hover {
      background-color: rgba(75, 85, 99, 0.8);
    }
    
    .copy-btn.copied {
      background-color: var(--color-success);
    }
    
    .hljs {
      padding: 1.5rem !important;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      background-color: var(--color-primary);
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }
    
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 1.5rem;
    }
    
    .tab {
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: border-color 0.2s, color 0.2s;
    }
    
    .tab.active {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .theme-toggle {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background-color: var(--color-card);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: background-color 0.3s;
      z-index: 10;
    }
    
    .theme-toggle:hover {
      background-color: var(--color-secondary);
    }
    
    /* Light Theme */
    body.light-mode {
      --color-primary: #4f46e5;
      --color-primary-hover: #4338ca;
      --color-secondary: #f3f4f6;
      --color-text: #1f2937;
      --color-text-secondary: #6b7280;
      --color-background: #f9fafb;
      --color-card: #ffffff;
      --color-input: #f3f4f6;
      --color-border: #e5e7eb;
    }
    
    /* Navigation */
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }
    
    .nav-logo {
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-link {
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .nav-link:hover {
      color: var(--color-primary);
    }
    
    @media (max-width: 640px) {
      .app-container {
        padding: 1rem 0.5rem;
      }
      
      .card {
        padding: 1.5rem 1rem;
      }
      
      .grid-cols-2 {
        grid-template-columns: 1fr !important;
      }
      
      .nav {
        flex-direction: column;
        gap: 1rem;
      }
      
      .tabs {
        overflow-x: auto;
      }
      
      .tab {
        padding: 0.75rem 1rem;
        white-space: nowrap;
      }
    }
  </style>
</head>

<body class="min-h-screen flex flex-col">
  <div class="app-container flex-grow">
    <nav class="nav">
      <div class="nav-logo">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        <span>Filestream-CF</span>
      </div>
      <div class="nav-links">
        <a href="/docs" class="nav-link">Documentation</a>
        <a href="/about" class="nav-link">About</a>
        <a href="https://github.com/pranaykumar2/filestream-cf" target="_blank" class="nav-link">GitHub</a>
      </div>
    </nav>
    
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold mb-2">Filestream-CF Generator</h1>
      <p class="text-lg text-gray-400">Create your own secure file sharing Telegram bot with Cloudflare Workers</p>
    </header>
    
    <div class="card fade-in">
      <div class="tabs">
        <div class="tab active" data-tab="configuration">Configuration</div>
        <div class="tab" data-tab="deployment">Deployment Guide</div>
        <div class="tab" data-tab="usage">Usage</div>
      </div>
      
      <div id="configuration" class="tab-content active">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4 flex items-center">
            <span class="step-number">1</span>
            Bot Configuration
          </h2>
          <p class="text-gray-400 mb-4">Enter your configuration details below. All fields are required for proper functionality.</p>
        </div>
        
        <form id="configForm" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="BOT_TOKEN" class="block text-sm font-medium">Telegram Bot Token</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    Get this from <a href="https://t.me/botfather" target="_blank" class="text-blue-400 hover:underline">@BotFather</a> on Telegram. Make sure to enable inline mode for your bot.
                  </div>
                </div>
              </div>
              <input type="text" id="BOT_TOKEN" name="BOT_TOKEN" class="input-field" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11">
              <p id="BOT_TOKEN-error" class="text-red-500 text-xs mt-1 hidden">Bot token is required.</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="BOT_WEBHOOK" class="block text-sm font-medium">Webhook Path</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    The URL path where Telegram will send updates. It's recommended to leave this as the default value.
                  </div>
                </div>
              </div>
              <input type="text" id="BOT_WEBHOOK" name="BOT_WEBHOOK" class="input-field" value="/endpoint">
              <p id="BOT_WEBHOOK-error" class="text-red-500 text-xs mt-1 hidden">Webhook path is required.</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="BOT_SECRET" class="block text-sm font-medium">Webhook Secret</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    A secret string to authenticate webhook requests from Telegram. Use a strong random string. Only A-Z, a-z, 0-9, _ and - are allowed.
                  </div>
                </div>
              </div>
              <div class="relative">
                <input type="text" id="BOT_SECRET" name="BOT_SECRET" class="input-field" placeholder="Strong secret string">
                <button type="button" id="generateSecretBtn" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white">
                  Generate
                </button>
              </div>
              <p id="BOT_SECRET-error" class="text-red-500 text-xs mt-1 hidden">Webhook secret is required.</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="SIA_SECRET" class="block text-sm font-medium">Encryption Secret</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    A strong secret key used for file hash encryption. This should be a long, random string and must be kept secret.
                  </div>
                </div>
              </div>
              <div class="relative">
                <input type="text" id="SIA_SECRET" name="SIA_SECRET" class="input-field" placeholder="Strong encryption key">
                <button type="button" id="generateKeyBtn" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white">
                  Generate
                </button>
              </div>
              <p id="SIA_SECRET-error" class="text-red-500 text-xs mt-1 hidden">Encryption secret is required.</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="BOT_OWNER" class="block text-sm font-medium">Bot Owner ID</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    Your Telegram user ID (numeric). You can get this from <a href="https://t.me/username_to_id_bot" target="_blank" class="text-blue-400 hover:underline">@username_to_id_bot</a>.
                  </div>
                </div>
              </div>
              <input type="number" id="BOT_OWNER" name="BOT_OWNER" class="input-field" placeholder="123456789">
              <p id="BOT_OWNER-error" class="text-red-500 text-xs mt-1 hidden">Owner ID must be a number.</p>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <label for="BOT_CHANNEL" class="block text-sm font-medium">Storage Channel ID</label>
                <div class="tooltip ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="tooltip-text">
                    ID of the Telegram channel where files will be stored. Must start with -100. The bot must be an admin in this channel with permission to post and edit messages.
                  </div>
                </div>
              </div>
              <input type="text" id="BOT_CHANNEL" name="BOT_CHANNEL" class="input-field" placeholder="-100123456789">
              <p id="BOT_CHANNEL-error" class="text-red-500 text-xs mt-1 hidden">Channel ID must start with -100.</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center">
              <label for="PUBLIC_BOT" class="block text-sm font-medium">Bot Access</label>
              <div class="tooltip ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="tooltip-text">
                  If set to public, anyone can use your bot. If private, only the bot owner can use it.
                </div>
              </div>
            </div>
            <select id="PUBLIC_BOT" name="PUBLIC_BOT" class="input-field">
              <option value="false">Private (Only Owner)</option>
              <option value="true">Public (Anyone)</option>
            </select>
          </div>
          
          <button type="submit" id="generateButton" class="btn btn-primary w-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Generate Worker Code
          </button>
        </form>
      </div>
      
      <div id="deployment" class="tab-content">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Deploying Your Worker</h2>
          <p class="text-gray-400 mb-4">Follow these steps to deploy your Filestream-CF bot to Cloudflare Workers.</p>
        </div>
        
        <div class="space-y-6">
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">1</span>
              Create a Cloudflare Account
            </h3>
            <p class="text-gray-400">If you don't already have one, <a href="https://dash.cloudflare.com/sign-up" target="_blank" class="text-blue-400 hover:underline">sign up for a Cloudflare account</a>.</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">2</span>
              Set Up Cloudflare Workers
            </h3>
            <p class="text-gray-400">Navigate to Workers & Pages in your Cloudflare dashboard and follow the setup process if it's your first time.</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">3</span>
              Create a New Worker
            </h3>
            <p class="text-gray-400">Click "Create Application" and select "Create Worker".</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">4</span>
              Deploy the Code
            </h3>
            <p class="text-gray-400">Go to the "Quick Edit" tab, paste the generated code, and click "Save and Deploy".</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">5</span>
              Set Up the Webhook
            </h3>
            <p class="text-gray-400">Visit <code>https://your-worker-url.workers.dev/registerWebhook</code> to register your bot's webhook.</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold flex items-center">
              <span class="step-number">6</span>
              Start Using Your Bot
            </h3>
            <p class="text-gray-400">Send a message to your bot on Telegram to start using it!</p>
          </div>
        </div>
      </div>
      
      <div id="usage" class="tab-content">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold mb-4">Using Your Bot</h2>
          <p class="text-gray-400 mb-4">Here's how to use your Filestream-CF bot after deployment.</p>
        </div>
        
        <div class="space-y-6">
          <div class="space-y-2">
            <h3 class="text-xl font-semibold">Sharing Files</h3>
            <p class="text-gray-400">Send any file to your bot in a private chat. The bot will respond with various sharing options:</p>
            <ul class="list-disc list-inside mt-2 text-gray-400 space-y-1">
              <li><strong>Telegram Link</strong> - For sharing files up to 4GB directly in Telegram</li>
              <li><strong>Inline Link</strong> - For sharing files inline in any Telegram chat</li>
              <li><strong>Stream Link</strong> - For streaming media files directly in a browser</li>
              <li><strong>Download Link</strong> - For downloading files directly in a browser</li>
            </ul>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold">Inline Sharing</h3>
            <p class="text-gray-400">Type <code>@your_bot_username file_hash</code> in any chat to share the file inline.</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold">Direct Links</h3>
            <p class="text-gray-400">Share the direct links with anyone who needs access to the file. The links will work as long as the file remains in your storage channel.</p>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold">File Size Limitations</h3>
            <ul class="list-disc list-inside mt-2 text-gray-400 space-y-1">
              <li><strong>Telegram Links & Inline Sharing</strong>: Up to 4GB (Telegram's limit)</li>
              <li><strong>Direct Download & Streaming</strong>: Up to 20MB (Cloudflare Workers limit)</li>
            </ul>
          </div>
          
          <div class="space-y-2">
            <h3 class="text-xl font-semibold">Privacy & Security</h3>
            <p class="text-gray-400">All file links are secured using modern encryption. Only people with the link can access the files. If you chose the "Private" option, only you can send files to the bot.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div id="codeSection" class="card fade-in hidden">
      <div class="mb-6">
        <h2 class="text-2xl font-semibold mb-4 flex items-center">
          <span class="step-number">2</span>
          Generated Code
        </h2>
        <p class="text-gray-400 mb-4">Copy this code and deploy it to Cloudflare Workers.</p>
      </div>
      
      <div class="code-container">
        <button id="copyButton" class="copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy Code</span>
        </button>
        <pre><code id="generatedCode" class="language-javascript">// Generated code will appear here</code></pre>
      </div>
      
      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-4">Next Steps:</h3>
        <ol class="space-y-3 text-gray-300">
          <li class="flex items-start">
            <span class="step-number">1</span>
            <div>
              <strong>Create a Cloudflare Worker</strong>
              <p class="text-gray-400 text-sm mt-1">Log in to Cloudflare, go to Workers & Pages, and create a new Worker.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="step-number">2</span>
            <div>
              <strong>Paste the Code</strong>
              <p class="text-gray-400 text-sm mt-1">Replace the default code with the generated code above.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="step-number">3</span>
            <div>
              <strong>Deploy the Worker</strong>
              <p class="text-gray-400 text-sm mt-1">Click "Save and Deploy" to publish your Worker.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="step-number">4</span>
            <div>
              <strong>Set Up the Webhook</strong>
              <p class="text-gray-400 text-sm mt-1">Visit <code>{your-worker-url}/registerWebhook</code> to set up the Telegram webhook.</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
  
  <footer class="text-center py-6 text-gray-500 text-sm">
    <p>Filestream-CF v2.0.0 | <a href="https://github.com/pranaykumar2/filestream-cf" target="_blank" class="text-blue-400 hover:underline">View on GitHub</a></p>
    <p class="mt-2">Original by <a href="https://github.com/vauth/filestream-cf" target="_blank" class="text-blue-400 hover:underline">Vauth</a>, Enhanced by <a href="https://github.com/pranaykumar2" target="_blank" class="text-blue-400 hover:underline">pranaykumar2</a></p>
  </footer>
  
  <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" id="themeIcon" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  </button>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
  <script>
    // DOM Elements
    const configForm = document.getElementById('configForm');
    const generateButton = document.getElementById('generateButton');
    const codeSection = document.getElementById('codeSection');
    const generatedCode = document.getElementById('generatedCode');
    const copyButton = document.getElementById('copyButton');
    const generateSecretBtn = document.getElementById('generateSecretBtn');
    const generateKeyBtn = document.getElementById('generateKeyBtn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const tabs = document.querySelectorAll('.tab');
    
    // Form fields
    const botToken = document.getElementById('BOT_TOKEN');
    const botWebhook = document.getElementById('BOT_WEBHOOK');
    const botSecret = document.getElementById('BOT_SECRET');
    const siaSecret = document.getElementById('SIA_SECRET');
    const botOwner = document.getElementById('BOT_OWNER');
    const botChannel = document.getElementById('BOT_CHANNEL');
    const publicBot = document.getElementById('PUBLIC_BOT');
    
    // Theme handling
    const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    
    // Apply the theme
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.innerHTML = '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />';
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isDark = !document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      if (isDark) {
        themeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />';
      } else {
        themeIcon.innerHTML = '<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />';
      }
    });
    
    // Tab handling
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });
    
    // Helper function to generate a random string
    function generateRandomString(length = 32, alphanumericOnly = true) {
      const chars = alphanumericOnly 
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      let result = '';
      const randomValues = new Uint8Array(length);
      crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < length; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
      }
      
      return result;
    }
    
    // Generate random secrets
    generateSecretBtn.addEventListener('click', () => {
      botSecret.value = generateRandomString(24, true);
      document.getElementById('BOT_SECRET-error').classList.add('hidden');
      botSecret.classList.remove('error');
    });
    
    generateKeyBtn.addEventListener('click', () => {
      siaSecret.value = generateRandomString(48, false);
      document.getElementById('SIA_SECRET-error').classList.add('hidden');
      siaSecret.classList.remove('error');
    });
    
    // Validate form inputs
    function validateForm() {
      let isValid = true;
      
      // Validate Bot Token
      if (!botToken.value.trim()) {
        document.getElementById('BOT_TOKEN-error').classList.remove('hidden');
        botToken.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('BOT_TOKEN-error').classList.add('hidden');
        botToken.classList.remove('error');
      }
      
      // Validate Webhook Path
      if (!botWebhook.value.trim()) {
        document.getElementById('BOT_WEBHOOK-error').classList.remove('hidden');
        botWebhook.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('BOT_WEBHOOK-error').classList.add('hidden');
        botWebhook.classList.remove('error');
      }
      
      // Validate Bot Secret
      if (!botSecret.value.trim()) {
        document.getElementById('BOT_SECRET-error').classList.remove('hidden');
        botSecret.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('BOT_SECRET-error').classList.add('hidden');
        botSecret.classList.remove('error');
      }
      
      // Validate SIA Secret
      if (!siaSecret.value.trim()) {
        document.getElementById('SIA_SECRET-error').classList.remove('hidden');
        siaSecret.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('SIA_SECRET-error').classList.add('hidden');
        siaSecret.classList.remove('error');
      }
      
      // Validate Bot Owner
      if (!botOwner.value.trim() || isNaN(botOwner.value)) {
        document.getElementById('BOT_OWNER-error').classList.remove('hidden');
        botOwner.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('BOT_OWNER-error').classList.add('hidden');
        botOwner.classList.remove('error');
      }
      
      // Validate Bot Channel
      if (!botChannel.value.trim() || !botChannel.value.startsWith('-100')) {
        document.getElementById('BOT_CHANNEL-error').classList.remove('hidden');
        botChannel.classList.add('error');
        isValid = false;
      } else {
        document.getElementById('BOT_CHANNEL-error').classList.add('hidden');
        botChannel.classList.remove('error');
      }
      
      return isValid;
    }
    
    // Generate worker code based on form inputs
    function generateWorkerCode() {
      return \`// Filestream-CF v2.0.0
// Generated on: \${new Date().toISOString()}
// GitHub: https://github.com/pranaykumar2/filestream-cf

// ---------- Configuration ---------- //

const BOT_TOKEN = "\${botToken.value}";
const BOT_WEBHOOK = "\${botWebhook.value}";
const BOT_SECRET = "\${botSecret.value}";
const BOT_OWNER = \${botOwner.value};
const BOT_CHANNEL = \${botChannel.value};
const SIA_SECRET = "\${siaSecret.value}";
const PUBLIC_BOT = \${publicBot.value};

// ---------- Constants ---------- //

const WHITE_METHODS = ["GET", "POST", "HEAD", "OPTIONS"];
const HEADERS_FILE = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"};
const HEADERS_ERROR = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'};
const ERROR_404 = {"ok":false,"error_code":404,"description":"Bad Request: missing /?file= parameter", "credit": "https://github.com/pranaykumar2/filestream-cf"};
const ERROR_405 = {"ok":false,"error_code":405,"description":"Bad Request: method not allowed"};
const ERROR_406 = {"ok":false,"error_code":406,"description":"Bad Request: file type invalid"};
const ERROR_407 = {"ok":false,"error_code":407,"description":"Bad Request: file hash invalid or tampered"};
const ERROR_408 = {"ok":false,"error_code":408,"description":"Bad Request: mode not in [attachment, inline]"};
const ERROR_429 = {"ok":false,"error_code":429,"description":"Too Many Requests: rate limit exceeded"};

// ---------- Event Listener ---------- //

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

// ---------- Main Request Handler ---------- //

async function handleRequest(event) {
  const url = new URL(event.request.url);
  const file = url.searchParams.get('file');
  const mode = url.searchParams.get('mode') || "attachment";
  
  // Handle CORS preflight requests
  if (event.request.method === 'OPTIONS') {
    return handleCorsRequest(event.request);
  }
   
  if (url.pathname === BOT_WEBHOOK) {
    return Bot.handleWebhook(event);
  }
  
  if (url.pathname === '/registerWebhook') {
    return Bot.registerWebhook(event, url, BOT_WEBHOOK, BOT_SECRET);
  }
  
  if (url.pathname === '/unregisterWebhook') {
    return Bot.unregisterWebhook(event);
  }
  
  if (url.pathname === '/getMe') {
    return new Response(JSON.stringify(await Bot.getMe()), {
      headers: HEADERS_ERROR,
      status: 200
    });
  }

  // Serve UI for root path with no file parameter
  if (url.pathname === '/' && !file) {
    return serveUI();
  }

  // Handle file requests
  if (!file) {
    return Raise(ERROR_404, 404);
  }
  
  if (!["attachment", "inline"].includes(mode)) {
    return Raise(ERROR_408, 400);
  }
  
  if (!WHITE_METHODS.includes(event.request.method)) {
    return Raise(ERROR_405, 405);
  }

  // Apply rate limiting
  if (await isRateLimited(event.request)) {
    return Raise(ERROR_429, 429);
  }
  
  // Decrypt file hash
  let messageId;
  try {
    messageId = await Crypto.decrypt(file);
  } catch (error) {
    return Raise(ERROR_407, 400);
  }

  // Retrieve the file
  const channel_id = BOT_CHANNEL;
  const file_id = messageId;
  const retrieve = await RetrieveFile(channel_id, file_id);
  
  if (retrieve.error_code) {
    return await Raise(retrieve, retrieve.error_code);
  }

  const [fileData, fileName, fileSize, fileType] = retrieve;

  return new Response(fileData, {
    status: 200,
    headers: {
      "Content-Disposition": \\\`\\\${mode}; filename="\\\${sanitizeFilename(fileName)}"\\\`,
      "Content-Length": fileSize,
      "Content-Type": fileType,
      ...HEADERS_FILE
    }
  });
}

// ---------- Serve UI ---------- //

function serveUI() {
  return new Response(\\\`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Filestream-CF</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #111827;
      color: #f9fafb;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6">
  <div class="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
    <h1 class="text-3xl font-bold mb-6">Filestream-CF</h1>
    <p class="text-gray-300 mb-6">A secure file sharing Telegram bot using Cloudflare Workers</p>
    <p class="text-gray-400 mb-8">Send files to <a href="https://t.me/\\\${BOT_TOKEN.split(':')[0]}" class="text-indigo-400 hover:underline">@\\\${BOT_TOKEN.split(':')[0]}</a> to get shareable links.</p>
    <div class="flex justify-center space-x-4">
      <a href="https://github.com/pranaykumar2/filestream-cf" target="_blank" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition">GitHub</a>
      <a href="/getMe" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition">Bot Status</a>
    </div>
  </div>
</body>
</html>\\\`, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// ---------- CORS Handling ---------- //

function handleCorsRequest(request) {
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

// ---------- Rate Limiting ---------- //

const ipLimits = new Map();
const RATE_LIMIT = 30;  // Requests per minute
const RATE_WINDOW = 60000;  // 1 minute in milliseconds

async function isRateLimited(request) {
  const clientIp = request.headers.get('CF-Connecting-IP') ||
                  request.headers.get('X-Forwarded-For') ||
                  'unknown';
  
  const now = Date.now();
  
  if (!ipLimits.has(clientIp)) {
    ipLimits.set(clientIp, {
      count: 1,
      timestamp: now
    });
    return false;
  }
  
  const record = ipLimits.get(clientIp);
  
  if (now - record.timestamp > RATE_WINDOW) {
    record.count = 1;
    record.timestamp = now;
    return false;
  }
  
  record.count++;
  return record.count > RATE_LIMIT;
}

// Clean up expired rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipLimits.entries()) {
    if (now - data.timestamp > RATE_WINDOW * 2) {
      ipLimits.delete(ip);
    }
  }
}, RATE_WINDOW);

// ---------- Helpers ---------- //

function sanitizeFilename(filename) {
  if (!filename) return 'unknown_file';
  
  // Remove path information
  let sanitized = filename.replace(/^.*[\\\\\/]/, '');
  
  // Remove or replace characters that could cause problems
  sanitized = sanitized
    .replace(/[^\\w\\s\\.-]/g, '_')  // Replace special chars with underscore
    .replace(/\\s+/g, '_');         // Replace spaces with underscore
  
  return sanitized.substring(0, 255);  // Limit length
}

async function Raise(json_error, status_code) {
  return new Response(JSON.stringify(json_error), { headers: HEADERS_ERROR, status: status_code });
}

async function UUID() {
  return crypto.randomUUID();
}

// ---------- Retrieve File ---------- //

async function RetrieveFile(channel_id, message_id) {
  let fileId, fileName, fileType, fileSize;
  let data = await Bot.editMessage(channel_id, message_id, await UUID());
  
  if (data.error_code) {
    return data;
  }
  
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
    const photoItem = data.photo[data.photo.length - 1];
    fileId = photoItem.file_id;
    fileName = \\\`\\\${photoItem.file_unique_id}.jpg\\\`;
    fileType = "image/jpeg";
    fileSize = photoItem.file_size;
  } else {
    return ERROR_406;
  }

  const file = await Bot.getFile(fileId);
  if (file.error_code) {
    return file;
  }

  return [await Bot.fetchFile(file.file_path), fileName, fileSize, fileType];
}

// ---------- Modern Cryptography ---------- //

class Crypto {
  static async encrypt(text) {
    // Generate a random salt
    const salt = crypto.randomUUID().slice(0, 16);
    const encoder = new TextEncoder();
    const messageData = encoder.encode(text.toString());
    
    // Derive key from SIA_SECRET and salt
    const key = await this.deriveKey(salt);
    
    // Generate IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      messageData
    );
    
    // Combine salt, IV, and encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(encoder.encode(salt));
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    // Return URL-safe base64
    return this.toBase64Url(combined);
  }
  
  static async decrypt(encryptedData) {
    try {
      // Decode base64
      const decoded = this.fromBase64Url(encryptedData);
      
      // Extract salt, IV, and ciphertext
      const decoder = new TextDecoder();
      const salt = decoder.decode(decoded.slice(0, 16));
      const iv = decoded.slice(16, 28);
      const ciphertext = decoded.slice(28);
      
      // Derive key from salt
      const key = await this.deriveKey(salt);
      
      // Decrypt
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      
      // Return decrypted message ID
      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Invalid or tampered file hash');
    }
  }
  
  static async deriveKey(salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(SIA_SECRET),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  static toBase64Url(buffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  }
  
  static fromBase64Url(base64Url) {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  }
}

// ---------- Telegram Bot ---------- //

class Bot {
  static async handleWebhook(event) {
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== BOT_SECRET) {
      return new Response('Unauthorized', { status: 403 });
    }
    const update = await event.request.json();
    event.waitUntil(this.processUpdate(event, update));
    return new Response('Ok');
  }
  
  static async processUpdate(event, update) {
    if (update.inline_query) {
      await this.handleInlineQuery(event, update.inline_query);
    }
    
    if ('message' in update) {
      await this.handleMessage(event, update.message);
    }
  }
  
  static async handleInlineQuery(event, inline) {
    let fileId, fileName, fileType, fileSize;

    if (!PUBLIC_BOT && inline.from.id != BOT_OWNER) {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return await this.answerInlineArticle(
        inline.id,
        "Access forbidden",
        "Deploy your own filestream-cf.",
        "*❌ Access forbidden.*\\n📡 Deploy your own [filestream-cf](https://github.com/pranaykumar2/filestream-cf) bot.",
        buttons
      );
    }
   
    try {
      await Crypto.decrypt(inline.query);
    } catch {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return await this.answerInlineArticle(
        inline.id,
        "Error",
        ERROR_407.description,
        ERROR_407.description,
        buttons
      );
    }

    const channel_id = BOT_CHANNEL;
    const message_id = await Crypto.decrypt(inline.query);
    const data = await this.editMessage(channel_id, message_id, await UUID());

    if (data.error_code) {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return await this.answerInlineArticle(
        inline.id,
        "Error",
        data.description,
        data.description,
        buttons
      );
    }

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
      const photoItem = data.photo[data.photo.length - 1];
      fileId = photoItem.file_id;
      fileName = \\\`\\\${photoItem.file_unique_id}.jpg\\\`;
      fileType = "image/jpeg";
      fileSize = photoItem.file_size;
    } else {
      return ERROR_406;
    }

    if (fileType === "image/jpeg") {
      const buttons = [[{ text: "Send Again", switch_inline_query_current_chat: inline.query }]];
      return await this.answerInlinePhoto(
        inline.id,
        fileName || "Photo",
        fileId,
        buttons
      );
    } else {
      const buttons = [[{ text: "Send Again", switch_inline_query_current_chat: inline.query }]];
      return await this.answerInlineDocument(
        inline.id,
        fileName || "File",
        fileId,
        fileType,
        buttons
      );
    }
  }
  
  static async handleMessage(event, message) {
    let fileId, fileName, fileType;
    let url = new URL(event.request.url);
    let bot = await this.getMe();

    // Ignore messages from bot itself
    if (message.via_bot && message.via_bot.username === bot.username) {
      return;
    }

    // Ignore channel messages
    if (message.chat.id.toString().includes("-100")) {
      return;
    }

    // Handle deep link starts
    if (message.text && message.text.startsWith("/start ")) {
      const file = message.text.split("/start ")[1];
      try {
        await Crypto.decrypt(file);
      } catch {
        return await this.sendMessage(
          message.chat.id,
          message.message_id,
          ERROR_407.description
        );
      }

      const channel_id = BOT_CHANNEL;
      const message_id = await Crypto.decrypt(file);
      const data = await this.editMessage(channel_id, message_id, await UUID());

      if (data.document) {
        fileId = data.document.file_id;
        return await this.sendDocument(message.chat.id, fileId);
      } else if (data.audio) {
        fileId = data.audio.file_id;
        return await this.sendDocument(message.chat.id, fileId);
      } else if (data.video) {
        fileId = data.video.file_id;
        return await this.sendDocument(message.chat.id, fileId);
      } else if (data.photo) {
        fileId = data.photo[data.photo.length - 1].file_id;
        return await this.sendPhoto(message.chat.id, fileId);
      } else {
        return this.sendMessage(
          message.chat.id,
          message.message_id,
          "Bad Request: File not found"
        );
      }
    }

    // Check if bot is public or user is the owner
    if (!PUBLIC_BOT && message.chat.id != BOT_OWNER) {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return this.sendMessage(
        message.chat.id,
        message.message_id,
        "*❌ Access forbidden.*\\n📡 Deploy your own [filestream-cf](https://github.com/pranaykumar2/filestream-cf) bot.",
        buttons
      );
    }

    // Process files
    let fileSave;
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
      fileId = message.photo[message.photo.length - 1].file_id;
      fileName = \\\`\\\${message.photo[message.photo.length - 1].file_unique_id}.jpg\\\`;
      fileType = "image";
      fileSave = await this.sendPhoto(BOT_CHANNEL, fileId);
    } else {
      const buttons = [[{ text: "Source Code", url: "https://github.com/pranaykumar2/filestream-cf" }]];
      return this.sendMessage(
        message.chat.id,
        message.message_id,
        "Send me any file/video/gif/audio *(t<=4GB, e<=20MB)*.",
        buttons
      );
    }

    if (fileSave.error_code) {
      return this.sendMessage(
        message.chat.id,
        message.message_id,
        fileSave.description
      );
    }

    const fileHash = await Crypto.encrypt(fileSave.message_id);
    const directLink = \\\`\\\${url.origin}/?file=\\\${fileHash}\\\`;
    const streamLink = \\\`\\\${url.origin}/?file=\\\${fileHash}&mode=inline\\\`;
    const telegramLink = \\\`https://t.me/\\\${bot.username}/?start=\\\${fileHash}\\\`;

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

    const messageText = \\\`*🗂 File Name:* \\\\\\\`\\\${fileName}\\\\\\\`\\n*⚙️ File Hash:* \\\\\\\`\\\${fileHash}\\\\\\\`\\\`;
    return this.sendMessage(message.chat.id, message.message_id, messageText, buttons);
  }

  static async registerWebhook(event, url, suffix, secret) {
    const webhookUrl = \\\`\\\${url.protocol}//\\\${url.hostname}\\\${suffix}\\\`;
    const response = await fetch(
      await this.apiUrl('setWebhook', {
        url: webhookUrl,
        secret_token: secret
      })
    );
    return new Response(JSON.stringify(await response.json()), {
      headers: HEADERS_ERROR
    });
  }

  static async unregisterWebhook() {
    const response = await fetch(
      await this.apiUrl('setWebhook', { url: '' })
    );
    return new Response(JSON.stringify(await response.json()), {
      headers: HEADERS_ERROR
    });
  }

  static async getMe() {
    const response = await fetch(await this.apiUrl('getMe'));
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async sendMessage(chatId, replyId, text, replyMarkup = []) {
    const response = await fetch(
      await this.apiUrl('sendMessage', {
        chat_id: chatId,
        reply_to_message_id: replyId,
        parse_mode: 'markdown',
        text,
        reply_markup: JSON.stringify({ inline_keyboard: replyMarkup })
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async sendDocument(chatId, fileId) {
    const response = await fetch(
      await this.apiUrl('sendDocument', {
        chat_id: chatId,
        document: fileId
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async sendPhoto(chatId, fileId) {
    const response = await fetch(
      await this.apiUrl('sendPhoto', {
        chat_id: chatId,
        photo: fileId
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async editMessage(channelId, messageId, captionText) {
    const response = await fetch(
      await this.apiUrl('editMessageCaption', {
        chat_id: channelId,
        message_id: messageId,
        caption: captionText
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async answerInlineArticle(queryId, title, description, text, replyMarkup = [], id = '1') {
    const data = [{
      type: 'article',
      id: id,
      title: title,
      thumbnail_url: "https://i.ibb.co/5s8hhND/dac5fa134448.png",
      description: description,
      input_message_content: {
        message_text: text,
        parse_mode: 'markdown'
      },
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    const response = await fetch(
      await this.apiUrl('answerInlineQuery', {
        inline_query_id: queryId,
        results: JSON.stringify(data),
        cache_time: 1
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async answerInlineDocument(queryId, title, fileId, mimeType, replyMarkup = [], id = '1') {
    const data = [{
      type: 'document',
      id: id,
      title: title,
      document_file_id: fileId,
      mime_type: mimeType,
      description: mimeType,
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    const response = await fetch(
      await this.apiUrl('answerInlineQuery', {
        inline_query_id: queryId,
        results: JSON.stringify(data),
        cache_time: 1
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async answerInlinePhoto(queryId, title, photoId, replyMarkup = [], id = '1') {
    const data = [{
      type: 'photo',
      id: id,
      title: title,
      photo_file_id: photoId,
      reply_markup: {
        inline_keyboard: replyMarkup
      }
    }];
    
    const response = await fetch(
      await this.apiUrl('answerInlineQuery', {
        inline_query_id: queryId,
        results: JSON.stringify(data),
        cache_time: 1
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async getFile(fileId) {
    const response = await fetch(
      await this.apiUrl('getFile', {
        file_id: fileId
      })
    );
    
    if (response.status === 200) {
      return (await response.json()).result;
    } else {
      return await response.json();
    }
  }

  static async fetchFile(filePath) {
    const file = await fetch(\\\`https://api.telegram.org/file/bot\\\${BOT_TOKEN}/\\\${filePath}\\\`);
    return await file.arrayBuffer();
  }

  static async apiUrl(method, params = null) {
    let query = '';
    
    if (params) {
      query = '?' + new URLSearchParams(params).toString();
    }
    
    return \\\`https://api.telegram.org/bot\\\${BOT_TOKEN}/\\\${method}\\\${query}\\\`;
  }
}
\\\`;
    }
    
    // Handle form submission
    configForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        const code = generateWorkerCode();
        generatedCode.textContent = code;
        hljs.highlightElement(generatedCode);
        codeSection.classList.remove('hidden');
        codeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Copy code to clipboard
    copyButton.addEventListener('click', function() {
      navigator.clipboard.writeText(generatedCode.textContent).then(() => {
        const copyBtnText = copyButton.querySelector('span');
        const originalText = copyBtnText.textContent;
        
        copyButton.classList.add('copied');
        copyBtnText.textContent = 'Copied!';
        
        setTimeout(() => {
          copyButton.classList.remove('copied');
          copyBtnText.textContent = originalText;
        }, 2000);
      });
    });
    
    // Highlight.js initialization
    document.addEventListener('DOMContentLoaded', () => {
      hljs.highlightAll();
    });
  </script>
</body>
</html>`;

// Now let's complete our implementation of the UI aspects by adding the webpack.config.js file
// and updating the final README.md with instructions for this improved version.
