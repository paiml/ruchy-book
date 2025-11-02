// BENCH-006: File line processing (100MB log file) - Deno TypeScript
// Count lines containing "error" (case-insensitive)

async function countErrorLines(filename: string): Promise<number> {
    const file = await Deno.open(filename);
    const decoder = new TextDecoder();
    let count = 0;
    let buffer = "";

    for await (const chunk of file.readable) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
            if (line.toLowerCase().includes("error")) {
                count++;
            }
        }
    }

    // Process final line
    if (buffer && buffer.toLowerCase().includes("error")) {
        count++;
    }

    file.close();
    return count;
}

async function main(): Promise<void> {
    const filename = Deno.args[0] || "test-data/sample-100mb.log";
    const count = await countErrorLines(filename);
    // Silent for benchmarking
    // Expected: ~10% of lines contain ERROR
}

main();
