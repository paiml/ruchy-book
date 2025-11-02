// BENCH-011: Nested Loops (1000x1000 iterations) - TypeScript/Deno

function nestedLoops(outer: number, inner: number): number {
    let total = 0;
    for (let i = 0; i < outer; i++) {
        for (let j = 0; j < inner; j++) {
            total += i * j;
        }
    }
    return total;
}

const result = nestedLoops(1000, 1000);
// Expected: 249500250000
