#!/usr/bin/env python3
# BENCH-011: Nested Loops (1000x1000 iterations) - Python

def nested_loops(outer, inner):
    total = 0
    for i in range(outer):
        for j in range(inner):
            total += i * j
    return total

result = nested_loops(1000, 1000)
# Expected: 249500250000
