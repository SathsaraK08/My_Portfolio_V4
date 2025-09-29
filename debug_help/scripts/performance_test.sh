#!/bin/bash

# Performance Testing Script for Portfolio V4
echo "⚡ Performance Testing - $(date)"
echo "===================================="

BASE_URL="http://localhost:3001"
LOGFILE="debug_help/logs/performance_$(date +%Y%m%d_%H%M%S).log"

# Create log file
mkdir -p debug_help/logs
echo "Performance Test Log - $(date)" > "$LOGFILE"
echo "================================" >> "$LOGFILE"

# Test configuration
ROUNDS=5
ENDPOINTS=(
    "/api/public/home-skills:Home Skills"
    "/api/health:Health Check"
    "/api/public/profile:Profile"
    "/api/public/projects:Projects"
    "/api/public/services:Services"
)

echo "Running $ROUNDS rounds of testing for each endpoint..."
echo

# Function to run performance test for an endpoint
test_endpoint_performance() {
    local endpoint=$1
    local name=$2

    echo "🎯 Testing $name ($endpoint)"
    echo "Testing $name - $(date)" >> "$LOGFILE"
    echo "Endpoint: $endpoint" >> "$LOGFILE"

    declare -a times
    local total=0
    local min=999
    local max=0

    for ((i=1; i<=$ROUNDS; i++)); do
        echo -n "  Round $i/$ROUNDS... "

        # Get response time
        time_total=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL$endpoint")
        times+=($time_total)

        # Convert to milliseconds for easier comparison
        time_ms=$(echo "$time_total * 1000" | bc | cut -d. -f1)

        echo "${time_total}s (${time_ms}ms)"
        echo "Round $i: ${time_total}s" >> "$LOGFILE"

        # Calculate min/max
        if (( $(echo "$time_total < $min" | bc -l) )); then
            min=$time_total
        fi
        if (( $(echo "$time_total > $max" | bc -l) )); then
            max=$time_total
        fi

        total=$(echo "$total + $time_total" | bc)

        # Short delay between requests
        sleep 1
    done

    # Calculate average
    avg=$(echo "scale=3; $total / $ROUNDS" | bc)

    echo "  📊 Results:"
    echo "     Min: ${min}s"
    echo "     Max: ${max}s"
    echo "     Avg: ${avg}s"

    # Log results
    echo "Results - Min: ${min}s, Max: ${max}s, Avg: ${avg}s" >> "$LOGFILE"
    echo "Individual times: ${times[@]}" >> "$LOGFILE"
    echo "---" >> "$LOGFILE"

    # Performance evaluation
    if (( $(echo "$avg > 5.0" | bc -l) )); then
        echo "     ⚠️  SLOW - Average >5s"
    elif (( $(echo "$avg > 3.0" | bc -l) )); then
        echo "     ⚡ MODERATE - Average >3s"
    else
        echo "     ✅ GOOD - Average <3s"
    fi

    echo
}

# Run tests for each endpoint
for item in "${ENDPOINTS[@]}"; do
    endpoint=$(echo $item | cut -d: -f1)
    name=$(echo $item | cut -d: -f2)
    test_endpoint_performance "$endpoint" "$name"
done

# Database connection stress test
echo "🔗 Database Connection Stress Test"
echo "=================================="
echo "Database Connection Test - $(date)" >> "$LOGFILE"

echo "Testing rapid consecutive requests..."
for ((i=1; i<=10; i++)); do
    echo -n "  Request $i/10... "

    response=$(curl -s "$BASE_URL/api/health")
    status=$(echo "$response" | jq -r '.status' 2>/dev/null)
    connections=$(echo "$response" | jq -r '.database.activeConnections' 2>/dev/null)

    echo "Status: $status, Connections: $connections"
    echo "Rapid request $i: Status=$status, Connections=$connections" >> "$LOGFILE"

    # Very short delay to stress test connection pool
    sleep 0.2
done

echo

# Memory usage check
echo "💾 Memory Usage Check"
echo "===================="
memory_response=$(curl -s "$BASE_URL/api/health" | jq '.memory')
echo "Current memory usage:"
echo "$memory_response" | jq .
echo "Memory usage: $memory_response" >> "$LOGFILE"

echo

# Generate summary report
echo "📈 Performance Summary Report"
echo "============================"

# Extract all averages from the log
echo "Endpoint Performance Summary:" >> "$LOGFILE"
grep "Results -" "$LOGFILE" | while read line; do
    echo "$line" >> "${LOGFILE}_summary"
done

echo "Performance test completed!"
echo "Full log: $LOGFILE"
echo

# Check for performance regressions
echo "🔍 Performance Health Check:"
skills_avg=$(grep -A 1 "Testing Home Skills" "$LOGFILE" | grep "Results -" | grep -o "Avg: [0-9.]*" | cut -d' ' -f2)
if [ ! -z "$skills_avg" ]; then
    if (( $(echo "$skills_avg > 5.0" | bc -l) )); then
        echo "❌ PERFORMANCE REGRESSION: Home Skills API >5s (current: ${skills_avg}s)"
        echo "   Expected: <3.7s based on previous optimizations"
    elif (( $(echo "$skills_avg < 4.0" | bc -l) )); then
        echo "✅ PERFORMANCE GOOD: Home Skills API optimal (${skills_avg}s)"
    else
        echo "⚠️  PERFORMANCE WARNING: Home Skills API slower than expected (${skills_avg}s)"
    fi
fi

echo "Test completed at $(date)"