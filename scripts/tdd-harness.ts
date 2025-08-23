#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * TDD Test Harness for Ruchy Book
 * 
 * This script runs all quality gates on Ruchy examples:
 * - ruchy test: Basic correctness
 * - ruchy lint: Code quality  
 * - ruchy coverage: Test coverage
 * - ruchy prove: Formal verification (where applicable)
 * - pmat analyze: Quality metrics
 * 
 * Results are automatically written to INTEGRATION.md
 */

import { walk } from "https://deno.land/std@0.210.0/fs/walk.ts";
import { ensureDir } from "https://deno.land/std@0.210.0/fs/ensure_dir.ts";

interface TestResult {
  file: string;
  test_passes: boolean;
  lint_clean: boolean;
  coverage_percent: number;
  formally_verified: boolean;
  quality_grade: string;
  errors: string[];
}

interface IntegrationReport {
  generated_at: string;
  ruchy_version: string;
  book_commit: string;
  total_examples: number;
  passing: number;
  test_coverage: number;
  lint_grade: string;
  provability_percent: number;
  test_results: TestResult[];
}

/**
 * Run a command and capture output
 */
async function runCommand(cmd: string, args: string[]): Promise<{ success: boolean; output: string; error: string }> {
  try {
    const command = new Deno.Command(cmd, {
      args,
      stdout: "piped",
      stderr: "piped",
    });
    
    const { code, stdout, stderr } = await command.output();
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);
    
    return {
      success: code === 0,
      output,
      error,
    };
  } catch (e) {
    return {
      success: false,
      output: "",
      error: e.toString(),
    };
  }
}

/**
 * Test a single Ruchy file through all quality gates
 */
async function testRuchyFile(filePath: string): Promise<TestResult> {
  const result: TestResult = {
    file: filePath,
    test_passes: false,
    lint_clean: false,
    coverage_percent: 0,
    formally_verified: false,
    quality_grade: "F",
    errors: [],
  };

  // 1. Run ruchy test
  const testResult = await runCommand("ruchy", ["test", filePath]);
  result.test_passes = testResult.success;
  if (!testResult.success) {
    result.errors.push(`Test failed: ${testResult.error}`);
  }

  // 2. Run ruchy lint --strict
  const lintResult = await runCommand("ruchy", ["lint", "--strict", filePath]);
  result.lint_clean = lintResult.success;
  if (!lintResult.success) {
    result.errors.push(`Lint issues: ${lintResult.error}`);
  }

  // 3. Run ruchy coverage
  const coverageResult = await runCommand("ruchy", ["coverage", filePath]);
  if (coverageResult.success) {
    // Parse coverage percentage from output
    const match = coverageResult.output.match(/(\d+(?:\.\d+)?)%/);
    if (match) {
      result.coverage_percent = parseFloat(match[1]);
    }
  }

  // 4. Run ruchy prove (if applicable)
  const proveResult = await runCommand("ruchy", ["prove", filePath]);
  result.formally_verified = proveResult.success;

  // 5. Run pmat analyze
  const pmatResult = await runCommand("pmat", ["analyze", filePath]);
  if (pmatResult.success) {
    // Parse quality grade from output
    const match = pmatResult.output.match(/Grade:\s*([A-F][+-]?)/i);
    if (match) {
      result.quality_grade = match[1];
    }
  }

  return result;
}

/**
 * Find all Ruchy examples in the book
 */
async function findRuchyExamples(): Promise<string[]> {
  const examples: string[] = [];
  
  // Look for .ruchy files in tests directory
  for await (const entry of walk("tests", { exts: [".ruchy"] })) {
    examples.push(entry.path);
  }
  
  // Also extract examples from markdown files
  for await (const entry of walk("src", { exts: [".md"] })) {
    const content = await Deno.readTextFile(entry.path);
    const ruchyBlocks = content.match(/```ruchy\n([\s\S]*?)```/g);
    
    if (ruchyBlocks) {
      for (let i = 0; i < ruchyBlocks.length; i++) {
        // Save each code block as a temp file for testing
        const code = ruchyBlocks[i].replace(/```ruchy\n/, "").replace(/```$/, "");
        const tempPath = `tests/extracted/${entry.name.replace(".md", "")}_example_${i + 1}.ruchy`;
        
        await ensureDir("tests/extracted");
        await Deno.writeTextFile(tempPath, code);
        examples.push(tempPath);
      }
    }
  }
  
  return examples;
}

/**
 * Generate INTEGRATION.md report
 */
async function generateIntegrationReport(report: IntegrationReport): Promise<void> {
  const passRate = (report.passing / report.total_examples * 100).toFixed(1);
  const lintGrade = calculateOverallLintGrade(report.test_results);
  const provabilityRate = (report.test_results.filter(r => r.formally_verified).length / report.total_examples * 100).toFixed(1);
  
  const markdown = `# Ruchy Book Integration Report

**Generated**: ${report.generated_at}  
**Ruchy Version**: ${report.ruchy_version}  
**Book Commit**: ${report.book_commit}  

---

## 🎯 Executive Summary

- **Total Examples**: ${report.total_examples}
- **Passing**: ${report.passing}/${report.total_examples} (${passRate}%)
- **Test Coverage**: ${report.test_coverage.toFixed(1)}%
- **Lint Grade**: ${lintGrade}
- **Provability**: ${provabilityRate}% formally verified

---

## 📊 Test Results

### Summary by Quality Gate
| Quality Gate | Pass | Fail | Rate |
|-------------|------|------|------|
| ruchy test | ${report.test_results.filter(r => r.test_passes).length} | ${report.test_results.filter(r => !r.test_passes).length} | ${(report.test_results.filter(r => r.test_passes).length / report.total_examples * 100).toFixed(1)}% |
| ruchy lint | ${report.test_results.filter(r => r.lint_clean).length} | ${report.test_results.filter(r => !r.lint_clean).length} | ${(report.test_results.filter(r => r.lint_clean).length / report.total_examples * 100).toFixed(1)}% |
| coverage >80% | ${report.test_results.filter(r => r.coverage_percent > 80).length} | ${report.test_results.filter(r => r.coverage_percent <= 80).length} | ${(report.test_results.filter(r => r.coverage_percent > 80).length / report.total_examples * 100).toFixed(1)}% |
| ruchy prove | ${report.test_results.filter(r => r.formally_verified).length} | ${report.test_results.filter(r => !r.formally_verified).length} | ${provabilityRate}% |

### Failed Examples
${report.test_results
  .filter(r => !r.test_passes)
  .slice(0, 10)
  .map(r => `- ❌ ${r.file}: ${r.errors[0] || "Unknown error"}`)
  .join("\n")}
${report.test_results.filter(r => !r.test_passes).length > 10 ? `\n... and ${report.test_results.filter(r => !r.test_passes).length - 10} more failures` : ""}

---

## 🔧 Lint Analysis

**Overall Grade**: ${lintGrade}

### Lint Issues by Category
${generateLintSummary(report.test_results)}

---

## 📈 Coverage Report

**Average Coverage**: ${report.test_coverage.toFixed(1)}%

### Coverage Distribution
| Range | Count | Examples |
|-------|-------|----------|
| 100% | ${report.test_results.filter(r => r.coverage_percent === 100).length} | Perfect coverage |
| 80-99% | ${report.test_results.filter(r => r.coverage_percent >= 80 && r.coverage_percent < 100).length} | Good coverage |
| 50-79% | ${report.test_results.filter(r => r.coverage_percent >= 50 && r.coverage_percent < 80).length} | Needs improvement |
| <50% | ${report.test_results.filter(r => r.coverage_percent < 50).length} | Poor coverage |

---

## ✅ Formal Verification

**Provability Score**: ${provabilityRate}%

### Verified Examples
${report.test_results
  .filter(r => r.formally_verified)
  .slice(0, 5)
  .map(r => `- ✅ ${r.file}`)
  .join("\n")}

---

## 🔴 Quality Gate Status

**BOOK RELEASE**: ${passRate === "100.0" && lintGrade === "A+" ? "✅ APPROVED" : "❌ BLOCKED"}

| Gate | Required | Current | Status |
|------|----------|---------|--------|
| Test Pass Rate | 100% | ${passRate}% | ${passRate === "100.0" ? "✅" : "❌"} |
| Lint Grade | A+ | ${lintGrade} | ${lintGrade === "A+" ? "✅" : "❌"} |
| Coverage | 100% | ${report.test_coverage.toFixed(1)}% | ${report.test_coverage === 100 ? "✅" : "❌"} |
| Provability | >50% | ${provabilityRate}% | ${parseFloat(provabilityRate) > 50 ? "✅" : "❌"} |

---

*This report was automatically generated by the TDD test harness.*
`;

  await Deno.writeTextFile("INTEGRATION.md", markdown);
}

/**
 * Calculate overall lint grade from results
 */
function calculateOverallLintGrade(results: TestResult[]): string {
  const cleanCount = results.filter(r => r.lint_clean).length;
  const percentage = (cleanCount / results.length) * 100;
  
  if (percentage === 100) return "A+";
  if (percentage >= 95) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 85) return "B+";
  if (percentage >= 80) return "B";
  if (percentage >= 75) return "B-";
  if (percentage >= 70) return "C+";
  if (percentage >= 65) return "C";
  if (percentage >= 60) return "C-";
  if (percentage >= 55) return "D+";
  if (percentage >= 50) return "D";
  return "F";
}

/**
 * Generate lint summary
 */
function generateLintSummary(results: TestResult[]): string {
  const lintIssues = results
    .filter(r => !r.lint_clean)
    .flatMap(r => r.errors.filter(e => e.includes("Lint")));
  
  if (lintIssues.length === 0) {
    return "No lint issues found! 🎉";
  }
  
  // Group by issue type (simplified)
  const summary = lintIssues
    .slice(0, 5)
    .map(issue => `- ${issue}`)
    .join("\n");
  
  return summary + (lintIssues.length > 5 ? `\n... and ${lintIssues.length - 5} more issues` : "");
}

/**
 * Get current git commit hash
 */
async function getGitCommit(): Promise<string> {
  const result = await runCommand("git", ["rev-parse", "--short", "HEAD"]);
  return result.output.trim() || "unknown";
}

/**
 * Get Ruchy version
 */
async function getRuchyVersion(): Promise<string> {
  const result = await runCommand("ruchy", ["--version"]);
  return result.output.trim() || "unknown";
}

/**
 * Main execution
 */
async function main() {
  console.log("🧪 TDD Test Harness for Ruchy Book");
  console.log("===================================\n");
  
  // Find all examples
  console.log("🔍 Finding Ruchy examples...");
  const examples = await findRuchyExamples();
  console.log(`📋 Found ${examples.length} examples to test\n`);
  
  // Test each example
  const results: TestResult[] = [];
  let passed = 0;
  
  for (const example of examples) {
    process.stdout.write(`Testing ${example}... `);
    const result = await testRuchyFile(example);
    results.push(result);
    
    if (result.test_passes) {
      console.log("✅");
      passed++;
    } else {
      console.log("❌");
    }
  }
  
  // Calculate metrics
  const totalCoverage = results.reduce((sum, r) => sum + r.coverage_percent, 0) / results.length;
  
  // Generate report
  const report: IntegrationReport = {
    generated_at: new Date().toISOString(),
    ruchy_version: await getRuchyVersion(),
    book_commit: await getGitCommit(),
    total_examples: examples.length,
    passing: passed,
    test_coverage: totalCoverage,
    lint_grade: calculateOverallLintGrade(results),
    provability_percent: (results.filter(r => r.formally_verified).length / examples.length * 100),
    test_results: results,
  };
  
  console.log("\n📊 Generating INTEGRATION.md...");
  await generateIntegrationReport(report);
  
  console.log("\n✅ TDD test harness complete!");
  console.log(`📈 Pass rate: ${passed}/${examples.length} (${(passed/examples.length*100).toFixed(1)}%)`);
  
  // Exit with failure if not 100% passing
  if (passed !== examples.length) {
    console.error("\n❌ Quality gates not met - book release BLOCKED");
    Deno.exit(1);
  }
}

// Run the harness
if (import.meta.main) {
  main();
}