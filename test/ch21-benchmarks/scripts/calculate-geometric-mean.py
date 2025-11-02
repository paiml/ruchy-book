#!/usr/bin/env python3
# Calculate geometric mean across completed benchmarks
# Shows honest overall performance vs Python baseline

import json
import sys
from pathlib import Path

def geometric_mean(values):
    """Calculate geometric mean of a list of values"""
    if not values:
        return 0
    product = 1
    for v in values:
        product *= v
    return product ** (1 / len(values))

def load_benchmark_results(benchmark_file):
    """Load benchmark results and extract speedups vs Python"""
    with open(benchmark_file) as f:
        data = json.load(f)

    if 'python' not in data['modes']:
        return None

    python_mean = data['modes']['python']['mean_ms']
    speedups = {}

    for mode_name, mode_data in data['modes'].items():
        if mode_name == 'python':
            speedups[mode_name] = 1.0  # Baseline
        else:
            speedups[mode_name] = python_mean / mode_data['mean_ms']

    return {
        'name': data['name'],
        'benchmark': data['benchmark'],
        'speedups': speedups
    }

def main():
    results_dir = Path("results")

    # Find all completed benchmark results
    completed_benchmarks = []
    for result_file in sorted(results_dir.glob("bench-*-results-full.json")):
        result = load_benchmark_results(result_file)
        if result:
            completed_benchmarks.append(result)

    if not completed_benchmarks:
        print("No completed benchmarks found", file=sys.stderr)
        return 1

    print(f"\\n{'='*80}")
    print(f"GEOMETRIC MEAN ANALYSIS - {len(completed_benchmarks)} Completed Benchmarks")
    print(f"{'='*80}\\n")

    # Collect all modes
    all_modes = set()
    for bench in completed_benchmarks:
        all_modes.update(bench['speedups'].keys())

    all_modes = sorted(all_modes)

    # Calculate geometric mean for each mode
    geometric_means = {}
    for mode in all_modes:
        speedups = []
        for bench in completed_benchmarks:
            if mode in bench['speedups']:
                speedups.append(bench['speedups'][mode])

        if speedups:
            geometric_means[mode] = geometric_mean(speedups)

    # Display results
    print("Individual Benchmark Results:")
    print(f"{'Benchmark':<40} | " + " | ".join(f"{mode:>15}" for mode in all_modes))
    print("-" * 80)

    for bench in completed_benchmarks:
        bench_name = f"{bench['benchmark']}: {bench['name']}"
        speedup_strs = []
        for mode in all_modes:
            if mode in bench['speedups']:
                speedup = bench['speedups'][mode]
                if mode == 'python':
                    speedup_strs.append(f"{'baseline':>15}")
                else:
                    speedup_strs.append(f"{speedup:>14.2f}x")
            else:
                speedup_strs.append(f"{'N/A':>15}")

        print(f"{bench_name:<40} | " + " | ".join(speedup_strs))

    print()
    print(f"{'='*80}")
    print("GEOMETRIC MEAN (Overall Performance):")
    print(f"{'='*80}")
    print()

    # Sort by geometric mean
    sorted_modes = sorted(geometric_means.items(), key=lambda x: x[1], reverse=True)

    for mode, gmean in sorted_modes:
        if mode == 'python':
            print(f"  {mode:<20} {gmean:>8.2f}x  (baseline)")
        else:
            print(f"  {mode:<20} {gmean:>8.2f}x")

    print()
    print(f"{'='*80}")
    print("INTERPRETATION:")
    print(f"{'='*80}")
    print(f"  Benchmarks analyzed: {len(completed_benchmarks)}")
    print(f"  Geometric mean is the honest average speedup across all benchmarks")
    print(f"  Values > 1.0x mean faster than Python baseline")
    print(f"  Values < 1.0x mean slower than Python baseline")
    print()

    # Highlight Ruchy modes
    ruchy_modes = [m for m in sorted_modes if m[0].startswith('ruchy')]
    if ruchy_modes:
        print("RUCHY PERFORMANCE SUMMARY:")
        for mode, gmean in ruchy_modes:
            print(f"  {mode:<20} {gmean:>8.2f}x average speedup")
        print()

    return 0

if __name__ == "__main__":
    sys.exit(main())
