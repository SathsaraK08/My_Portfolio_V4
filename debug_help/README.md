# Debug Help - Portfolio V4 🛠️

## Quick Start Commands

```bash
# Test all APIs
./debug_help/scripts/test_all_apis.sh

# Run performance tests
./debug_help/scripts/performance_test.sh

# Check database health
curl -s http://localhost:3001/api/health | jq
```

## 📁 Directory Structure

```
debug_help/
├── README.md                         # This file - Quick reference
├── prisma_query_logs.md              # Database query analysis & optimization
├── error_logs_debugging.md           # Error patterns & troubleshooting
├── database_monitoring.md            # Database config & connection monitoring
├── professional_logging_guide.md     # 🆕 Complete logging system guide
├── scripts/
│   ├── test_all_apis.sh             # Comprehensive API testing
│   ├── performance_test.sh          # Performance benchmarking
│   ├── analyze_logs.sh              # 🆕 Professional log analysis
│   └── monitor_connections.sh       # Real-time connection monitoring
└── logs/
    ├── combined-YYYY-MM-DD.log       # 🆕 All structured logs
    ├── error-YYYY-MM-DD.log          # 🆕 Error logs with stack traces
    ├── http-YYYY-MM-DD.log           # 🆕 HTTP/API request logs
    ├── performance-YYYY-MM-DD.log    # 🆕 Performance metrics
    ├── analysis_YYYYMMDD_HHMMSS.txt  # 🆕 Log analysis reports
    ├── api_test_YYYYMMDD_HHMMSS.log
    ├── performance_YYYYMMDD_HHMMSS.log
    └── *.gz                          # 🆕 Compressed archived logs
```

## 🚀 Quick Diagnostics

### 1. Is Everything Working?
```bash
# Quick health check
curl -s http://localhost:3001/api/health | jq '.status'
# Expected: "healthy"

# Test main Skills API
curl -s http://localhost:3001/api/public/home-skills | jq '.skills | length'
# Expected: 6
```

### 2. Professional Logging & Analysis (🆕)
```bash
# Analyze all logs with detailed reporting
./debug_help/scripts/analyze_logs.sh

# View real-time structured logs (color coded)
tail -f debug_help/logs/combined-$(date +%Y-%m-%d).log

# Check for errors with full stack traces
tail -f debug_help/logs/error-$(date +%Y-%m-%d).log

# Monitor HTTP traffic and performance
tail -f debug_help/logs/http-$(date +%Y-%m-%d).log
```

### 3. Performance Check
```bash
# Quick response time test
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost:3001/api/public/home-skills
# Expected: <4 seconds
```

### 4. Database Connection
```bash
# Check connection pool
curl -s http://localhost:3001/api/health | jq '.database'
# Expected: {"connected": true, "activeConnections": 1}
```

## 📊 Current Performance Benchmarks

| API Endpoint | Target Time | Current Performance | Status |
|-------------|-------------|-------------------|---------|
| Home Skills | <4.0s | 3.2-3.7s | ✅ Good |
| Health API | <5.0s | ~3.4s | ✅ Good |
| Profile API | <3.0s | ~2.0s | ✅ Excellent |
| Projects API | <3.0s | ~1.7s | ✅ Excellent |
| Services API | <3.0s | ~1.7s | ✅ Excellent |

## 🔧 Previously Fixed Issues

### ✅ BigInt Serialization Error (RESOLVED)
- **Symptoms**: `TypeError: Do not know how to serialize a BigInt`
- **Status**: PERMANENTLY FIXED
- **Files**: All API routes now use `convertBigIntToNumber()`

### ✅ Database Performance (OPTIMIZED)
- **Before**: 5-11+ second response times
- **After**: 3.2-3.7 second consistent response times
- **Improvement**: 50-70% faster

### ✅ Connection Pool Issues (RESOLVED)
- **Configuration**: PgBouncer, 5 connections, 30s timeouts
- **Status**: Stable, usually 1 active connection

## 🚨 Red Flags to Watch For

### Performance Regression
```bash
# If this takes >5 seconds, investigate
time curl -s http://localhost:3001/api/public/home-skills > /dev/null
```

### Connection Pool Exhaustion
```bash
# If this shows >4, investigate
curl -s http://localhost:3001/api/health | jq '.database.activeConnections'
```

### API Errors
```bash
# All should return 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/public/home-skills
```

## 🛠️ Emergency Troubleshooting

### If APIs Return 500 Errors:
1. Check for BigInt errors in console
2. Verify `.env` DATABASE_URL is correct
3. Clear cache: `rm -rf .next && npm run dev`
4. Check server logs for errors

### If Database Connection Fails:
1. Test health endpoint: `curl -s http://localhost:3001/api/health`
2. Check Supabase dashboard for outages
3. Verify connection string format
4. Check connection pool usage

### If Performance Degrades:
1. Run performance test: `./debug_help/scripts/performance_test.sh`
2. Check if optimizations were reverted
3. Monitor query execution times
4. Verify database connection pool

## 📋 Detailed Documentation

### For Database Issues:
- Read: `debug_help/database_monitoring.md`
- Focus on connection pool configuration
- Check query optimization section

### For Performance Problems:
- Read: `debug_help/prisma_query_logs.md`
- Review query execution times
- Check optimization checklist

### For Error Debugging:
- Read: `debug_help/error_logs_debugging.md`
- Follow debugging workflow
- Check common error patterns

## 🔍 Monitoring & Maintenance

### Regular Health Checks
```bash
# Run daily
./debug_help/scripts/test_all_apis.sh

# Run weekly
./debug_help/scripts/performance_test.sh
```

### Performance Monitoring
```bash
# Create real-time monitor
./debug_help/scripts/monitor_connections.sh
```

### Log Rotation
```bash
# Clean old logs (run monthly)
find debug_help/logs -name "*.log" -mtime +30 -delete
```

## 🎯 Performance Goals

### Current Status: ✅ ALL TARGETS MET
- Skills API: 3.2-3.7s (Target: <4s)
- Database connections: Stable at 1 (Limit: 5)
- Error rate: 0% (Target: <1%)
- Cache hit rate: High due to 300s TTL

### Success Metrics
- ✅ No BigInt serialization errors
- ✅ All APIs returning 200 status
- ✅ Response times under targets
- ✅ Database connection pool stable
- ✅ SkillsMarquee loading 6 skills consistently

## 📞 Quick Reference Commands

```bash
# Development server
npm run dev                    # Start server (usually port 3001)
rm -rf .next && npm run dev   # Clear cache and restart

# Health checks
curl -s http://localhost:3001/api/health | jq
curl -s http://localhost:3001/api/public/home-skills | jq '.skills | length'

# Performance testing
./debug_help/scripts/test_all_apis.sh
./debug_help/scripts/performance_test.sh

# Database monitoring
curl -s http://localhost:3001/api/health | jq '.database'

# Error checking
npm run dev | grep -i error
tail -f debug_help/logs/server.log
```

---
**Status**: 🟢 All systems operational
**Last Updated**: 2025-09-29
**Critical Issues**: None
**Performance**: Meeting all targets