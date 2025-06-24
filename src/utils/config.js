/**
 * Configuration management for Filestream-CF
 * Handles loading, validation, and access to configuration values
 */

// Default configuration object
let config = {
  // Bot configuration
  BOT_TOKEN: "",
  BOT_WEBHOOK: "/endpoint",
  BOT_SECRET: "",
  BOT_OWNER: 0,
  BOT_CHANNEL: 0,
  SIA_SECRET: "",
  PUBLIC_BOT: false,
  
  // Feature flags
  FEATURES: {
    RATE_LIMITING: true,
    FILE_EXPIRY: false,
    STATS_TRACKING: false
  },
  
  // Constants
  HEADERS: {
    FILE: {
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS", 
      "Access-Control-Allow-Headers": "Content-Type"
    },
    API: {
      'Access-Control-Allow-Origin': '*', 
      'Content-Type': 'application/json'
    }
  },
  ALLOWED_METHODS: ["GET", "POST", "HEAD", "OPTIONS"],
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 30,
    WINDOW_MS: 60000
  },
  
  // Error codes
  ERRORS: {
    ERROR_400: {
      "ok": false,
      "error_code": 400,
      "description": "Bad Request"
    },
    ERROR_403: {
      "ok": false,
      "error_code": 403,
      "description": "Forbidden"
    },
    ERROR_404: {
      "ok": false,
      "error_code": 404,
      "description": "Not Found: Missing file parameter",
      "credit": "https://github.com/pranaykumar2/filestream-cf"
    },
    ERROR_405: {
      "ok": false,
      "error_code": 405,
      "description": "Method Not Allowed"
    },
    ERROR_406: {
      "ok": false,
      "error_code": 406,
      "description": "Not Acceptable: File type invalid"
    },
    ERROR_407: {
      "ok": false,
      "error_code": 407,
      "description": "File hash invalid or tampered"
    },
    ERROR_408: {
      "ok": false,
      "error_code": 408,
      "description": "Not Acceptable: Invalid mode parameter"
    },
    ERROR_429: {
      "ok": false,
      "error_code": 429,
      "description": "Too Many Requests: Rate limit exceeded"
    },
    ERROR_500: {
      "ok": false,
      "error_code": 500,
      "description": "Internal Server Error"
    }
  }
};

/**
 * Initialize configuration from environment variables or global constants
 */
export function initializeConfig() {
  try {
    // Try to load from environment variables first (for Cloudflare Workers)
    if (typeof BOT_TOKEN !== 'undefined') config.BOT_TOKEN = BOT_TOKEN;
    if (typeof BOT_WEBHOOK !== 'undefined') config.BOT_WEBHOOK = BOT_WEBHOOK;
    if (typeof BOT_SECRET !== 'undefined') config.BOT_SECRET = BOT_SECRET;
    if (typeof BOT_OWNER !== 'undefined') config.BOT_OWNER = parseInt(BOT_OWNER, 10);
    if (typeof BOT_CHANNEL !== 'undefined') config.BOT_CHANNEL = parseInt(BOT_CHANNEL, 10);
    if (typeof SIA_SECRET !== 'undefined') config.SIA_SECRET = SIA_SECRET;
    if (typeof PUBLIC_BOT !== 'undefined') config.PUBLIC_BOT = PUBLIC_BOT === 'true' || PUBLIC_BOT === true;
    
    // Validate required configuration
    validateConfig();
    
    console.log("Configuration initialized successfully");
  } catch (error) {
    console.error("Configuration initialization failed:", error.message);
  }
}

/**
 * Validate the configuration
 * @throws {Error} If configuration is invalid
 */
function validateConfig() {
  const requiredFields = [
    { field: 'BOT_TOKEN', validator: value => typeof value === 'string' && value.length > 0 },
    { field: 'BOT_SECRET', validator: value => typeof value === 'string' && value.length > 0 },
    { field: 'SIA_SECRET', validator: value => typeof value === 'string' && value.length > 0 },
    { field: 'BOT_CHANNEL', validator: value => typeof value === 'number' && String(value).startsWith('-100') }
  ];
  
  for (const { field, validator } of requiredFields) {
    if (!validator(config[field])) {
      throw new Error(`Invalid configuration: ${field} is invalid or missing`);
    }
  }
}

/**
 * Get the current configuration
 * @returns {Object} The current configuration
 */
export function getConfig() {
  return { ...config }; // Return a copy to prevent modification
}

/**
 * Get a specific error by code
 * @param {string} code - The error code
 * @returns {Object} The error object
 */
export function getError(code) {
  return config.ERRORS[code] || config.ERRORS.ERROR_500;
}

/**
 * Check if a feature is enabled
 * @param {string} feature - The feature name
 * @returns {boolean} Whether the feature is enabled
 */
export function isFeatureEnabled(feature) {
  return config.FEATURES[feature] === true;
}