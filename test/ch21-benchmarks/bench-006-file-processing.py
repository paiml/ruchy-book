#!/usr/bin/env python3
# BENCH-006: File line processing (100MB log file) - Python
# Count lines containing "error" (case-insensitive)

import sys

def count_error_lines(filename):
    """Count lines containing 'error' (case-insensitive)"""
    count = 0
    with open(filename, 'r') as f:
        for line in f:
            if 'error' in line.lower():
                count += 1
    return count

def main():
    filename = sys.argv[1] if len(sys.argv) > 1 else "test-data/sample-100mb.log"
    count = count_error_lines(filename)
    # Silent for benchmarking
    # Expected: ~10% of lines contain ERROR

if __name__ == "__main__":
    main()
