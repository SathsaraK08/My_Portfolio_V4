#!/bin/bash

# Log Analysis Script for Professional Logging System
echo "🔍 Log Analysis - $(date)"
echo "=============================="

LOG_DIR="debug_help/logs"
OUTPUT_FILE="debug_help/logs/analysis_$(date +%Y%m%d_%H%M%S).txt"

# Create analysis output file
mkdir -p "$LOG_DIR"
echo "Log Analysis Report - $(date)" > "$OUTPUT_FILE"
echo "=======================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Function to analyze log files
analyze_logs() {
    local log_type=$1
    local pattern=$2
    local description=$3

    echo "📊 $description"
    echo "📊 $description" >> "$OUTPUT_FILE"
    echo "-------------------" >> "$OUTPUT_FILE"

    # Find the most recent log file of this type
    local latest_log=$(ls -t $LOG_DIR/$log_type*.log 2>/dev/null | head -1)

    if [ -n "$latest_log" ] && [ -f "$latest_log" ]; then
        echo "   Analyzing: $latest_log"

        # Count total entries
        local total_entries=$(grep -c "$pattern" "$latest_log" 2>/dev/null || echo "0")
        echo "   Total entries: $total_entries"
        echo "Total entries: $total_entries" >> "$OUTPUT_FILE"

        # Show recent entries (last 10)
        if [ "$total_entries" -gt 0 ]; then
            echo "   Recent entries:" >> "$OUTPUT_FILE"
            grep "$pattern" "$latest_log" | tail -10 >> "$OUTPUT_FILE"
        fi

        echo "" >> "$OUTPUT_FILE"
    else
        echo "   No log files found for pattern: $log_type"
        echo "No log files found for pattern: $log_type" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi

    echo
}

# Function to analyze errors with stack traces
analyze_errors() {
    echo "🚨 Error Analysis"
    echo "🚨 Error Analysis" >> "$OUTPUT_FILE"
    echo "=================" >> "$OUTPUT_FILE"

    local error_log=$(ls -t $LOG_DIR/error*.log 2>/dev/null | head -1)

    if [ -n "$error_log" ] && [ -f "$error_log" ]; then
        echo "   Analyzing: $error_log"

        # Count errors by type
        echo "   Error Types:" >> "$OUTPUT_FILE"
        grep '"level":"error"' "$error_log" | grep -o '"name":"[^"]*"' | sort | uniq -c | sort -nr >> "$OUTPUT_FILE" 2>/dev/null

        # Show recent errors with stack traces
        echo "" >> "$OUTPUT_FILE"
        echo "   Recent Errors (with stack traces):" >> "$OUTPUT_FILE"
        grep -A 10 '"level":"error"' "$error_log" | tail -50 >> "$OUTPUT_FILE" 2>/dev/null

        # Count total errors today
        local today=$(date +%Y-%m-%d)
        local today_errors=$(grep "$today" "$error_log" | grep -c '"level":"error"' 2>/dev/null || echo "0")
        echo "   Errors today: $today_errors"
        echo "Errors today: $today_errors" >> "$OUTPUT_FILE"
    else
        echo "   No error logs found"
        echo "No error logs found" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo
}

# Function to analyze performance metrics
analyze_performance() {
    echo "⚡ Performance Analysis"
    echo "⚡ Performance Analysis" >> "$OUTPUT_FILE"
    echo "======================" >> "$OUTPUT_FILE"

    local perf_log=$(ls -t $LOG_DIR/performance*.log 2>/dev/null | head -1)
    local combined_log=$(ls -t $LOG_DIR/combined*.log 2>/dev/null | head -1)

    # Analyze from performance or combined logs
    local log_to_analyze=""
    if [ -n "$perf_log" ] && [ -f "$perf_log" ]; then
        log_to_analyze="$perf_log"
    elif [ -n "$combined_log" ] && [ -f "$combined_log" ]; then
        log_to_analyze="$combined_log"
    fi

    if [ -n "$log_to_analyze" ]; then
        echo "   Analyzing: $log_to_analyze"

        # Extract performance metrics
        echo "   API Response Times (recent 10):" >> "$OUTPUT_FILE"
        grep '"performance":' "$log_to_analyze" | grep -o '"duration":[0-9]*' | tail -10 >> "$OUTPUT_FILE" 2>/dev/null

        echo "" >> "$OUTPUT_FILE"
        echo "   Slow Operations (>3000ms):" >> "$OUTPUT_FILE"
        grep '"performance":' "$log_to_analyze" | grep '"duration":[3-9][0-9][0-9][0-9]' | tail -5 >> "$OUTPUT_FILE" 2>/dev/null

        echo "" >> "$OUTPUT_FILE"
        echo "   Memory Usage Patterns:" >> "$OUTPUT_FILE"
        grep '"memory":' "$log_to_analyze" | grep -o '"heapUsed":[0-9]*' | tail -10 >> "$OUTPUT_FILE" 2>/dev/null

        # Database performance
        echo "" >> "$OUTPUT_FILE"
        echo "   Database Query Performance:" >> "$OUTPUT_FILE"
        grep '"database":' "$log_to_analyze" | grep -o '"duration":[0-9]*' | tail -10 >> "$OUTPUT_FILE" 2>/dev/null
    else
        echo "   No performance logs found"
        echo "No performance logs found" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo
}

# Function to analyze traffic patterns
analyze_traffic() {
    echo "🌐 Traffic Analysis"
    echo "🌐 Traffic Analysis" >> "$OUTPUT_FILE"
    echo "==================" >> "$OUTPUT_FILE"

    local http_log=$(ls -t $LOG_DIR/http*.log 2>/dev/null | head -1)
    local combined_log=$(ls -t $LOG_DIR/combined*.log 2>/dev/null | head -1)

    # Analyze from http or combined logs
    local log_to_analyze=""
    if [ -n "$http_log" ] && [ -f "$http_log" ]; then
        log_to_analyze="$http_log"
    elif [ -n "$combined_log" ] && [ -f "$combined_log" ]; then
        log_to_analyze="$combined_log"
    fi

    if [ -n "$log_to_analyze" ]; then
        echo "   Analyzing: $log_to_analyze"

        # Top endpoints
        echo "   Top API Endpoints:" >> "$OUTPUT_FILE"
        grep '"level":"http"' "$log_to_analyze" | grep -o '"url":"[^"]*"' | sort | uniq -c | sort -nr | head -10 >> "$OUTPUT_FILE" 2>/dev/null

        # Status code distribution
        echo "" >> "$OUTPUT_FILE"
        echo "   HTTP Status Codes:" >> "$OUTPUT_FILE"
        grep '"statusCode":' "$log_to_analyze" | grep -o '"statusCode":[0-9]*' | sort | uniq -c | sort -nr >> "$OUTPUT_FILE" 2>/dev/null

        # Response time distribution
        echo "" >> "$OUTPUT_FILE"
        echo "   Response Time Distribution:" >> "$OUTPUT_FILE"
        grep '"responseTime":' "$log_to_analyze" | grep -o '"responseTime":[0-9]*' | awk -F':' '{
            time = $2;
            if (time < 1000) bucket="<1s";
            else if (time < 3000) bucket="1-3s";
            else if (time < 5000) bucket="3-5s";
            else bucket=">5s";
            print bucket;
        }' | sort | uniq -c >> "$OUTPUT_FILE" 2>/dev/null

        # User agents (top 5)
        echo "" >> "$OUTPUT_FILE"
        echo "   Top User Agents:" >> "$OUTPUT_FILE"
        grep '"userAgent":' "$log_to_analyze" | grep -o '"userAgent":"[^"]*"' | sort | uniq -c | sort -nr | head -5 >> "$OUTPUT_FILE" 2>/dev/null
    else
        echo "   No traffic logs found"
        echo "No traffic logs found" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo
}

# Function to analyze database operations
analyze_database() {
    echo "🗄️  Database Analysis"
    echo "🗄️  Database Analysis" >> "$OUTPUT_FILE"
    echo "===================" >> "$OUTPUT_FILE"

    local combined_log=$(ls -t $LOG_DIR/combined*.log 2>/dev/null | head -1)

    if [ -n "$combined_log" ] && [ -f "$combined_log" ]; then
        echo "   Analyzing: $combined_log"

        # Database query patterns
        echo "   Recent Database Operations:" >> "$OUTPUT_FILE"
        grep '"database":' "$combined_log" | tail -10 >> "$OUTPUT_FILE" 2>/dev/null

        echo "" >> "$OUTPUT_FILE"
        echo "   Slow Database Queries (>2000ms):" >> "$OUTPUT_FILE"
        grep '"database":' "$combined_log" | grep '"duration":[2-9][0-9][0-9][0-9]' | tail -5 >> "$OUTPUT_FILE" 2>/dev/null

        echo "" >> "$OUTPUT_FILE"
        echo "   Connection Pool Status:" >> "$OUTPUT_FILE"
        grep '"activeConnections":' "$combined_log" | tail -10 >> "$OUTPUT_FILE" 2>/dev/null
    else
        echo "   No database logs found"
        echo "No database logs found" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo
}

# Function to show log file sizes and rotation status
analyze_log_health() {
    echo "💾 Log File Health"
    echo "💾 Log File Health" >> "$OUTPUT_FILE"
    echo "==================" >> "$OUTPUT_FILE"

    echo "   Current log files:" >> "$OUTPUT_FILE"
    ls -lh $LOG_DIR/*.log 2>/dev/null >> "$OUTPUT_FILE" || echo "No .log files found" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
    echo "   Compressed/Archived logs:" >> "$OUTPUT_FILE"
    ls -lh $LOG_DIR/*.gz 2>/dev/null >> "$OUTPUT_FILE" || echo "No .gz files found" >> "$OUTPUT_FILE"

    # Check total log directory size
    local total_size=$(du -sh $LOG_DIR 2>/dev/null | cut -f1)
    echo "" >> "$OUTPUT_FILE"
    echo "   Total logs directory size: $total_size" >> "$OUTPUT_FILE"

    # Disk usage warning
    local disk_usage=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        echo "   ⚠️  WARNING: Disk usage is $disk_usage%" >> "$OUTPUT_FILE"
    fi

    echo
}

# Function to generate summary and recommendations
generate_summary() {
    echo "📋 Summary & Recommendations"
    echo "📋 Summary & Recommendations" >> "$OUTPUT_FILE"
    echo "============================" >> "$OUTPUT_FILE"

    local today=$(date +%Y-%m-%d)
    local combined_log=$(ls -t $LOG_DIR/combined*.log 2>/dev/null | head -1)
    local error_log=$(ls -t $LOG_DIR/error*.log 2>/dev/null | head -1)

    if [ -n "$combined_log" ] && [ -f "$combined_log" ]; then
        local total_requests=$(grep -c '"level":"http"' "$combined_log" 2>/dev/null || echo "0")
        local total_errors=$(grep -c '"level":"error"' "$error_log" 2>/dev/null || echo "0")
        local error_rate=0

        if [ "$total_requests" -gt 0 ]; then
            error_rate=$(echo "scale=2; $total_errors * 100 / $total_requests" | bc 2>/dev/null || echo "0")
        fi

        echo "   📊 Today's Statistics:" >> "$OUTPUT_FILE"
        echo "   - Total requests: $total_requests" >> "$OUTPUT_FILE"
        echo "   - Total errors: $total_errors" >> "$OUTPUT_FILE"
        echo "   - Error rate: ${error_rate}%" >> "$OUTPUT_FILE"

        echo "" >> "$OUTPUT_FILE"
        echo "   🎯 Recommendations:" >> "$OUTPUT_FILE"

        if (( $(echo "$error_rate > 5" | bc -l 2>/dev/null || echo "0") )); then
            echo "   ⚠️  High error rate detected - investigate recent errors" >> "$OUTPUT_FILE"
        fi

        # Check for slow requests
        local slow_requests=$(grep '"responseTime":' "$combined_log" | grep -c '"responseTime":[5-9][0-9][0-9][0-9]' 2>/dev/null || echo "0")
        if [ "$slow_requests" -gt 5 ]; then
            echo "   ⚠️  Multiple slow requests detected - check performance logs" >> "$OUTPUT_FILE"
        fi

        # Check memory usage
        local high_memory=$(grep '"heapUsed":' "$combined_log" | grep -c '"heapUsed":[2-9][0-9][0-9]' 2>/dev/null || echo "0")
        if [ "$high_memory" -gt 10 ]; then
            echo "   ⚠️  High memory usage detected - monitor memory leaks" >> "$OUTPUT_FILE"
        fi

        echo "   ✅ Use './debug_help/scripts/test_all_apis.sh' to verify current health" >> "$OUTPUT_FILE"
        echo "   ✅ Logs are automatically rotated and compressed" >> "$OUTPUT_FILE"
        echo "   ✅ Check 'debug_help/README.md' for troubleshooting guide" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo "Analysis completed at: $(date)" >> "$OUTPUT_FILE"
}

# Run all analyses
echo "Running comprehensive log analysis..."

analyze_errors
analyze_performance
analyze_traffic
analyze_database
analyze_log_health
generate_summary

echo "✅ Analysis complete! Report saved to: $OUTPUT_FILE"
echo ""
echo "📊 Quick Summary:"
if [ -f "$OUTPUT_FILE" ]; then
    # Show a quick summary of key metrics
    echo "Recent error count: $(grep -c "Errors today:" "$OUTPUT_FILE" 2>/dev/null || echo "N/A")"

    # Check if any warnings were generated
    if grep -q "⚠️" "$OUTPUT_FILE"; then
        echo "⚠️  Warnings found - check full report for details"
    else
        echo "✅ No critical issues detected"
    fi
fi

echo ""
echo "📁 Full report: $OUTPUT_FILE"
echo "📊 To view report: cat \"$OUTPUT_FILE\""