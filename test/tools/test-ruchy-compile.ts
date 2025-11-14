#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write=/tmp
/**
 * TICKET-018-02: Comprehensive ruchy compile validation
 *
 * Tests all .ruchy files for compilation success.
 * Part of 18-tool comprehensive testing initiative.
 * Phase 1B (Compilation & Testing) - Tool 1/3
 *
 * Usage:
 *   deno run --allow-read --allow-run --allow-write=/tmp test/tools/test-ruchy-compile.ts
 *
 * Exit codes:
 *   0: All valid examples compile successfully
 *   1: One or more valid examples fail compilation
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface CompileResult {
  file: string;
  passed: boolean;
  isIntentionalError: boolean;
  error?: string;
  durationMs: number;
}

async function runRuchyCompile(file: string): Promise<CompileResult> {
  const startTime = performance.now();

  // Check if this is an intentional error example
  const content = await Deno.readTextFile(file);
  const isIntentionalError = content.includes("// Error:");

  const cmd = new Deno.Command("ruchy", {
    args: ["compile", file, "-o", "/tmp/test_compile_output"],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);
  const output = stdoutText + stderrText;

  // Clean up output file
  try {
    await Deno.remove("/tmp/test_compile_output");
  } catch {
    // Ignore if file doesn't exist
  }

  return {
    file,
    passed: code === 0,
    isIntentionalError,
    error: code !== 0 ? output : undefined,
    durationMs,
  };
}

async function main() {
  console.log("🔧 TICKET-018-02: ruchy compile comprehensive validation");
  console.log("=".repeat(70));

  const results: CompileResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyCompile(entry.path);
    results.push(result);

    if (!result.passed) {
      if (result.isIntentionalError) {
        console.log(
          `⚠️  ${entry.path} (${result.durationMs.toFixed(0)}ms) - Intentional error`,
        );
      } else {
        console.error(`❌ ${entry.path} (${result.durationMs.toFixed(0)}ms)`);
        if (result.error) {
          const errorLines = result.error.split("\n").slice(0, 3);
          errorLines.forEach((line) => console.error(`   ${line}`));
        }
      }
    } else {
      console.log(
        `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms)`,
      );
    }
  }

  const totalDuration = performance.now() - startTime;

  // Summary statistics
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  // Only count as intentional error if it failed AND has error comment
  const intentionalErrors = results.filter((r) => !r.passed && r.isIntentionalError).length;
  const realFailures = results.filter((r) => !r.passed && !r.isIntentionalError).length;
  const total = results.length;
  const validExamples = total - intentionalErrors;

  const rawRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
  const adjustedRate = validExamples > 0
    ? ((passed / validExamples) * 100).toFixed(1)
    : "0.0";

  console.log(`📊 Summary: ${passed}/${total} (${rawRate}%)`);
  console.log(`📊 Valid Examples: ${passed}/${validExamples} (${adjustedRate}%)`);
  console.log(`⚠️  Intentional Errors: ${intentionalErrors}`);
  console.log(`❌ Real Failures: ${realFailures}`);
  console.log(`⏱️  Total Time: ${totalDuration.toFixed(0)}ms`);
  console.log(`⚡ Average: ${(totalDuration / total).toFixed(0)}ms per file`);

  // Detailed failure report
  if (realFailures > 0) {
    console.log("\n❌ Real Compilation Failures:");
    results
      .filter((r) => !r.passed && !r.isIntentionalError)
      .forEach((r) => {
        console.log(`   - ${r.file}`);
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
  console.log(
    `   [${realFailures === 0 ? "✓" : "✗"}] All valid examples compile`,
  );
  console.log(
    `   [${totalDuration < 10000 ? "✓" : "✗"}] Total time < 10 seconds`,
  );
  console.log(
    `   [${parseFloat(adjustedRate) >= 95 ? "✓" : "✗"}] Pass rate >= 95%`,
  );
  console.log(
    `   [${
      realFailures === 0 && totalDuration < 10000 && parseFloat(adjustedRate) >= 95
        ? "✓"
        : "✗"
    }] Ready for CI/CD`,
  );

  // Exit with appropriate code
  // Success if all valid examples compile (ignoring intentional errors)
  const success = realFailures === 0;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-02: ${success ? "PASS" : "FAIL"}`,
  );

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
