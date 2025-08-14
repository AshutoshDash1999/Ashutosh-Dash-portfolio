# Portfolio API Documentation

This document describes the production-ready API endpoint for the Ashutosh Dash Portfolio website, specifically for the contact form functionality.

## API Overview

The API is designed with enterprise-grade security, monitoring, and reliability features following industry best practices. It includes comprehensive rate limiting, request validation, security measures, and detailed logging for production environments.

## Base URL

```
https://ashutoshdash.dev/api
```

## Endpoints

### API Index

- **GET** `/api` - Returns API information and security features

### Contact Form

- **POST** `/api/contact` - Submit contact form with enterprise security

## Security Features

### Rate Limiting

- **Limit**: 5 requests per minute per IP address
- **Window**: 60 seconds rolling window
- **Headers**: Rate limit information included in response headers
- **Response**: 429 status code when limit exceeded

### Origin Validation

- **Allowed Origins**: Only requests from your website domains are accepted
- **Referer Validation**: Checks request referer headers
- **User-Agent Required**: All requests must include a valid User-Agent header

### Request Tracking

- **Unique Request IDs**: Each request gets a unique identifier for tracking
- **Comprehensive Logging**: Full request/response logging with timestamps
- **Performance Monitoring**: Response time tracking for all requests

## Request Format

### POST /api/contact

**Headers Required:**

```
Content-Type: application/json
User-Agent: [required]
Origin: [must match allowed domains]
Referer: [must match allowed domains]
```

**Request Body:**

```json
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email format)",
  "subject": "string (required, 1-200 chars)",
  "message": "string (required, 10-2000 chars)"
}
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "msg_1704067200000",
    "timestamp": "2025-01-01T00:00:00.000Z",
    "requestId": "req_1704067200000_abc123def"
  },
  "meta": {
    "rateLimit": {
      "remaining": 4,
      "resetTime": "2025-01-01T00:01:00.000Z"
    }
  }
}
```

**Response Headers:**

```
X-Request-ID: req_1704067200000_abc123def
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 2025-01-01T00:01:00.000Z
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please enter a valid email address"
      }
    ],
    "requestId": "req_1704067200000_abc123def"
  }
}
```

#### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 45,
    "requestId": "req_1704067200000_abc123def"
  }
}
```

**Response Headers:**

```
Retry-After: 45
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2025-01-01T00:01:00.000Z
```

#### Security Violation (403)

```json
{
  "success": false,
  "error": {
    "code": "SECURITY_VIOLATION",
    "message": "Request blocked for security reasons",
    "details": "Invalid origin",
    "requestId": "req_1704067200000_abc123def"
  }
}
```

#### Method Not Allowed (405)

```json
{
  "success": false,
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "GET method is not allowed for this endpoint",
    "allowedMethods": ["POST"]
  }
}
```

#### Internal Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error",
    "requestId": "req_1704067200000_abc123def"
  }
}
```

## HTTP Status Codes

- **200**: Success - Message processed successfully
- **400**: Bad Request - Validation errors or invalid JSON
- **403**: Forbidden - Security violation (invalid origin/referer)
- **405**: Method Not Allowed - Unsupported HTTP method
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server-side processing error

## Error Codes

| Code                  | Description                          | HTTP Status |
| --------------------- | ------------------------------------ | ----------- |
| `VALIDATION_ERROR`    | Form validation failed               | 400         |
| `INVALID_JSON`        | Malformed JSON in request body       | 400         |
| `SECURITY_VIOLATION`  | Request blocked for security reasons | 403         |
| `METHOD_NOT_ALLOWED`  | HTTP method not supported            | 405         |
| `RATE_LIMIT_EXCEEDED` | Too many requests from this IP       | 429         |
| `INTERNAL_ERROR`      | Server-side processing error         | 500         |

## Rate Limiting Details

### Headers

- `X-RateLimit-Limit`: Maximum requests allowed per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit resets
- `Retry-After`: Seconds to wait before retrying (when rate limited)

### Behavior

- Rate limiting is per IP address
- Uses a rolling 60-second window
- Requests are counted in real-time
- Rate limit resets automatically after the window expires

## Security Measures

### Origin Validation

- Only requests from allowed domains are processed
- Checks both `Origin` and `Referer` headers
- Blocks requests from unknown sources

### Request Validation

- All requests must include a `User-Agent` header
- JSON body validation with strict schema enforcement
- Input sanitization and length restrictions

### Logging and Monitoring

- Every request is logged with full details
- Unique request IDs for tracking and debugging
- Performance metrics for all requests
- Security violations are logged separately

## Development and Testing

### Local Development

```bash
# Start development server
pnpm dev

# API will be available at
http://localhost:3000/api/contact
```

### Testing the API

```bash
# Test with curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "User-Agent: TestClient/1.0" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message for the API."
  }'
```

### Allowed Domains for Testing

- `http://localhost:3000` (development)
- `https://ashutoshdash.dev` (production)
- `https://www.ashutoshdash.dev` (production)

## Production Considerations

### Rate Limiting

- Current implementation uses in-memory storage
- For production, consider using Redis or similar for distributed rate limiting
- Adjust rate limits based on your traffic patterns

### Logging

- Console logging is used for development
- In production, integrate with logging services like:
  - DataDog
  - LogRocket
  - AWS CloudWatch
  - Google Cloud Logging

### Monitoring

- Monitor rate limit violations
- Track response times and error rates
- Set up alerts for security violations
- Monitor API usage patterns

## Server Actions Integration

The contact form also supports Next.js Server Actions for enhanced user experience:

```typescript
import { submitContactForm } from '@/lib/actions/contact';

// Use in forms with useFormState
const [state, formAction] = useFormState(submitContactForm, initialState);
```

## Validation Rules

All inputs are validated using Zod schemas:

- **Name**: 1-100 characters, required
- **Email**: Valid email format, required
- **Subject**: 1-200 characters, required
- **Message**: 10-2000 characters, required

## CORS Support

CORS headers are automatically added for cross-origin requests from allowed domains.

## Support and Contact

- **Email**: hello@ashutoshdash.dev
- **GitHub**: https://github.com/ashutoshdash
- **Documentation**: This document and `/api` endpoint

## Changelog

### Version 1.0.0 (Current)

- Production-ready contact form API
- Enterprise-grade security features
- Comprehensive rate limiting
- Request tracking and logging
- Origin and referer validation
- Detailed error handling
- Performance monitoring
