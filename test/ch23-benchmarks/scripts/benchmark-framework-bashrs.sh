#!/usr/bin/env bash
# Chapter 23: Scientific Benchmarking Framework (bashrs v6.25.0)
# Uses bashrs bench for rigorous, reproducible performance testing
# bashrs quality-checked - lint with: bashrs lint benchmark-framework-bashrs.sh

set -euo pipefail

# ============================================================================
# Configuration
# ============================================================================

readonly WARMUP_ITERATIONS=3
readonly MEASURED_ITERATIONS=10
readonly RESULTS_DIR="$(dirname "$0")/../results"
readonly DATA_DIR="$(dirname "$0")/../data"
readonly TEMP_DIR="$(dirname "$0")/../.temp"

# Environment capture for reproducibility
readonly ENV_CPU=$(lscpu | grep "Model name" | cut -d: -f2 | xargs || echo "unknown")
readonly ENV_RAM=$(free -h | grep "Mem:" | awk '{print $2}' || echo "unknown")
readonly ENV_OS=$(uname -sr || echo "unknown")
readonly ENV_DATE=$(date -Iseconds)

# ============================================================================
# Benchmark Execution with bashrs bench
# ============================================================================

run_benchmark() {
    local name=$1
    local mode=$2  # python, deno, ruchy-ast, ruchy-bytecode, ruchy-transpile, ruchy-compile
    local script=$3

    echo "Running: $name [$mode]" >&2

    # Create temp directory if needed
    mkdir -p "$TEMP_DIR"

    # Prepare execution artifacts
    local wrapper_script="$TEMP_DIR/wrapper-$mode-$$.sh"
    local bench_output="$TEMP_DIR/bench-output-$mode-$$.json"
    local binary=""
    local rust_file=""

    case "$mode" in
        python)
            # Create wrapper for Python execution
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
python3 "$script" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        deno)
            # Create wrapper for Deno TypeScript execution
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
deno run "$script" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        ruchy-ast)
            # Create wrapper for Ruchy AST interpretation
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
ruchy run "$script" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        ruchy-bytecode)
            # Create wrapper for Ruchy bytecode VM
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
ruchy --vm-mode bytecode run "$script" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        ruchy-transpile)
            # Compile ONCE (not timed)
            rust_file="$TEMP_DIR/transpiled-$$.rs"
            binary="$TEMP_DIR/transpiled-$$"
            echo "  Transpiling..." >&2
            ruchy transpile "$script" > "$rust_file" 2>/dev/null
            rustc -O "$rust_file" -o "$binary" 2>/dev/null

            # Create wrapper that executes pre-compiled binary
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
"$binary" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        ruchy-compile)
            # Compile ONCE (not timed)
            binary="$TEMP_DIR/compiled-$$"
            echo "  Compiling..." >&2
            ruchy compile "$script" -o "$binary" >/dev/null 2>&1

            # Create wrapper that executes pre-compiled binary
            cat > "$wrapper_script" << EOF
#!/usr/bin/env bash
"$binary" > /dev/null 2>&1
EOF
            chmod +x "$wrapper_script"
            ;;

        *)
            echo "Unknown mode: $mode" >&2
            return 1
            ;;
    esac

    # Run bashrs bench with scientific rigor
    echo "  Benchmarking with bashrs bench..." >&2
    bashrs bench \
        --warmup "$WARMUP_ITERATIONS" \
        --iterations "$MEASURED_ITERATIONS" \
        --output "$bench_output" \
        --verify-determinism \
        --quiet \
        "$wrapper_script" >/dev/null 2>&1 || true

    # Parse bashrs bench JSON output (v6.25.0 format)
    local mean median stddev min max
    if [[ -f "$bench_output" ]]; then
        # bashrs bench nests data under benchmarks[0].statistics
        mean=$(python3 -c "import json; data = json.load(open('$bench_output')); print(f\"{data['benchmarks'][0]['statistics']['mean_ms']:.2f}\")")
        median=$(python3 -c "import json; data = json.load(open('$bench_output')); print(f\"{data['benchmarks'][0]['statistics']['median_ms']:.2f}\")")
        stddev=$(python3 -c "import json; data = json.load(open('$bench_output')); print(f\"{data['benchmarks'][0]['statistics']['stddev_ms']:.2f}\")")
        min=$(python3 -c "import json; data = json.load(open('$bench_output')); print(f\"{data['benchmarks'][0]['statistics']['min_ms']:.2f}\")")
        max=$(python3 -c "import json; data = json.load(open('$bench_output')); print(f\"{data['benchmarks'][0]['statistics']['max_ms']:.2f}\")")

        # Get raw results as comma-separated integers (rounded to nearest ms)
        local raw_results=$(python3 -c "import json; data = json.load(open('$bench_output')); print(','.join([str(int(round(x))) for x in data['benchmarks'][0]['raw_results_ms']]))")
    else
        echo "Error: bashrs bench did not produce output file" >&2
        return 1
    fi

    # Cleanup temp files
    rm -f "$wrapper_script" "$bench_output"
    if [[ -n "$binary" ]]; then
        rm -f "$binary"
    fi
    if [[ -n "$rust_file" ]]; then
        rm -f "$rust_file"
    fi

    # Output JSON in our standard format
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
  "raw_results": [$raw_results],
  "environment": {
    "cpu": "$ENV_CPU",
    "ram": "$ENV_RAM",
    "os": "$ENV_OS",
    "timestamp": "$ENV_DATE"
  },
  "tool": "bashrs bench v6.25.0"
}
EOF
}

# ============================================================================
# Main Entry Point
# ============================================================================

if [[ "${BASH_SOURCE[0]:-}" == "${0:-}" ]]; then
    echo "Benchmark Framework Loaded (bashrs bench v6.25.0)" >&2
    echo "Environment:" >&2
    echo "  CPU: $ENV_CPU" >&2
    echo "  RAM: $ENV_RAM" >&2
    echo "  OS:  $ENV_OS" >&2
    echo "  Date: $ENV_DATE" >&2
    echo "  bashrs: $(bashrs --version 2>&1 | head -1)" >&2
fi
