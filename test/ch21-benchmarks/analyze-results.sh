#!/usr/bin/env bash
# Analyze benchmark results and generate summary
#
# This script extracts key metrics from all completed benchmarks
# and generates a markdown summary for the book

set -euo pipefail

RESULTS_DIR="results"
OUTPUT_FILE="RESULTS-SUMMARY.md"

echo "# Benchmark Results Summary - Ruchy v$(ruchy --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "**Generated**: $(date --iso-8601=seconds)" >> "$OUTPUT_FILE"
echo "**Platform**: $(uname -srm)" >> "$OUTPUT_FILE"
echo "**CPU**: $(lscpu | grep 'Model name' | sed 's/Model name:\s*//')" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "## Benchmark Performance Summary" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "| Benchmark | Python (ms) | Ruchy AST | Ruchy Bytecode | Ruchy Transpiled | Ruchy Compiled | Rust (ms) | Speedup vs Python |" >> "$OUTPUT_FILE"
echo "|-----------|-------------|-----------|----------------|------------------|----------------|-----------|-------------------|" >> "$OUTPUT_FILE"

for bench_num in 003 004 005 007 008 011 012; do
    json_file="$RESULTS_DIR/bench-$bench_num-results-full.json"

    if [! -f "$json_file" ]; then
        echo "| BENCH-$bench_num | ❌ No results | - | - | - | - | - | - |" >> "$OUTPUT_FILE"
        continue
    fi

    # Extract benchmark name
    bench_name=$(jq -r '.name // "Unknown"' "$json_file" 2>/dev/null || echo "Unknown")

    # Extract timing data (handle incomplete JSON gracefully)
    python_ms=$(jq -r '.modes.python.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")
    ruchy_ast_ms=$(jq -r '.modes.ruchy_ast.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")
    ruchy_bytecode_ms=$(jq -r '.modes.ruchy_bytecode.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")
    ruchy_transpiled_ms=$(jq -r '.modes.ruchy_transpiled.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")
    ruchy_compiled_ms=$(jq -r '.modes.ruchy_compiled.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")
    rust_ms=$(jq -r '.modes.rust.mean_ms // "N/A"' "$json_file" 2>/dev/null || echo "N/A")

    # Calculate speedup
    if [[ "$python_ms" != "N/A" ]] && [[ "$ruchy_transpiled_ms" != "N/A" ]]; then
        speedup=$(awk "BEGIN {printf \"%.2f\", $python_ms / $ruchy_transpiled_ms}")
    else
        speedup="N/A"
    fi

    echo "| $bench_name | $python_ms | $ruchy_ast_ms | $ruchy_bytecode_ms | $ruchy_transpiled_ms | $ruchy_compiled_ms | $rust_ms | ${speedup}x |" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "## Detailed Results by Benchmark" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for bench_num in 003 004 005 007 008 011 012; do
    json_file="$RESULTS_DIR/bench-$bench_num-results-full.json"

    if [ ! -f "$json_file" ]; then
        continue
    fi

    bench_name=$(jq -r '.name // "BENCH-$bench_num"' "$json_file" 2>/dev/null || echo "BENCH-$bench_num")

    echo "### $bench_name" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "All execution modes:" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Extract all modes
    jq -r '.modes | to_entries[] | "- **\(.key)**: \(.value.mean_ms)ms (median: \(.value.median_ms)ms, σ: \(.value.stddev_ms)ms)"' "$json_file" 2>/dev/null >> "$OUTPUT_FILE" || echo "⚠️ Incomplete data" >> "$OUTPUT_FILE"

    echo "" >> "$OUTPUT_FILE"
done

echo "✅ Results summary generated: $OUTPUT_FILE"
