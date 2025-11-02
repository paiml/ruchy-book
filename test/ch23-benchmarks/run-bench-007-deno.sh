#!/usr/bin/env bash
# Quick test: Add Deno to BENCH-007

set -euo pipefail

source "$(dirname "$0")/scripts/benchmark-framework-bashrs.sh"

readonly BENCH_NAME="Fibonacci recursive (n=20)"
readonly PYTHON_SCRIPT="$(dirname "$0")/bench-007-fibonacci.py"
readonly DENO_SCRIPT="$(dirname "$0")/bench-007-fibonacci.ts"
readonly RUCHY_SCRIPT="$(dirname "$0")/bench-007-fibonacci.ruchy"

echo "Running Python..."
run_benchmark "$BENCH_NAME" "python" "$PYTHON_SCRIPT" | jq -r '"\(.mode): \(.mean_ms)ms"'

echo "Running Deno..."
run_benchmark "$BENCH_NAME" "deno" "$DENO_SCRIPT" | jq -r '"\(.mode): \(.mean_ms)ms"'

echo "Running Ruchy bytecode..."
run_benchmark "$BENCH_NAME" "ruchy-bytecode" "$RUCHY_SCRIPT" | jq -r '"\(.mode): \(.mean_ms)ms"'

echo "Running Ruchy transpiled..."
run_benchmark "$BENCH_NAME" "ruchy-transpile" "$RUCHY_SCRIPT" | jq -r '"\(.mode): \(.mean_ms)ms"'
