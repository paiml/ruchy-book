#!/usr/bin/env python3
"""
Generate realistic test log file for BENCH-006
Target: 100MB of log data with predictable error patterns
"""

import random
import sys
from datetime import datetime, timedelta

# Fixed seed for reproducibility (Toyota Way: Jidoka)
random.seed(42)

# Log levels and their frequencies
LOG_LEVELS = [
    ("INFO", 70),   # 70% info messages
    ("WARN", 20),   # 20% warnings
    ("ERROR", 8),   # 8% errors
    ("DEBUG", 2),   # 2% debug
]

# Sample log messages (varied to create realistic data)
MESSAGES = [
    "Processing request from user {user_id}",
    "Database query completed in {ms}ms",
    "Cache hit for key {key}",
    "Cache miss for key {key}, fetching from database",
    "API call to {service} completed successfully",
    "Scheduled job {job_name} started",
    "Scheduled job {job_name} completed",
    "User {user_id} logged in from IP {ip}",
    "File {filename} uploaded successfully",
    "Email sent to {email}",
    "Payment processed for order {order_id}",
    "Inventory updated for product {product_id}",
    "Session {session_id} expired",
    "Configuration reloaded",
    "Health check passed",
]

# Error-specific messages
ERROR_MESSAGES = [
    "Failed to connect to database: connection timeout",
    "Error processing payment: insufficient funds",
    "File not found: {filename}",
    "Permission denied for user {user_id}",
    "API rate limit exceeded for endpoint {endpoint}",
    "Invalid input: {error_detail}",
    "Network error: connection reset by peer",
    "Memory allocation failed",
]

def weighted_choice(choices):
    """Select item based on weights"""
    total = sum(weight for _, weight in choices)
    r = random.uniform(0, total)
    upto = 0
    for choice, weight in choices:
        if upto + weight >= r:
            return choice
        upto += weight
    return choices[-1][0]

def generate_log_line(timestamp):
    """Generate a single realistic log line"""
    level = weighted_choice(LOG_LEVELS)

    # Choose message based on log level
    if level == "ERROR":
        template = random.choice(ERROR_MESSAGES)
    else:
        template = random.choice(MESSAGES)

    # Fill in template placeholders
    message = template.format(
        user_id=random.randint(1000, 9999),
        ms=random.randint(5, 500),
        key=f"cache_{random.randint(1, 1000)}",
        service=random.choice(["auth", "payment", "inventory", "email"]),
        job_name=random.choice(["backup", "cleanup", "report", "sync"]),
        ip=f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}",
        filename=f"file{random.randint(1, 100)}.txt",
        email=f"user{random.randint(1, 1000)}@example.com",
        order_id=f"ORD-{random.randint(10000, 99999)}",
        product_id=f"PRD-{random.randint(100, 999)}",
        session_id=f"sess_{random.randint(100000, 999999)}",
        endpoint="/api/v1/users",
        error_detail="field 'email' is required"
    )

    # Format: 2025-11-02 15:30:45.123 [INFO] message
    return f"{timestamp.strftime('%Y-%m-%d %H:%M:%S')}.{random.randint(100, 999)} [{level:5s}] {message}\n"

def generate_test_file(output_path, target_size_mb=100):
    """Generate test log file with approximately target_size_mb of data"""
    target_bytes = target_size_mb * 1024 * 1024

    # Start timestamp
    start_time = datetime(2025, 11, 1, 0, 0, 0)

    bytes_written = 0
    lines_written = 0
    error_count = 0

    print(f"Generating {target_size_mb}MB test log file...", file=sys.stderr)

    with open(output_path, 'w') as f:
        while bytes_written < target_bytes:
            # Increment timestamp by random amount (realistic log timing)
            start_time += timedelta(milliseconds=random.randint(10, 500))

            line = generate_log_line(start_time)

            # Track stats
            if "[ERROR]" in line:
                error_count += 1

            f.write(line)
            bytes_written += len(line)
            lines_written += 1

            # Progress indicator
            if lines_written % 100000 == 0:
                mb_written = bytes_written / (1024 * 1024)
                print(f"  Progress: {mb_written:.1f}MB written, {lines_written:,} lines, {error_count:,} errors", file=sys.stderr)

    # Final stats
    mb_written = bytes_written / (1024 * 1024)
    print(f"\n✅ Generated: {output_path}", file=sys.stderr)
    print(f"   Size: {mb_written:.2f}MB", file=sys.stderr)
    print(f"   Lines: {lines_written:,}", file=sys.stderr)
    print(f"   Errors: {error_count:,} ({100 * error_count / lines_written:.2f}%)", file=sys.stderr)

    return error_count

if __name__ == "__main__":
    output_file = "testdata/bench-006-logs-100mb.txt"
    expected_errors = generate_test_file(output_file, target_size_mb=100)

    # Write expected error count to file for validation
    with open("testdata/bench-006-expected-errors.txt", 'w') as f:
        f.write(str(expected_errors))

    print(f"\nExpected error count written to: testdata/bench-006-expected-errors.txt")
