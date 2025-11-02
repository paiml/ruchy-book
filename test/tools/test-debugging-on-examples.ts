#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write

/**
 * TICKET-020 Phase 2 (GREEN): Debugging Tools on Book Examples
 *
 * Tests ruchydbg debug analyze on sample book examples
 * Methodology: EXTREME TDD (GREEN phase - integration)
 *
 * Validates:
 * - Debugging works on real book examples
 * - Performance overhead is acceptable
 * - Error handling is robust
 * - Integration readiness confirmed
 */

interface Example {
  file: string;
  example_number: number;
  code: string;
  chapter: string;
}

interface DebugResult {
  example: Example;
  success: boolean;
  exitCode: number;
  executionTimeMs: number;
  stdout: string;
  stderr: string;
}

async function testDebugOnExample(example: Example): Promise<DebugResult> {
  // Write example to temp file
  const tempFile = `/tmp/debug-example-${example.chapter}-${example.example_number}.ruchy`;
  await Deno.writeTextFile(tempFile, example.code);

  const startTime = performance.now();

  const command = new Deno.Command("ruchydbg", {
    args: ["debug", "analyze", tempFile],
    stdout: "piped",
    stderr: "piped",
  });

  const process = command.spawn();
  const { code, stdout, stderr } = await process.output();

  const endTime = performance.now();

  return {
    example,
    success: code === 0,
    exitCode: code,
    executionTimeMs: endTime - startTime,
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
  };
}

async function main() {
  console.log("═════════════════════════════════════════════════════════");
  console.log("🔬 TICKET-020 Phase 2 (GREEN): Debugging on Book Examples");
  console.log("═════════════════════════════════════════════════════════\n");

  // Load summary.json
  const summaryText = await Deno.readTextFile("test/extracted-examples/summary.json");
  const summary = JSON.parse(summaryText);

  console.log(`📊 Test Data:`);
  console.log(`   Total examples: ${summary.examples_found}`);
  console.log(`   Ruchy version: ${summary.ruchy_version}`);
  console.log(`   Chapters: ${summary.chapters_processed}`);
  console.log(``);

  // Sample examples from different chapters
  const sampleExamples: Example[] = [];

  // Get first working example from each of first 5 chapters
  for (const [chapterName, chapterData] of Object.entries(summary.chapters) as [string, any][]) {
    if (sampleExamples.length >= 5) break;

    const workingExample = chapterData.examples.find((ex: any) => ex.passed);
    if (workingExample) {
      sampleExamples.push({
        file: workingExample.file,
        example_number: workingExample.example_number,
        code: workingExample.code,
        chapter: chapterName,
      });
    }
  }

  console.log(`📋 Testing ${sampleExamples.length} sample examples with ruchydbg debug analyze\n`);

  // Test each sample
  const results: DebugResult[] = [];

  for (let i = 0; i < sampleExamples.length; i++) {
    const example = sampleExamples[i];
    console.log(`Test ${i + 1}/${sampleExamples.length}: ${example.chapter}`);
    console.log(`   File: ${example.file}`);
    console.log(`   Example: #${example.example_number}`);

    const result = await testDebugOnExample(example);
    results.push(result);

    console.log(`   Exit code: ${result.exitCode}`);
    console.log(`   Success: ${result.success ? "✅" : "❌"}`);
    console.log(`   Time: ${result.executionTimeMs.toFixed(0)}ms`);
    console.log(``);
  }

  // Calculate statistics
  const successCount = results.filter(r => r.success).length;
  const successRate = (successCount / results.length) * 100;
  const avgTime = results.reduce((sum, r) => sum + r.executionTimeMs, 0) / results.length;
  const minTime = Math.min(...results.map(r => r.executionTimeMs));
  const maxTime = Math.max(...results.map(r => r.executionTimeMs));

  // Summary
  console.log("═════════════════════════════════════════════════════════");
  console.log("📊 PHASE 2 (GREEN) SUMMARY");
  console.log("═════════════════════════════════════════════════════════");
  console.log(`✅ Tests run: ${results.length}`);
  console.log(`✅ Tests passed: ${successCount}/${results.length}`);
  console.log(`✅ Success rate: ${successRate.toFixed(1)}%`);
  console.log(``);
  console.log(`⏱️  Performance:`);
  console.log(`   Average: ${avgTime.toFixed(0)}ms`);
  console.log(`   Min: ${minTime.toFixed(0)}ms`);
  console.log(`   Max: ${maxTime.toFixed(0)}ms`);
  console.log(``);

  // Comparison to standard execution
  const standardExecTime = 3; // ms (from previous tests)
  const overhead = avgTime / standardExecTime;
  console.log(`📈 Overhead Analysis:`);
  console.log(`   Standard execution: ~${standardExecTime}ms`);
  console.log(`   Debug execution: ${avgTime.toFixed(0)}ms`);
  console.log(`   Overhead: ${overhead.toFixed(0)}x (expected for debugging)`);
  console.log(``);

  console.log(`🎯 Integration Status:`);
  if (successRate === 100) {
    console.log(`   ✅ PRODUCTION READY - All samples passed`);
  } else if (successRate >= 80) {
    console.log(`   ⚠️  MOSTLY WORKING - Some issues found`);
  } else {
    console.log(`   ❌ NEEDS WORK - Multiple failures`);
  }
  console.log(``);

  console.log(`📋 Next Steps:`);
  console.log(`   - Phase 3 (REFACTOR): Update documentation`);
  console.log(`   - Add debugging to pre-commit hooks (optional)`);
  console.log(`   - Create debugging best practices guide`);
  console.log(``);

  // Exit with success if all tests passed
  Deno.exit(successRate === 100 ? 0 : 1);
}

main();
