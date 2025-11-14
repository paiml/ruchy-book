#!/usr/bin/env python3
# BENCH-005: Array Sum (1 million integers) - Python

def array_sum(n):
    total = 0
    for i in range(n):
        total += i
    return total

result = array_sum(1000000)
# Expected: 499999500000
