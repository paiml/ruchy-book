#!/usr/bin/env -S deno run --allow-read

/**
 * Validate that all Ruchy code examples have proper status annotations
 * TypeScript implementation of Documentation Status Testing validation
 */

import { walk } from "@std/fs";

interface ExampleInfo {
  lineNumber: number;
  code: string;
  hasStatusAnnotation: boolean;
}

interface FileValidationResult {
  file: string;
  totalExamples: number;
  missingAnnotations: number;
  hasStatusHeader: boolean;
  issues: string[];
  valid: boolean;
  examples: ExampleInfo[];
}

interface ValidationSummary {
  files: FileValidationResult[];
  totalFiles: number;
  validFiles: number;
  totalExamples: number;
  annotatedExamples: number;
  issues: string[];
}

class DocsStatusValidator {
  private statusPatterns = [
    /\/\/ Status: ✅ WORKING/,
    /\/\/ Status: ⚠️ NOT IMPLEMENTED/,
    /\/\/ Status: ❌ BROKEN/,
    /\/\/ Status: 📋 PLANNED/
  ];

  private docStatusPattern = /<!-- DOC_STATUS_START -->.*?<!-- DOC_STATUS_END -->/s;

  extractRuchyExamples(filepath: string, content: string): ExampleInfo[] {
    const examples: ExampleInfo[] = [];
    const lines = content.split('\n');
    let inRuchyBlock = false;
    let currentExample = "";
    let exampleStartLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === "```ruchy") {
        inRuchyBlock = true;
        currentExample = "";
        exampleStartLine = i + 1;
      } else if (line.trim() === "```" && inRuchyBlock) {
        inRuchyBlock = false;

        if (currentExample.trim()) {
          examples.push({
            lineNumber: exampleStartLine,
            code: currentExample.trim(),
            hasStatusAnnotation: this.hasStatusAnnotation(currentExample)
          });
        }
      } else if (inRuchyBlock) {
        currentExample += line + "\n";
      }
    }

    return examples;
  }

  hasStatusAnnotation(code: string): boolean {
    return this.statusPatterns.some(pattern => pattern.test(code));
  }

  hasDocStatusHeader(content: string): boolean {
    return this.docStatusPattern.test(content);
  }

  async validateFile(filepath: string): Promise<FileValidationResult> {
    const content = await Deno.readTextFile(filepath);
    const examples = this.extractRuchyExamples(filepath, content);

    const issues: string[] = [];
    const missingAnnotations = examples.filter(e => !e.hasStatusAnnotation).length;

    // Check for missing annotations
    for (const example of examples) {
      if (!example.hasStatusAnnotation) {
        issues.push(`Line ${example.lineNumber}: Ruchy example missing status annotation`);
      }
    }

    // Check for status header if there are examples
    const hasHeader = this.hasDocStatusHeader(content);
    if (examples.length > 0 && !hasHeader) {
      issues.push("Missing DOC_STATUS header block");
    }

    return {
      file: filepath,
      totalExamples: examples.length,
      missingAnnotations,
      hasStatusHeader: hasHeader,
      issues,
      valid: issues.length === 0,
      examples
    };
  }

  async validateProject(): Promise<ValidationSummary> {
    const results: ValidationSummary = {
      files: [],
      totalFiles: 0,
      validFiles: 0,
      totalExamples: 0,
      annotatedExamples: 0,
      issues: []
    };

    // Check src directory
    try {
      for await (const entry of walk("src", { 
        exts: [".md"],
        includeDirs: false 
      })) {
        if (entry.isFile) {
          const fileResult = await this.validateFile(entry.path);
          results.files.push(fileResult);
          results.totalFiles++;
          results.totalExamples += fileResult.totalExamples;
          results.annotatedExamples += (fileResult.totalExamples - fileResult.missingAnnotations);

          if (fileResult.valid) {
            results.validFiles++;
          } else {
            results.issues.push(...fileResult.issues);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading src directory: ${error.message}`);
    }

    // Check docs directory
    try {
      for await (const entry of walk("docs", { 
        exts: [".md"],
        includeDirs: false 
      })) {
        if (entry.isFile) {
          const fileResult = await this.validateFile(entry.path);
          results.files.push(fileResult);
          results.totalFiles++;
          results.totalExamples += fileResult.totalExamples;
          results.annotatedExamples += (fileResult.totalExamples - fileResult.missingAnnotations);

          if (fileResult.valid) {
            results.validFiles++;
          } else {
            results.issues.push(...fileResult.issues);
          }
        }
      }
    } catch (error) {
      // docs directory might not exist
      console.log("Note: docs directory not found or not accessible");
    }

    return results;
  }

  reportResults(results: ValidationSummary): boolean {
    console.log("🔍 Documentation Status Validation Report");
    console.log("=".repeat(50));
    console.log(`📄 Files checked: ${results.totalFiles}`);
    console.log(`✅ Valid files: ${results.validFiles}`);
    console.log(`💻 Total examples: ${results.totalExamples}`);
    console.log(`📝 Annotated examples: ${results.annotatedExamples}`);

    if (results.totalExamples > 0) {
      const annotationRate = (results.annotatedExamples / results.totalExamples) * 100;
      console.log(`📊 Annotation coverage: ${annotationRate.toFixed(1)}%`);
    }

    if (results.issues.length > 0) {
      console.log(`\n❌ Issues found (${results.issues.length}):`);
      for (const issue of results.issues.slice(0, 20)) { // Limit to first 20 issues
        console.log(`  - ${issue}`);
      }
      if (results.issues.length > 20) {
        console.log(`  ... and ${results.issues.length - 20} more issues`);
      }
      return false;
    } else {
      console.log("\n🎉 All documentation has proper status annotations!");
      return true;
    }
  }

  async run(): Promise<number> {
    console.log("🔍 Validating documentation status annotations...\n");
    
    const results = await this.validateProject();
    const success = this.reportResults(results);
    
    return success ? 0 : 1;
  }
}

// Main execution
if (import.meta.main) {
  const validator = new DocsStatusValidator();
  const exitCode = await validator.run();
  Deno.exit(exitCode);
}