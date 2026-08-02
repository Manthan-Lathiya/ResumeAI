/**
 * Django Proxy — Forwards requests from Express to Django
 *
 * Express acts as an API Gateway:
 * 1. Receives request from React
 * 2. Validates the input (Zod)
 * 3. Forwards the request to Django
 * 4. Returns Django's response to React
 *
 * This module handles step 3 — the actual HTTP call to Django.
 */

const axios = require('axios');

// Base URL for the Django backend
const DJANGO_URL = process.env.DJANGO_URL || 'http://localhost:8000';

/**
 * Forward a request to Django.
 *
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} path - Django API path (e.g., '/api/users/signup/')
 * @param {object} options - Request options
 * @param {object} options.data - Request body (for POST/PUT)
 * @param {object} options.headers - Request headers (e.g., Authorization)
 * @param {object} options.params - URL query parameters
 * @returns {object} - Django's response data
 */
async function forwardToDjango(method, path, options = {}) {
  try {
    const config = {
      method,
      url: `${DJANGO_URL}${path}`,
      headers: {
        'Content-Type': 'application/json',
        // Forward the Authorization header if present
        ...(options.headers?.authorization && {
          Authorization: options.headers.authorization,
        }),
      },
    };

    // Add request body for POST/PUT requests
    if (options.data) {
      config.data = options.data;
    }

    // Add query parameters if present
    if (options.params) {
      config.params = options.params;
    }

    const response = await axios(config);
    return { status: response.status, data: response.data };

  } catch (error) {
    // If Django returned an error response, forward it
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }

    // If Django is unreachable
    return {
      status: 503,
      data: { error: 'Django backend is unavailable. Make sure it is running on ' + DJANGO_URL },
    };
  }
}

/**
 * Forward a multipart/form-data request to Django.
 * Used for file uploads (resume PDFs/DOCXs).
 *
 * @param {string} path - Django API path
 * @param {FormData} formData - Multipart form data with file
 * @param {object} headers - Request headers
 * @returns {object} - Django's response data
 */
async function forwardFileToDjango(path, formData, headers = {}) {
  try {
    const response = await axios.post(`${DJANGO_URL}${path}`, formData, {
      headers: {
        ...formData.getHeaders(),
        ...(headers.authorization && {
          Authorization: headers.authorization,
        }),
      },
      maxContentLength: 10 * 1024 * 1024, // 10MB max
    });

    return { status: response.status, data: response.data };

  } catch (error) {
    if (error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    return {
      status: 503,
      data: { error: 'Django backend is unavailable' },
    };
  }
}

module.exports = { forwardToDjango, forwardFileToDjango };
