#!/bin/bash

# API Testing Script for Portfolio V4
echo "🧪 Testing All APIs - $(date)"
echo "=================================="

# Configuration
BASE_URL="http://localhost:3001"
LOGFILE="debug_help/logs/api_test_$(date +%Y%m%d_%H%M%S).log"

# Create log file
mkdir -p debug_help/logs
touch "$LOGFILE"

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local name=$2

    echo -n "Testing $name API... "

    response=$(curl -s -w "HTTPSTATUS:%{http_code};TIME:%{time_total}" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*;TIME:[0-9.]*$//')

    # Log details
    echo "[$name] Status: $http_code, Time: ${time_total}s" >> "$LOGFILE"
    echo "[$name] Response: $body" >> "$LOGFILE"
    echo "---" >> "$LOGFILE"

    # Display results
    if [ "$http_code" = "200" ]; then
        echo "✅ $http_code (${time_total}s)"

        # Additional validation for specific endpoints
        case $endpoint in
            "/api/public/home-skills")
                skills_count=$(echo "$body" | jq -r '.skills | length' 2>/dev/null)
                if [ "$skills_count" != "null" ] && [ "$skills_count" -gt 0 ]; then
                    echo "   📊 Skills loaded: $skills_count"
                else
                    echo "   ⚠️  Skills data issue"
                fi
                ;;
            "/api/health")
                status=$(echo "$body" | jq -r '.status' 2>/dev/null)
                connected=$(echo "$body" | jq -r '.database.connected' 2>/dev/null)
                echo "   📊 Status: $status, DB Connected: $connected"
                ;;
        esac
    else
        echo "❌ $http_code (${time_total}s)"
        if [ ${#body} -lt 200 ]; then
            echo "   Error: $body"
        else
            echo "   Error: Response too long, check logs"
        fi
    fi
}

# Test all endpoints
echo "Starting API tests..."
echo

test_api "/api/health" "Health"
test_api "/api/public/profile" "Profile"
test_api "/api/public/projects" "Projects"
test_api "/api/public/services" "Services"
test_api "/api/public/skills" "Skills"
test_api "/api/public/home-skills" "Home Skills"

echo
echo "🔍 Performance Summary:"
echo "======================"

# Calculate average response time
avg_time=$(grep "Time:" "$LOGFILE" | grep -o "[0-9.]*s" | sed 's/s//' | awk '{sum+=$1} END {printf "%.2f", sum/NR}')
echo "Average Response Time: ${avg_time}s"

# Count successful requests
success_count=$(grep "Status: 200" "$LOGFILE" | wc -l)
total_count=$(grep "Status:" "$LOGFILE" | wc -l)
echo "Success Rate: $success_count/$total_count"

# Check for any concerning response times
slow_requests=$(grep "Time:" "$LOGFILE" | grep -E "Time: [5-9]\.[0-9]*s|Time: [0-9]{2,}\." | wc -l)
if [ "$slow_requests" -gt 0 ]; then
    echo "⚠️  $slow_requests slow requests (>5s) detected"
    echo "   Check $LOGFILE for details"
fi

echo
echo "📋 Log file created: $LOGFILE"
echo "✅ Test completed at $(date)"