# Chapter 19: WASM Notebooks and Interactive Computing

## The Problem

Modern data science and computational workflows demand interactive exploration with immediate feedback. Traditional compile-run-debug cycles slow down experimentation. Ruchy's WASM notebooks bring Jupyter-style interactivity to systems programming, enabling rapid prototyping with the safety and performance of Rust.

## Quick Example

```ruchy
// Start a notebook server
// $ ruchy notebook --port 8888

// In a notebook cell:
let data = vec![1, 2, 3, 4, 5]
let mean = data.iter().sum::<i32>() as f64 / data.len() as f64
println!("Mean: {}", mean)
```

## Core Concepts

### WASM Compilation Model

Ruchy notebooks compile cells to WebAssembly for secure, sandboxed execution in the browser. This provides:

1. **Client-side execution** - No server round-trips for computation
2. **Security isolation** - WASM sandbox prevents system access
3. **Performance** - Near-native execution speed
4. **Portability** - Runs in any modern browser

### Cell Execution Architecture

```ruchy
// Cells maintain state across executions
let mut counter = 0

// Cell 2 can access previous definitions
counter += 1
println!("Counter: {}", counter)
```

### Rich Output Support

Notebooks support multiple MIME types for rich visualization:

```ruchy
// Text output
println!("Plain text output")

// JSON output for structured data
fun display_json(data: Vec<i32>) {
    println!("{{\"data\": {:?}}}", data)
}

// HTML for custom visualizations
fun display_html(title: &str) {
    println!("<h3>{}</h3>", title)
}
```

## Practical Usage

### Data Analysis Workflow

```ruchy
// Load and analyze data interactively
let numbers = vec![10, 20, 30, 40, 50]

// Calculate statistics
let sum: i32 = numbers.iter().sum()
let count = numbers.len()
let average = sum as f64 / count as f64

// Display results
println!("Statistics:")
println!("  Count: {}", count)
println!("  Sum: {}", sum)
println!("  Average: {:.2}", average)
```

### Interactive Plotting

```ruchy
// Generate plot data
fun generate_plot_data(n: usize) -> Vec<(f64, f64)> {
    let mut data = Vec::new()
    for i in 0..n {
        let x = i as f64
        let y = (x * 0.1).sin() * 10.0
        data.push((x, y))
    }
    data
}

// Create visualization
let plot_data = generate_plot_data(50)
for (x, y) in plot_data.iter().take(5) {
    println!("({:.1}, {:.2})", x, y)
}
```

### Machine Learning Experimentation

```ruchy
// Simple linear regression
fun linear_regression(x: Vec<f64>, y: Vec<f64>) -> (f64, f64) {
    let n = x.len() as f64
    let sum_x: f64 = x.iter().sum()
    let sum_y: f64 = y.iter().sum()
    let sum_xy: f64 = x.iter().zip(y.iter()).map(|(a, b)| a * b).sum()
    let sum_x2: f64 = x.iter().map(|a| a * a).sum()
    
    let slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
    let intercept = (sum_y - slope * sum_x) / n
    
    (slope, intercept)
}

// Test with sample data
let x_data = vec![1.0, 2.0, 3.0, 4.0, 5.0]
let y_data = vec![2.0, 4.0, 6.0, 8.0, 10.0]
let (m, b) = linear_regression(x_data, y_data)
println!("y = {:.2}x + {:.2}", m, b)
```

## Notebook Features

### Keyboard Shortcuts

The notebook interface provides professional keyboard shortcuts:

- **Shift+Enter**: Run cell and move to next
- **Ctrl+Enter**: Run cell and stay
- **Alt+Enter**: Run cell and insert new below
- **Esc**: Command mode
- **Enter**: Edit mode
- **A**: Insert cell above (command mode)
- **B**: Insert cell below (command mode)
- **DD**: Delete cell (command mode)
- **M**: Convert to Markdown (command mode)
- **Y**: Convert to code (command mode)

### Theme Support

```ruchy
// Notebooks support light and dark themes
// Toggle with the theme button in toolbar
fun calculate_fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a = 0u64
            let mut b = 1u64
            for _ in 2..=n {
                let temp = a + b
                a = b
                b = temp
            }
            b
        }
    }
}

println!("Fibonacci(10) = {}", calculate_fibonacci(10))
```

### State Management

```ruchy
// Cells share a persistent execution context
struct DataPoint {
    x: f64,
    y: f64,
}

let mut dataset = Vec::new()

// Add data points across cells
dataset.push(DataPoint { x: 1.0, y: 2.5 })
dataset.push(DataPoint { x: 2.0, y: 5.0 })

// Access in later cells
println!("Dataset size: {}", dataset.len())
```

## Testing Notebooks

### Unit Testing in Cells

```ruchy
// Define tests directly in notebook cells
fun test_addition() {
    assert_eq!(2 + 2, 4)
    assert_eq!(10 + 5, 15)
    println!("✅ Addition tests passed")
}

fun test_string_concat() {
    let s1 = "Hello"
    let s2 = "World"
    let result = format!("{} {}", s1, s2)
    assert_eq!(result, "Hello World")
    println!("✅ String tests passed")
}

// Run tests
test_addition()
test_string_concat()
```

### Property-Based Testing

```ruchy
// Test properties that should always hold
fun test_commutative_property(a: i32, b: i32) -> bool {
    a + b == b + a
}

// Test with multiple inputs
let test_cases = vec![(1, 2), (5, 3), (10, -5), (0, 0)]
for (a, b) in test_cases {
    if test_commutative_property(a, b) {
        println!("✅ {} + {} = {} + {} ✓", a, b, b, a)
    }
}
```

## Common Pitfalls

1. **Cell Execution Order**: Cells can be run out of order, leading to undefined variables
2. **State Persistence**: Variables persist between cell runs - restart kernel to clear
3. **Output Limits**: Large outputs may be truncated for performance
4. **WASM Limitations**: Not all Rust features are available in WASM context

## Performance Considerations

```ruchy
// Benchmark computation in notebook
fun benchmark_operation<F>(name: &str, operation: F) 
where 
    F: Fn() 
{
    // Simple timing (actual implementation would use proper timing)
    println!("Running benchmark: {}", name)
    operation()
    println!("Completed: {}", name)
}

// Test performance
benchmark_operation("Vector sum", || {
    let v: Vec<i32> = (0..1000).collect()
    let sum: i32 = v.iter().sum()
    println!("Sum of 0..1000 = {}", sum)
})
```

## Integration with Development Workflow

### Exporting Notebooks

```ruchy
// Notebooks can be exported to standalone scripts
// Export options:
// - Ruchy script (.ruchy)
// - Rust code (.rs)
// - Markdown documentation (.md)
// - HTML presentation (.html)

fun main() {
    println!("This notebook can be exported as a standalone program")
    
    // Your notebook code becomes a complete application
    let data = process_data()
    let results = analyze(data)
    display_results(results)
}

fun process_data() -> Vec<i32> {
    vec![1, 2, 3, 4, 5]
}

fun analyze(data: Vec<i32>) -> f64 {
    data.iter().sum::<i32>() as f64 / data.len() as f64
}

fun display_results(result: f64) {
    println!("Analysis result: {:.2}", result)
}
```

## Advanced Features

### Custom MIME Type Handlers

```ruchy
// Register custom output types for specialized visualization
struct PlotData {
    x: Vec<f64>,
    y: Vec<f64>,
}

impl PlotData {
    fun new() -> Self {
        PlotData { x: Vec::new(), y: Vec::new() }
    }
    
    fun add_point(&mut self, x: f64, y: f64) {
        self.x.push(x)
        self.y.push(y)
    }
    
    fun display(&self) {
        println!("Plot with {} points", self.x.len())
        for i in 0..3.min(self.x.len()) {
            println!("  ({:.2}, {:.2})", self.x[i], self.y[i])
        }
        if self.x.len() > 3 {
            println!("  ... and {} more points", self.x.len() - 3)
        }
    }
}

// Use custom visualization
let mut plot = PlotData::new()
plot.add_point(0.0, 0.0)
plot.add_point(1.0, 1.0)
plot.add_point(2.0, 4.0)
plot.display()
```

### Collaborative Features

```ruchy
// Future: Real-time collaboration
// Multiple users can edit and run cells simultaneously
// Changes are synchronized via WebRTC

fun share_notebook(notebook_id: &str) {
    println!("Notebook shared at: http://localhost:8888/notebooks/{}", notebook_id)
    println!("Collaborators can join with this link")
}

// Simulated sharing
share_notebook("data-analysis-2024")
```

## Summary

- WASM notebooks bring interactive computing to Ruchy
- Client-side execution ensures security and performance
- Rich output support enables data visualization
- Professional UI with themes and keyboard shortcuts
- Integration with standard development workflows
- Testing and benchmarking directly in notebooks
- Export to multiple formats for documentation and deployment