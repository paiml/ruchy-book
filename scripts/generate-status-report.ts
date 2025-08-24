#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Generate comprehensive visual status report and dashboard
 * TypeScript implementation for Documentation Status Testing reporting
 */

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

interface OneLinerSummary {
  timestamp: string;
  ruchy_version: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  planned_tests: number;
  success_rate: number;
}

class StatusReportGenerator {
  private testResults: TestSummary | null = null;
  private oneLinerResults: OneLinerSummary | null = null;

  async loadResults(): Promise<boolean> {
    try {
      // Load main test results
      const mainResults = await Deno.readTextFile("test/extracted-examples/summary.json");
      this.testResults = JSON.parse(mainResults);

      // Load one-liner results
      try {
        const oneLinerResults = await Deno.readTextFile("test/extracted-examples/oneliners.json");
        this.oneLinerResults = JSON.parse(oneLinerResults);
      } catch {
        console.log("ℹ️  One-liner results not found, skipping...");
      }

      return true;
    } catch (error) {
      console.error(`❌ Could not load test results: ${error.message}`);
      console.log("💡 Run 'deno task extract-examples' first to generate test results");
      return false;
    }
  }

  generateProgressBar(percentage: number, width: number = 20): string {
    // Ensure percentage is valid and within bounds
    const safePercentage = Math.max(0, Math.min(100, percentage || 0));
    const filled = Math.round((safePercentage / 100) * width);
    const empty = Math.max(0, width - filled);
    return "█".repeat(filled) + "░".repeat(empty);
  }

  getStatusColor(percentage: number): string {
    if (percentage >= 90) return "🟢";
    if (percentage >= 75) return "🟡";
    if (percentage >= 50) return "🟠";
    return "🔴";
  }

  generateMarkdownReport(): string {
    if (!this.testResults) return "";

    const timestamp = new Date().toLocaleString();
    const sections: string[] = [];

    // Header
    sections.push(`# 📊 Ruchy Documentation Status Report`);
    sections.push(`*Generated: ${timestamp}*`);
    sections.push(`*Ruchy Version: ${this.testResults.ruchy_version}*`);
    sections.push(``);

    // Executive Summary
    const overallRate = this.testResults.success_rate;
    const progressBar = this.generateProgressBar(overallRate, 30);
    const statusColor = this.getStatusColor(overallRate);
    
    sections.push(`## 🎯 Executive Summary`);
    sections.push(``);
    sections.push(`**Overall Status**: ${statusColor} ${overallRate}% Implementation Complete`);
    sections.push(`\`${progressBar}\` ${overallRate}%`);
    sections.push(``);
    sections.push(`| Metric | Value |`);
    sections.push(`|--------|-------|`);
    sections.push(`| 📚 Chapters Processed | ${this.testResults.chapters_processed} |`);
    sections.push(`| 💻 Total Examples | ${this.testResults.examples_found} |`);
    sections.push(`| ✅ Working Examples | ${this.testResults.examples_working} |`);
    sections.push(`| ❌ Failing Examples | ${this.testResults.examples_failing} |`);
    sections.push(`| 📈 Success Rate | ${this.testResults.success_rate}% |`);
    
    if (this.oneLinerResults) {
      sections.push(`| 🧮 One-Liner Tests | ${this.oneLinerResults.passed_tests}/${this.oneLinerResults.total_tests} passing |`);
    }
    sections.push(``);

    // Chapter Breakdown
    sections.push(`## 📖 Chapter Status Breakdown`);
    sections.push(``);
    
    const sortedChapters = Object.entries(this.testResults.chapters)
      .sort((a, b) => {
        const aRate = a[1].total_examples > 0 ? (a[1].working_examples / a[1].total_examples) * 100 : 0;
        const bRate = b[1].total_examples > 0 ? (b[1].working_examples / b[1].total_examples) * 100 : 0;
        return bRate - aRate; // Sort by success rate descending
      });

    for (const [chapterName, chapter] of sortedChapters) {
      if (chapter.total_examples === 0) continue;

      const chapterRate = chapter.total_examples > 0 ? Math.round((chapter.working_examples / chapter.total_examples) * 100) : 0;
      const chapterBar = this.generateProgressBar(chapterRate, 15);
      const chapterColor = this.getStatusColor(chapterRate);
      
      sections.push(`### ${chapterColor} ${chapterName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`);
      sections.push(`\`${chapterBar}\` ${chapterRate}% (${chapter.working_examples}/${chapter.total_examples})`);
      
      // Status breakdown for this chapter
      const statusCounts = {
        working: chapter.examples.filter(e => e.status === "working").length,
        not_implemented: chapter.examples.filter(e => e.status === "not_implemented").length,
        broken: chapter.examples.filter(e => e.status === "broken").length,
        planned: chapter.examples.filter(e => e.status === "planned").length
      };

      if (statusCounts.working > 0) sections.push(`- ✅ ${statusCounts.working} working`);
      if (statusCounts.not_implemented > 0) sections.push(`- ⚠️ ${statusCounts.not_implemented} not implemented`);
      if (statusCounts.broken > 0) sections.push(`- ❌ ${statusCounts.broken} broken`);
      if (statusCounts.planned > 0) sections.push(`- 📋 ${statusCounts.planned} planned`);
      sections.push(``);
    }

    // Status Distribution
    const totalWorking = Object.values(this.testResults.chapters).reduce((sum, ch) => sum + ch.examples.filter(e => e.status === "working").length, 0);
    const totalNotImpl = Object.values(this.testResults.chapters).reduce((sum, ch) => sum + ch.examples.filter(e => e.status === "not_implemented").length, 0);
    const totalBroken = Object.values(this.testResults.chapters).reduce((sum, ch) => sum + ch.examples.filter(e => e.status === "broken").length, 0);
    const totalPlanned = Object.values(this.testResults.chapters).reduce((sum, ch) => sum + ch.examples.filter(e => e.status === "planned").length, 0);

    sections.push(`## 📊 Status Distribution`);
    sections.push(``);
    sections.push(`\`\`\`ascii`);
    sections.push(`Status Distribution (${this.testResults.examples_found} total examples):`);
    sections.push(``);
    sections.push(`✅ Working        ${this.generateProgressBar((totalWorking / this.testResults.examples_found) * 100, 25)} ${totalWorking}`);
    sections.push(`❌ Broken         ${this.generateProgressBar((totalBroken / this.testResults.examples_found) * 100, 25)} ${totalBroken}`);
    sections.push(`⚠️  Not Impl      ${this.generateProgressBar((totalNotImpl / this.testResults.examples_found) * 100, 25)} ${totalNotImpl}`);
    sections.push(`📋 Planned       ${this.generateProgressBar((totalPlanned / this.testResults.examples_found) * 100, 25)} ${totalPlanned}`);
    sections.push(`\`\`\``);
    sections.push(``);

    // One-liner Status
    if (this.oneLinerResults) {
      sections.push(`## 🧮 One-Liner Test Status`);
      sections.push(``);
      const oneLinerRate = this.oneLinerResults.success_rate;
      const oneLinerBar = this.generateProgressBar(oneLinerRate, 20);
      const oneLinerColor = this.getStatusColor(oneLinerRate);
      
      sections.push(`**One-Liner Success Rate**: ${oneLinerColor} ${oneLinerRate}%`);
      sections.push(`\`${oneLinerBar}\` ${this.oneLinerResults.passed_tests}/${this.oneLinerResults.total_tests} tests passing`);
      sections.push(``);
      sections.push(`| Category | Status |`);
      sections.push(`|----------|--------|`);
      sections.push(`| ✅ Passing Tests | ${this.oneLinerResults.passed_tests} |`);
      sections.push(`| ❌ Failing Tests | ${this.oneLinerResults.failed_tests} |`);
      sections.push(`| 📋 Planned Tests | ${this.oneLinerResults.planned_tests} |`);
      sections.push(`| 🎯 Total Coverage | ${this.oneLinerResults.passed_tests}/${this.oneLinerResults.total_tests + this.oneLinerResults.planned_tests} |`);
      sections.push(``);
    }

    // Quality Metrics
    sections.push(`## 🏆 Quality Metrics`);
    sections.push(``);
    
    const qualityMetrics = [
      { name: "Documentation Coverage", value: `${this.testResults.chapters_processed}/35 chapters`, percentage: (this.testResults.chapters_processed / 35) * 100 },
      { name: "Example Testing", value: `${this.testResults.examples_found} examples tested`, percentage: 100 },
      { name: "Implementation Status", value: `${this.testResults.success_rate}% working`, percentage: this.testResults.success_rate },
    ];

    for (const metric of qualityMetrics) {
      const bar = this.generateProgressBar(metric.percentage, 20);
      const color = this.getStatusColor(metric.percentage);
      sections.push(`**${metric.name}**: ${color} ${metric.value}`);
      sections.push(`\`${bar}\` ${Math.round(metric.percentage)}%`);
      sections.push(``);
    }

    // Recommendations
    sections.push(`## 🔧 Recommendations`);
    sections.push(``);

    if (this.testResults.success_rate < 50) {
      sections.push(`- 🚨 **Critical**: Success rate below 50% - major implementation work needed`);
    } else if (this.testResults.success_rate < 75) {
      sections.push(`- ⚠️ **Moderate**: Success rate ${this.testResults.success_rate}% - focus on fixing broken examples`);
    } else if (this.testResults.success_rate < 90) {
      sections.push(`- 🟡 **Good**: Success rate ${this.testResults.success_rate}% - polish remaining examples`);
    } else {
      sections.push(`- 🎉 **Excellent**: Success rate ${this.testResults.success_rate}% - documentation is production ready!`);
    }

    if (totalBroken > totalNotImpl) {
      sections.push(`- 🔨 Focus on fixing ${totalBroken} broken examples before implementing new features`);
    } else if (totalNotImpl > 0) {
      sections.push(`- 📝 Consider implementing ${totalNotImpl} missing features for better coverage`);
    }

    if (this.oneLinerResults && this.oneLinerResults.success_rate === 100) {
      sections.push(`- ✨ One-liner functionality is complete - excellent for quick calculations!`);
    }

    sections.push(``);
    sections.push(`---`);
    sections.push(`*Report generated by Documentation Status Testing system*`);
    sections.push(`*Last test run: ${this.testResults.timestamp}*`);

    return sections.join('\n');
  }

  async generateJSONReport(): Promise<object> {
    const report = {
      generated_at: new Date().toISOString(),
      ruchy_version: this.testResults?.ruchy_version || "unknown",
      summary: {
        total_chapters: this.testResults?.chapters_processed || 0,
        total_examples: this.testResults?.examples_found || 0,
        working_examples: this.testResults?.examples_working || 0,
        failing_examples: this.testResults?.examples_failing || 0,
        success_rate: this.testResults?.success_rate || 0
      },
      chapters: {},
      oneliners: this.oneLinerResults ? {
        total_tests: this.oneLinerResults.total_tests,
        passed_tests: this.oneLinerResults.passed_tests,
        failed_tests: this.oneLinerResults.failed_tests,
        planned_tests: this.oneLinerResults.planned_tests,
        success_rate: this.oneLinerResults.success_rate
      } : null,
      quality_metrics: {
        documentation_coverage: this.testResults ? (this.testResults.chapters_processed / 35) * 100 : 0,
        example_testing: 100,
        implementation_status: this.testResults?.success_rate || 0
      }
    };

    if (this.testResults) {
      for (const [name, chapter] of Object.entries(this.testResults.chapters)) {
        const chapterRate = chapter.total_examples > 0 
          ? Math.round((chapter.working_examples / chapter.total_examples) * 100)
          : 0;

        (report.chapters as any)[name] = {
          total_examples: chapter.total_examples,
          working_examples: chapter.working_examples,
          failing_examples: chapter.failing_examples,
          success_rate: chapterRate,
          status_breakdown: {
            working: chapter.examples.filter(e => e.status === "working").length,
            not_implemented: chapter.examples.filter(e => e.status === "not_implemented").length,
            broken: chapter.examples.filter(e => e.status === "broken").length,
            planned: chapter.examples.filter(e => e.status === "planned").length
          }
        };
      }
    }

    return report;
  }

  async run(): Promise<void> {
    console.log("📊 Generating comprehensive status report...");
    console.log("===========================================");

    if (!(await this.loadResults())) {
      return;
    }

    // Create reports directory
    try {
      await Deno.mkdir("reports", { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport();
    const reportPath = "reports/status-report.md";
    await Deno.writeTextFile(reportPath, markdownReport);
    console.log(`📝 Generated markdown report: ${reportPath}`);

    // Generate JSON report
    const jsonReport = await this.generateJSONReport();
    const jsonPath = "reports/status-report.json";
    await Deno.writeTextFile(jsonPath, JSON.stringify(jsonReport, null, 2));
    console.log(`📊 Generated JSON report: ${jsonPath}`);

    // Generate HTML dashboard
    const htmlDashboard = this.generateHTMLDashboard(markdownReport);
    const htmlPath = "reports/status-dashboard.html";
    await Deno.writeTextFile(htmlPath, htmlDashboard);
    console.log(`🌐 Generated HTML dashboard: ${htmlPath}`);

    console.log("");
    console.log("🎉 Status reports generated successfully!");
    console.log("📁 All reports saved in 'reports/' directory");
    
    if (this.testResults) {
      console.log(`📈 Overall status: ${this.getStatusColor(this.testResults.success_rate)} ${this.testResults.success_rate}% implementation complete`);
    }
  }

  generateHTMLDashboard(markdownContent: string): string {
    // Simple HTML wrapper for the markdown content
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruchy Documentation Status Dashboard</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        pre { 
            background: #f5f5f5; 
            padding: 15px; 
            border-radius: 5px; 
            overflow-x: auto;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 1em 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px 12px; 
            text-align: left; 
        }
        th { background-color: #f2f2f2; }
        h1, h2, h3 { color: #333; }
        .progress-bar {
            font-family: monospace;
            background: #f0f0f0;
            padding: 2px 4px;
            border-radius: 3px;
            display: inline-block;
        }
        .refresh-info {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e7f3ff;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #b3d9ff;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="refresh-info">
        🔄 Auto-refresh: Run <code>deno task generate-report</code> to update
    </div>
    
    <div id="content">
        ${this.convertMarkdownToHTML(markdownContent)}
    </div>
    
    <script>
        // Simple auto-refresh check every 30 seconds
        setInterval(() => {
            const refreshInfo = document.querySelector('.refresh-info');
            const now = new Date();
            refreshInfo.innerHTML = \`🔄 Last checked: \${now.toLocaleTimeString()}<br>Run <code>deno task generate-report</code> to update\`;
        }, 30000);
    </script>
</body>
</html>`;
  }

  convertMarkdownToHTML(markdown: string): string {
    // Simple markdown to HTML conversion
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```ascii\n([\s\S]*?)\n```/g, '<pre>$1</pre>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
      .replace(/^\| (.*) \|$/gm, (match) => {
        const cells = match.split('|').slice(1, -1).map(cell => `<td>${cell.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .replace(/^\|(-+\|)+$/gm, '') // Remove table separators
      .replace(/(<tr>.*<\/tr>)/s, '<table>$1</table>') // Wrap tables
      .replace(/\n/g, '<br>');
  }
}

// Main execution
if (import.meta.main) {
  const generator = new StatusReportGenerator();
  await generator.run();
}