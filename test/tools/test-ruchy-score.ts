#!/usr/bin/env -S deno run --allow-read --allow-run
/**
 * TICKET-018-10: Comprehensive ruchy score validation
 *
 * Tests all .ruchy files in the test directory for quality scoring.
 * Part of 18-tool comprehensive testing initiative.
 *
 * Usage:
 *   deno run --allow-read --allow-run test/tools/test-ruchy-score.ts
 *
 * Exit codes:
 *   0: All files meet quality threshold
 *   1: One or more files below quality threshold
 */

import { walk } from "https://deno.land/std@0.208.0/fs/mod.ts";

interface ScoreResult {
  file: string;
  passed: boolean;
  score?: number; // 0.0 to 1.0+
  grade?: string;
  durationMs: number;
}

async function runRuchyScore(file: string): Promise<ScoreResult> {
  const startTime = performance.now();

  const cmd = new Deno.Command("ruchy", {
    args: ["score", file],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await cmd.output();
  const durationMs = performance.now() - startTime;

  const stdoutText = new TextDecoder().decode(stdout);

  // Parse score from output: "Score: 1.00/1.0"
  const scoreMatch = stdoutText.match(/Score:\s*([\d.]+)\/[\d.]+/);
  const score = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;

  // Determine grade based on score
  let grade = "F";
  if (score !== undefined) {
    if (score >= 1.00) grade = "A+";
    else if (score >= 0.93) grade = "A";
    else if (score >= 0.90) grade = "A-";
    else if (score >= 0.87) grade = "B+";
    else if (score >= 0.83) grade = "B";
    else if (score >= 0.80) grade = "B-";
    else if (score >= 0.77) grade = "C+";
    else if (score >= 0.73) grade = "C";
    else if (score >= 0.70) grade = "C-";
    else if (score >= 0.67) grade = "D+";
    else if (score >= 0.60) grade = "D";
    else grade = "F";
  }

  return {
    file,
    passed: code === 0 && (score || 0) >= 0.30, // Pragmatic threshold
    score,
    grade,
    durationMs,
  };
}

async function main() {
  console.log("🏆 TICKET-018-10: ruchy score comprehensive validation");
  console.log("=".repeat(70));

  const results: ScoreResult[] = [];
  const startTime = performance.now();

  // Find all .ruchy files in tests directory
  for await (
    const entry of walk("tests", {
      exts: [".ruchy"],
      includeDirs: false,
    })
  ) {
    const result = await runRuchyScore(entry.path);
    results.push(result);

    if (!result.passed) {
      console.error(`❌ ${entry.path} (${result.durationMs.toFixed(0)}ms)`);
      console.error(
        `   Score: ${result.score?.toFixed(2)} (${result.grade}) - Below threshold`,
      );
    } else {
      console.log(
        `✅ ${entry.path} (${result.durationMs.toFixed(0)}ms) - ${
          result.score?.toFixed(2)
        } (${result.grade})`,
      );
    }
  }

  const totalDuration = performance.now() - startTime;

  // Summary statistics
  console.log("\n" + "=".repeat(70));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

  // Calculate average score
  const validScores = results.filter((r) => r.score !== undefined);
  const avgScore = validScores.length > 0
    ? validScores.reduce((sum, r) => sum + r.score!, 0) / validScores.length
    : 0;

  console.log(`📊 Summary: ${passed}/${total} (${rate}%)`);
  console.log(`📈 Average Score: ${avgScore.toFixed(2)}/1.0`);
  console.log(`⏱️  Total Time: ${totalDuration.toFixed(0)}ms`);
  console.log(`⚡ Average: ${(totalDuration / total).toFixed(0)}ms per file`);

  // Grade distribution
  const gradeCount: Record<string, number> = {};
  results.forEach((r) => {
    if (r.grade) {
      gradeCount[r.grade] = (gradeCount[r.grade] || 0) + 1;
    }
  });

  console.log("\n📊 Grade Distribution:");
  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];
  grades.forEach((grade) => {
    if (gradeCount[grade]) {
      const count = gradeCount[grade];
      const pct = ((count / total) * 100).toFixed(1);
      console.log(`   ${grade}: ${count} files (${pct}%)`);
    }
  });

  // Detailed failure report
  if (failed > 0) {
    console.log("\n❌ Files Below Quality Threshold:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(
          `   - ${r.file}: ${r.score?.toFixed(2)} (${r.grade})`,
        );
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
    `   [${passed === total ? "✓" : "✗"}] All files meet quality threshold`,
  );
  console.log(
    `   [${totalDuration < 5000 ? "✓" : "✗"}] Total time < 5 seconds`,
  );
  console.log(
    `   [${avgScore >= 0.85 ? "✓" : "✗"}] Average score >= 0.85 (A- or better)`,
  );
  console.log(
    `   [${
      passed === total && totalDuration < 5000 && avgScore >= 0.85 ? "✓" : "✗"
    }] Ready for CI/CD`,
  );

  // Exit with appropriate code
  const success = passed === total;
  console.log(
    `\n${success ? "✅" : "❌"} TICKET-018-10: ${success ? "PASS" : "FAIL"}`,
  );

  Deno.exit(success ? 0 : 1);
}

// Run if executed directly
if (import.meta.main) {
  main();
}
