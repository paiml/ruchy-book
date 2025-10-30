#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-07: Comprehensive ruchy lint validation
 *
 * Tests all .ruchy files in the test directory for style compliance.
 * Part of 18-tool comprehensive testing initiative.
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-lint.ts
 *
 * Exit codes:
 *   0: All files pass style analysis
 *   1: One or more files have style issues
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface LintResult {
  file: string;
  passed: boolean;
  warnings?: string[];
  durationMs: number;
}

async function runRuchyLint(file: string): Promise<LintResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["lint", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);

  // Parse warnings from output
  const warnings = stdoutText
    .split("\n")
    .filter((line) => line.includes("warning:"))
    .map((line) => line.trim());

  return {
    file,
    passed: code === 0,
    warnings: warnings.length > 0 ? warnings : undefined,
    durationMs,
  };
}

async function main() {
  console.log("🎨 TICKET-018-07: ruchy lint comprehensive validation");
  console.log("=".repeat(70));

  const results: LintResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyLint(entry.path);
    results.push(result);

    if (!result.passed) {
      console.error(`❌ ${entry.path} (${result.durationMs.toFixed(0)}ms)`);
      if (result.warnings) {
        result.warnings.forEach((w) => console.error(`   ${w}`));
      }
    } else {
      const warningNote = result.warnings
        ? ` (${result.warnings.length} warnings)`
        : "";
      console.log(
        `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms)${warningNote}`,
      );
    }
  }

  const totalDuration = performance.now() - startTime;

  // Summary statistics
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalWarnings = results.reduce(
    (sum, r) => sum + (r.warnings?.length || 0),
    0,
  );
  const total = results.length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

  console.log(`📊 Summary: ${passed}/${total} (${rate}%)`);
  if (totalWarnings > 0) {
    console.log(`⚠️  Total Warnings: ${totalWarnings}`);
  }
  console.log(`⏱️  Total Time: ${totalDuration.toFixed(0)}ms`);
  console.log(`⚡ Average: ${(totalDuration / total).toFixed(0)}ms per file`);

  // Detailed failure report
  if (failed > 0) {
    console.log("\n❌ Failed Files:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.file}`);
        if (r.warnings) {
          r.warnings.forEach((w) => console.log(`     ${w}`));
        }
      });
  }

  // Warning analysis
  if (totalWarnings > 0) {
    console.log("\n⚠️  Files with Warnings:");
    results
      .filter((r) => r.warnings && r.warnings.length > 0)
      .forEach((r) => {
        console.log(`   - ${r.file} (${r.warnings!.length} warnings)`);
      });
  }

  // Performance analysis
  const avgDuration = results.reduce((sum, r) => sum + r.durationMs, 0) /
    total;
  const maxDuration = Math.max(...results.map((r) => r.durationMs));
  const slowest = results.find((r) => r.durationMs === maxDuration);

  console.log("\n📈 Performance:");
  console.log(`   Average: ${avgDuration.toFixed(0)}ms per file`);
  console.log(`   Slowest: ${maxDuration.toFixed(0)}ms (${slowest?.file})`);

  // Success criteria check
  console.log("\n✅ Success Criteria:");
  console.log(`   [${passed === total ? "✓" : "✗"}] All files pass lint`);
  console.log(
    `   [${totalDuration < 5000 ? "✓" : "✗"}] Total time < 5 seconds`,
  );
  console.log(
    `   [${
      passed === total && totalDuration < 5000 ? "✓" : "✗"
    }] Ready for CI/CD`,
  );

  // Exit with appropriate code
  const success = passed === total;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-07: ${success ? "PASS" : "FAIL"}`,
  );

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
