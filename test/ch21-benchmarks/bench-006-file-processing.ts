#!/usr/bin/env -S deno run --allow-read
// BENCH-006: File Line Processing - Deno TypeScript
// Count lines containing "error" (case-insensitive)

import { readLines } from "https://deno.land/std@0.208.0/io/mod.ts";

async function countErrorLines(filename: string): Promise<number> {
    let count = 0;
    const file = await Deno.open(filename);
    for await (const line of readLines(file)) {
        if (line.toLowerCase().includes('error')) {
            count++;
        }
    }
    file.close();
    return count;
}

const result = await countErrorLines('testdata/bench-006-logs-100mb.txt');
console.log(result);
// Expected: 126076
