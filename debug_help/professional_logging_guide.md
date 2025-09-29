# Professional Logging System Guide 📊

## Overview

A comprehensive, production-ready logging system with:
- ✅ **Full stack trace capture**
- ✅ **Traffic/usage monitoring**
- ✅ **Memory-safe log rotation**
- ✅ **Security-safe ENV logging**
- ✅ **Professional log levels and formats**
- ✅ **Automated analysis tools**

## 🏗️ System Architecture

### Core Components

```
src/lib/
├── logger.ts              # Winston-based logger with custom levels
├── request-logger.ts      # HTTP request/response middleware
└── env-validator.ts       # Environment configuration validator

debug_help/logs/
├── error-YYYY-MM-DD.log          # Error logs with stack traces
├── combined-YYYY-MM-DD.log       # All logs combined
├── http-YYYY-MM-DD.log           # HTTP/API request logs
├── performance-YYYY-MM-DD.log    # Performance metrics
└── *.gz                          # Compressed archived logs
```

### Log Levels & Categories

| Level | Purpose | File Location | Retention |
|-------|---------|---------------|-----------|
| **error** | Errors with stack traces | `error-*.log` | 14 days |
| **warn** | Warnings and issues | `combined-*.log` | 7 days |
| **info** | General information | `combined-*.log` | 7 days |
| **http** | API requests/responses | `http-*.log` | 7 days |
| **debug** | Detailed debugging | `combined-*.log` | 7 days |

## 🚀 Usage Examples

### Basic Logging

```typescript
import { Logger } from '@/lib/logger'

// Error with stack trace
try {
  // risky operation
} catch (error) {
  Logger.error('Operation failed', error, {
    operation: 'user_registration',
    userId: 12345,
    additionalContext: { step: 'validation' }
  })
}

// Performance tracking
Logger.performance('Database query completed', {
  operation: 'skills.findMany',
  duration: 1250, // ms
  memory: process.memoryUsage(),
  database: {
    query: 'SELECT * FROM skills WHERE visible = true',
    duration: 890,
    activeConnections: 2
  }
})

// HTTP request logging (automatic with middleware)
Logger.http('API request', {
  method: 'GET',
  url: '/api/public/skills',
  statusCode: 200,
  responseTime: 1200,
  userAgent: 'Mozilla/5.0...'
})
```

### API Route Integration

```typescript
import { withRequestLogging, ErrorHandler } from '@/lib/request-logger'
import { Logger } from '@/lib/logger'

async function myApiHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now()

    // Your API logic here
    const result = await someOperation()

    // Log successful completion
    Logger.performance('API completed', {
      operation: 'GET /api/my-endpoint',
      duration: Date.now() - startTime,
      memory: process.memoryUsage()
    })

    return NextResponse.json(result)
  } catch (error) {
    // Enhanced error handling with context
    const errorResult = ErrorHandler.handle(error, {
      operation: 'GET /api/my-endpoint',
      file: '/app/api/my-endpoint/route.ts',
      function: 'myApiHandler',
      additionalContext: {
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      }
    })

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Export with logging middleware
export const GET = withRequestLogging(myApiHandler)
```

### Environment Validation

```typescript
import { EnvironmentValidator } from '@/lib/env-validator'

// Validate all environment variables
const validation = EnvironmentValidator.validate()

if (!validation.valid) {
  console.error('Environment validation failed:', validation.errors)
}

// Validate specific variable
const result = EnvironmentValidator.validateSingle('DATABASE_URL')
if (!result.valid) {
  console.error('Database URL invalid:', result.error)
}

// Get security-safe config export
const safeConfig = EnvironmentValidator.exportSafeConfig()
console.log('Current configuration:', safeConfig)
```

## 🔍 Log Analysis & Monitoring

### Automated Analysis

```bash
# Comprehensive log analysis
./debug_help/scripts/analyze_logs.sh

# API health testing
./debug_help/scripts/test_all_apis.sh

# Performance benchmarking
./debug_help/scripts/performance_test.sh
```

### Manual Log Investigation

```bash
# View recent errors with stack traces
tail -f debug_help/logs/error-$(date +%Y-%m-%d).log | jq

# Monitor API requests in real-time
tail -f debug_help/logs/http-$(date +%Y-%m-%d).log | jq

# Check performance metrics
grep '"performance":' debug_help/logs/combined-$(date +%Y-%m-%d).log | jq

# Search for specific errors
grep "BigInt\|Connection\|Timeout" debug_help/logs/*.log
```

### Key Metrics to Monitor

#### Performance Indicators
```json
{
  "performance": {
    "operation": "GET /api/public/home-skills",
    "duration": 3200,           // Total request time (ms)
    "memory": {
      "heapUsed": 85,            // MB
      "heapTotal": 95,           // MB
      "rss": 223                 // MB
    },
    "database": {
      "query": "skills.findMany",
      "duration": 2800,          // Database query time (ms)
      "activeConnections": 1     // Current pool connections
    }
  }
}
```

#### Error Tracking
```json
{
  "level": "error",
  "message": "Skills API failed",
  "error": {
    "name": "TypeError",
    "message": "Do not know how to serialize a BigInt",
    "stack": "TypeError: Do not know how to serialize a BigInt\n    at JSON.stringify..."
  },
  "context": {
    "operation": "GET /api/public/home-skills",
    "file": "/app/api/public/home-skills/route.ts",
    "function": "getSkillsHandler",
    "memory": {...},
    "activeRequests": 3
  }
}
```

#### Traffic Analytics
```json
{
  "traffic": {
    "endpoint": "/api/public/home-skills",
    "method": "GET",
    "responseTime": 3200,
    "statusCode": 200,
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "location": {
      "country": "US",
      "city": "New York"
    },
    "uniqueVisitor": true
  }
}
```

## 🔒 Security Features

### Sensitive Data Protection

The logging system automatically sanitizes:

```typescript
// Passwords and secrets
{ password: "secret123" } → { password: "[REDACTED]" }

// Database connection strings
"postgresql://user:pass@host:5432/db" → "postgresql://user:***@host:5432/db"

// Long tokens and keys
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." → "eyJh***...XVCJ9"

// Email addresses
"user@example.com" → "us***@example.com"
```

### Environment Variable Validation

```bash
# Example validation output (security-safe)
✅ DATABASE_URL: postgresql://postgres:***@aws-1-us-east-2.pooler.supabase.com/postgres
✅ NEXTAUTH_SECRET: 1K0n***...Vs=
⚠️  ADMIN_PASSWORD: Weak password detected (consider stronger password)
❌ MISSING_REQUIRED: EMAIL_SERVER_HOST is required but not set
```

## 📊 Memory Management

### Automatic Log Rotation

- **Daily rotation**: New log files created daily
- **Size limits**: 20MB per log file (combined/error), 10MB (http/performance)
- **Compression**: Old logs automatically gzipped
- **Retention**: 7-14 days depending on log type
- **Cleanup**: Automatic cleanup of old files

### Memory-Safe Request Tracking

```typescript
// Built-in memory management
- Max concurrent request tracking: 1000
- Automatic cleanup of old requests: 5 minutes
- Memory usage monitoring and alerts
- Request tracking timeout handling
```

### Performance Monitoring

```typescript
// Memory usage tracking in all logs
{
  "memory": {
    "heapUsed": 85,    // Current heap usage (MB)
    "heapTotal": 95,   // Total heap allocated (MB)
    "external": 4,     // External memory usage (MB)
    "rss": 223         // Resident set size (MB)
  },
  "activeRequests": 3  // Current request tracking count
}
```

## 🎯 Performance Targets & Alerts

### Response Time Thresholds

| Endpoint | Target | Warning | Critical |
|----------|--------|---------|----------|
| GET /api/health | <3s | >3s | >5s |
| GET /api/public/home-skills | <4s | >4s | >6s |
| GET /api/public/profile | <2s | >3s | >5s |
| Other APIs | <3s | >4s | >6s |

### Memory Usage Alerts

| Metric | Normal | Warning | Critical |
|--------|--------|---------|----------|
| Heap Used | <100MB | 100-200MB | >200MB |
| Active Connections | 1-3 | 4-5 | >5 |
| Request Tracking | <500 | 500-800 | >800 |

### Error Rate Monitoring

- **Target**: <1% error rate
- **Warning**: >1% error rate
- **Critical**: >5% error rate
- **Alert**: >10 errors in 5 minutes

## 🛠️ Troubleshooting Guide

### Common Log Patterns

#### 1. BigInt Serialization Issues (RESOLVED)
```bash
grep "Do not know how to serialize a BigInt" debug_help/logs/error-*.log
# Should return no results if properly fixed
```

#### 2. Database Connection Problems
```bash
grep "Error in PostgreSQL connection" debug_help/logs/error-*.log
# Check for connection pool exhaustion
```

#### 3. Performance Regression
```bash
grep '"duration":[5-9][0-9][0-9][0-9]' debug_help/logs/performance-*.log
# Find requests taking >5 seconds
```

#### 4. Memory Leaks
```bash
grep '"heapUsed":[2-9][0-9][0-9]' debug_help/logs/combined-*.log
# Check for heap usage >200MB
```

### Quick Diagnostics

```bash
# Current system health
curl -s http://localhost:3001/api/health | jq

# Recent error summary
tail -20 debug_help/logs/error-$(date +%Y-%m-%d).log

# Performance over last hour
grep $(date +%H:) debug_help/logs/performance-$(date +%Y-%m-%d).log | jq '.performance.duration'

# Traffic analysis
./debug_help/scripts/analyze_logs.sh
```

## 📁 Log File Structure

### Sample Log Entry (Combined)
```json
{
  "timestamp": "2025-09-29 22:15:43:123",
  "level": "info",
  "message": "Skills API response ready",
  "skillsCount": 6,
  "totalDuration": 3200,
  "queryDuration": 2800,
  "activeConnections": 1,
  "performance": {
    "operation": "GET /api/public/home-skills",
    "duration": 3200,
    "memory": {
      "heapUsed": 85,
      "heapTotal": 95,
      "external": 4,
      "rss": 223
    },
    "database": {
      "query": "skills.findMany",
      "duration": 2800,
      "activeConnections": 1
    }
  }
}
```

### File Naming Convention
- `combined-2025-09-29.log` - All logs for September 29, 2025
- `error-2025-09-29.log` - Only errors for that date
- `combined-2025-09-28.log.gz` - Compressed archived log

## 🔧 Configuration

### Winston Logger Configuration

```typescript
// Log levels (descending priority)
const logLevels = {
  error: 0,    // Always logged
  warn: 1,     // Warnings and above
  info: 2,     // General information
  http: 3,     # HTTP requests (debug mode)
  debug: 4,    // Detailed debugging (dev only)
}

// Automatic log rotation settings
maxFiles: '14d',          // Keep for 14 days (errors)
maxFiles: '7d',           // Keep for 7 days (others)
maxSize: '20m',           // 20MB max file size
zippedArchive: true,      // Compress old logs
```

### Environment-Specific Behavior

#### Development
- All log levels enabled (debug through error)
- Console output with colors
- Immediate error display
- Detailed stack traces

#### Production
- Limited to info level and above
- File logging only
- Compressed archives
- Security-sanitized output

---

## 🚀 Quick Start Commands

```bash
# Test the logging system
./debug_help/scripts/test_all_apis.sh

# Analyze current logs
./debug_help/scripts/analyze_logs.sh

# Monitor logs in real-time
tail -f debug_help/logs/combined-$(date +%Y-%m-%d).log | jq

# Check system health
curl -s http://localhost:3001/api/health | jq
```

**Status**: ✅ Professional logging system fully implemented and operational