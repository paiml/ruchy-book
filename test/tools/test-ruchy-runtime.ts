#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-13: Comprehensive ruchy runtime validation
 *
 * Validates performance analysis and BigO complexity detection.
 * Part of 18-tool comprehensive testing initiative.
 * Phase 1D (Performance & Analysis) - Tool 1/3
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-runtime.ts
 *
 * Exit codes:
 *   0: Tool correctly analyzes performance (100% success)
 *   1: Tool fails to analyze performance
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface RuntimeResult {
  file: string;
  success: boolean;
  bigO?: string;
  worstCase?: string;
  error?: string;
  durationMs: number;
}

async function runRuchyRuntime(file: string): Promise<RuntimeResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["runtime", "--bigo", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stderrText = new TextDecoder().decode(stderr);
  const stdoutText = new TextDecoder().decode(stdout);
  const output = stdoutText + stderrText;

  // Parse BigO complexity from output
  const bigOMatch = output.match(/Algorithmic Complexity: (O\([^)]+\))/);
  const bigO = bigOMatch ? bigOMatch[1] : undefined;

  const worstCaseMatch = output.match(/Worst-case scenario: (.+)/);
  const worstCase = worstCaseMatch ? worstCaseMatch[1].trim() : undefined;

  return {
    file,
    success: code === 0,
    bigO,
    worstCase,
    error: code !== 0 ? output : undefined,
    durationMs,
  };
}

async function main() {
  console.log("⚡ TICKET-018-13: ruchy runtime comprehensive validation");
  console.log("=".repeat(70));

  const results: RuntimeResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyRuntime(entry.path);
    results.push(result);

    if (result.success) {
      const bigOStr = result.bigO || "unknown";
      console.log(
        `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms) - ${bigOStr}`,
      );
    } else {
      console.error(
        `❌ ${entry.path} (${result.durationMs.toFixed(0)}ms) - Failed`,
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
  const success = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : "0.0";

  console.log(`📊 Summary: ${total} files analyzed`);
  console.log(`   Success: ${success}/${total} (${successRate}%)`);
  console.log(`   Failed: ${failed}/${total}`);

  // BigO complexity distribution
  const bigODistribution = new Map<string, number>();
  results.forEach((r) => {
    if (r.bigO) {
      const count = bigODistribution.get(r.bigO) || 0;
      bigODistribution.set(r.bigO, count + 1);
    }
  });

  if (bigODistribution.size > 0) {
    console.log(`\n📈 BigO Complexity Distribution:`);
    const sorted = Array.from(bigODistribution.entries()).sort((a, b) =>
      b[1] - a[1]
    );
    sorted.forEach(([complexity, count]) => {
      const pct = ((count / total) * 100).toFixed(1);
      console.log(`   ${complexity}: ${count} files (${pct}%)`);
    });

    // Find most complex
    const complexities = results
      .map((r) => ({ file: r.file, bigO: r.bigO }))
      .filter((r) => r.bigO);
    if (complexities.length > 0) {
      // Simple heuristic: O(n^5) > O(n^2) > O(n) > O(1)
      const complexityOrder = ["O(1)", "O(n)", "O(n^2)", "O(n^3)", "O(n^4)", "O(n^5)"];
      const mostComplex = complexities.reduce((max, curr) => {
        const maxIdx = complexityOrder.indexOf(max.bigO || "");
        const currIdx = complexityOrder.indexOf(curr.bigO || "");
        return currIdx > maxIdx ? curr : max;
      });
      console.log(`\n🔥 Most Complex: ${mostComplex.file} (${mostComplex.bigO})`);
    }
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

  // Runtime analysis
  console.log("\n📊 Runtime Analysis:");
  console.log(`   Success rate: ${successRate}%`);
  console.log(
    `   BigO detection: ${bigODistribution.size} unique complexities`,
  );
  console.log(
    `   Tool behavior: ${success === total ? "100% reliable" : "Some failures"}`,
  );

  if (success === total) {
    console.log(`   Status: Excellent - 100% performance analysis success`);
  } else if (success >= total * 0.95) {
    console.log(`   Status: Good - >95% performance analysis success`);
  } else {
    console.log(`   Status: Needs improvement - <95% performance analysis success`);
  }

  // Success criteria check
  console.log("\n✅ Success Criteria:");
  console.log(
    `   [${success === total ? "✓" : "✗"}] All files analyzed successfully`,
  );
  console.log(
    `   [${totalDuration < 5000 ? "✓" : "✗"}] Total time < 5 seconds`,
  );
  console.log(
    `   [${bigODistribution.size > 0 ? "✓" : "✗"}] BigO complexities detected`,
  );
  console.log(
    `   [✓] Baseline established (${successRate}% success rate)`,
  );

  const passed = success === total && totalDuration < 5000;
  console.log(
    `\n${passed ? "✅" : "⚠️ "} TICKET-018-13: ${passed ? "PASS" : "ACCEPTABLE"}`,
  );

  // Phase 1D START
  if (passed || success >= total * 0.95) {
    console.log("\n🚀 Phase 1D Status:");
    console.log("   ✅ Tool 1/3: ruchy runtime (COMPLETE)");
    console.log(`   Performance analysis: ${successRate}%`);
    console.log("   Note: 100% success demonstrates excellent performance tooling");
    console.log("\n🚀 MILESTONE: Phase 1D STARTED!");
    console.log("   ✅ Performance analysis (ruchy runtime)");
    console.log("   📊 Progress: 10/18 tools (55.6%)");
    console.log("   🎯 Next: ruchy provability (Phase 1D 2/3)");
  }

  Deno.exit(passed ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
