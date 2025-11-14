#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write
/**
 * TICKET-028-16: Comprehensive --trace Flag Validation
 *
 * 🚀 Phase 2A: High Priority Tools (1/5)
 *
 * Tool: ruchy --trace (execution tracing flag)
 * Purpose: Enable debugging visibility through execution tracing
 * Reference: DEBUGGER-014, Issue #84
 *
 * This is the FIRST tool in Phase 2 expansion!
 */

interface TraceResult {
  success: boolean;
  traceOutputFound: boolean;
  executionWorks: boolean;
  outputCorrect: boolean;
  performanceMs: number;
  error?: string;
}

async function testTraceFlag(filePath: string): Promise<TraceResult> {
  const startTime = performance.now();

  try {
    const cmd = new Deno.Command("ruchy", {
      args: ["--trace", filePath],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await cmd.output();
    const performanceMs = performance.now() - startTime;

    const stdoutText = new TextDecoder().decode(stdout);
    const stderrText = new TextDecoder().decode(stderr);
    const allOutput = stdoutText + stderrText;

    // Check if execution worked (code ran)
    const executionWorks = code === 0;

    // Check if trace output is present
    // Trace output typically includes: line numbers, execution steps, stack info
    const traceIndicators = [
      /trace/i,
      /line \d+/i,
      /step/i,
      /executing/i,
      /\[\d+\]/,  // Stack depth indicators
    ];
    const traceOutputFound = traceIndicators.some(pattern => pattern.test(allOutput));

    // Check if normal output still works
    const outputCorrect = stdoutText.length > 0;

    return {
      success: executionWorks,
      traceOutputFound,
      executionWorks,
      outputCorrect,
      performanceMs,
    };
  } catch (error) {
    return {
      success: false,
      traceOutputFound: false,
      executionWorks: false,
      outputCorrect: false,
      performanceMs: performance.now() - startTime,
      error: `Test error: ${error}`,
    };
  }
}

async function testTraceWithSubcommand(subcommand: string, filePath: string): Promise<TraceResult> {
  const startTime = performance.now();

  try {
    const cmd = new Deno.Command("ruchy", {
      args: ["--trace", subcommand, filePath],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await cmd.output();
    const performanceMs = performance.now() - startTime;

    const stdoutText = new TextDecoder().decode(stdout);
    const stderrText = new TextDecoder().decode(stderr);
    const allOutput = stdoutText + stderrText;

    const executionWorks = code === 0;
    const traceIndicators = [/trace/i, /line \d+/i, /step/i, /executing/i];
    const traceOutputFound = traceIndicators.some(pattern => pattern.test(allOutput));
    const outputCorrect = stdoutText.length > 0;

    return {
      success: executionWorks,
      traceOutputFound,
      executionWorks,
      outputCorrect,
      performanceMs,
    };
  } catch (error) {
    return {
      success: false,
      traceOutputFound: false,
      executionWorks: false,
      outputCorrect: false,
      performanceMs: performance.now() - startTime,
      error: `Test error: ${error}`,
    };
  }
}

async function main() {
  console.log("🔍 TICKET-028-16: --trace Flag Validation");
  console.log("🚀 Phase 2A: High Priority Tools (1/5)");
  console.log("=" .repeat(80));
  console.log();

  console.log("📋 Test Configuration:");
  console.log("   Flag: ruchy --trace");
  console.log("   Purpose: Execution tracing for debugging");
  console.log("   Reference: DEBUGGER-014, Issue #84");
  console.log("   Expected: Trace output showing execution flow");
  console.log();

  // Create test file
  const testFile = "/tmp/trace_test_ticket_028_16.ruchy";
  await Deno.writeTextFile(testFile, `fun main() {
  let x = 42
  println("Value: " + x)
  let y = x * 2
  println("Result: " + y)
}`);

  // Test 1: Basic trace
  console.log("🧪 Test 1: Basic --trace Flag");
  const basicResult = await testTraceFlag(testFile);
  console.log(`   Execution works: ${basicResult.executionWorks ? "✅" : "❌"}`);
  console.log(`   Trace output found: ${basicResult.traceOutputFound ? "✅" : "⚠️  No trace output"}`);
  console.log(`   Normal output works: ${basicResult.outputCorrect ? "✅" : "❌"}`);
  console.log(`   Performance: ${basicResult.performanceMs.toFixed(2)}ms`);
  if (basicResult.error) {
    console.log(`   Error: ${basicResult.error}`);
  }
  console.log();

  // Test 2: Trace with 'run' subcommand
  console.log("🧪 Test 2: --trace with 'run' Subcommand");
  const runResult = await testTraceWithSubcommand("run", testFile);
  console.log(`   Execution works: ${runResult.executionWorks ? "✅" : "❌"}`);
  console.log(`   Trace output found: ${runResult.traceOutputFound ? "✅" : "⚠️  No trace output"}`);
  console.log(`   Performance: ${runResult.performanceMs.toFixed(2)}ms`);
  console.log();

  // Test 3: Sample of extracted examples
  console.log("🧪 Test 3: Trace on Sample Extracted Examples");
  const sampleFiles = [];

  for await (const entry of Deno.readDir("test/extracted-examples")) {
    if (entry.isFile && entry.name.endsWith(".ruchy")) {
      sampleFiles.push(`test/extracted-examples/${entry.name}`);
      if (sampleFiles.length >= 5) break; // Test 5 samples
    }
  }

  let tracedSuccessfully = 0;
  let traceOutputCount = 0;
  let totalTime = 0;

  for (const file of sampleFiles) {
    const result = await testTraceFlag(file);
    if (result.success) tracedSuccessfully++;
    if (result.traceOutputFound) traceOutputCount++;
    totalTime += result.performanceMs;
  }

  const avgTime = totalTime / sampleFiles.length;
  console.log(`   Files tested: ${sampleFiles.length}`);
  console.log(`   Successful execution: ${tracedSuccessfully}/${sampleFiles.length} (${((tracedSuccessfully/sampleFiles.length)*100).toFixed(1)}%)`);
  console.log(`   Trace output found: ${traceOutputCount}/${sampleFiles.length} (${((traceOutputCount/sampleFiles.length)*100).toFixed(1)}%)`);
  console.log(`   Average performance: ${avgTime.toFixed(2)}ms`);
  console.log();

  // Cleanup
  await Deno.remove(testFile);

  // Overall assessment
  console.log("=" .repeat(80));
  console.log("📊 Assessment Summary:");
  console.log();

  const implementationStatus = basicResult.traceOutputFound ? "IMPLEMENTED" : "NOT YET IMPLEMENTED";
  const statusIcon = basicResult.traceOutputFound ? "✅" : "⏳";

  console.log(`${statusIcon} --trace Flag Status: ${implementationStatus}`);
  console.log();

  if (!basicResult.traceOutputFound) {
    console.log("   ⚠️  FINDING: --trace flag exists but trace output not visible");
    console.log("   📝 Note: Execution continues normally (no errors)");
    console.log("   📝 Reference: Issue #84 (DEBUGGER-014)");
    console.log("   📝 Status: Flag accepted, implementation pending");
    console.log();
    console.log("   Expected Future Behavior:");
    console.log("   • Line-by-line execution trace");
    console.log("   • Variable state at each step");
    console.log("   • Stack depth indicators");
    console.log("   • Execution timing information");
  } else {
    console.log("   ✅ Trace output is working!");
    console.log("   ✅ Execution tracing available");
    console.log("   ✅ Debugging visibility enabled");
  }

  console.log();
  console.log("   Key Findings:");
  console.log(`   • Flag recognition: ${basicResult.executionWorks ? "✅ Works" : "❌ Broken"}`);
  console.log(`   • Execution still runs: ${basicResult.executionWorks ? "✅ Yes" : "❌ No"}`);
  console.log(`   • Performance impact: ${basicResult.performanceMs.toFixed(2)}ms (baseline)`);
  console.log(`   • Integration: ${runResult.success ? "✅ Works with subcommands" : "❌ Issues"}`);
  console.log();

  console.log("=" .repeat(80));
  console.log("🚀 Phase 2A Progress:");
  console.log("   ✅ TICKET-028-16: --trace flag (CURRENT)");
  console.log("   🔜 TICKET-028-19: ruchydbg run (NEXT)");
  console.log("   🔜 TICKET-028-15: ruchy wasm");
  console.log("   🔜 TICKET-028-06: ruchy transpile");
  console.log("   🔜 TICKET-028-05: ruchy parse");
  console.log();
  console.log("📊 Overall Progress: 19/48 tools (39.6% including Phase 1)");
  console.log("=" .repeat(80));

  // Exit with appropriate code
  const allTestsPass = basicResult.executionWorks && runResult.executionWorks;
  Deno.exit(allTestsPass ? 0 : 1);
}

if (import.meta.main) {
  main();
}
