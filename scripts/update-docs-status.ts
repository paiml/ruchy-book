#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run

/**
 * Automatically update documentation status annotations and headers
 * Based on test results from extract-examples.ts
 * TypeScript implementation of Phase 2 Documentation Status Testing
 */

import { walk } from "@std/fs";

interface TestResult {
  file: string;
  example_number: number;
  line_number: number;
  code: string;
  passed: boolean;
  error?: string;
  status: "working" | "not_implemented" | "broken" | "planned";
}

interface ChapterResults {
  chapter: string;
  total_examples: number;
  working_examples: number;
  failing_examples: number;
  examples: TestResult[];
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

class DocsStatusUpdater {
  private testResults: TestSummary | null = null;
  
  async loadTestResults(): Promise<boolean> {
    try {
      const resultsPath = "test/extracted-examples/summary.json";
      const content = await Deno.readTextFile(resultsPath);
      this.testResults = JSON.parse(content);
      return true;
    } catch (error) {
      console.error(`❌ Could not load test results: ${error.message}`);
      console.log("💡 Run 'deno task extract-examples' first to generate test results");
      return false;
    }
  }

  generateDocStatusHeader(chapterResults: ChapterResults): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const workingRate = chapterResults.total_examples > 0 
      ? Math.round((chapterResults.working_examples / chapterResults.total_examples) * 100)
      : 0;

    const statusEmoji = workingRate === 100 ? "✅" : workingRate >= 75 ? "🟡" : workingRate >= 50 ? "🟠" : "❌";

    return `<!-- DOC_STATUS_START -->
**Chapter Status**: ${statusEmoji} ${workingRate}% Working (${chapterResults.working_examples}/${chapterResults.total_examples} examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | ${chapterResults.examples.filter(e => e.status === "working").length} | Ready for production use |
| ⚠️ Not Implemented | ${chapterResults.examples.filter(e => e.status === "not_implemented").length} | Planned for future versions |
| ❌ Broken | ${chapterResults.examples.filter(e => e.status === "broken").length} | Known issues, needs fixing |
| 📋 Planned | ${chapterResults.examples.filter(e => e.status === "planned").length} | Future roadmap features |

*Last updated: ${timestamp}*  
*Ruchy version: ${this.testResults?.ruchy_version}*
<!-- DOC_STATUS_END -->`;
  }

  getStatusAnnotation(example: TestResult): string {
    const statusMap = {
      "working": "✅ WORKING",
      "not_implemented": "⚠️ NOT IMPLEMENTED", 
      "broken": "❌ BROKEN",
      "planned": "📋 PLANNED"
    };

    let annotation = `// Status: ${statusMap[example.status]}`;
    
    if (example.error && example.status !== "working") {
      // Add brief error context for debugging
      const errorLine = example.error.split('\n')[0]?.trim();
      if (errorLine && errorLine.length < 100) {
        annotation += `\n// Error: ${errorLine}`;
      }
    }

    return annotation;
  }

  async updateChapterFile(filepath: string, chapterResults: ChapterResults): Promise<void> {
    console.log(`📝 Updating: ${chapterResults.chapter}`);
    
    let content = await Deno.readTextFile(filepath);
    let modified = false;

    // 1. Update or inject DOC_STATUS header
    const statusHeader = this.generateDocStatusHeader(chapterResults);
    const docStatusPattern = /<!-- DOC_STATUS_START -->.*?<!-- DOC_STATUS_END -->/s;
    
    if (docStatusPattern.test(content)) {
      // Replace existing header
      content = content.replace(docStatusPattern, statusHeader);
      console.log(`   ✅ Updated status header`);
      modified = true;
    } else {
      // Inject at the beginning after title
      const lines = content.split('\n');
      let insertIndex = 0;
      
      // Find first heading or skip front matter
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('# ')) {
          insertIndex = i + 1;
          break;
        }
      }
      
      lines.splice(insertIndex, 0, '', statusHeader, '');
      content = lines.join('\n');
      console.log(`   ✨ Injected new status header`);
      modified = true;
    }

    // 2. Update individual example annotations
    let annotationsAdded = 0;
    let annotationsUpdated = 0;

    const lines = content.split('\n');
    let inRuchyBlock = false;
    let currentExample = "";
    let exampleStartLine = 0;
    let exampleNumber = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim() === "```ruchy") {
        inRuchyBlock = true;
        currentExample = "";
        exampleStartLine = i + 1;
      } else if (line.trim() === "```" && inRuchyBlock) {
        inRuchyBlock = false;
        
        if (currentExample.trim()) {
          // Find corresponding test result
          const testResult = chapterResults.examples.find(e => e.example_number === exampleNumber);
          exampleNumber++;
          
          if (testResult) {
            const annotation = this.getStatusAnnotation(testResult);
            const existingStatusPattern = /\/\/ Status: [^\n]*/g;
            const existingErrorPattern = /\/\/ Error: [^\n]*/g;
            
            // Check if example already has status annotation
            if (existingStatusPattern.test(currentExample)) {
              // Update existing annotation
              currentExample = currentExample.replace(existingStatusPattern, `// Status: ${annotation.split('\n')[0].replace('// Status: ', '')}`);
              
              // Update or remove error annotation
              if (annotation.includes('// Error:')) {
                const errorPart = annotation.split('\n')[1];
                if (existingErrorPattern.test(currentExample)) {
                  currentExample = currentExample.replace(existingErrorPattern, errorPart);
                } else {
                  currentExample += '\n' + errorPart;
                }
              } else {
                currentExample = currentExample.replace(existingErrorPattern, '');
              }
              
              annotationsUpdated++;
            } else {
              // Add new annotation at the top of the code block
              currentExample = annotation + '\n' + currentExample;
              annotationsAdded++;
            }
            
            // Update the content
            const endBlockLine = i;
            const startBlockLine = exampleStartLine - 1;
            const beforeBlock = lines.slice(0, startBlockLine + 1);
            const afterBlock = lines.slice(endBlockLine);
            const updatedLines = currentExample.split('\n');
            
            lines.splice(startBlockLine + 1, endBlockLine - startBlockLine - 1, ...updatedLines);
            i = startBlockLine + updatedLines.length;
            modified = true;
          }
        }
      } else if (inRuchyBlock) {
        currentExample += line + "\n";
      }
    }

    if (annotationsAdded > 0) {
      console.log(`   ✨ Added ${annotationsAdded} new status annotations`);
    }
    if (annotationsUpdated > 0) {
      console.log(`   🔄 Updated ${annotationsUpdated} existing status annotations`);
    }

    // Write updated content if any changes were made
    if (modified) {
      content = lines.join('\n');
      await Deno.writeTextFile(filepath, content);
      console.log(`   💾 Saved changes to ${filepath}`);
    } else {
      console.log(`   ℹ️  No changes needed`);
    }
  }

  async run(): Promise<void> {
    console.log("🔄 Updating documentation status annotations...");
    console.log("================================================");

    // Load test results
    if (!(await this.loadTestResults())) {
      return;
    }

    if (!this.testResults) {
      console.error("❌ No test results available");
      return;
    }

    console.log(`📊 Processing ${this.testResults.chapters_processed} chapters with ${this.testResults.examples_found} examples`);
    console.log(`⏰ Test results from: ${this.testResults.timestamp}`);
    console.log("");

    let updatedFiles = 0;

    // Process each chapter that has test results
    for (const [chapterName, chapterResults] of Object.entries(this.testResults.chapters)) {
      // Skip chapters with no examples
      if (chapterResults.total_examples === 0) {
        continue;
      }

      // Find the markdown file for this chapter
      let chapterPath: string | null = null;
      
      for await (const entry of walk("src", { 
        exts: [".md"],
        includeDirs: false 
      })) {
        if (entry.isFile) {
          const basename = entry.path.split('/').pop()?.replace('.md', '');
          if (basename === chapterName) {
            chapterPath = entry.path;
            break;
          }
        }
      }

      if (chapterPath) {
        await this.updateChapterFile(chapterPath, chapterResults);
        updatedFiles++;
        console.log("");
      } else {
        console.log(`⚠️  Could not find markdown file for chapter: ${chapterName}`);
      }
    }

    // Generate summary
    console.log("📊 UPDATE SUMMARY");
    console.log("=================");
    console.log(`📄 Files updated: ${updatedFiles}`);
    console.log(`💻 Examples annotated: ${this.testResults.examples_found}`);
    console.log(`✅ Working examples: ${this.testResults.examples_working}`);
    console.log(`❌ Failing examples: ${this.testResults.examples_failing}`);
    console.log(`📈 Overall success rate: ${this.testResults.success_rate}%`);
    
    if (updatedFiles > 0) {
      console.log("\n🎉 Documentation status annotations updated successfully!");
      console.log("📝 All Ruchy examples now have proper status indicators");
      console.log("🔄 Status headers reflect current implementation state");
    }
  }
}

// Main execution
if (import.meta.main) {
  const updater = new DocsStatusUpdater();
  await updater.run();
}