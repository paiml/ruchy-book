// BENCH-003: String concatenation (10K operations) - Deno TypeScript
function string_concatenation(iterations: number): string {
    // Idiomatic: Array join (equivalent to Python's join)
    return Array(iterations).fill('x').join('');
}

function main(): void {
    const iterations = 10000;
    const result = string_concatenation(iterations);
    // Silent for benchmarking
    // Expected: 10000 characters
}

main();
