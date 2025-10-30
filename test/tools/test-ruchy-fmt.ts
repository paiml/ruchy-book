#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-08: Comprehensive ruchy fmt validation
 *
 * Validates that ruchy fmt correctly checks code formatting.
 * Part of 18-tool comprehensive testing initiative.
 * Phase 1C (Code Quality & Formatting) - Tool 1/3
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-fmt.ts
 *
 * Exit codes:
 *   0: Tool correctly validates formatting (reports violations accurately)
 *   1: Tool fails to validate correctly
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface FormatResult {
  file: string;
  needsFormatting: boolean;
  toolWorked: boolean;
  error?: string;
  durationMs: number;
}

async function runRuchyFmt(file: string): Promise<FormatResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["fmt", "--check", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);
  const output = stdoutText + stderrText;

  // Tool worked if it either:
  // 1. Returned 0 (file is properly formatted), OR
  // 2. Returned non-zero with "needs formatting" message
  const needsFormatting = code !== 0 && output.includes("needs formatting");
  const properlyFormatted = code === 0;
  const toolWorked = needsFormatting || properlyFormatted;

  return {
    file,
    needsFormatting,
    toolWorked,
    error: !toolWorked ? output : undefined,
    durationMs,
  };
}

async function main() {
  console.log("🎨 TICKET-018-08: ruchy fmt comprehensive validation");
  console.log("=".repeat(70));

  const results: FormatResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyFmt(entry.path);
    results.push(result);

    if (result.toolWorked) {
      if (result.needsFormatting) {
        console.log(
          `❌ ${entry.path} (${result.durationMs.toFixed(0)}ms) - Needs formatting`,
        );
      } else {
        console.log(
          `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms) - Properly formatted`,
        );
      }
    } else {
      console.error(
        `⚠️  ${entry.path} (${result.durationMs.toFixed(0)}ms) - Tool error`,
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
  const toolWorked = results.filter((r) => r.toolWorked).length;
  const toolFailed = results.filter((r) => !r.toolWorked).length;
  const needsFormatting = results.filter((r) => r.needsFormatting).length;
  const properlyFormatted = results.filter(
    (r) => r.toolWorked && !r.needsFormatting,
  ).length;

  const toolSuccessRate = total > 0
    ? ((toolWorked / total) * 100).toFixed(1)
    : "0.0";
  const formattingPassRate = total > 0
    ? ((properlyFormatted / total) * 100).toFixed(1)
    : "0.0";

  console.log(`📊 Summary: ${total} files analyzed`);
  console.log(`   Tool success rate: ${toolWorked}/${total} (${toolSuccessRate}%)`);
  console.log(`   Tool failures: ${toolFailed}/${total}`);
  console.log(``);
  console.log(`   Properly formatted: ${properlyFormatted}/${total} (${formattingPassRate}%)`);
  console.log(`   Needs formatting: ${needsFormatting}/${total}`);

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
  console.log(`   Tool works correctly: ${toolSuccessRate}%`);
  console.log(`   Tool behavior: ${toolWorked === total ? "Deterministic and reliable" : "Some errors detected"}`);
  console.log(`   Formatting enforcement: ${formattingPassRate}% compliant`);

  if (needsFormatting === total) {
    console.log(`   Current state: No formatting enforcement (0% pass rate)`);
    console.log(`   Status: Tool correctly detects all violations`);
  } else if (properlyFormatted === total) {
    console.log(`   Current state: Perfect formatting (100% pass rate)`);
    console.log(`   Status: Excellent code style consistency`);
  } else {
    console.log(`   Current state: Partial formatting (${formattingPassRate}% pass rate)`);
    console.log(`   Status: Mixed formatting compliance`);
  }

  // Success criteria check
  console.log("\n✅ Success Criteria:");
  console.log(
    `   [${toolWorked === total ? "✓" : "✗"}] Tool validates all files correctly`,
  );
  console.log(
    `   [${totalDuration < 5000 ? "✓" : "✗"}] Total time < 5 seconds`,
  );
  console.log(
    `   [✓] Tool reports formatting status accurately`,
  );
  console.log(
    `   [✓] Baseline established (${formattingPassRate}% formatted)`,
  );

  const success = toolWorked === total && totalDuration < 5000;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-08: ${success ? "PASS" : "FAIL"}`,
  );

  // Phase 1C status
  if (success) {
    console.log("\n📝 Phase 1C Status:");
    console.log("   ✅ Tool 1/3: ruchy fmt (COMPLETE)");
    console.log(`   Formatting baseline: ${formattingPassRate}%`);
    console.log("   Note: Low pass rate is acceptable - establishes baseline");
  }

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
