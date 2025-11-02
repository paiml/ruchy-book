#!/usr/bin/env bash
# Run BENCH-007 (Fibonacci) in all 9 execution modes
# Uses bashrs bench v6.25.0 for scientific benchmarking

set -euo pipefail

source "$(dirname "$0")/scripts/benchmark-framework-bashrs.sh"

readonly BENCH_NAME="Fibonacci recursive (n=20)"
readonly PYTHON_SCRIPT="$(dirname "$0")/bench-007-fibonacci.py"
readonly DENO_SCRIPT="$(dirname "$0")/bench-007-fibonacci.ts"
readonly JULIA_SCRIPT="$(dirname "$0")/bench-007-fibonacci.jl"
readonly GO_SCRIPT="$(dirname "$0")/bench-007-fibonacci.go"
readonly RUST_SCRIPT="$(dirname "$0")/bench-007-fibonacci.rs"
readonly C_SCRIPT="$(dirname "$0")/bench-bench-007-*".c"
readonly RUCHY_SCRIPT="$(dirname "$0")/bench-007-fibonacci.ruchy"
readonly RESULTS_FILE="$(dirname "$0")/results/bench-007-results-full.json"

echo "========================================" >&2
echo "BENCH-007: Fibonacci Benchmark (Full)" >&2
echo "10 Execution Modes Comparison" >&2
echo "Using bashrs bench v6.25.0" >&2
echo "========================================" >&2
echo "" >&2

mkdir -p "$(dirname "$RESULTS_FILE")"

# Build JSON output
echo "{" > "$RESULTS_FILE"
echo '  "benchmark": "BENCH-007",' >> "$RESULTS_FILE"
echo '  "name": "Fibonacci recursive (n=20)",' >> "$RESULTS_FILE"
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

with open('results/bench-007-results-full.json') as f:
    data = json.load(f)

print(f"\nBenchmark: {data['name']}")
print(f"Tool: {data['tool']}\n")
print("Mode                | Mean (ms)  | Median (ms) | StdDev (ms) | Speedup vs Python")
print("--------------------|------------|-------------|-------------|-------------------")

python_mean = data['modes']['python']['mean_ms']
for mode_name, mode_data in data['modes'].items():
    mean = mode_data['mean_ms']
    median = mode_data['median_ms']
    stddev = mode_data['stddev_ms']
    speedup = python_mean / mean
    speedup_str = f"{speedup:5.2f}x" if mode_name != 'python' else "baseline"
    print(f"{mode_name:19} | {mean:10.2f} | {median:11.2f} | {stddev:11.2f} | {speedup_str}")

print("\n📖 Execution Modes Explained (ELI5):")
print("─" * 80)
print("python:           Interpreted (CPython)")
print("deno:             JIT compiled (V8 + TypeScript)")
print("julia:            JIT compiled (LLVM + type inference)")
print("go:               AOT compiled (fast compilation)")
print("rust:             AOT compiled (maximum optimization)")
print("ruchy-ast:        Interpreted (tree walking)")
print("ruchy-bytecode:   VM bytecode (pre-compiled)")
print("ruchy-transpiled: AOT compiled via Rust (2-step)")
print("ruchy-compiled:   AOT compiled (1-step)")
EOF
