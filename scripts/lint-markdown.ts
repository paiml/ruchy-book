#!/usr/bin/env -S deno run --allow-read --allow-run

/**
 * Comprehensive markdown quality checks for Ruchy Book
 * TypeScript implementation of Documentation Status Testing linting
 */

interface LintResult {
  category: string;
  passed: boolean;
  issues: string[];
  details?: string;
}

class MarkdownLinter {
  private results: LintResult[] = [];

  async checkFileExists(path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch {
      return false;
    }
  }

  async runCommand(command: string, args: string[]): Promise<{ success: boolean; stdout: string; stderr: string }> {
    try {
      const cmd = new Deno.Command(command, {
        args,
        stdout: "piped",
        stderr: "piped"
      });

      const { success, stdout, stderr } = await cmd.output();
      
      return {
        success,
        stdout: new TextDecoder().decode(stdout),
        stderr: new TextDecoder().decode(stderr)
      };
    } catch (error) {
      return {
        success: false,
        stdout: "",
        stderr: error.message
      };
    }
  }

  async checkMarkdownLinting(): Promise<LintResult> {
    console.log("📝 1. Basic markdown linting...");
    
    // Check if markdownlint-cli2 is available
    const { success: hasMarkdownlint } = await this.runCommand("which", ["markdownlint-cli2"]);
    
    if (!hasMarkdownlint) {
      console.log("⚠️  markdownlint-cli2 not found, attempting to install...");
      const installResult = await this.runCommand("npm", ["install", "-g", "markdownlint-cli2"]);
      if (!installResult.success) {
        return {
          category: "Markdown Linting",
          passed: false,
          issues: ["Failed to install markdownlint-cli2"],
          details: installResult.stderr
        };
      }
    }

    // Run markdown linting
    const lintResult = await this.runCommand("markdownlint-cli2", [
      "src/**/*.md",
      "docs/**/*.md",
      "*.md"
    ]);

    const issues: string[] = [];
    
    if (!lintResult.success) {
      // Parse markdownlint output for issues
      const lines = lintResult.stdout.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.includes('MD') && (line.includes('error') || line.includes('warning'))) {
          issues.push(line.trim());
        }
      }
    }

    return {
      category: "Markdown Linting",
      passed: lintResult.success,
      issues,
      details: issues.length > 0 ? `Found ${issues.length} linting issues` : "All markdown files pass linting"
    };
  }

  async checkLinkValidation(): Promise<LintResult> {
    console.log("🔗 2. Link validation...");
    
    const { success: hasLinkCheck } = await this.runCommand("which", ["markdown-link-check"]);
    
    if (!hasLinkCheck) {
      console.log("⚠️  markdown-link-check not found, attempting to install...");
      const installResult = await this.runCommand("npm", ["install", "-g", "markdown-link-check"]);
      if (!installResult.success) {
        return {
          category: "Link Validation",
          passed: false,
          issues: ["Failed to install markdown-link-check"],
          details: installResult.stderr
        };
      }
    }

    const issues: string[] = [];
    const filesToCheck = [
      "README.md",
      "INTEGRATION.md",
      "ROADMAP.md"
    ];

    // Add markdown files from src directory
    try {
      for await (const entry of Deno.readDir("src")) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          filesToCheck.push(`src/${entry.name}`);
        }
      }
    } catch {
      // src directory might not exist
    }

    let brokenLinkFiles = 0;
    
    for (const file of filesToCheck) {
      if (await this.checkFileExists(file)) {
        console.log(`   Checking links in ${file}...`);
        const result = await this.runCommand("markdown-link-check", [file, "--quiet"]);
        
        if (!result.success) {
          brokenLinkFiles++;
          issues.push(`Broken links found in ${file}`);
        }
      }
    }

    return {
      category: "Link Validation",
      passed: brokenLinkFiles === 0,
      issues,
      details: brokenLinkFiles === 0 ? "All links are valid" : `Found broken links in ${brokenLinkFiles} files`
    };
  }

  async checkStatusAnnotations(): Promise<LintResult> {
    console.log("✅ 3. Status annotation validation...");
    
    // Run our status validation script
    const result = await this.runCommand("deno", [
      "run", 
      "--allow-read",
      "scripts/validate-docs-status.ts"
    ]);

    const issues: string[] = [];
    
    if (!result.success) {
      // Parse validation output for specific issues
      const lines = result.stdout.split('\n');
      for (const line of lines) {
        if (line.includes('missing status annotation') || line.includes('Missing DOC_STATUS')) {
          issues.push(line.trim());
        }
      }
    }

    return {
      category: "Status Annotation Validation",
      passed: result.success,
      issues: issues.slice(0, 10), // Limit to first 10 issues
      details: result.success ? "All Ruchy examples have proper status annotations" : "Some examples are missing status annotations"
    };
  }

  async checkRuchyCodeBlocks(): Promise<LintResult> {
    console.log("🦀 4. Ruchy code block validation...");
    
    let totalRuchyExamples = 0;
    let filesWithRuchyBlocks = 0;

    try {
      for await (const entry of Deno.readDir("src")) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          const content = await Deno.readTextFile(`src/${entry.name}`);
          const ruchyBlocks = (content.match(/```ruchy/g) || []).length;
          
          if (ruchyBlocks > 0) {
            filesWithRuchyBlocks++;
            totalRuchyExamples += ruchyBlocks;
          }
        }
      }
    } catch {
      // Handle directory access issues
    }

    return {
      category: "Ruchy Code Block Validation",
      passed: totalRuchyExamples > 0,
      issues: totalRuchyExamples === 0 ? ["No Ruchy code blocks found"] : [],
      details: `Found ${totalRuchyExamples} Ruchy examples in ${filesWithRuchyBlocks} files`
    };
  }

  async checkHeadingStructure(): Promise<LintResult> {
    console.log("📋 5. Heading structure validation...");
    
    const issues: string[] = [];
    
    try {
      for await (const entry of Deno.readDir("src")) {
        if (entry.isFile && entry.name.endsWith(".md")) {
          const filepath = `src/${entry.name}`;
          const content = await Deno.readTextFile(filepath);
          const lines = content.split('\n');
          
          // Check for proper heading hierarchy
          let hasDeepHeadings = false;
          let hasTopLevelHeadings = false;
          
          for (const line of lines) {
            if (line.match(/^#{4,}/)) {
              hasDeepHeadings = true;
            }
            if (line.match(/^#{1,3}/)) {
              hasTopLevelHeadings = true;
            }
          }
          
          if (hasDeepHeadings && !hasTopLevelHeadings) {
            issues.push(`${filepath}: Deep headings without proper hierarchy`);
          }
        }
      }
    } catch {
      // Handle directory access issues
    }

    return {
      category: "Heading Structure Validation",
      passed: issues.length === 0,
      issues,
      details: issues.length === 0 ? "All headings follow proper hierarchy" : `Found ${issues.length} files with heading issues`
    };
  }

  async run(): Promise<number> {
    console.log("🔍 Running comprehensive markdown quality checks...");
    console.log("=================================================\n");

    // Check if we're in the right directory
    if (!(await this.checkFileExists("src"))) {
      console.error("❌ Error: Please run this script from the ruchy-book root directory");
      return 1;
    }

    // Run all checks
    this.results.push(await this.checkMarkdownLinting());
    this.results.push(await this.checkLinkValidation());
    this.results.push(await this.checkStatusAnnotations());
    this.results.push(await this.checkRuchyCodeBlocks());
    this.results.push(await this.checkHeadingStructure());

    // Generate summary
    this.generateSummary();
    
    const failedChecks = this.results.filter(r => !r.passed).length;
    return failedChecks === 0 ? 0 : 1;
  }

  generateSummary(): void {
    console.log("\n📊 QUALITY CHECK SUMMARY");
    console.log("========================");

    let issueCount = 0;

    for (const result of this.results) {
      const status = result.passed ? "✅" : "❌";
      console.log(`${status} ${result.category}: ${result.details}`);
      
      if (!result.passed && result.issues.length > 0) {
        issueCount += result.issues.length;
        // Show first few issues
        for (const issue of result.issues.slice(0, 3)) {
          console.log(`   - ${issue}`);
        }
        if (result.issues.length > 3) {
          console.log(`   ... and ${result.issues.length - 3} more issues`);
        }
      }
    }

    console.log(`\nIssues found: ${issueCount}`);

    if (issueCount === 0) {
      console.log("🎉 All markdown quality checks passed!");
      console.log("✅ Documentation is ready for publication");
    } else {
      console.log("❌ Found issues in documentation quality");
      console.log("🔧 Please fix the issues above before proceeding");
    }
  }
}

// Main execution
if (import.meta.main) {
  const linter = new MarkdownLinter();
  const exitCode = await linter.run();
  Deno.exit(exitCode);
}