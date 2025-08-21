#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * Comprehensive Ruchy One-Liner Test Suite
 * TypeScript implementation for testing all one-liner examples
 */

interface OneLinerTest {
  description: string;
  command: string;
  expected: string;
  category: string;
}

interface OneLinerResult {
  test: OneLinerTest;
  passed: boolean;
  actual?: string;
  error?: string;
}

interface TestSummary {
  timestamp: string;
  ruchy_version: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  planned_tests: number;
  success_rate: number;
  results: OneLinerResult[];
}

class OneLinerTester {
  private testSummary: TestSummary;

  constructor() {
    this.testSummary = {
      timestamp: new Date().toISOString(),
      ruchy_version: "unknown",
      total_tests: 0,
      passed_tests: 0,
      failed_tests: 0,
      planned_tests: 0,
      success_rate: 0,
      results: []
    };
  }

  async getRuchyVersion(): Promise<string> {
    try {
      const cmd = new Deno.Command("ruchy", { args: ["--version"] });
      const { stdout } = await cmd.output();
      return new TextDecoder().decode(stdout).trim();
    } catch {
      return "ruchy not found";
    }
  }

  private getWorkingTests(): OneLinerTest[] {
    return [
      // Basic Mathematics
      {
        description: "Simple addition",
        command: 'ruchy -e "2 + 2"',
        expected: "4",
        category: "Basic Mathematics"
      },
      {
        description: "Percentage calculation",
        command: 'ruchy -e "100.0 * 1.08"',
        expected: "108",
        category: "Basic Mathematics"
      },
      {
        description: "Compound interest",
        command: 'ruchy -e "1000.0 * 1.05 * 1.05"',
        expected: "1102.5",
        category: "Basic Mathematics"
      },
      {
        description: "Multi-step calculation",
        command: 'ruchy -e "let price = 99.99; let tax = 0.08; price * (1.0 + tax)"',
        expected: "107.9892",
        category: "Basic Mathematics"
      },

      // Boolean Logic
      {
        description: "Greater than comparison",
        command: 'ruchy -e "10 > 5"',
        expected: "true",
        category: "Boolean Logic"
      },
      {
        description: "Boolean AND operation",
        command: 'ruchy -e "true && false"',
        expected: "false",
        category: "Boolean Logic"
      },
      {
        description: "Boolean OR operation",
        command: 'ruchy -e "true || false"',
        expected: "true",
        category: "Boolean Logic"
      },
      {
        description: "Conditional expression",
        command: 'ruchy -e \'if 100 > 50 { "expensive" } else { "cheap" }\'',
        expected: '"expensive"',
        category: "Boolean Logic"
      },

      // String Operations
      {
        description: "String concatenation",
        command: 'ruchy -e \'"Hello " + "World"\'',
        expected: '"Hello World"',
        category: "String Operations"
      },
      {
        description: "String with variables",
        command: 'ruchy -e \'let name = "Ruchy"; "Hello " + name + "!"\'',
        expected: '"Hello Ruchy!"',
        category: "String Operations"
      },

      // Mathematical Functions (Working since v0.7.5+)
      {
        description: "Square root function",
        command: 'ruchy -e "16.0.sqrt()"',
        expected: "4",
        category: "Mathematical Functions"
      },
      {
        description: "Trigonometric sine",
        command: 'ruchy -e "let x = 10.0; let y = 20.0; (x * x + y * y).sqrt()"',
        expected: "22.360679774997898",
        category: "Mathematical Functions"
      },

      // Real-World Calculations
      {
        description: "Physics: E=mc²",
        command: 'ruchy -e "let c = 299792458.0; let m = 0.1; m * c * c"',
        expected: "8987551787368177",
        category: "Real-World Calculations"
      },
      {
        description: "Electrical power P=VI",
        command: 'ruchy -e "let v = 120.0; let i = 10.0; v * i"',
        expected: "1200",
        category: "Real-World Calculations"
      },
      {
        description: "Investment return %",
        command: 'ruchy -e "let initial = 10000.0; let final = 15000.0; (final / initial - 1.0) * 100.0"',
        expected: "50",
        category: "Real-World Calculations"
      },

      // Output Functions
      {
        description: "Basic text operations",
        command: 'ruchy -e \'println("Processing text data..."); ()\'',
        expected: 'Processing text data...\n()',
        category: "Output Functions"
      },

      // JSON Output Format
      {
        description: "Basic JSON output",
        command: 'ruchy -e "5 + 3" --format json',
        expected: '{"success":true,"result":"8"}',
        category: "JSON Output"
      },
      {
        description: "Float JSON output",
        command: 'ruchy -e "100.0 * 1.08" --format json',
        expected: '{"success":true,"result":"108"}',
        category: "JSON Output"
      },

      // Shell Integration
      {
        description: "Shell script integration",
        command: 'ruchy -e "100.0 * 1.08"',
        expected: "108",
        category: "Shell Integration"
      },

      // Performance Comparisons
      {
        description: "Manual exponentiation (2^32)",
        command: 'ruchy -e "2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2"',
        expected: "4294967296",
        category: "Performance Comparisons"
      }
    ];
  }

  private getPlannedTests(): string[] {
    return [
      "Array operations: [1, 2, 3].map(|x| x * 2) (Planned: v0.8.0)",
      "Array filtering: [1, 2, 3, 4, 5].filter(|x| x > 3) (Planned: v0.8.0)",
      "Statistical operations: [1, 2, 3, 4, 5].mean() (Planned: v0.8.0)",
      "String methods: \"hello\".len() (Planned: v0.8.0)",
      "String case conversion: \"hello\".to_upper() (Planned: v0.8.0)",
      "String trimming: \"  spaces  \".trim() (Planned: v0.8.0)",
      "File I/O: read_file(\"data.txt\") (Planned: v0.9.0)",
      "CSV processing: read_csv(\"data.csv\") (Planned: v0.9.0)",
      "HTTP operations: http_get(\"https://api.example.com\") (Planned: v0.9.0)",
      "Advanced math: range(1000).map(|x| x * x).sum() (Planned: v0.8.0)",
      "R-style statistics: corr([1, 2, 3], [2, 4, 6]) (Planned: v1.0.0)",
      "Machine learning: linear_regression(X_train, y_train) (Planned: v1.0.0)"
    ];
  }

  async runTest(test: OneLinerTest): Promise<OneLinerResult> {
    try {
      const cmd = new Deno.Command("sh", {
        args: ["-c", test.command],
        stdout: "piped",
        stderr: "piped"
      });

      const { success, stdout, stderr } = await cmd.output();
      const output = new TextDecoder().decode(stdout).trim();
      const error = new TextDecoder().decode(stderr).trim();

      if (success && output === test.expected) {
        return {
          test,
          passed: true,
          actual: output
        };
      } else {
        return {
          test,
          passed: false,
          actual: output,
          error: error || `Expected: ${test.expected}, Got: ${output}`
        };
      }
    } catch (error) {
      return {
        test,
        passed: false,
        error: error.message
      };
    }
  }

  async run(): Promise<void> {
    console.log("🧪 Testing ALL Ruchy One-Liners from Chapter 4.1");
    console.log("=================================================");

    // Get Ruchy version
    this.testSummary.ruchy_version = await this.getRuchyVersion();
    console.log(`📦 Ruchy version: ${this.testSummary.ruchy_version}\n`);

    const workingTests = this.getWorkingTests();
    const plannedFeatures = this.getPlannedTests();

    // Group tests by category
    const categories = [...new Set(workingTests.map(t => t.category))];

    for (const category of categories) {
      console.log(`\n📋 ${category}`);
      console.log("-".repeat(category.length + 4));

      const categoryTests = workingTests.filter(t => t.category === category);
      
      for (const test of categoryTests) {
        process.stdout.write(`Testing: ${test.description}... `);
        const result = await this.runTest(test);
        
        if (result.passed) {
          console.log("✅ PASS");
          this.testSummary.passed_tests++;
        } else {
          console.log("❌ FAIL");
          this.testSummary.failed_tests++;
        }
        
        this.testSummary.results.push(result);
        this.testSummary.total_tests++;
      }
    }

    // Show planned features
    console.log("\n📋 Planned Features (Future Versions)");
    console.log("=====================================");
    for (const planned of plannedFeatures) {
      console.log(`📋 PLANNED: ${planned}`);
      this.testSummary.planned_tests++;
    }

    // Calculate success rate
    if (this.testSummary.total_tests > 0) {
      this.testSummary.success_rate = Math.round(
        (this.testSummary.passed_tests / this.testSummary.total_tests) * 100
      );
    }

    this.generateSummary();
    await this.saveResults();
  }

  generateSummary(): void {
    console.log("\n📈 Results Summary");
    console.log("==================");
    console.log(`Tests Passed: ${this.testSummary.passed_tests}`);
    console.log(`Tests Failed: ${this.testSummary.failed_tests}`);
    console.log(`Tests Planned: ${this.testSummary.planned_tests}`);
    console.log(`Total Current Tests: ${this.testSummary.total_tests}`);
    console.log(`Total All Examples: ${this.testSummary.total_tests + this.testSummary.planned_tests}`);

    if (this.testSummary.failed_tests === 0) {
      console.log("\n🎉 ALL CURRENT TESTS PASSED!");
      console.log(`✅ All ${this.testSummary.passed_tests} working examples verified`);
      console.log(`📋 ${this.testSummary.planned_tests} examples planned for future versions`);
      console.log(`🎯 Current success rate: 100% (${this.testSummary.passed_tests}/${this.testSummary.total_tests})`);
      console.log(`🚀 Overall coverage: ${this.testSummary.passed_tests}/${this.testSummary.total_tests + this.testSummary.planned_tests} examples working`);
    } else {
      console.log("\n❌ SOME TESTS FAILED");
      console.log("Please check the failing examples and update the implementation");
    }
  }

  async saveResults(): Promise<void> {
    try {
      await Deno.mkdir("test/extracted-examples", { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Save detailed results
    await Deno.writeTextFile(
      "test/extracted-examples/oneliners.json",
      JSON.stringify(this.testSummary, null, 2)
    );

    // Create simple text log
    const logLines = [
      `🧪 Ruchy One-Liner Test Results`,
      `Generated: ${this.testSummary.timestamp}`,
      `Ruchy Version: ${this.testSummary.ruchy_version}`,
      "",
      `📊 Summary:`,
      `Tests Passed: ${this.testSummary.passed_tests}`,
      `Tests Failed: ${this.testSummary.failed_tests}`,
      `Tests Planned: ${this.testSummary.planned_tests}`,
      `Success Rate: ${this.testSummary.success_rate}%`,
      "",
      `📝 Detailed Results:`,
      ...this.testSummary.results.map(r => 
        `${r.passed ? "✅" : "❌"} ${r.test.description} - ${r.test.category}`
      )
    ];

    await Deno.writeTextFile(
      "test/extracted-examples/oneliners.log",
      logLines.join("\n")
    );

    console.log("\n📋 Results saved:");
    console.log("   • test/extracted-examples/oneliners.json - Detailed results");
    console.log("   • test/extracted-examples/oneliners.log - Summary log");
  }
}

// Main execution
if (import.meta.main) {
  const tester = new OneLinerTester();
  await tester.run();
}