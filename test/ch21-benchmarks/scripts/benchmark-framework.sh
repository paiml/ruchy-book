#!/usr/bin/env bash
# Chapter 21: Scientific Benchmarking Framework
# Implements rigorous, reproducible performance testing
# bashrs quality-checked - lint with: bashrs lint benchmark-framework.sh

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

readonly WARMUP_ITERATIONS=3
readonly MEASURED_ITERATIONS=10
readonly RESULTS_DIR="$(dirname "$0")/../results"
readonly DATA_DIR="$(dirname "$0")/../data"

# Environment capture for reproducibility
readonly ENV_CPU=$(lscpu | grep "Model name" | cut -d: -f2 | xargs || echo "unknown")
readonly ENV_RAM=$(free -h | grep "Mem:" | awk '{print $2}' || echo "unknown")
readonly ENV_OS=$(uname -sr || echo "unknown")
readonly ENV_DATE=$(date -Iseconds)

# ============================================================================
# Statistics Functions
# ============================================================================

calculate_mean() {
    python3 -c "import sys; vals = [float(x) for x in sys.argv[1:]]; print(f'{sum(vals)/len(vals):.2f}')" "$@"
}

calculate_median() {
    python3 -c "import sys; vals = sorted([float(x) for x in sys.argv[1:]]); n = len(vals); print(f'{vals[n//2] if n % 2 else (vals[n//2-1] + vals[n//2])/2:.2f}')" "$@"
}

calculate_stddev() {
    python3 -c "import sys, statistics; vals = [float(x) for x in sys.argv[1:]]; print(f'{statistics.stdev(vals):.2f}')" "$@"
}

calculate_min() {
    local values=("$@")
    printf '%s\n' "${values[@]}" | sort -n | head -1
}

calculate_max() {
    local values=("$@")
    printf '%s\n' "${values[@]}" | sort -n | tail -1
}

# ============================================================================
# Timing Functions
# ============================================================================

# Time execution in milliseconds
time_execution() {
    local start end elapsed
    start=$(date +%s%N)
    "$@" > /dev/null 2>&1  # Suppress stdout/stderr during timing
    end=$(date +%s%N)
    elapsed=$(( (end - start) / 1000000 ))  # Convert to milliseconds
    echo "$elapsed"
}

# ============================================================================
# Benchmark Execution
# ============================================================================

run_benchmark() {
    local name=$1
    local mode=$2  # python, ruchy-ast, ruchy-bytecode, ruchy-transpile, ruchy-compile
    local script=$3

    echo "Running: $name [$mode]" >&2

    # Prepare compiled artifacts (not timed)
    local binary=""
    local rust_file=""
    if [[ "$mode" == "ruchy-transpile" ]]; then
        rust_file="${script%.ruchy}.rs"
        binary="${script%.ruchy}-transpiled"
        echo "  Transpiling..." >&2
        ruchy transpile "$script" > "$rust_file" 2>/dev/null
        rustc -O "$rust_file" -o "$binary" 2>/dev/null
    elif [[ "$mode" == "ruchy-compile" ]]; then
        binary="${script%.ruchy}-compiled"
        echo "  Compiling..." >&2
        ruchy compile "$script" -o "$binary" >/dev/null 2>&1
    fi

    # Warmup
    echo "  Warmup ($WARMUP_ITERATIONS iterations)..." >&2
    for i in $(seq 1 $WARMUP_ITERATIONS); do
        execute_benchmark "$mode" "$script" "$binary" > /dev/null
    done

    # Measure
    echo "  Measuring ($MEASURED_ITERATIONS iterations)..." >&2
    local results=()
    for i in $(seq 1 $MEASURED_ITERATIONS); do
        local time_ms=$(execute_benchmark "$mode" "$script" "$binary")
        results+=("$time_ms")
        echo "    Iteration $i: ${time_ms}ms" >&2
    done

    # Cleanup compiled artifacts
    if [[ -n "$binary" ]]; then
        rm -f "$binary"
    fi
    if [[ -n "$rust_file" ]]; then
        rm -f "$rust_file"
    fi

    # Calculate statistics
    local mean=$(calculate_mean "${results[@]}")
    local median=$(calculate_median "${results[@]}")
    local stddev=$(calculate_stddev "${results[@]}")
    local min=$(calculate_min "${results[@]}")
    local max=$(calculate_max "${results[@]}")

    # Output JSON
    cat <<EOF
{
  "name": "$name",
  "mode": "$mode",
  "iterations": $MEASURED_ITERATIONS,
  "warmup": $WARMUP_ITERATIONS,
  "mean_ms": $mean,
  "median_ms": $median,
  "stddev_ms": $stddev,
  "min_ms": $min,
  "max_ms": $max,
  "raw_results": [$(IFS=,; echo "${results[*]}")],
  "environment": {
    "cpu": "$ENV_CPU",
    "ram": "$ENV_RAM",
    "os": "$ENV_OS",
    "timestamp": "$ENV_DATE"
  }
}
EOF
}

execute_benchmark() {
    local mode=$1
    local script=$2
    local binary=$3  # Pre-compiled binary (for transpile/compile modes)

    case "$mode" in
        python)
            time_execution python3 "$script"
            ;;
        ruchy-ast)
            time_execution ruchy run "$script"
            ;;
        ruchy-bytecode)
            time_execution ruchy --vm-mode bytecode run "$script"
            ;;
        ruchy-transpile|ruchy-compile)
            # Binary already compiled, just execute
            time_execution "./$binary"
            ;;
        *)
            echo "Unknown mode: $mode" >&2
            return 1
            ;;
    esac
}

# ============================================================================
# Main Entry Point
# ============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "Benchmark Framework Loaded" >&2
    echo "Environment:" >&2
    echo "  CPU: $ENV_CPU" >&2
    echo "  RAM: $ENV_RAM" >&2
    echo "  OS:  $ENV_OS" >&2
    echo "  Date: $ENV_DATE" >&2
fi
