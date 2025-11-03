#!/usr/bin/env bash
# Run all working benchmarks and generate comprehensive report
# Ruchy v3.182.0 validation

set -euo pipefail

echo "=========================================="
echo "RUCHY v3.182.0 COMPREHENSIVE BENCHMARK SUITE"
echo "=========================================="
echo ""
echo "Running 9 complete benchmarks..."
echo "Estimated time: ~45-60 minutes"
echo ""

BENCHMARKS=(
    "002:Matrix multiplication (100x100)"
    "003:String concatenation (10K operations)"
    "004:Binary tree (memory stress test)"
    "005:Array sum (1M integers)"
    "007:Fibonacci recursive (n=20)"
    "008:Prime generation (10K primes)"
    "009:JSON parsing (50MB file)"
    "011:Nested loops (1000x1000)"
    "012:Startup time (Hello World)"
)

for bench_info in "${BENCHMARKS[@]}"; do
    IFS=':' read -r num name <<< "$bench_info"
    echo "=========================================="
    echo "Running BENCH-${num}: $name"
    echo "=========================================="

    if [ -f "./run-bench-${num}-full.sh" ]; then
        ./run-bench-${num}-full.sh
        echo ""
        echo "✅ BENCH-${num} complete!"
        echo ""
    else
        echo "⚠️  Script not found: run-bench-${num}-full.sh"
        echo ""
    fi
done

echo "=========================================="
echo "ALL BENCHMARKS COMPLETE!"
echo "=========================================="
echo ""
echo "Results available in: results/"
echo ""
echo "Generating summary..."

# Generate summary report
python3 << 'PYTHON_EOF'
import json
import os
from pathlib import Path

results_dir = Path("results")
benchmarks = []

for json_file in sorted(results_dir.glob("bench-*-results-full.json")):
    with open(json_file) as f:
        data = json.load(f)
        benchmarks.append(data)

print("\n" + "="*80)
print("COMPREHENSIVE BENCHMARK SUMMARY - Ruchy v3.182.0")
print("="*80)
print(f"\nTotal Benchmarks: {len(benchmarks)}")
print(f"Tool: bashrs bench v6.25.0")
print(f"Hardware: AMD Ryzen Threadripper 7960X 24-Cores, 125Gi RAM")
print("\n" + "="*80)

for bench in benchmarks:
    print(f"\n{bench['benchmark']}: {bench['name']}")
    print("-"*80)

    # Get Python baseline
    if 'python' in bench['modes']:
        python_mean = bench['modes']['python']['mean_ms']
    else:
        python_mean = None

    # Sort modes by mean time
    modes = [(name, stats) for name, stats in bench['modes'].items()]
    modes.sort(key=lambda x: x[1]['mean_ms'])

    print(f"{'Rank':<6} {'Mode':<20} {'Mean (ms)':<12} {'Median (ms)':<12} {'StdDev (ms)':<12} {'Speedup'}")
    print("-"*80)

    for i, (name, stats) in enumerate(modes, 1):
        mean = stats['mean_ms']
        median = stats['median_ms']
        stddev = stats['stddev_ms']

        if python_mean:
            speedup = python_mean / mean
            speedup_str = f"{speedup:>8.2f}x"
        else:
            speedup_str = "N/A"

        rank = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i:>2}"
        print(f"{rank:<6} {name:<20} {mean:>10.2f}  {median:>10.2f}  {stddev:>10.2f}  {speedup_str}")

print("\n" + "="*80)
print("Report generated: $(date)")
print("="*80)
PYTHON_EOF

echo ""
echo "Done!"
