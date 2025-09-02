# Chapter 15: Binary Compilation & Deployment

## The Problem

Writing scripts is great for development and prototyping, but production deployment requires standalone binaries that can run without the ruchy runtime. You need to distribute your ruchy programs as self-contained executables that users can run directly.

## Quick Example

```ruchy
fun main() {
    println("Hello from compiled Ruchy!");
}
```

```bash
$ ruchy compile hello.ruchy
→ Compiling hello.ruchy...
✓ Successfully compiled to: a.out
ℹ Binary size: 3,811,256 bytes

$ ./a.out
Hello from compiled Ruchy!
```

## Core Concepts

### Binary Compilation Process
Ruchy's `compile` command transpiles your code to Rust and then creates a native binary:

1. **Transpilation**: Ruchy → Rust source code
2. **Rust Compilation**: Rust → Native binary  
3. **Optimization**: Dead code elimination and inlining
4. **Packaging**: Self-contained executable

### Deployment Benefits
- **No Runtime Dependencies**: Binaries run on target systems without ruchy installed
- **Native Performance**: Full Rust performance characteristics
- **Easy Distribution**: Single executable file
- **Production Ready**: Suitable for servers, containers, and distribution

## Practical Usage

### Command-Line Tool Example
```ruchy
fun main() {
    let args = std::env::args();
    
    if args.len() < 2 {
        println("Usage: calculator <expression>");
        return;
    }
    
    let expr = args[1];
    let result = evaluate_expression(expr);
    println("Result: {}", result);
}

fun evaluate_expression(expr: String) -> f64 {
    // Simple calculator - supports +, -, *, /
    if expr.contains('+') {
        let parts = expr.split('+');
        return parts[0].parse::<f64>() + parts[1].parse::<f64>();
    } else if expr.contains('-') {
        let parts = expr.split('-');
        return parts[0].parse::<f64>() - parts[1].parse::<f64>();
    } else if expr.contains('*') {
        let parts = expr.split('*');
        return parts[0].parse::<f64>() * parts[1].parse::<f64>();
    } else if expr.contains('/') {
        let parts = expr.split('/');
        let divisor = parts[1].parse::<f64>();
        if divisor != 0.0 {
            return parts[0].parse::<f64>() / divisor;
        }
    }
    
    expr.parse::<f64>()
}
```

```bash
$ ruchy compile calculator.ruchy -o calc
$ ./calc "10+5"
Result: 15
$ ./calc "20*3"
Result: 60
```

### Data Processing Binary
```ruchy
fun main() {
    let data = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    let sum = calculate_sum(&data);
    let avg = calculate_average(&data);
    let max = find_maximum(&data);
    
    println("Data Analysis Results:");
    println("Sum: {}", sum);
    println("Average: {:.2}", avg);
    println("Maximum: {}", max);
}

fun calculate_sum(data: &Vec<i32>) -> i32 {
    let mut total = 0;
    let mut i = 0;
    while i < data.len() {
        total = total + data[i];
        i = i + 1;
    }
    total
}

fun calculate_average(data: &Vec<i32>) -> f64 {
    let sum = calculate_sum(data);
    (sum as f64) / (data.len() as f64)
}

fun find_maximum(data: &Vec<i32>) -> i32 {
    let mut max = data[0];
    let mut i = 1;
    while i < data.len() {
        if data[i] > max {
            max = data[i];
        }
        i = i + 1;
    }
    max
}
```

```bash
$ ruchy compile data_processor.ruchy
$ ./a.out
Data Analysis Results:
Sum: 55
Average: 5.50
Maximum: 10
```

### Mathematical Library Binary
```ruchy
fun main() {
    println("Mathematical Functions Demo");
    
    let n = 10;
    println("Factorial of {}: {}", n, factorial(n));
    
    let x = 25;
    println("Square root of {}: {}", x, integer_sqrt(x));
    
    let a = 48;
    let b = 18;
    println("GCD of {} and {}: {}", a, b, gcd(a, b));
}

fun factorial(n: i32) -> i64 {
    if n <= 1 {
        1
    } else {
        (n as i64) * factorial(n - 1)
    }
}

fun integer_sqrt(n: i32) -> i32 {
    if n < 2 {
        return n;
    }
    
    let mut x = n / 2;
    let mut prev = 0;
    
    while x != prev {
        prev = x;
        x = (x + n / x) / 2;
    }
    
    x
}

fun gcd(mut a: i32, mut b: i32) -> i32 {
    while b != 0 {
        let temp = b;
        b = a % b;
        a = temp;
    }
    a
}
```

```bash
$ ruchy compile math_lib.ruchy
→ Compiling math_lib.ruchy...
✓ Successfully compiled to: a.out
ℹ Binary size: 3,823,445 bytes

$ ./a.out
Mathematical Functions Demo
Factorial of 10: 3628800
Square root of 25: 5
GCD of 48 and 18: 6
```

## Compilation Options

### Custom Output Names
```bash
# Specify output filename
ruchy compile program.ruchy -o myprogram
ruchy compile server.ruchy -o webserver
```

### Binary Analysis
```bash
# Check binary size
ls -lh a.out
du -h a.out

# Verify binary type
file a.out
```

### Cross-Platform Considerations
```bash
# Current platform compilation
ruchy compile app.ruchy

# Check target architecture
./a.out
ldd a.out  # Linux: show dynamic dependencies
```

## Performance Characteristics

### Binary Size Analysis
- **Base Size**: ~3.8MB (includes Rust runtime)
- **Code Growth**: Minimal per function (~1-10KB)
- **Optimization**: Dead code elimination included

### Runtime Performance
- **Native Speed**: Full Rust performance
- **No Interpretation**: Direct machine code execution
- **Memory Efficiency**: Rust's zero-cost abstractions

### Startup Time
```bash
# Measure execution time
time ./calculator "100*200"
# Typical: 0.002s user, 0.001s system
```

## Common Pitfalls

### Large Binary Size
**Problem**: Binaries are several MB even for simple programs
**Reason**: Includes full Rust standard library and runtime
**Solution**: This is expected for standalone deployment

### Platform Dependencies
**Problem**: Binary won't run on different architectures
**Solution**: Compile on target platform or use cross-compilation (future feature)

### Debug Information
**Problem**: Runtime errors don't show Ruchy source locations
**Solution**: Use `ruchy run` for development, `ruchy compile` for production

## Deployment Strategies

### Container Deployment
```dockerfile
# Dockerfile
FROM scratch
COPY ./myapp /myapp
ENTRYPOINT ["/myapp"]
```

```bash
# Build minimal container
ruchy compile app.ruchy -o myapp
docker build -t ruchy-app .
docker run ruchy-app
```

### System Service Deployment
```bash
# Install binary
sudo cp myapp /usr/local/bin/
chmod +x /usr/local/bin/myapp

# Create systemd service
sudo systemctl enable myapp
sudo systemctl start myapp
```

### Distribution
```bash
# Create distribution package
tar czf myapp-v1.0-linux-x86_64.tar.gz myapp README.md
```

## Quality Gates for Binaries

### Pre-Compilation Validation
```bash
# Ensure code quality before compiling
ruchy check program.ruchy      # Syntax validation
ruchy lint program.ruchy       # Style checking  
ruchy score program.ruchy      # Quality scoring
ruchy test program.ruchy       # Test validation
```

### Binary Verification
```bash
# Verify compilation success
ruchy compile program.ruchy && echo "✅ Compilation successful"

# Test binary execution
./a.out && echo "✅ Binary runs successfully"

# Performance baseline
time ./a.out > /dev/null
```

## Real-World Applications

### 1. Data Analysis Tool
- Processes CSV files
- Calculates statistics
- Generates reports
- Deployed as single binary

### 2. System Utility
- Monitors system resources
- Logs performance metrics
- Runs as background service
- No runtime dependencies

### 3. Mathematical Calculator
- Command-line interface
- Complex calculations
- Distributed to users
- Works offline

## Summary

- `ruchy compile` creates standalone native binaries
- Binaries have no runtime dependencies 
- Performance equals native Rust code
- Ideal for production deployment and distribution
- Quality gates ensure reliable compilation
- Supports containerization and system services

Binary compilation transforms your ruchy programs from development scripts into production-ready applications that can be deployed anywhere without dependencies.