#!/usr/bin/env bash
# Generate 100MB log file for BENCH-006 testing
# Mix of INFO, WARN, ERROR lines

set -euo pipefail

OUTPUT_FILE="${1:-test-data/sample.log}"
TARGET_SIZE_MB=100

echo "Generating $TARGET_SIZE_MB MB log file: $OUTPUT_FILE"

mkdir -p "$(dirname "$OUTPUT_FILE")"

# Clear existing file
> "$OUTPUT_FILE"

# Generate log lines until we reach target size
current_size=0
line_num=0

while [ $current_size -lt $((TARGET_SIZE_MB * 1024 * 1024)) ]; do
    timestamp=$(date -u +"%Y-%m-%d %H:%M:%S" --date="@$((1704067200 + line_num * 10))") # Start from 2024-01-01

    # 70% INFO, 20% WARN, 10% ERROR distribution
    rand=$((RANDOM % 100))

    if [ $rand -lt 10 ]; then
        level="ERROR"
        message="Failed to process request: connection timeout"
    elif [ $rand -lt 30 ]; then
        level="WARN"
        message="High memory usage detected: 85% threshold exceeded"
    else
        level="INFO"
        message="Request processed successfully in 45ms"
    fi

    echo "$timestamp [$level] service-$((line_num % 10)) - $message" >> "$OUTPUT_FILE"

    line_num=$((line_num + 1))

    # Check size every 10000 lines
    if [ $((line_num % 10000)) -eq 0 ]; then
        current_size=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE" 2>/dev/null)
        echo "Generated $(( current_size / 1024 / 1024 )) MB ($line_num lines)..." >&2
    fi
done

final_size=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || stat -f%z "$OUTPUT_FILE" 2>/dev/null)
echo "✅ Generated $(( final_size / 1024 / 1024 )) MB ($line_num lines)" >&2
echo "$OUTPUT_FILE"
