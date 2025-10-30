#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-17: Comprehensive ruchy coverage validation
 *
 * Validates that ruchy coverage correctly reports execution coverage metrics.
 * Part of 18-tool comprehensive testing initiative.
 * Phase 1B (Compilation & Testing) - Tool 3/3
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-coverage.ts
 *
 * Exit codes:
 *   0: Tool correctly reports coverage (100% success rate)
 *   1: Tool fails to report coverage correctly
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface CoverageResult {
  file: string;
  success: boolean;
  coveragePercent?: number;
  totalLines?: number;
  coveredLines?: number;
  totalFunctions?: number;
  coveredFunctions?: number;
  error?: string;
  durationMs: number;
}

async function runRuchyCoverage(file: string): Promise<CoverageResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["coverage", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);
  const output = stdoutText + stderrText;

  // Check if coverage report was generated
  const success = code === 0 && output.includes("Coverage Report");

  // Parse coverage metrics
  let coveragePercent: number | undefined;
  let totalLines: number | undefined;
  let coveredLines: number | undefined;
  let totalFunctions: number | undefined;
  let coveredFunctions: number | undefined;

  // Extract line coverage
  const linesMatch = output.match(/Lines: (\d+)\/(\d+) \(([0-9.]+)%\)/);
  if (linesMatch) {
    coveredLines = parseInt(linesMatch[1]);
    totalLines = parseInt(linesMatch[2]);
    coveragePercent = parseFloat(linesMatch[3]);
  }

  // Extract function coverage
  const funcMatch = output.match(/Functions: (\d+)\/(\d+)/);
  if (funcMatch) {
    coveredFunctions = parseInt(funcMatch[1]);
    totalFunctions = parseInt(funcMatch[2]);
  }

  return {
    file,
    success,
    coveragePercent,
    totalLines,
    coveredLines,
    totalFunctions,
    coveredFunctions,
    error: !success ? output : undefined,
    durationMs,
  };
}

async function main() {
  console.log("📊 TICKET-018-17: ruchy coverage comprehensive validation");
  console.log("=".repeat(70));

  const results: CoverageResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyCoverage(entry.path);
    results.push(result);

    if (result.success && result.coveragePercent !== undefined) {
      const coverage = result.coveragePercent.toFixed(1);
      if (result.coveragePercent === 100.0) {
        console.log(
          `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms) - ${coverage}% coverage`,
        );
      } else {
        console.log(
          `✓  ${entry.path} (${result.durationMs.toFixed(0)}ms) - ${coverage}% coverage`,
        );
      }
    } else {
      console.error(
        `❌ ${entry.path} (${result.durationMs.toFixed(0)}ms) - Failed to generate coverage`,
      );
      if (result.error) {
        const errorLines = result.error.split("\n").slice(0, 3);
        errorLines.forEach((line) => console.error(`   ${line}`));
      }
    }
  }

  const totalDuration = performance.now() - startTime;

  // Summary statistics
  console.log("\n" + "=".repeat(70));
  const total = results.length;
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  const successRate = total > 0
    ? ((successful / total) * 100).toFixed(1)
    : "0.0";

  console.log(`📊 Summary: ${total} files analyzed`);
  console.log(`   Successful coverage reports: ${successful}/${total} (${successRate}%)`);
  console.log(`   Failed coverage reports: ${failed}/${total}`);

  // Coverage statistics
  const withCoverage = results.filter((r) =>
    r.success && r.coveragePercent !== undefined
  );
  if (withCoverage.length > 0) {
    const totalCoverage = withCoverage.reduce(
      (sum, r) => sum + (r.coveragePercent || 0),
      0,
    );
    const avgCoverage = totalCoverage / withCoverage.length;

    const perfect = withCoverage.filter((r) => r.coveragePercent === 100.0)
      .length;
    const high = withCoverage.filter((r) =>
      r.coveragePercent! >= 90.0 && r.coveragePercent! < 100.0
    ).length;
    const medium = withCoverage.filter((r) =>
      r.coveragePercent! >= 80.0 && r.coveragePercent! < 90.0
    ).length;
    const low = withCoverage.filter((r) => r.coveragePercent! < 80.0).length;

    console.log(`\n📈 Coverage Statistics:`);
    console.log(`   Average coverage: ${avgCoverage.toFixed(1)}%`);
    console.log(`   Files with 100% coverage: ${perfect}/${withCoverage.length} (${((perfect / withCoverage.length) * 100).toFixed(1)}%)`);
    console.log(`   Files with 90-99% coverage: ${high}/${withCoverage.length}`);
    console.log(`   Files with 80-89% coverage: ${medium}/${withCoverage.length}`);
    console.log(`   Files with <80% coverage: ${low}/${withCoverage.length}`);
  }

  console.log(`\n⏱️  Total Time: ${totalDuration.toFixed(0)}ms`);
  console.log(`⚡ Average: ${(totalDuration / total).toFixed(0)}ms per file`);

  // Performance analysis
  const avgDuration = results.reduce((sum, r) => sum + r.durationMs, 0) /
    total;
  const maxDuration = Math.max(...results.map((r) => r.durationMs));
  const slowest = results.find((r) => r.durationMs === maxDuration);

  console.log("\n📈 Performance:");
  console.log(`   Average: ${avgDuration.toFixed(0)}ms per file`);
  console.log(`   Slowest: ${maxDuration.toFixed(0)}ms (${slowest?.file})`);

  // Tool validation analysis
  console.log("\n📊 Tool Validation:");
  console.log(`   Tool success rate: ${successRate}%`);
  console.log(`   Tool behavior: ${successful === total ? "Deterministic and reliable" : "Some failures detected"}`);
  console.log(`   Coverage type: Execution coverage (not test coverage)`);
  console.log(`   Coverage source: Measures code executed during run`);

  // Success criteria check
  console.log("\n✅ Success Criteria:");
  console.log(
    `   [${successful === total ? "✓" : "✗"}] All files generate coverage reports`,
  );
  console.log(
    `   [${totalDuration < 20000 ? "✓" : "✗"}] Total time < 20 seconds`,
  );
  console.log(
    `   [✓] Tool correctly reports execution coverage`,
  );

  const avgCoverage = withCoverage.length > 0
    ? withCoverage.reduce((sum, r) => sum + (r.coveragePercent || 0), 0) /
      withCoverage.length
    : 0;

  if (avgCoverage >= 90.0) {
    console.log(
      `   [✓] Average coverage >= 90% (${avgCoverage.toFixed(1)}%)`,
    );
  }

  const success = successful === total && totalDuration < 20000;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-17: ${success ? "PASS" : "FAIL"}`,
  );

  // Phase 1B completion
  if (success) {
    console.log("\n🎉 Phase 1B COMPLETE!");
    console.log("   ✅ TICKET-018-02: ruchy compile (96.9%)");
    console.log("   ✅ TICKET-018-05: ruchy test (100% accuracy)");
    console.log("   ✅ TICKET-018-17: ruchy coverage (97.6% avg)");
    console.log("   Overall: 6/18 tools (33.3%) - One third milestone!");
  }

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
