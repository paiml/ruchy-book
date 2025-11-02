#!/usr/bin/env bash
# Run BENCH-003 (String Concatenation) in all 9 execution modes
# Uses bashrs bench v6.25.0 for scientific benchmarking

set -euo pipefail

source "$(dirname "$0")/scripts/benchmark-framework-bashrs.sh"

readonly BENCH_NAME="String concatenation (10K operations)"
readonly PYTHON_SCRIPT="$(dirname "$0")/bench-003-string-concat.py"
readonly DENO_SCRIPT="$(dirname "$0")/bench-003-string-concat.ts"
readonly JULIA_SCRIPT="$(dirname "$0")/bench-003-string-concat.jl"
readonly GO_SCRIPT="$(dirname "$0")/bench-003-string-concat.go"
readonly RUST_SCRIPT="$(dirname "$0")/bench-003-string-concat-rust.rs"
readonly C_SCRIPT="$(dirname "$0")/bench-003-string-concat.c"
readonly RUCHY_SCRIPT="$(dirname "$0")/bench-003-string-concat.ruchy"
readonly RESULTS_FILE="$(dirname "$0")/results/bench-003-results-full.json"

echo "========================================" >&2
echo "BENCH-003: String Concatenation" >&2
echo "10 Execution Modes Comparison" >&2
echo "Using bashrs bench v6.25.0" >&2
echo "========================================" >&2
echo "" >&2

mkdir -p "$(dirname "$RESULTS_FILE")"

# Build JSON output
echo "{" > "$RESULTS_FILE"
echo '  "benchmark": "BENCH-003",' >> "$RESULTS_FILE"
echo '  "name": "String concatenation (10K operations)",' >> "$RESULTS_FILE"
echo '  "tool": "bashrs bench v6.25.0",' >> "$RESULTS_FILE"
echo '  "modes": {' >> "$RESULTS_FILE"

# Mode 1: Python (idiomatic)
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

# Mode 6: Ruchy AST
echo '    "ruchy-ast": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-ast" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 7: Ruchy Bytecode
echo '    "ruchy-bytecode": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-bytecode" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 8: Ruchy Transpiled
echo '    "ruchy-transpiled": ' >> "$RESULTS_FILE"
run_benchmark "$BENCH_NAME" "ruchy-transpile" "$RUCHY_SCRIPT" >> "$RESULTS_FILE"
echo ',' >> "$RESULTS_FILE"

# Mode 9: Ruchy Compiled
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

with open('results/bench-003-results-full.json') as f:
    data = json.load(f)

print(f"\nBenchmark: {data['name']}")
print(f"Tool: {data['tool']}\n")
print("Mode                | Mean (ms)  | Median (ms) | StdDev (ms) | Speedup vs Python")
print("--------------------|------------|-------------|-------------|-------------------")

python_mean = data['modes']['python']['mean_ms']
results = []
for mode_name, mode_data in data['modes'].items():
    mean = mode_data['mean_ms']
    median = mode_data['median_ms']
    stddev = mode_data['stddev_ms']
    speedup = python_mean / mean
    speedup_str = f"{speedup:5.2f}x" if mode_name != 'python' else "baseline"
    results.append((speedup, mode_name, mean, median, stddev, speedup_str))

# Sort by speedup (fastest first)
results.sort(reverse=True)
for _, mode_name, mean, median, stddev, speedup_str in results:
    print(f"{mode_name:19} | {mean:10.2f} | {median:11.2f} | {stddev:11.2f} | {speedup_str}")

print("\n📖 Note: All implementations use idiomatic, efficient string building")
print("   (Python: join, Go: strings.Builder, Rust: repeat, etc.)")
EOF
