#!/usr/bin/env python3
# BENCH-006: File Line Processing (Large File grep-like operation)
# Task: Read 100MB log file, count lines containing "error" (case-insensitive)
# Measures: Buffered I/O efficiency, string search performance

def count_error_lines(filename):
    """Count lines containing 'error' (case-insensitive)"""
    count = 0
    with open(filename, 'r') as f:
        for line in f:
            if 'error' in line.lower():
                count += 1
    return count

# Execute benchmark
result = count_error_lines('testdata/bench-006-logs-100mb.txt')
print(result)
# Expected: 126076
