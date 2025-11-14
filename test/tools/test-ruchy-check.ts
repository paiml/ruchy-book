#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-04: Comprehensive ruchy check validation
 *
 * Tests all .ruchy files in the test directory for syntax correctness.
 * Part of 18-tool comprehensive testing initiative.
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-check.ts
 *
 * Exit codes:
 *   0: All files pass syntax validation
 *   1: One or more files have syntax errors
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface CheckResult {
  file: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

async function runRuchyCheck(file: string): Promise<CheckResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["check", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);

  return {
    file,
    passed: code === 0,
    error: code !== 0 ? stderrText || stdoutText : undefined,
    durationMs,
  };
}

async function main() {
  console.log("🔍 TICKET-018-04: ruchy check comprehensive validation");
  console.log("=" .repeat(70));

  const results: CheckResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (const entry of walk("tests", {
    exts: [".ruchy"],
    includeDirs: false,
  })) {
    const result = await runRuchyCheck(entry.path);
    results.push(result);

    if (!result.passed) {
      console.error(`❌ ${entry.path} (${result.durationMs.toFixed(0)}ms)`);
      if (result.error) {
        console.error(`   Error: ${result.error.trim()}`);
      }
    } else {
      console.log(`✅ ${entry.path} (${result.durationMs.toFixed(0)}ms)`);
    }
  }

  const totalDuration = performance.now() - startTime;

  // Summary statistics
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

  console.log(`📊 Summary: ${passed}/${total} (${rate}%)`);
  console.log(`⏱️  Total Time: ${totalDuration.toFixed(0)}ms`);
  console.log(
    `⚡ Average: ${(totalDuration / total).toFixed(0)}ms per file`,
  );

  // Detailed failure report
  if (failed > 0) {
    console.log("\n❌ Failed Files:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.file}`);
        if (r.error) {
          console.log(`     ${r.error.trim()}`);
        }
      });
  }

  // Performance analysis
  const avgDuration = results.reduce((sum, r) => sum + r.durationMs, 0) / total;
  const maxDuration = Math.max(...results.map((r) => r.durationMs));
  const slowest = results.find((r) => r.durationMs === maxDuration);

  console.log("\n📈 Performance:");
  console.log(`   Average: ${avgDuration.toFixed(0)}ms per file`);
  console.log(`   Slowest: ${maxDuration.toFixed(0)}ms (${slowest?.file})`);

  // Success criteria check
  console.log("\n✅ Success Criteria:");
  console.log(`   [${passed === total ? "✓" : "✗"}] All files pass validation`);
  console.log(`   [${totalDuration < 5000 ? "✓" : "✗"}] Total time < 5 seconds`);
  console.log(
    `   [${passed === total && totalDuration < 5000 ? "✓" : "✗"}] Ready for CI/CD`,
  );

  // Exit with appropriate code
  const success = passed === total;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-04: ${
      success ? "PASS" : "FAIL"
    }`,
  );

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
