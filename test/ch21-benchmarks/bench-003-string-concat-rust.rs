fn string_concatenation(iterations: usize) -> String {
    "x".repeat(iterations)
}

fn main() {
    let _ = string_concatenation(10000);
}
