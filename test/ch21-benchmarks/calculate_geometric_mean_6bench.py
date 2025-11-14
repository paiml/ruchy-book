#!/usr/bin/env python3
"""Calculate geometric mean for 6 benchmarks"""

import math

# Speedup data for all 6 benchmarks
benchmarks = {
    "python": [1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    "deno": [3.67, 1.74, 7.88, 2.82, 0.60, 1.88],  # BENCH-003, 005, 007, 008, 012, 011
    "julia": [12.96, 33.54, 12.90, 71.30, 12.25, 47.37],
    "go": [8.26, 23.05, 8.22, 23.26, 7.51, 20.90],
    "rust": [10.18, 28.59, 10.38, 20.44, 9.54, 34.15],
    "c": [11.56, 34.20, 11.51, 22.72, 10.28, 37.90],
    "ruchy-ast": [1.82, 0.08, 1.81, 0.03, 4.33, 0.07],
    "ruchy-bytecode": [4.65, 0.08, 4.42, 22.78, 4.17, 0.07],
    "ruchy-transpiled": [5.17, 30.60, 10.51, 21.50, 9.89, 33.75],
    "ruchy-compiled": [5.38, 30.24, 10.20, 22.66, 10.02, 28.93],
}

print("6-Benchmark Geometric Mean Calculation")
print("=" * 60)
print()

# Calculate geometric mean for each mode
results = []
for mode, speedups in benchmarks.items():
    product = 1.0
    for s in speedups:
        product *= s
    gm = product ** (1/6)
    results.append((gm, mode))
    print(f"{mode:20s}: {gm:6.2f}x  (speedups: {speedups})")

print()
print("Sorted by Geometric Mean:")
print("-" * 60)
results.sort(reverse=True)
for gm, mode in results:
    print(f"{mode:20s}: {gm:6.2f}x")

# Calculate individual speedups for BENCH-011
print()
print("BENCH-011 Individual Speedups:")
print("-" * 60)
python_time = 58.74
times = {
    "python": 58.74,
    "deno": 31.21,
    "julia": 1.24,
    "go": 2.81,
    "rust": 1.72,
    "c": 1.55,
    "ruchy-ast": 789.10,
    "ruchy-bytecode": 788.85,
    "ruchy-transpiled": 1.74,
    "ruchy-compiled": 2.03,
}

for mode, time in sorted(times.items(), key=lambda x: x[1]):
    speedup = python_time / time
    print(f"{mode:20s}: {time:7.2f}ms ({speedup:6.2f}x)")
