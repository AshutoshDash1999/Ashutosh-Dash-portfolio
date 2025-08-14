import { NextRequest, NextResponse } from 'next/server';

/**
 * API Middleware - Adds common headers and CORS support to all API routes
 *
 * This middleware runs before every API request and adds:
 * 1. Server identification headers for monitoring and debugging
 * 2. CORS headers to allow cross-origin requests from your website
 * 3. Standardized response headers across all API endpoints
 */
export function middleware(request: NextRequest) {
  // Create response object to modify headers
  const response = NextResponse.next();

  // Add server identification headers for monitoring and debugging
  // These help identify which server handled the request and when
  response.headers.set('X-API-Server', 'Ashutosh-Dash-Portfolio');
  response.headers.set('X-API-Built-With', 'Next.js 15');
  response.headers.set('X-API-Timestamp', new Date().toISOString());

  // Add CORS (Cross-Origin Resource Sharing) headers for API routes
  // This allows your website to make requests to the API from different domains
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Allow requests from any origin (your website domains)
    response.headers.set('Access-Control-Allow-Origin', '*');

    // Specify which HTTP methods are allowed
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Specify which headers can be sent with the request
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

/**
 * Middleware configuration
 *
 * matcher: '/api/:path*' - This middleware runs on all routes that start with /api/
 * Examples: /api/contact, /api/users, /api/v1/anything, etc.
 */
export const config = {
  matcher: '/api/:path*',
};
