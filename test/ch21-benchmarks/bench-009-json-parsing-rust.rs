// BENCH-009: JSON parsing (50MB file) - Rust
// Parse large JSON and access deeply nested value
use std::env;
use std::fs;

// Using serde_json for parsing
// Note: This requires serde_json to be available

fn parse_and_access(filename: &str) -> Result<String, Box<dyn std::error::Error>> {
    let contents = fs::read_to_string(filename)?;
    let data: serde_json::Value = serde_json::from_str(&contents)?;

    // Access deeply nested value
    let city = data["users"][500]["profile"]["location"]["city"]
        .as_str()
        .ok_or("City not found")?
        .to_string();

    Ok(city)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let filename = env::args()
        .nth(1)
        .unwrap_or_else(|| "test-data/sample-50mb.json".to_string());

    let city = parse_and_access(&filename)?;
    let _ = city;
    // Silent for benchmarking
    // Expected: "London" or other city name

    Ok(())
}
