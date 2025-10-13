#!/usr/bin/env -S deno run --allow-net --allow-read --allow-run

/**
 * Test Ruchy Book Examples in Notebook (Layer 5 Validation)
 *
 * Part of 7-Layer Validation Stack:
 * - Layer 1: Syntax (ruchy check)
 * - Layer 2: Compile (ruchy compile)
 * - Layer 3: Run (ruchy run)
 * - Layer 4: 15 Tools (make dogfood-full)
 * - Layer 5: Notebook (THIS SCRIPT) ✅
 * - Layer 6: Spec Cross-Reference
 * - Layer 7: Integration Test
 *
 * Uses Ruchy notebook server API for real execution validation.
 */

const NOTEBOOK_URL = "http://localhost:8080/api/execute";
const NOTEBOOK_HEALTH = "http://localhost:8080/api/health";
const NOTEBOOK_TIMEOUT = 10000; // 10 seconds

interface NotebookResponse {
  success: boolean;
  output?: string;
  error?: string;
  stdout?: string;
  stderr?: string;
}

interface TestExample {
  file: string;
  code: string;
  expectedOutput?: string;
  description: string;
}

/**
 * Check if notebook server is running
 */
async function checkNotebookServer(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(NOTEBOOK_HEALTH, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Execute code in notebook via API
 */
async function executeInNotebook(code: string): Promise<NotebookResponse> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NOTEBOOK_TIMEOUT);

    const response = await fetch(NOTEBOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: code }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Extract examples from test script
 */
async function extractExamplesFromTestScript(
  scriptPath: string
): Promise<TestExample[]> {
  const content = await Deno.readTextFile(scriptPath);
  const examples: TestExample[] = [];

  // Extract heredoc code blocks from bash script
  const heredocRegex = /cat > (.*?) << 'EOF'\n(.*?)\nEOF/gs;
  let match;

  while ((match = heredocRegex.exec(content)) !== null) {
    const file = match[1];
    const code = match[2];

    // Extract description from comment before cat command
    const lines = content.substring(0, match.index).split('\n');
    const descLine = lines[lines.length - 2] || '';
    const description = descLine.replace(/^echo\s+"?📝\s*/, '').replace(/"$/, '').trim();

    examples.push({
      file,
      code,
      description: description || file,
    });
  }

  return examples;
}

/**
 * Test a single example in notebook
 */
async function testExample(example: TestExample): Promise<boolean> {
  console.log(`\n  📝 ${example.description}`);
  console.log(`     File: ${example.file}`);

  const result = await executeInNotebook(example.code);

  if (!result.success) {
    console.log(`     ❌ FAIL - ${result.error || 'Unknown error'}`);
    if (result.stderr) {
      console.log(`     stderr: ${result.stderr}`);
    }
    return false;
  }

  const output = result.output || result.stdout || '';
  console.log(`     ✅ PASS - Executed successfully`);
  console.log(`     Output: ${output.trim().split('\n')[0]}${output.includes('\n') ? '...' : ''}`);

  return true;
}

/**
 * Main test runner
 */
async function main() {
  console.log("🧪 Layer 5: Notebook Execution Validation");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Check notebook server
  console.log("\n🔍 Checking notebook server...");
  const serverRunning = await checkNotebookServer();

  if (!serverRunning) {
    console.log("❌ Notebook server not running!");
    console.log("");
    console.log("To start notebook server:");
    console.log("  ruchy notebook --port 8080");
    console.log("");
    console.log("Or run in background:");
    console.log("  ruchy notebook --port 8080 &");
    console.log("");
    Deno.exit(1);
  }

  console.log("✅ Notebook server is running");

  // Get chapter to test from command line
  const chapter = Deno.args[0] || "ch01";
  const testScript = `test/${chapter}/test_all_${chapter}.sh`;

  console.log(`\n📂 Testing chapter: ${chapter}`);
  console.log(`   Script: ${testScript}`);

  // Check if test script exists
  try {
    await Deno.stat(testScript);
  } catch {
    console.log(`❌ Test script not found: ${testScript}`);
    console.log("");
    console.log("Usage:");
    console.log("  deno run --allow-all scripts/test-in-notebook.ts [chapter]");
    console.log("");
    console.log("Examples:");
    console.log("  deno run --allow-all scripts/test-in-notebook.ts ch01");
    console.log("  deno run --allow-all scripts/test-in-notebook.ts ch02");
    console.log("");
    Deno.exit(1);
  }

  // Extract examples from test script
  console.log("\n📦 Extracting examples from test script...");
  const examples = await extractExamplesFromTestScript(testScript);
  console.log(`   Found ${examples.length} examples`);

  // Test each example
  console.log("\n🧪 Testing examples in notebook:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  let passed = 0;
  let failed = 0;

  for (const example of examples) {
    const success = await testExample(example);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Notebook Validation Results");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Total Examples: ${examples.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  const passRate = examples.length > 0
    ? ((passed / examples.length) * 100).toFixed(1)
    : "0.0";
  console.log(`Pass Rate: ${passRate}%`);
  console.log("");

  if (failed === 0) {
    console.log(`✅ SUCCESS: All ${chapter} examples pass notebook validation!`);
    console.log("");
    console.log("Layer 5 (Notebook Execution): ✅ COMPLETE");
    Deno.exit(0);
  } else {
    console.log(`❌ FAILURE: ${failed} examples failed notebook validation`);
    console.log("");
    console.log("Manual review required.");
    Deno.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  main();
}
