// BENCH-007: Fibonacci recursive (n=20) - Deno TypeScript
function fibonacci(n: number): number {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

function main(): void {
    const result = fibonacci(20);
    // Silent for benchmarking
    // Expected: 6765
}

main();
