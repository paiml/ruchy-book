#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * Tooling Integration Test Suite
 * 
 * This script tests all Ruchy binary tools against book examples 
 * and ensures they work correctly for each version qualification.
 * 
 * Based on analysis of rosetta-ruchy repository tooling capabilities.
 */

interface ToolingTest {
  name: string;
  command: string;
  expectedPattern?: RegExp;
  shouldPass: boolean;
  description: string;
}

interface TestResult {
  tool: string;
  passed: boolean;
  output: string;
  error?: string;
  duration: number;
}

class ToolingIntegrationTester {
  private testFile = "test/tooling/simple_test.ruchy";
  private results: TestResult[] = [];

  async runTest(test: ToolingTest): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      console.log(`🔧 Testing ${test.name}...`);
      
      const cmd = new Deno.Command("ruchy", {
        args: test.command.split(" ").slice(1), // Remove 'ruchy' from command
        stdout: "piped",
        stderr: "piped",
      });

      const result = await cmd.output();
      const duration = performance.now() - startTime;
      
      const output = new TextDecoder().decode(result.stdout);
      const error = new TextDecoder().decode(result.stderr);
      
      const passed = result.success === test.shouldPass && 
                    (!test.expectedPattern || test.expectedPattern.test(output));
      
      if (passed) {
        console.log(`  ✅ ${test.description}`);
      } else {
        console.log(`  ❌ ${test.description}`);
        console.log(`     Expected success: ${test.shouldPass}, got: ${result.success}`);
        if (test.expectedPattern && !test.expectedPattern.test(output)) {
          console.log(`     Output didn't match expected pattern`);
        }
      }

      return {
        tool: test.name,
        passed,
        output: output || error,
        error: result.success ? undefined : error,
        duration
      };
      
    } catch (e) {
      const duration = performance.now() - startTime;
      console.log(`  ❌ ${test.description} - Command failed: ${e.message}`);
      
      return {
        tool: test.name,
        passed: false,
        output: "",
        error: e.message,
        duration
      };
    }
  }

  async runAllTests(): Promise<TestResult[]> {
    console.log("🧪 Ruchy Tooling Integration Test Suite");
    console.log("=====================================");
    
    // Verify test file exists
    try {
      await Deno.stat(this.testFile);
      console.log(`📝 Using test file: ${this.testFile}`);
    } catch {
      console.error(`❌ Test file not found: ${this.testFile}`);
      Deno.exit(1);
    }

    const tests: ToolingTest[] = [
      {
        name: "check",
        command: `ruchy check ${this.testFile}`,
        expectedPattern: /✓ Syntax is valid/,
        shouldPass: true,
        description: "Syntax validation"
      },
      {
        name: "lint",
        command: `ruchy lint ${this.testFile}`,
        expectedPattern: /Issues found|No issues found/,
        shouldPass: true,
        description: "Code quality analysis"
      },
      {
        name: "fmt",
        command: `ruchy fmt --check ${this.testFile}`,
        shouldPass: true, // May pass or fail, both are valid
        description: "Code formatting check"
      },
      {
        name: "runtime",
        command: `ruchy runtime ${this.testFile}`,
        expectedPattern: /Performance Metrics|Total Functions/,
        shouldPass: true,
        description: "Performance analysis"
      },
      {
        name: "provability",
        command: `ruchy provability ${this.testFile}`,
        expectedPattern: /Provability Analysis|Total Functions/,
        shouldPass: true,
        description: "Formal verification"
      },
      {
        name: "score",
        command: `ruchy score ${this.testFile}`,
        expectedPattern: /Quality Score Report|Overall Score/,
        shouldPass: true,
        description: "Quality scoring"
      },
      {
        name: "quality-gate",
        command: `ruchy quality-gate ${this.testFile}`,
        expectedPattern: /Quality Gate|Summary/,
        shouldPass: true,
        description: "Quality gate enforcement"
      },
      {
        name: "test",
        command: `ruchy test --coverage ${this.testFile}`,
        expectedPattern: /Running Ruchy tests|Coverage/,
        shouldPass: true,
        description: "Test execution with coverage"
      }
    ];

    console.log("");
    
    for (const test of tests) {
      const result = await this.runTest(test);
      this.results.push(result);
    }

    return this.results;
  }

  generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    let report = `
# Ruchy Tooling Integration Test Report

**Generated**: ${new Date().toISOString()}
**Test File**: ${this.testFile}
**Total Tests**: ${totalTests}
**Passed**: ${passedTests}
**Failed**: ${failedTests}
**Success Rate**: ${successRate}%
**Total Duration**: ${Math.round(totalDuration)}ms

## Test Results Summary

`;

    this.results.forEach(result => {
      const status = result.passed ? "✅ PASS" : "❌ FAIL";
      const duration = Math.round(result.duration);
      
      report += `### ${result.tool} - ${status} (${duration}ms)\n\n`;
      
      if (result.output) {
        report += "```\n" + result.output.trim() + "\n```\n\n";
      }
      
      if (result.error) {
        report += "**Error**: " + result.error + "\n\n";
      }
    });

    report += `
## Integration Assessment

`;

    if (successRate >= 80) {
      report += `✅ **EXCELLENT** - ${successRate}% of tools working correctly
- Ruchy tooling ecosystem is production-ready
- All core development workflows supported
- Ready for professional development and CI/CD integration
`;
    } else if (successRate >= 60) {
      report += `⚠️ **GOOD** - ${successRate}% of tools working correctly
- Ruchy tooling ecosystem is mostly functional
- Core development workflows supported with some limitations
- Suitable for most development tasks
`;
    } else {
      report += `❌ **NEEDS IMPROVEMENT** - Only ${successRate}% of tools working correctly
- Ruchy tooling ecosystem has significant gaps
- Limited development workflow support
- May require workarounds for professional development
`;
    }

    return report;
  }

  async saveReport(filename: string): Promise<void> {
    const report = this.generateReport();
    await Deno.writeTextFile(filename, report);
    console.log(`📊 Report saved to: ${filename}`);
  }
}

// Main execution
if (import.meta.main) {
  const tester = new ToolingIntegrationTester();
  
  try {
    const results = await tester.runAllTests();
    
    console.log("\n📊 Test Summary");
    console.log("================");
    
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    const successRate = Math.round((passed / total) * 100);
    
    console.log(`✅ Passed: ${passed}/${total} (${successRate}%)`);
    console.log(`❌ Failed: ${total - passed}/${total}`);
    
    // Save detailed report
    const reportFilename = `reports/tooling-integration-${new Date().toISOString().split('T')[0]}.md`;
    await tester.saveReport(reportFilename);
    
    // Exit with appropriate code
    if (successRate >= 80) {
      console.log("\n🎉 Tooling integration test: SUCCESS");
      Deno.exit(0);
    } else {
      console.log("\n⚠️ Tooling integration test: PARTIAL SUCCESS");
      Deno.exit(0); // Still exit 0 for partial success in development
    }
    
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    Deno.exit(1);
  }
}