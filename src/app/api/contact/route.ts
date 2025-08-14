import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security: Allowed origins (your website domains)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://ashutoshdash.dev',
  'https://www.ashutoshdash.dev',
  // Add your production domains here
];

// Security: Allowed referrers
const ALLOWED_REFERRERS = [
  'http://localhost:3000',
  'https://ashutoshdash.dev',
  'https://www.ashutoshdash.dev',
  // Add your production domains here
];

// Request tracking and logging
interface RequestLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  referer: string;
  origin: string;
  method: string;
  path: string;
  status: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

// Rate limiting function
function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count,
    resetTime: record.resetTime,
  };
}

// Security validation
function validateRequest(request: NextRequest): { valid: boolean; reason?: string } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const userAgent = request.headers.get('user-agent');

  // Check if request has required headers
  if (!userAgent) {
    return { valid: false, reason: 'Missing User-Agent header' };
  }

  // Check origin (if present)
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return { valid: false, reason: 'Invalid origin' };
  }

  // Check referer (if present)
  if (referer) {
    const refererUrl = new URL(referer);
    const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
    if (!ALLOWED_REFERRERS.includes(refererOrigin)) {
      return { valid: false, reason: 'Invalid referer' };
    }
  }

  return { valid: true };
}

// Logging function
function logRequest(log: RequestLog): void {
  // In production, send to logging service (e.g., DataDog, LogRocket, etc.)
  console.log(
    `[${log.timestamp}] ${log.method} ${log.path} - ${log.status} - ${log.responseTime}ms - ${log.success ? 'SUCCESS' : 'FAILED'} - IP: ${log.ip} - UA: ${log.userAgent}`
  );

  if (!log.success && log.error) {
    console.error(`[${log.timestamp}] ERROR: ${log.error}`);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Get request details for logging
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || 'unknown';
    const origin = request.headers.get('origin') || 'unknown';

    // Security validation
    const securityCheck = validateRequest(request);
    if (!securityCheck.valid) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: 'SECURITY_VIOLATION',
            message: 'Request blocked for security reasons',
            details: securityCheck.reason,
            requestId,
          },
        },
        { status: 403 }
      );

      // Log blocked request
      logRequest({
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        referer,
        origin,
        method: 'POST',
        path: '/api/contact',
        status: 403,
        responseTime: Date.now() - startTime,
        success: false,
        error: securityCheck.reason,
      });

      return response;
    }

    // Rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
            requestId,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
          },
        }
      );

      // Log rate limited request
      logRequest({
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        referer,
        origin,
        method: 'POST',
        path: '/api/contact',
        status: 429,
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Rate limit exceeded',
      });

      return response;
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON in request body',
            requestId,
          },
        },
        { status: 400 }
      );

      logRequest({
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        referer,
        origin,
        method: 'POST',
        path: '/api/contact',
        status: 400,
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Invalid JSON body',
      });

      return response;
    }

    // Validate form data
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: validationResult.error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
            requestId,
          },
        },
        { status: 400 }
      );

      logRequest({
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
        referer,
        origin,
        method: 'POST',
        path: '/api/contact',
        status: 400,
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Validation failed',
      });

      return response;
    }

    const { name, email, subject, message } = validationResult.data;

    // TODO: Implement actual email sending logic here
    // For now, we'll simulate processing
    console.log('Contact form submission:', { name, email, subject, message, requestId });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: {
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          requestId,
        },
        meta: {
          rateLimit: {
            remaining: rateLimit.remaining,
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          },
        },
      },
      {
        status: 200,
        headers: {
          'X-Request-ID': requestId,
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );

    // Log successful request
    logRequest({
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      referer,
      origin,
      method: 'POST',
      path: '/api/contact',
      status: 200,
      responseTime: Date.now() - startTime,
      success: true,
    });

    return response;
  } catch (error) {
    console.error('Contact form processing error:', error);

    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          requestId,
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      },
      {
        status: 500,
        headers: {
          'X-Request-ID': requestId,
        },
      }
    );

    // Log error
    logRequest({
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referer: request.headers.get('referer') || 'unknown',
      origin: request.headers.get('origin') || 'unknown',
      method: 'POST',
      path: '/api/contact',
      status: 500,
      responseTime: Date.now() - startTime,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return response;
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET method is not allowed for this endpoint',
        allowedMethods: ['POST'],
      },
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'PUT method is not allowed for this endpoint',
        allowedMethods: ['POST'],
      },
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method is not allowed for this endpoint',
        allowedMethods: ['POST'],
      },
    },
    { status: 405 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'POST',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
