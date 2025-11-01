fn string_concatenation(iterations: &str) -> i32 {
    let mut result = String::from("");
    let mut i = 0;
    while i < iterations {
        {
            result = format!("{}{}", result, "x");
            i = i + 1;
        }
    }
    result
}
fn main() {
    {
        let iterations = 10000;
        let mut result = string_concatenation(iterations);
    }
}
