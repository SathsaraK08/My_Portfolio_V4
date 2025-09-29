# Error Logs & Debugging Guide

## Previously Resolved Critical Errors

### ✅ FIXED: BigInt Serialization Error
```
TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at GET (src/app/api/public/home-skills/route.ts:95:25)
```

**Root Cause**: Prisma was returning BigInt values for numeric fields (id, order, level) which couldn't be serialized to JSON.

**Solution Applied**: Added `convertBigIntToNumber()` helper function in affected API routes.

**Files Fixed**:
- `src/app/api/public/home-skills/route.ts`
- `src/app/api/health/route.ts`

**Status**: ✅ PERMANENTLY RESOLVED

### ✅ FIXED: Database Connection Errors
```
prisma:error Error in PostgreSQL connection: Error { kind: Closed, cause: None }
```

**Root Cause**: Suboptimal connection pooling configuration and query complexity.

**Solution Applied**:
- Optimized DATABASE_URL with proper pooling parameters
- Enhanced Prisma client configuration
- Simplified complex queries

**Status**: ✅ RESOLVED - Stable connections

## Current Error Monitoring

### Health Check Status
```bash
# Should return "healthy" status
curl -s http://localhost:3001/api/health | jq '.status'
```

### API Status Check
```bash
# All should return 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/public/home-skills
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/public/profile
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/public/projects
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/public/services
```

## Common Error Patterns & Solutions

### 1. Connection Pool Exhaustion
**Symptoms**:
```
Error: Can't reach database server
P2028: Transaction API error
Connection timeout
```

**Debug Commands**:
```bash
# Check active connections
curl -s http://localhost:3001/api/health | jq '.database.activeConnections'

# Should be <= 5 (our limit)
```

**Solutions**:
- Verify connection limit in DATABASE_URL
- Check for unclosed connections
- Implement connection retry logic

### 2. Query Timeout
**Symptoms**:
```
P2024: Timed out fetching a new connection from the connection pool
Query timeout
```

**Debug**:
- Check query complexity
- Look for missing indexes
- Monitor query execution time in logs

### 3. TypeScript Type Errors
**Symptoms**:
```
Type 'number' is not assignable to type 'string'
Property 'xyz' does not exist on type
```

**Common Fix**: Check interface definitions match API responses

### 4. Next.js Compilation Errors
**Symptoms**:
```
Module not found
Cannot resolve module
Build failed
```

**Debug Steps**:
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Check import paths and file names

## Error Tracking Commands

### Real-time Error Monitoring
```bash
# Monitor dev server for errors
npm run dev | grep -E "(error|Error|ERROR)"

# Monitor specific error patterns
npm run dev | grep -E "(BigInt|Connection|Timeout)"
```

### API Error Testing
```bash
# Test with verbose error output
curl -v http://localhost:3001/api/public/home-skills

# Test error handling with invalid endpoint
curl -s http://localhost:3001/api/public/invalid-endpoint
```

### Database Connection Testing
```bash
# Test database health multiple times
for i in {1..5}; do
  echo "Health check $i:"
  curl -s http://localhost:3001/api/health | jq '.status, .database.connected, .responseTime'
  sleep 2
done
```

## Performance Warning Indicators

### Slow Response Times
```bash
# If any of these exceed 5 seconds, investigate:
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3001/api/public/home-skills
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3001/api/public/profile
```

### Memory Usage Spikes
```bash
# Monitor memory usage
curl -s http://localhost:3001/api/health | jq '.memory'
```

### Connection Pool Pressure
```bash
# Active connections approaching limit (5)
curl -s http://localhost:3001/api/health | jq '.database.activeConnections'
```

## Debugging Workflow

### 1. First Check - Are APIs Working?
```bash
./debug_help/scripts/test_all_apis.sh
```

### 2. Check Database Connection
```bash
curl -s http://localhost:3001/api/health
```

### 3. Monitor Server Logs
```bash
# Check for error patterns
npm run dev | tee debug_help/logs/server.log
```

### 4. Performance Check
```bash
# Run performance tests
./debug_help/scripts/performance_test.sh
```

## Emergency Recovery Steps

### If APIs Return 500 Errors:
1. Check for BigInt serialization - look for numeric conversions
2. Verify database connection string in .env
3. Clear Next.js cache: `rm -rf .next`
4. Restart dev server

### If Database Connection Fails:
1. Check Supabase dashboard for outages
2. Verify DATABASE_URL format
3. Test direct connection with DIRECT_URL
4. Check connection pool configuration

### If Performance Degrades:
1. Check for reverted optimizations
2. Monitor query execution times
3. Verify LIMIT clauses in queries
4. Check connection pool usage

## Log File Locations
```
debug_help/logs/server.log          # Server output
debug_help/logs/error.log           # Error-specific logs
debug_help/logs/performance.log     # Performance metrics
debug_help/logs/database.log        # Database connection logs
```

## Critical Files to Monitor
- `src/lib/prisma.ts` - Database client configuration
- `src/app/api/*/route.ts` - API endpoints
- `.env` - Database connection strings
- `package.json` - Dependencies
- `next.config.ts` - Next.js configuration

---
**Last Updated**: 2025-09-29
**Status**: All critical errors resolved, monitoring active