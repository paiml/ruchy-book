#!/usr/bin/env -S ../../bashrs/target/release/bashrs
# Chapter 23: Scientific Benchmarking Framework
# Implements rigorous, reproducible performance testing
# bashrs compliant - strict mode enabled

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
    local values=("$@")
    local sum=0
    local count=${#values[@]}

    for val in "${values[@]}"; do
        sum=$(echo "$sum + $val" | bc)
    done

    echo "scale=3; $sum / $count" | bc
}

calculate_median() {
    local values=("$@")
    local count=${#values[@]}

    # Sort values
    IFS=$'\n' sorted=($(sort -n <<<"${values[*]}"))
    unset IFS

    if (( count % 2 == 0 )); then
        local mid1=$((count / 2 - 1))
        local mid2=$((count / 2))
        echo "scale=3; (${sorted[$mid1]} + ${sorted[$mid2]}) / 2" | bc
    else
        local mid=$((count / 2))
        echo "${sorted[$mid]}"
    fi
}

calculate_stddev() {
    local values=("$@")
    local mean=$(calculate_mean "${values[@]}")
    local count=${#values[@]}
    local sum_sq_diff=0

    for val in "${values[@]}"; do
        local diff=$(echo "$val - $mean" | bc)
        local sq=$(echo "$diff * $diff" | bc)
        sum_sq_diff=$(echo "$sum_sq_diff + $sq" | bc)
    done

    local variance=$(echo "scale=6; $sum_sq_diff / $count" | bc)
    echo "scale=3; sqrt($variance)" | bc
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
    "$@"
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

    # Warmup
    echo "  Warmup ($WARMUP_ITERATIONS iterations)..." >&2
    for i in $(seq 1 $WARMUP_ITERATIONS); do
        execute_benchmark "$mode" "$script" > /dev/null
    done

    # Measure
    echo "  Measuring ($MEASURED_ITERATIONS iterations)..." >&2
    local results=()
    for i in $(seq 1 $MEASURED_ITERATIONS); do
        local time_ms=$(execute_benchmark "$mode" "$script")
        results+=("$time_ms")
        echo "    Iteration $i: ${time_ms}ms" >&2
    done

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
        ruchy-transpile)
            # Transpile first (not timed)
            local rust_file="${script%.ruchy}.rs"
            local binary="${script%.ruchy}-transpiled"
            ruchy transpile "$script" > "$rust_file" 2>/dev/null
            rustc -O "$rust_file" -o "$binary" 2>/dev/null
            # Time execution
            time_execution "./$binary"
            # Cleanup
            rm -f "$rust_file" "$binary"
            ;;
        ruchy-compile)
            # Compile first (not timed)
            local binary="${script%.ruchy}-compiled"
            ruchy compile "$script" -o "$binary" 2>/dev/null
            # Time execution
            time_execution "./$binary"
            # Cleanup
            rm -f "$binary"
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
