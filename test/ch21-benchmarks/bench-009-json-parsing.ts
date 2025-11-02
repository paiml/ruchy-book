// BENCH-009: JSON parsing (50MB file) - Deno TypeScript
// Parse large JSON and access deeply nested value

async function parseAndAccess(filename: string): Promise<string> {
    const contents = await Deno.readTextFile(filename);
    const data = JSON.parse(contents);

    // Access deeply nested value
    const city = data.users[500].profile.location.city;
    return city;
}

async function main(): Promise<void> {
    const filename = Deno.args[0] || "test-data/sample-50mb.json";
    const city = await parseAndAccess(filename);
    // Silent for benchmarking
    // Expected: "London" or other city name
}

main();
