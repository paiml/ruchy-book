#!/usr/bin/env deno run --allow-all

/**
 * TICKET-018: Comprehensive Multi-Tool Testing
 * Tests EVERY example against ALL 18+ ruchy tools
 */

interface ToolResult {
  passed: boolean;
  time_ms?: number;
  output?: string;
  error?: string;
  metadata?: Record<string, any>;
}

interface ExampleResult {
  example: string;
  file: string;
  line: number;
  tools: Record<string, ToolResult>;
  overall_pass: boolean;
  tools_passed: number;
  tools_failed: number;
}

const RUCHY_TOOLS = {
  // Core Execution (3)
  core: [
    { name: 'run', cmd: 'ruchy run', blocking: false },
    { name: 'compile', cmd: 'ruchy compile', blocking: false },
    { name: 'wasm', cmd: 'ruchy wasm', blocking: false },
  ],
  
  // Quality Analysis (15)
  quality: [
    { name: 'check', cmd: 'ruchy check', blocking: false },
    { name: 'test', cmd: 'ruchy test', blocking: false },
    { name: 'fmt', cmd: 'ruchy fmt --check', blocking: false },
    { name: 'lint', cmd: 'ruchy lint', blocking: false },
    { name: 'provability', cmd: 'ruchy provability', blocking: false },
    { name: 'runtime', cmd: 'ruchy runtime', blocking: false },
    { name: 'score', cmd: 'ruchy score', blocking: false },
    { name: 'quality-gate', cmd: 'ruchy quality-gate', blocking: false },
    { name: 'optimize', cmd: 'ruchy optimize', blocking: false },
    { name: 'prove', cmd: 'ruchy prove', blocking: false },
    { name: 'doc', cmd: 'ruchy doc', blocking: false },
    { name: 'bench', cmd: 'ruchy bench', blocking: false },
    { name: 'ast', cmd: 'ruchy ast', blocking: false },
    { name: 'coverage', cmd: 'ruchy coverage', blocking: false },
    { name: 'mcp', cmd: 'ruchy mcp --check', blocking: false },
  ],
  
  // Additional Tools
  additional: [
    { name: 'parse', cmd: 'ruchy parse', blocking: false },
    { name: 'property-tests', cmd: 'ruchy property-tests --cases 10', blocking: false },
    { name: 'mutations', cmd: 'ruchy mutations', blocking: false },
    { name: 'fuzz', cmd: 'ruchy fuzz --iterations 100', blocking: false },
  ]
};

async function testWithTool(
  filePath: string, 
  tool: { name: string, cmd: string, blocking: boolean }
): Promise<ToolResult> {
  const startTime = performance.now();
  
  try {
    const process = new Deno.Command('bash', {
      args: ['-c', `${tool.cmd} ${filePath} 2>&1`],
      stdout: 'piped',
      stderr: 'piped',
    });
    
    const { code, stdout, stderr } = await process.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);
    const time_ms = Math.round(performance.now() - startTime);
    
    // Determine if passed based on exit code and known error patterns
    const passed = code === 0 && !output.includes('Error:') && !error.includes('Error:');
    
    return {
      passed,
      time_ms,
      output: output.slice(0, 500), // Truncate for storage
      error: error.slice(0, 500),
    };
  } catch (e) {
    const time_ms = Math.round(performance.now() - startTime);
    return {
      passed: false,
      time_ms,
      error: String(e),
    };
  }
}

async function testExample(
  filePath: string, 
  exampleName: string, 
  lineNumber: number
): Promise<ExampleResult> {
  console.log(`\n🧪 Testing: ${exampleName}`);
  console.log('='.repeat(60));
  
  const result: ExampleResult = {
    example: exampleName,
    file: filePath,
    line: lineNumber,
    tools: {},
    overall_pass: true,
    tools_passed: 0,
    tools_failed: 0,
  };
  
  // Test with all core tools
  for (const tool of [...RUCHY_TOOLS.core, ...RUCHY_TOOLS.quality]) {
    const toolResult = await testWithTool(filePath, tool);
    result.tools[tool.name] = toolResult;
    
    if (toolResult.passed) {
      result.tools_passed++;
      console.log(`  ✅ ${tool.name.padEnd(20)} (${toolResult.time_ms}ms)`);
    } else {
      result.tools_failed++;
      result.overall_pass = false;
      console.log(`  ❌ ${tool.name.padEnd(20)} (${toolResult.time_ms}ms)`);
    }
  }
  
  return result;
}

async function main() {
  console.log('🚀 TICKET-018: Comprehensive Multi-Tool Testing');
  console.log('Testing examples across ALL ruchy tools\n');
  
  // Test a simple example
  const testCode = `
fun main() {
    println("Hello, World!")
}
`.trim();
  
  // Write test file
  const testFile = '/tmp/test_example.ruchy';
  await Deno.writeTextFile(testFile, testCode);
  
  const result = await testExample(testFile, 'hello_world', 1);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`  Total Tools Tested: ${result.tools_passed + result.tools_failed}`);
  console.log(`  Tools Passed: ${result.tools_passed}`);
  console.log(`  Tools Failed: ${result.tools_failed}`);
  console.log(`  Overall Pass: ${result.overall_pass ? '✅' : '❌'}`);
  console.log(`  Success Rate: ${Math.round(result.tools_passed / (result.tools_passed + result.tools_failed) * 100)}%`);
  
  // Save detailed results
  const outputPath = 'test/extracted-examples/multi-tool-results.json';
  await Deno.writeTextFile(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n📁 Detailed results saved: ${outputPath}`);
}

if (import.meta.main) {
  main();
}
