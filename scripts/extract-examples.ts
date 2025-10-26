#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * Extract and test all Ruchy examples from every chapter
 * TypeScript implementation of Documentation Status Testing
 */

import { walk } from "@std/fs";
import { join, basename } from "@std/path";

interface ExampleResult {
  file: string;
  example_number: number;
  line_number: number;
  code: string;
  passed: boolean;
  error?: string;
  errorCategory?: "PARSER_ERROR" | "METHOD_ERROR" | "IMPORT_ERROR" | "PLANNED" | "UNKNOWN";
  rootCause?: string;
  status: "working" | "not_implemented" | "broken" | "planned";
}

interface ChapterResults {
  chapter: string;
  total_examples: number;
  working_examples: number;
  failing_examples: number;
  examples: ExampleResult[];
}

interface TestSummary {
  timestamp: string;
  ruchy_version: string;
  chapters_processed: number;
  examples_found: number;
  examples_working: number;
  examples_failing: number;
  success_rate: number;
  chapters: Record<string, ChapterResults>;
}

class ExampleExtractor {
  private testResults: TestSummary;
  
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      ruchy_version: "unknown",
      chapters_processed: 0,
      examples_found: 0,
      examples_working: 0,
      examples_failing: 0,
      success_rate: 0,
      chapters: {}
    };
  }

  async getRuchyVersion(): Promise<string> {
    try {
      const cmd = new Deno.Command("ruchy", { 
        args: ["--version"],
        stdout: "piped",
        stderr: "piped"
      });
      const { stdout } = await cmd.output();
      return new TextDecoder().decode(stdout).trim();
    } catch {
      return "ruchy not found";
    }
  }

  extractRuchyExamples(content: string, filename: string): ExampleResult[] {
    const examples: ExampleResult[] = [];
    const lines = content.split('\n');
    let inRuchyBlock = false;
    let currentExample = "";
    let exampleStartLine = 0;
    let exampleNumber = 1;
    let skipNext = false;
    let skipReason = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for skip-test marker (must be on line before ```ruchy)
      if (line.trim().startsWith("<!-- skip-test:")) {
        skipNext = true;
        // Extract reason from comment
        const match = line.match(/<!-- skip-test:\s*(.+?)\s*-->/);
        skipReason = match ? match[1] : "marked as skip-test";
      }

      if (line.trim() === "```ruchy") {
        if (skipNext) {
          // Skip this example - don't set inRuchyBlock
          console.log(`   ⏭️  Skipping example ${exampleNumber} (${skipReason})`);
          skipNext = false;
          skipReason = "";
          exampleNumber++; // Still increment to keep numbering consistent
        } else {
          inRuchyBlock = true;
          currentExample = "";
          exampleStartLine = i + 1;
        }
      } else if (line.trim() === "```" && inRuchyBlock) {
        inRuchyBlock = false;

        if (currentExample.trim()) {
          examples.push({
            file: filename,
            example_number: exampleNumber++,
            line_number: exampleStartLine,
            code: currentExample.trim(),
            passed: false,
            status: "working" // Will be updated after testing
          });
        }
      } else if (inRuchyBlock) {
        currentExample += line + "\n";
      }
    }

    return examples;
  }

  async testRuchyExample(example: ExampleResult): Promise<ExampleResult> {
    // Create temporary file
    const tempDir = await Deno.makeTempDir({ prefix: "ruchy_test_" });
    const tempFile = join(tempDir, `example_${example.example_number}.ruchy`);
    
    try {
      await Deno.writeTextFile(tempFile, example.code);

      // Test with ruchy run (interpreter mode) - v3.82.0+ has true interpreter
      // Falls back to compile mode if needed
      // TIMEOUT FIX: 30 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds

      const cmd = new Deno.Command("ruchy", {
        args: ["run", tempFile],
        stdout: "piped",
        stderr: "piped",
        signal: controller.signal
      });

      try {
        const { success, stdout, stderr } = await cmd.output();
        clearTimeout(timeoutId);

        if (success) {
          example.passed = true;
          example.status = "working";
        } else {
          const errorText = new TextDecoder().decode(stderr);
          example.passed = false;
          example.error = errorText;
          example.status = this.classifyError(errorText);
          example.errorCategory = this.categorizeError(errorText);
          example.rootCause = this.analyzeRootCause(errorText);
        }
      } catch (abortError) {
        clearTimeout(timeoutId);
        if (abortError.name === "AbortError") {
          // Compilation timed out - mark as slow test
          example.passed = false;
          example.error = "⏱️  SLOW TEST: Compilation timed out after 30 seconds (likely DataFrame/polars dependency issue)";
          example.status = "broken";
          example.errorCategory = "TIMEOUT";
          example.rootCause = "Compilation hung - possibly waiting for polars crate dependency resolution";
        } else {
          throw abortError;
        }
      }

    } catch (error) {
      example.passed = false;
      example.error = error.message;
      example.status = "broken";
    } finally {
      // Clean up
      try {
        await Deno.remove(tempDir, { recursive: true });
      } catch {
        // Ignore cleanup errors
      }
    }

    return example;
  }

  classifyError(errorMessage: string): "not_implemented" | "broken" | "planned" {
    const error = errorMessage.toLowerCase();
    
    // Enhanced error classification for Toyota Way quality
    
    // Method/runtime failures (LIBRARY gaps - not language gaps)
    const methodPatterns = [
      "no method named",
      "method not found",
      "has no method",
      ".to_string",
      ".items",
      ".len",
      ".trim"
    ];
    
    // Not yet implemented features (PLANNED gaps)
    const plannedPatterns = [
      "not yet implemented",
      "feature not available",
      "coming soon",
      "planned for"
    ];
    
    // Parser failures (REAL language gaps)
    const parserPatterns = [
      "unexpected token",
      "expected",
      "syntax error",
      "parse error",
      "invalid syntax"
    ];

    if (methodPatterns.some(pattern => error.includes(pattern))) {
      return "not_implemented"; // This is a method gap, not language gap
    }
    
    if (plannedPatterns.some(pattern => error.includes(pattern))) {
      return "planned";
    }
    
    if (parserPatterns.some(pattern => error.includes(pattern))) {
      return "broken"; // This is a REAL language gap
    }

    // Default classification
    return "broken";
  }

  categorizeError(errorMessage: string): "PARSER_ERROR" | "METHOD_ERROR" | "IMPORT_ERROR" | "PLANNED" | "UNKNOWN" {
    const error = errorMessage.toLowerCase();
    
    if (error.includes("no method named") || error.includes("has no method")) {
      return "METHOD_ERROR";
    }
    
    if (error.includes("unexpected token") || error.includes("syntax error") || error.includes("parse error")) {
      return "PARSER_ERROR";
    }
    
    if (error.includes("unresolved import") || error.includes("cannot find module")) {
      return "IMPORT_ERROR";
    }
    
    if (error.includes("not yet implemented") || error.includes("planned for")) {
      return "PLANNED";
    }
    
    return "UNKNOWN";
  }

  analyzeRootCause(errorMessage: string): string {
    const error = errorMessage.toLowerCase();
    
    if (error.includes("no method named")) {
      const methodMatch = error.match(/no method named `([^`]+)`/);
      if (methodMatch) {
        return `Missing method implementation: ${methodMatch[1]}()`;
      }
      return "Missing method implementation";
    }
    
    if (error.includes("unexpected token")) {
      return "Syntax not recognized by parser - potential language gap";
    }
    
    if (error.includes("unresolved import")) {
      return "Missing dependency or import path issue";
    }
    
    if (error.includes("not yet implemented")) {
      return "Feature planned but not yet available";
    }
    
    return "Unknown error - needs manual investigation";
  }

  async processChapter(filepath: string): Promise<ChapterResults | null> {
    try {
      const content = await Deno.readTextFile(filepath);
      const chapterName = basename(filepath, ".md");
      
      console.log(`📄 Processing: ${chapterName}`);
      
      const examples = this.extractRuchyExamples(content, filepath);
      
      if (examples.length === 0) {
        console.log(`   ℹ️  No Ruchy examples found`);
        return null;
      }

      console.log(`   📝 Found ${examples.length} examples`);
      
      // Test each example
      const testedExamples = [];
      for (const example of examples) {
        console.log(`   🧪 Testing example ${example.example_number}...`);
        const result = await this.testRuchyExample(example);
        testedExamples.push(result);
        
        if (result.passed) {
          console.log(`   ✅ PASS`);
        } else {
          console.log(`   ❌ FAIL (${result.status})`);
        }
      }

      const workingCount = testedExamples.filter(e => e.passed).length;
      const failingCount = testedExamples.length - workingCount;

      const results: ChapterResults = {
        chapter: chapterName,
        total_examples: examples.length,
        working_examples: workingCount,
        failing_examples: failingCount,
        examples: testedExamples
      };

      this.testResults.chapters[chapterName] = results;
      this.testResults.examples_found += examples.length;
      this.testResults.examples_working += workingCount;
      this.testResults.examples_failing += failingCount;

      return results;
    } catch (error) {
      console.error(`❌ Error processing ${filepath}: ${error.message}`);
      return null;
    }
  }

  async run(): Promise<void> {
    console.log("🔍 Extracting ALL Ruchy examples from book chapters...");
    console.log("=====================================================");

    // Get Ruchy version
    this.testResults.ruchy_version = await this.getRuchyVersion();
    console.log(`🦀 Ruchy version: ${this.testResults.ruchy_version}`);

    // Create output directory
    try {
      await Deno.mkdir("test/extracted-examples", { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Process all markdown files
    console.log("\n🔍 Scanning chapters for Ruchy examples...\n");

    for await (const entry of walk("src", { 
      exts: [".md"],
      includeDirs: false 
    })) {
      if (entry.isFile) {
        const result = await this.processChapter(entry.path);
        if (result) {
          this.testResults.chapters_processed++;
        }
        console.log(""); // Add spacing between chapters
      }
    }

    // Process one-liners separately using deno task
    if (await this.fileExists("src/ch04-01-one-liners.md")) {
      console.log("🧮 Processing one-liners chapter (running separate test)...");
      try {
        const cmd = new Deno.Command("deno", {
          args: ["task", "test-oneliners"],
          stdout: "piped",
          stderr: "piped"
        });
        const { success } = await cmd.output();
        console.log(success ? "   ✅ One-liner tests completed" : "   ⚠️  Some one-liners need implementation");
      } catch (error) {
        console.log(`   ❌ One-liner test error: ${error.message}`);
      }
    }

    // Calculate final statistics
    if (this.testResults.examples_found > 0) {
      this.testResults.success_rate = Math.round(
        (this.testResults.examples_working / this.testResults.examples_found) * 100
      );
    }

    // Generate summary
    this.generateSummary();
    
    // Save results
    await this.saveResults();
  }

  async fileExists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch {
      return false;
    }
  }

  generateSummary(): void {
    console.log("📊 EXTRACTION AND TESTING SUMMARY");
    console.log("==================================");
    console.log(`📄 Chapters processed: ${this.testResults.chapters_processed}`);
    console.log(`💻 Code examples found: ${this.testResults.examples_found}`);
    console.log(`✅ Examples working: ${this.testResults.examples_working}`);
    console.log(`❌ Examples failing: ${this.testResults.examples_failing}`);
    console.log(`📈 Success rate: ${this.testResults.success_rate}%`);
  }

  async saveResults(): Promise<void> {
    // Save JSON summary
    const summaryPath = "test/extracted-examples/summary.json";
    await Deno.writeTextFile(summaryPath, JSON.stringify(this.testResults, null, 2));
    
    // Save passing examples log
    const passingExamples = [];
    const failingExamples = [];
    
    for (const chapter of Object.values(this.testResults.chapters)) {
      for (const example of chapter.examples) {
        const logEntry = `${example.passed ? "✅" : "❌"} ${chapter.chapter} example ${example.example_number}`;
        if (example.passed) {
          passingExamples.push(logEntry);
        } else {
          failingExamples.push(logEntry + ` (${example.status})`);
        }
      }
    }

    await Deno.writeTextFile("test/extracted-examples/passing.log", passingExamples.join("\n"));
    await Deno.writeTextFile("test/extracted-examples/failing.log", failingExamples.join("\n"));
    
    // Save detailed errors
    const errorLog = [];
    for (const chapter of Object.values(this.testResults.chapters)) {
      for (const example of chapter.examples) {
        if (!example.passed && example.error) {
          errorLog.push(`=== ${chapter.chapter} example ${example.example_number} ===`);
          errorLog.push(example.error);
          errorLog.push("");
        }
      }
    }
    
    await Deno.writeTextFile("test/extracted-examples/errors.log", errorLog.join("\n"));
    
    console.log("\n📋 Generated files:");
    console.log("   • test/extracted-examples/summary.json - Machine-readable results");
    console.log("   • test/extracted-examples/passing.log - Working examples");
    console.log("   • test/extracted-examples/failing.log - Failing examples");
    console.log("   • test/extracted-examples/errors.log - Error details");
  }
}

// Main execution
if (import.meta.main) {
  const extractor = new ExampleExtractor();
  await extractor.run();
}