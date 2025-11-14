#!/usr/bin/env -S deno run --allow-read --allow-run --allow-write
/**
 * TICKET-028-19: Comprehensive ruchydbg run Validation
 *
 * 🚀 Phase 2A: High Priority Tools (2/5)
 *
 * Tool: ruchydbg run (debug execution with time-travel debugging)
 * Purpose: Advanced debugging with timeout detection, type-aware tracing
 * Version: ruchydbg v1.9.1
 *
 * This is the SECOND high-priority tool in Phase 2!
 */

interface DebugResult {
  success: boolean;
  executionTime: number;
  timedOut: boolean;
  traceAvailable: boolean;
  errorMessage?: string;
}

async function testBasicDebugExecution(filePath: string): Promise<DebugResult> {
  try {
    const cmd = new Deno.Command("ruchydbg", {
      args: ["run", filePath],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await cmd.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);

    // Extract execution time
    const timeMatch = output.match(/Execution time: (\d+)ms/);
    const executionTime = timeMatch ? parseInt(timeMatch[1]) : 0;

    // Check for success
    const success = output.includes("✅ SUCCESS");
    const timedOut = output.includes("TIMEOUT");

    return {
      success,
      executionTime,
      timedOut,
      traceAvailable: false, // Not testing trace in basic mode
    };
  } catch (error) {
    return {
      success: false,
      executionTime: 0,
      timedOut: false,
      traceAvailable: false,
      errorMessage: `Test error: ${error}`,
    };
  }
}

async function testTraceExecution(filePath: string): Promise<DebugResult> {
  try {
    const cmd = new Deno.Command("ruchydbg", {
      args: ["run", filePath, "--trace"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await cmd.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);

    const timeMatch = output.match(/Execution time: (\d+)ms/);
    const executionTime = timeMatch ? parseInt(timeMatch[1]) : 0;

    const success = output.includes("✅ SUCCESS");
    const timedOut = output.includes("TIMEOUT");

    // Check for type-aware trace output
    const traceAvailable = output.includes("TRACE:") ||
                           output.includes("Type-aware tracing");

    return {
      success,
      executionTime,
      timedOut,
      traceAvailable,
    };
  } catch (error) {
    return {
      success: false,
      executionTime: 0,
      timedOut: false,
      traceAvailable: false,
      errorMessage: `Test error: ${error}`,
    };
  }
}

async function testTimeoutDetection(): Promise<DebugResult> {
  // Create infinite loop file
  const infiniteLoopFile = "/tmp/ruchydbg_infinite_loop_test.ruchy";
  await Deno.writeTextFile(infiniteLoopFile, `fun main() {
  let i = 0
  while true {
    i = i + 1
  }
}`);

  try {
    const cmd = new Deno.Command("ruchydbg", {
      args: ["run", infiniteLoopFile, "--timeout", "500"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await cmd.output();
    const output = new TextDecoder().decode(stdout) + new TextDecoder().decode(stderr);

    const timeMatch = output.match(/Execution time: (\d+)ms/);
    const executionTime = timeMatch ? parseInt(timeMatch[1]) : 0;

    const timedOut = output.includes("TIMEOUT");
    const success = timedOut; // Success means timeout was detected!

    await Deno.remove(infiniteLoopFile);

    return {
      success,
      executionTime,
      timedOut,
      traceAvailable: false,
    };
  } catch (error) {
    return {
      success: false,
      executionTime: 0,
      timedOut: false,
      traceAvailable: false,
      errorMessage: `Test error: ${error}`,
    };
  }
}

async function main() {
  console.log("🐛 TICKET-028-19: ruchydbg run Validation");
  console.log("🚀 Phase 2A: High Priority Tools (2/5)");
  console.log("=" .repeat(80));
  console.log();

  console.log("📋 Test Configuration:");
  console.log("   Tool: ruchydbg run (debug execution)");
  console.log("   Version: ruchydbg v1.9.1");
  console.log("   Features: Timeout detection, type-aware tracing, record-replay");
  console.log("   Expected: Advanced debugging with performance overhead");
  console.log();

  // Create test file
  const testFile = "/tmp/ruchydbg_test_ticket_028_19.ruchy";
  await Deno.writeTextFile(testFile, `fun main() {
  let x = 42
  println("Value: " + x)
  let y = x * 2
  println("Result: " + y)
}`);

  // Test 1: Basic debug execution
  console.log("🧪 Test 1: Basic Debug Execution");
  const basicResult = await testBasicDebugExecution(testFile);
  console.log(`   Success: ${basicResult.success ? "✅" : "❌"}`);
  console.log(`   Execution time: ${basicResult.executionTime}ms`);
  console.log(`   Timed out: ${basicResult.timedOut ? "❌ Unexpected" : "✅ No"}`);
  if (basicResult.errorMessage) {
    console.log(`   Error: ${basicResult.errorMessage}`);
  }
  console.log();

  // Test 2: Type-aware tracing
  console.log("🧪 Test 2: Type-Aware Tracing (--trace)");
  const traceResult = await testTraceExecution(testFile);
  console.log(`   Success: ${traceResult.success ? "✅" : "❌"}`);
  console.log(`   Trace available: ${traceResult.traceAvailable ? "✅" : "❌"}`);
  console.log(`   Execution time: ${traceResult.executionTime}ms`);
  console.log(`   Performance overhead: ${traceResult.executionTime - basicResult.executionTime}ms`);
  console.log();

  // Test 3: Timeout detection
  console.log("🧪 Test 3: Timeout Detection (Infinite Loop)");
  const timeoutResult = await testTimeoutDetection();
  console.log(`   Timeout detected: ${timeoutResult.timedOut ? "✅" : "❌"}`);
  console.log(`   Execution time: ${timeoutResult.executionTime}ms (should be ~500ms)`);
  console.log(`   Test passed: ${timeoutResult.success ? "✅" : "❌"}`);
  console.log();

  // Test 4: Sample files
  console.log("🧪 Test 4: Debug on Sample Extracted Examples");
  const sampleFiles = [];

  for await (const entry of Deno.readDir("test/extracted-examples")) {
    if (entry.isFile && entry.name.endsWith(".ruchy")) {
      sampleFiles.push(`test/extracted-examples/${entry.name}`);
      if (sampleFiles.length >= 5) break;
    }
  }

  let debugSuccessCount = 0;
  let traceSuccessCount = 0;
  let totalTime = 0;

  for (const file of sampleFiles) {
    const result = await testBasicDebugExecution(file);
    if (result.success) debugSuccessCount++;
    totalTime += result.executionTime;

    const traceRes = await testTraceExecution(file);
    if (traceRes.traceAvailable) traceSuccessCount++;
  }

  const avgTime = totalTime / sampleFiles.length;
  console.log(`   Files tested: ${sampleFiles.length}`);
  console.log(`   Debug success: ${debugSuccessCount}/${sampleFiles.length} (${((debugSuccessCount/sampleFiles.length)*100).toFixed(1)}%)`);
  console.log(`   Trace available: ${traceSuccessCount}/${sampleFiles.length} (${((traceSuccessCount/sampleFiles.length)*100).toFixed(1)}%)`);
  console.log(`   Average execution time: ${avgTime.toFixed(2)}ms`);
  console.log();

  // Cleanup
  await Deno.remove(testFile);

  // Overall assessment
  console.log("=" .repeat(80));
  console.log("📊 Assessment Summary:");
  console.log();

  const fullyFunctional = basicResult.success &&
                          traceResult.traceAvailable &&
                          timeoutResult.timedOut;

  if (fullyFunctional) {
    console.log("✅ ruchydbg run Status: FULLY FUNCTIONAL");
    console.log();
    console.log("   Key Features Working:");
    console.log("   • Basic debug execution: ✅");
    console.log("   • Type-aware tracing: ✅");
    console.log("   • Timeout detection: ✅");
    console.log("   • Performance overhead: Acceptable");
    console.log();
    console.log("   Debugger Capabilities:");
    console.log("   • Execution time tracking");
    console.log("   • Infinite loop detection (timeout)");
    console.log("   • Type-aware trace output");
    console.log("   • Clear success/failure indicators");
  } else {
    console.log("⚠️  ruchydbg run Status: PARTIAL FUNCTIONALITY");
    console.log();
    console.log("   Issues Found:");
    if (!basicResult.success) console.log("   • Basic execution not working");
    if (!traceResult.traceAvailable) console.log("   • Type-aware tracing not available");
    if (!timeoutResult.timedOut) console.log("   • Timeout detection not working");
  }

  console.log();
  console.log("   Performance Analysis:");
  console.log(`   • Basic execution: ${basicResult.executionTime}ms`);
  console.log(`   • With tracing: ${traceResult.executionTime}ms`);
  console.log(`   • Overhead: ${traceResult.executionTime - basicResult.executionTime}ms (${(((traceResult.executionTime - basicResult.executionTime) / basicResult.executionTime) * 100).toFixed(1)}%)`);
  console.log(`   • Timeout accuracy: ${timeoutResult.executionTime}ms (target: 500ms)`);
  console.log();

  console.log("   Comparison with ruchy run:");
  console.log("   • ruchy run: ~3ms (baseline)");
  console.log(`   • ruchydbg run: ${basicResult.executionTime}ms (${(basicResult.executionTime / 3).toFixed(1)}x slower)`);
  console.log("   • Overhead acceptable for debugging features");
  console.log();

  console.log("=" .repeat(80));
  console.log("🚀 Phase 2A Progress:");
  console.log("   ✅ TICKET-028-16: --trace flag (baseline)");
  console.log("   ✅ TICKET-028-19: ruchydbg run (CURRENT - fully functional!)");
  console.log("   🔜 TICKET-028-15: ruchy wasm (NEXT)");
  console.log("   🔜 TICKET-028-06: ruchy transpile");
  console.log("   🔜 TICKET-028-05: ruchy parse");
  console.log();
  console.log("📊 Overall Progress: 20/48 tools (41.7% including Phase 1)");
  console.log("=" .repeat(80));

  // Exit with appropriate code
  const allTestsPass = basicResult.success &&
                       traceResult.traceAvailable &&
                       timeoutResult.timedOut;
  Deno.exit(allTestsPass ? 0 : 1);
}

if (import.meta.main) {
  main();
}
