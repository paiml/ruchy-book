#!/usr/bin/env -S deno run --allow-read

/**
 * Check test coverage and ensure it meets the minimum threshold
 */

const MIN_COVERAGE = 80;

async function checkCoverage(): Promise<void> {
  try {
    // Read the coverage report
    const coverageText = await Deno.readTextFile('coverage.lcov');
    
    // Parse LCOV format
    const lines = coverageText.split('\n');
    let totalLines = 0;
    let coveredLines = 0;
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalBranches = 0;
    let coveredBranches = 0;

    for (const line of lines) {
      if (line.startsWith('LF:')) {
        totalLines += parseInt(line.slice(3), 10);
      } else if (line.startsWith('LH:')) {
        coveredLines += parseInt(line.slice(3), 10);
      } else if (line.startsWith('FNF:')) {
        totalFunctions += parseInt(line.slice(4), 10);
      } else if (line.startsWith('FNH:')) {
        coveredFunctions += parseInt(line.slice(4), 10);
      } else if (line.startsWith('BRF:')) {
        totalBranches += parseInt(line.slice(4), 10);
      } else if (line.startsWith('BRH:')) {
        coveredBranches += parseInt(line.slice(4), 10);
      }
    }

    // Calculate coverage percentages
    const lineCoverage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
    const functionCoverage = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0;
    const branchCoverage = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0;
    
    // Overall coverage (weighted average)
    const overallCoverage = (lineCoverage * 0.5 + functionCoverage * 0.3 + branchCoverage * 0.2);

    // Print report
    console.log('📊 Coverage Report:');
    console.log('─'.repeat(40));
    console.log(`  Lines:     ${coveredLines}/${totalLines} (${lineCoverage.toFixed(2)}%)`);
    console.log(`  Functions: ${coveredFunctions}/${totalFunctions} (${functionCoverage.toFixed(2)}%)`);
    console.log(`  Branches:  ${coveredBranches}/${totalBranches} (${branchCoverage.toFixed(2)}%)`);
    console.log('─'.repeat(40));
    console.log(`  Overall:   ${overallCoverage.toFixed(2)}%`);
    console.log('─'.repeat(40));

    // Check threshold
    if (overallCoverage >= MIN_COVERAGE) {
      console.log(`✅ Coverage meets minimum threshold (${MIN_COVERAGE}%)`);
      Deno.exit(0);
    } else {
      console.log(`❌ Coverage below minimum threshold (${MIN_COVERAGE}%)`);
      console.log(`   Increase test coverage by ${(MIN_COVERAGE - overallCoverage).toFixed(2)}%`);
      Deno.exit(1);
    }
  } catch (error) {
    console.error('❌ Error reading coverage report:', error.message);
    console.error('   Run "make test" first to generate coverage data');
    Deno.exit(1);
  }
}

// Run if this is the main module
if (import.meta.main) {
  await checkCoverage();
}