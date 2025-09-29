# Prisma Query Logs & Analysis

## Current Query Performance (Post-Optimization)

### Skills API Optimized Query
```sql
-- Optimized query (3.2-3.7s response time)
SELECT "public"."skills"."id",
       "public"."skills"."name",
       "public"."skills"."category",
       "public"."skills"."level",
       "public"."skills"."icon",
       "public"."skills"."imageUrl",
       "public"."skills"."order",
       "public"."skills"."description"
FROM "public"."skills"
WHERE "public"."skills"."isVisible" = $1
ORDER BY "public"."skills"."order" ASC,
         "public"."skills"."level" DESC
LIMIT $2 OFFSET $3
```

### Connection Pool Query
```sql
-- Pool monitoring query
SELECT count(*) as count
FROM pg_stat_activity
WHERE state = 'active'
```

## Query Performance Timeline

### Before Optimization
```
Query Duration: 7-11+ seconds
Complex joins with page sections
No LIMIT clause
Multiple ORDER BY conditions
Full field selection
```

### After Optimization
```
Query Duration: 3.2-3.7 seconds
Removed expensive joins
Added LIMIT 20
Simplified ORDER BY
Selective field queries
```

## Common Slow Queries to Watch

### 1. Page Sections Join (REMOVED - was causing slowness)
```sql
-- SLOW QUERY - Now removed for performance
SELECT "public"."pages"."id"
FROM "public"."pages"
WHERE "public"."pages"."name" = $1
LIMIT $2 OFFSET $3;

SELECT "public"."page_sections"."id",
       "public"."page_sections"."title",
       "public"."page_sections"."subtitle",
       "public"."page_sections"."pageId"
FROM "public"."page_sections"
WHERE ("public"."page_sections"."name" = $1
       AND "public"."page_sections"."pageId" IN ($2))
ORDER BY "public"."page_sections"."id" ASC
LIMIT $3 OFFSET $4
```

### 2. Profile Query (Optimized)
```sql
SELECT "public"."profiles"."id",
       "public"."profiles"."fullName",
       "public"."profiles"."title",
       "public"."profiles"."bio",
       "public"."profiles"."avatar",
       "public"."profiles"."avatarPath",
       "public"."profiles"."resume",
       "public"."profiles"."resumePath",
       "public"."profiles"."location",
       "public"."profiles"."email",
       "public"."profiles"."phone",
       "public"."profiles"."website",
       "public"."profiles"."linkedIn",
       "public"."profiles"."github",
       "public"."profiles"."twitter",
       "public"."profiles"."instagram",
       "public"."profiles"."youTube",
       "public"."profiles"."isVisible",
       "public"."profiles"."createdAt",
       "public"."profiles"."updatedAt"
FROM "public"."profiles"
WHERE "public"."profiles"."isVisible" = $1
LIMIT $2 OFFSET $3
```

## Connection Pool Monitoring

### Current Configuration
```
Database: Supabase PostgreSQL (Free Tier)
Pooler: PgBouncer mode
Connection Limit: 5
Pool Timeout: 30s
Connect Timeout: 30s
Active Connections: Usually 1
```

### Connection Health Check
```javascript
// From /api/health
const result = await prisma.$queryRaw`
  SELECT count(*) as count
  FROM pg_stat_activity
  WHERE state = 'active'
`
```

## Query Analysis Commands

### Check Current Active Connections
```bash
curl -s http://localhost:3001/api/health | jq '.database.activeConnections'
```

### Test API Performance
```bash
# Skills API performance test
time curl -s http://localhost:3001/api/public/home-skills > /dev/null

# Multiple requests test
for i in {1..5}; do
  echo "Test $i:"
  curl -s -w "Response Time: %{time_total}s\n" -o /dev/null http://localhost:3001/api/public/home-skills
done
```

### Monitor Database Queries in Real-Time
```bash
# Watch server logs for query patterns
tail -f dev_server.log | grep "prisma:query"
```

## Performance Benchmarks

| Query Type | Before | After | Improvement |
|------------|--------|-------|-------------|
| Skills API | 5-11s | 3.2-3.7s | ~65% faster |
| Health API | 3-6s | 3.4s | Consistent |
| Profile API | Variable | 1.7-2.4s | Stable |
| Projects API | Variable | 1.7s | Optimized |

## Red Flags to Monitor

### 1. Long Query Duration (>5s)
- Check for missing indexes
- Look for N+1 query problems
- Verify connection pool isn't exhausted

### 2. Connection Pool Issues
- `activeConnections` approaching limit (5)
- Connection timeout errors
- "Error { kind: Closed, cause: None }" messages

### 3. Memory Usage Spikes
- Large result sets without LIMIT
- Complex joins causing temp table creation
- Inefficient ORDER BY on non-indexed columns

## Optimization Checklist

- ✅ Use `select` to fetch only needed fields
- ✅ Add `take` (LIMIT) to prevent over-fetching
- ✅ Simplify `orderBy` clauses
- ✅ Avoid complex joins when possible
- ✅ Use connection pooling (PgBouncer)
- ✅ Monitor active connections
- ✅ Implement proper error handling
- ✅ Cache responses appropriately

## Troubleshooting Commands

```bash
# Check if dev server is running
lsof -i :3001

# Test database connectivity
curl -s http://localhost:3001/api/health

# Check all public APIs
for endpoint in profile projects services skills home-skills; do
  echo "Testing $endpoint:"
  curl -s -o /dev/null -w "%{http_code} - %{time_total}s\n" "http://localhost:3001/api/public/$endpoint"
done
```

---
**Last Updated**: 2025-09-29
**Current Status**: All queries optimized, performance stable