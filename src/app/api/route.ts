import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Ashutosh Dash Portfolio API',
    version: '1.0.0',
    description:
      'Production-ready API for portfolio website contact form with enterprise-grade security and monitoring',
    documentation: 'https://github.com/ashutoshdash/portfolio-api',
    endpoints: {
      contact: {
        url: '/api/contact',
        method: 'POST',
        description: 'Submit contact form with enterprise security features',
        fields: ['name', 'email', 'subject', 'message'],
        features: [
          'Rate limiting (5 requests/minute per IP)',
          'Origin and referer validation',
          'Request tracking and logging',
          'Comprehensive error handling',
          'Security headers and validation',
        ],
        security: {
          rateLimit: '5 requests per minute per IP',
          allowedOrigins: ['ashutoshdash.dev', 'localhost:3000'],
          validation: 'Origin, referer, and user-agent validation',
          logging: 'Full request/response logging with request IDs',
        },
      },
    },
    status: 'active',
    lastUpdated: new Date().toISOString(),
    security: {
      rateLimit: true,
      originValidation: true,
      requestTracking: true,
      comprehensiveLogging: true,
    },
    support: {
      email: 'hello@ashutoshdash.dev',
      github: 'https://github.com/ashutoshdash',
    },
  });
}
