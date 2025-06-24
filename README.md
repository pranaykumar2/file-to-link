# Filestream-CF

A secure file sharing Telegram bot using Cloudflare Workers.

![GitHub License](https://img.shields.io/github/license/pranaykumar2/filestream-cf)
![GitHub Version](https://img.shields.io/badge/version-2.0.0-blue)

## Features

- **Secure File Sharing**: Share files through Telegram and generate public links
- **Multiple Access Methods**:
  - Telegram direct link (up to 4GB)
  - Inline query (up to 4GB)
  - Direct download link (up to 20MB)
  - Streaming link (up to 20MB)
- **Modern Security**: 
  - AES-GCM encryption for file hashes
  - PBKDF2 key derivation with SHA-256
  - Rate limiting to prevent abuse
- **Improved Architecture**:
  - Modular code structure
  - Better error handling
  - Enhanced security measures
- **Modern UI**:
  - Responsive web interface
  - Dark/light mode support
  - Configuration generator

## Demo

To try out the bot, send a file to: (your bot here)

## Quick Start

1. Create a new Telegram bot with [@BotFather](https://t.me/botfather)
2. Enable inline mode for your bot
3. Create a channel and add your bot as an admin
4. Visit our [Configuration Generator](https://your-worker-url.workers.dev/) to create your worker code
5. Deploy the code to Cloudflare Workers
6. Visit `your-worker-url.workers.dev/registerWebhook` to set up the webhook
7. Start using your bot by sending it files!

## Detailed Setup

### Requirements

- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Telegram User ID (from [@username_to_id_bot](https://t.me/username_to_id_bot))
- Telegram Channel ID (must start with `-100`)
- Cloudflare account

### Bot Configuration

1. Talk to [@BotFather](https://t.me/botfather) and create a new bot with `/newbot`
2. Enable inline mode with `/setinline`
3. Optionally disable inline feedback with `/setinlinefeedback`

### Channel Setup

1. Create a new channel (public or private)
2. Add your bot as an administrator with permissions to post messages
3. Get the channel ID by forwarding a message from it to [@username_to_id_bot](https://t.me/username_to_id_bot)
4. Make sure the channel ID starts with `-100`

### Cloudflare Workers Setup

#### Option 1: Using the Web UI

1. Visit the [Configuration Generator](https://your-worker-url.workers.dev/)
2. Fill in all required fields
3. Click "Generate Worker Code"
4. Copy the generated code
5. Create a new Cloudflare Worker
6. Paste the code and deploy

#### Option 2: Manual Deployment

1. Clone this repository
   ```bash
   git clone https://github.com/pranaykumar2/filestream-cf.git
   cd filestream-cf