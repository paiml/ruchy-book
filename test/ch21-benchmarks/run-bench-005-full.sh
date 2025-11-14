#!/usr/bin/env bash
# Run BENCH-005 (Array Sum) in all 10 execution modes
# Uses bashrs bench v6.25.0 for scientific benchmarking

set -euo pipefail

source "$(dirname "$0")/scripts/benchmark-framework-bashrs.sh"

readonly BENCH_NAME="Array sum (1M integers)"
readonly PYTHON_SCRIPT="$(dirname "$0")/bench-005-array-sum.py"
readonly DENO_SCRIPT="$(dirname "$0")/bench-005-array-sum.ts"
readonly JULIA_SCRIPT="$(dirname "$0")/bench-005-array-sum.jl"
readonly GO_SCRIPT="$(dirname "$0")/bench-005-array-sum.go"
readonly RUST_SCRIPT="$(dirname "$0")/bench-005-array-sum.rs"
readonly C_SCRIPT="$(dirname "$0")/bench-005-array-sum.c"
readonly RUCHY_SCRIPT="$(dirname "$0")/bench-005-array-sum.ruchy"
readonly RESULTS_FILE="$(dirname "$0")/results/bench-005-results-full.json"

echo "========================================" >&2
echo "BENCH-005: Array Sum Benchmark (Full)" >&2
echo "10 Execution Modes Comparison" >&2
echo "Using bashrs bench v6.25.0" >&2
echo "========================================" >&2
echo "" >&2

mkdir -p "$(dirname "$RESULTS_FILE")"

# Build JSON output
echo "{" > "$RESULTS_FILE"
echo '  "benchmark": "BENCH-005",' >> "$RESULTS_FILE"
echo '  "name": "Array sum (1M integers)",' >> "$RESULTS_FILE"
echo '  "tool": "bashrs bench v6.25.0",' >> "$RESULTS_FILE"
echo '  "modes": {' >> "$RESULTS_FILE"

# Mode 1: Python
echo '    "python": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "python" "$PYTHON_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 2: Deno TypeScript
echo '    "deno": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "deno" "$DENO_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 3: Julia
echo '    "julia": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "julia" "$JULIA_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 4: Go (compiled)
echo '    "go": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "go" "$GO_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 5: Rust (compiled)
echo '    "rust": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "rust" "$RUST_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 6: C (compiled)
echo '    "c": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "c" "$C_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 7: Ruchy AST
echo '    "ruchy-ast": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-ast" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 8: Ruchy Bytecode
echo '    "ruchy-bytecode": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-bytecode" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 9: Ruchy Transpiled
echo '    "ruchy-transpiled": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-transpile" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 10: Ruchy Compiled
echo '    "ruchy-compiled": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-compile" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"

# Close modes object and add metadata
echo '  },' >> "$RESULTS_FILE"
echo '  "metadata": {' >> "$RESULTS_FILE"
echo '    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",' >> "$RESULTS_FILE"
echo '    "os": "'$(uname -s)'",' >> "$RESULTS_FILE"
echo '    "arch": "'$(uname -m)'",' >> "$RESULTS_FILE"
echo '    "ruchy_version": "'$(ruchy --version 2>&1 | head -1)'",' >> "$RESULTS_FILE"
echo '    "bashrs_version": "v6.25.0"' >> "$RESULTS_FILE"
echo '  }' >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

echo "" >&2
echo "✅ BENCH-005 complete! Results saved to:" >&2
echo "   $RESULTS_FILE" >&2

# Generate summary table using Python
python3 << 'EOF'
import json
import sys

with open('results/bench-005-results-full.json') as f:
    data = json.load(f)

print("\n" + "="*70)
print(f"BENCH-005 RESULTS: {data['name']}")
print("="*70)
print(f"{'Mode':<20} {'Mean (ms)':<12} {'Median (ms)':<12} {'StdDev (ms)':<12} {'Speedup'}")
print("-"*70)

# Get Python baseline
python_mean = data['modes']['python']['mean_ms']

# Sort by mean time (fastest first)
modes = [(name, stats) for name, stats in data['modes'].items()]
modes.sort(key=lambda x: x[1]['mean_ms'])

for name, stats in modes:
    mean = stats['mean_ms']
    median = stats['median_ms']
    stddev = stats['stddev_ms']
    speedup = python_mean / mean

    print(f"{name:<20} {mean:>10.2f}  {median:>10.2f}  {stddev:>10.2f}  {speedup:>8.2f}x")

print("="*70)
EOF
