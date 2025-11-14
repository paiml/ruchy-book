#!/usr/bin/env python3
# BENCH-009: JSON parsing (50MB file) - Python
# Parse large JSON and access deeply nested value

import json
import sys

def parse_and_access(filename):
    """Parse JSON file and access deeply nested value"""
    with open(filename, 'r') as f:
        data = json.load(f)

    # Access deeply nested value
    city = data['users'][500]['profile']['location']['city']
    return city

def main():
    filename = sys.argv[1] if len(sys.argv) > 1 else "test-data/sample-50mb.json"
    city = parse_and_access(filename)
    # Silent for benchmarking
    # Expected: "London" or other city name

if __name__ == "__main__":
    main()
