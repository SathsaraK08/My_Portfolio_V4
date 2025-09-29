# Database Configuration & Monitoring

## Current Database Setup (Optimized)

### Supabase Configuration
```
Provider: PostgreSQL
Tier: Free
Host: aws-us-east-2.pooler.supabase.com
Port: 6543 (Pooled)
Direct Port: 5432 (Migrations only)
```

### Connection String (Optimized)
```bash
# Current optimized configuration in .env
DATABASE_URL="postgresql://postgres.cowyzhxivrfixizgdugw:v7ZyFWADSJJ2gsSQ@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=5&pool_timeout=30&connect_timeout=30"

# Direct URL for migrations only
DIRECT_URL="postgresql://postgres:v7ZyFWADSJJ2gsSQ@db.cowyzhxivrfixizgdugw.supabase.co:5432/postgres?sslmode=require"
```

### Prisma Client Configuration
```typescript
// src/lib/prisma.ts (Optimized)
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  errorFormat: 'minimal',
  transactionOptions: {
    timeout: 30000, // 30 seconds
  },
})
```

## Connection Pool Monitoring

### Current Pool Settings
- **Mode**: PgBouncer
- **Max Connections**: 5
- **Pool Timeout**: 30 seconds
- **Connect Timeout**: 30 seconds
- **Typical Active Connections**: 1

### Real-time Monitoring Commands

#### Check Connection Pool Status
```bash
# Get current active connections
curl -s http://localhost:3001/api/health | jq '.database.activeConnections'

# Expected result: Usually 1, max 5
```

#### Monitor Connection Health
```bash
# Continuous monitoring
watch -n 5 "curl -s http://localhost:3001/api/health | jq '.database'"
```

#### Connection Pool Stress Test
```bash
# Test rapid consecutive requests
for i in {1..10}; do
  echo "Request $i:"
  curl -s http://localhost:3001/api/health | jq '.database.activeConnections'
  sleep 0.5
done
```

## Database Performance Metrics

### Query Performance Targets
- **Skills API**: <4 seconds (Currently: 3.2-3.7s ✅)
- **Profile API**: <3 seconds (Currently: ~2s ✅)
- **Projects API**: <3 seconds (Currently: ~1.7s ✅)
- **Services API**: <3 seconds (Currently: ~1.7s ✅)
- **Health API**: <5 seconds (Currently: ~3.4s ✅)

### Performance Monitoring Query
```sql
-- Monitor active connections and query activity
SELECT
    count(*) as total_connections,
    count(CASE WHEN state = 'active' THEN 1 END) as active_connections,
    count(CASE WHEN state = 'idle' THEN 1 END) as idle_connections
FROM pg_stat_activity;
```

## Database Schema Overview

### Core Tables
```sql
-- Key tables with performance considerations
users           -- Authentication (low usage)
profiles        -- User profiles (frequent read)
skills          -- Tech skills (frequent read, optimized)
projects        -- Portfolio projects (frequent read)
services        -- Service offerings (frequent read)
pages           -- CMS pages (low usage after optimization)
page_sections   -- CMS sections (disabled for performance)
```

### Indexing Strategy
```sql
-- Critical indexes for performance
CREATE INDEX idx_skills_visible_order ON skills(isVisible, order, level);
CREATE INDEX idx_projects_visible_featured ON projects(isVisible, featured);
CREATE INDEX idx_profiles_visible ON profiles(isVisible);
CREATE INDEX idx_services_visible_order ON services(isVisible, featured, order);
```

## Connection Issues Troubleshooting

### Common Connection Errors

#### 1. Connection Pool Exhausted
```
Error: Can't reach database server at aws-1-us-east-2.pooler.supabase.com:6543
```
**Check**: Active connections count
**Solution**: Increase pool timeout or optimize query efficiency

#### 2. Connection Timeout
```
P2028: Transaction API error: Transaction already closed
```
**Check**: Query execution time
**Solution**: Optimize slow queries or increase timeout

#### 3. SSL Connection Error
```
Error: SSL connection required
```
**Check**: sslmode=require in connection string
**Solution**: Verify DATABASE_URL format

### Diagnostic Commands

#### Test Database Connectivity
```bash
# Test connection through health API
curl -s http://localhost:3001/api/health

# Expected response:
{
  "status": "healthy",
  "database": {
    "connected": true,
    "activeConnections": 1
  },
  "responseTime": 3000
}
```

#### Verify Connection Pool Configuration
```bash
# Check current configuration
echo $DATABASE_URL | grep -o "connection_limit=[0-9]*"
echo $DATABASE_URL | grep -o "pool_timeout=[0-9]*"
echo $DATABASE_URL | grep -o "connect_timeout=[0-9]*"
```

#### Monitor Query Execution
```bash
# Enable query logging in development
export DEBUG=prisma:*
npm run dev
```

## Performance Optimization Checklist

### ✅ Completed Optimizations
- [x] Connection pooling with PgBouncer
- [x] Optimized connection limits (5)
- [x] Query result limiting with `take`
- [x] Selective field queries
- [x] Simplified query joins
- [x] Enhanced error handling
- [x] Connection timeout configuration

### Future Optimization Opportunities
- [ ] Database indexing optimization
- [ ] Query result caching with Redis
- [ ] Read replicas for heavy queries
- [ ] Connection pool monitoring dashboard
- [ ] Automated performance alerts

## Supabase Free Tier Limits

### Connection Limits
- **Max Connections**: 60 total
- **Our Pool Limit**: 5 (conservative)
- **Connection Duration**: No limit
- **Concurrent Users**: Suitable for development

### Performance Considerations
- **Shared Resources**: Performance varies with load
- **Connection Pooling**: Essential for efficiency
- **Query Optimization**: Critical for response times

## Monitoring Dashboard Queries

### Real-time Connection Monitor
```bash
#!/bin/bash
# Save as debug_help/scripts/monitor_connections.sh
while true; do
    clear
    echo "Database Connection Monitor - $(date)"
    echo "======================================="

    health=$(curl -s http://localhost:3001/api/health)

    echo "Status: $(echo $health | jq -r '.status')"
    echo "Connected: $(echo $health | jq -r '.database.connected')"
    echo "Active Connections: $(echo $health | jq -r '.database.activeConnections')"
    echo "Response Time: $(echo $health | jq -r '.responseTime')ms"
    echo "Memory Used: $(echo $health | jq -r '.memory.used')MB"

    sleep 5
done
```

### Performance Alert Thresholds
- **Response Time**: >5 seconds (Critical)
- **Active Connections**: >4 (Warning), >5 (Critical)
- **Error Rate**: >1% (Warning)
- **Memory Usage**: >200MB (Warning)

---
**Configuration Status**: ✅ Optimized for development
**Connection Pool**: ✅ Stable (PgBouncer, 5 connections)
**Performance**: ✅ Meeting targets (<4s response times)
**Last Updated**: 2025-09-29