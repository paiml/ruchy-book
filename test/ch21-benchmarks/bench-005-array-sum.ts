// BENCH-005: Array Sum (1 million integers) - TypeScript/Deno

function arraySum(n: number): number {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += i;
    }
    return sum;
}

const result = arraySum(1000000);
// Expected: 499999500000
