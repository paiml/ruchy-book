#!/usr/bin/env python3
# Fast log file generator for BENCH-006
# Generates 100MB of log data quickly

import sys
import random
from datetime import datetime, timedelta

def generate_log(output_file, target_mb=100):
    """Generate log file with target size in MB"""
    target_bytes = target_mb * 1024 * 1024

    # Log templates
    templates = [
        ("[ERROR] service-{svc} - Failed to process request: connection timeout", 10),  # 10% ERROR
        ("[WARN] service-{svc} - High memory usage detected: 85% threshold exceeded", 20),  # 20% WARN
        ("[INFO] service-{svc} - Request processed successfully in 45ms", 70),  # 70% INFO
    ]

    # Create weighted list
    log_types = []
    for template, weight in templates:
        log_types.extend([template] * weight)

    start_time = datetime(2024, 1, 1, 0, 0, 0)
    current_bytes = 0
    line_num = 0

    print(f"Generating {target_mb}MB log file...", file=sys.stderr)

    with open(output_file, 'w') as f:
        while current_bytes < target_bytes:
            timestamp = (start_time + timedelta(seconds=line_num * 10)).strftime("%Y-%m-%d %H:%M:%S")
            template = random.choice(log_types)
            log_line = f"{timestamp} {template.format(svc=line_num % 10)}\n"

            f.write(log_line)
            current_bytes += len(log_line)
            line_num += 1

            if line_num % 100000 == 0:
                mb = current_bytes / 1024 / 1024
                print(f"Generated {mb:.1f}MB ({line_num} lines)...", file=sys.stderr)

    final_mb = current_bytes / 1024 / 1024
    print(f"✅ Generated {final_mb:.1f}MB ({line_num} lines)", file=sys.stderr)
    return output_file

if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "test-data/sample-100mb.log"
    generate_log(output)
