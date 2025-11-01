#!/usr/bin/env bash
# Run BENCH-007 (Fibonacci) in all 5 execution modes
# Outputs JSON results for analysis
# bashrs quality-checked - lint with: bashrs lint run-bench-007.sh

set -euo pipefail

# Load framework
source "$(dirname "$0")/scripts/benchmark-framework.sh"

readonly BENCH_NAME="Fibonacci recursive (n=20)"
readonly PYTHON_SCRIPT="$(dirname "$0")/bench-007-fibonacci.py"
readonly RUCHY_SCRIPT="$(dirname "$0")/bench-007-fibonacci.ruchy"
readonly RESULTS_FILE="$(dirname "$0")/results/bench-007-results.json"

echo "========================================" >&2
echo "BENCH-007: Fibonacci Benchmark" >&2
echo "========================================" >&2
echo "" >&2

# Ensure results directory exists
mkdir -p "$(dirname "$RESULTS_FILE")"

# Run all 5 modes
echo "{" > "$RESULTS_FILE"
echo '  "benchmark": "BENCH-007",' >> "$RESULTS_FILE"
echo '  "name": "Fibonacci recursive (n=20)",' >> "$RESULTS_FILE"
echo '  "modes": {' >> "$RESULTS_FILE"

# Mode A: Python
echo '    "python": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "python" "$PYTHON_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode B: Ruchy AST
echo '    "ruchy-ast": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-ast" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode C: Ruchy Bytecode
echo '    "ruchy-bytecode": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-bytecode" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode D: Ruchy Transpiled
echo '    "ruchy-transpiled": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-transpile" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode E: Ruchy Compiled
echo '    "ruchy-compiled": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-compile" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"

echo '  }' >> "$RESULTS_FILE"
echo '}' >> "$RESULTS_FILE"

echo "" >&2
echo "========================================" >&2
echo "Results saved to: $RESULTS_FILE" >&2
echo "========================================" >&2

# Display summary
echo "" >&2
echo "Summary:" >&2
python3 << 'EOF'
import json
import sys

with open('results/bench-007-results.json') as f:
    data = json.load(f)

print(f"\nBenchmark: {data['name']}\n")
print("Mode                | Mean (ms)  | Median (ms) | StdDev (ms)")
print("--------------------|-----------

|-------------|------------")

for mode_name, mode_data in data['modes'].items():
    mean = mode_data['mean_ms']
    median = mode_data['median_ms']
    stddev = mode_data['stddev_ms']
    print(f"{mode_name:19} | {mean:10.2f} | {median:11.2f} | {stddev:11.2f}")
EOF
