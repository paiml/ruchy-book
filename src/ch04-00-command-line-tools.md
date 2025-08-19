# Command-Line Tools

*"The first time I built a command-line tool that actually solved a real problem, I felt like I had superpowers. It took a tedious 2-hour manual task and turned it into a 5-second command. That's when I realized programming isn't about writing code - it's about automating your life."* - Noah Gift

## The Problem

You've learned the basics - variables, logic, and organization. But real-world programming means building tools that solve actual problems. How do you create programs that process files, handle user input, and perform useful work?

Most people think command-line tools are complex, requiring deep system knowledge and complicated frameworks. In Ruchy, building useful tools should be as straightforward as solving the problem by hand.

## Quick Example

Here's a simple but useful command-line tool in Ruchy:

```ruchy
// File: word_counter.ruchy
// Simple word counter tool

// Get filename from user
println("Word Counter Tool")
print("Enter filename: ")
let filename = input()

// Read and process file
let content = read_file(filename)
let words = content.split_whitespace()
let word_count = words.len()
let char_count = content.len()
let line_count = content.lines().len()

// Display results
println(f"\nFile Analysis: {filename}")
println(f"Characters: {char_count}")
println(f"Words: {word_count}")  
println(f"Lines: {line_count}")
```

Run it:
```bash
$ ruchy run word_counter.ruchy
Word Counter Tool
Enter filename: my_document.txt

File Analysis: my_document.txt
Characters: 1,247
Words: 203
Lines: 45
```

That's a real tool! It solves a common problem with simple code.

## Core Concepts

### User Input

Get information from users with `input()`:
```ruchy
let name = input("What's your name? ")
let age = input("How old are you? ").to_i()
let is_student = input("Are you a student? (y/n) ") == "y"
```

### File Operations

Work with files using built-in functions:
```ruchy  
// Reading files
let content = read_file("data.txt")
let lines = read_lines("data.txt")

// Writing files
write_file("output.txt", "Hello, World!")
append_file("log.txt", "New entry: " + timestamp())

// File information
let exists = file_exists("config.txt")
let size = file_size("data.txt")
```

### Command Arguments

Access command-line arguments:
```ruchy
// Usage: ruchy run script.ruchy file1.txt file2.txt
let args = command_args()
let program_name = args[0]
let first_file = args[1]
let second_file = args[2]

println(f"Processing: {first_file} and {second_file}")
```

## Practical Tools

### File Processor

```ruchy
// File: text_processor.ruchy
// Processes text files with various operations

println("=== Text Processor ===")
let filename = input("Enter filename: ")

if !file_exists(filename) {
    println(f"Error: File '{filename}' not found!")
    exit(1)
}

let content = read_file(filename)
let lines = content.lines()

println("\nChoose operation:")
println("1. Count lines")
println("2. Find and replace")
println("3. Convert to uppercase") 
println("4. Remove empty lines")

let choice = input("Enter choice (1-4): ").to_i()

match choice {
    1 => {
        println(f"Total lines: {lines.len()}")
    }
    2 => {
        let find = input("Find: ")
        let replace = input("Replace with: ")
        let new_content = content.replace(find, replace)
        let output_file = filename.replace(".txt", "_modified.txt")
        write_file(output_file, new_content)
        println(f"Saved to: {output_file}")
    }
    3 => {
        let upper_content = content.to_uppercase()
        let output_file = filename.replace(".txt", "_upper.txt")
        write_file(output_file, upper_content)
        println(f"Saved to: {output_file}")
    }
    4 => {
        let clean_lines = lines.filter(|line| !line.trim().is_empty())
        let clean_content = clean_lines.join("\n")
        let output_file = filename.replace(".txt", "_clean.txt")
        write_file(output_file, clean_content)
        println(f"Saved to: {output_file}")
    }
    _ => {
        println("Invalid choice!")
    }
}
```

### Log Analyzer

```ruchy
// File: log_analyzer.ruchy
// Analyzes server log files

println("=== Log Analyzer ===")
let log_file = input("Enter log file path: ")

let lines = read_lines(log_file)
let total_requests = lines.len()

// Count different status codes
let success_count = 0
let error_count = 0
let not_found_count = 0

for line in lines {
    if line.contains(" 200 ") {
        success_count += 1
    } else if line.contains(" 404 ") {
        not_found_count += 1
    } else if line.contains(" 500 ") {
        error_count += 1
    }
}

// Calculate percentages
let success_percent = (success_count * 100) / total_requests
let error_percent = (error_count * 100) / total_requests
let not_found_percent = (not_found_count * 100) / total_requests

println(f"\n=== Analysis Results ===")
println(f"Total Requests: {total_requests}")
println(f"Success (200): {success_count} ({success_percent}%)")
println(f"Not Found (404): {not_found_count} ({not_found_percent}%)")
println(f"Server Error (500): {error_count} ({error_percent}%)")

// Find busiest hour
let hour_counts = {}
for line in lines {
    let timestamp = extract_hour(line)  // Custom function
    hour_counts[timestamp] = hour_counts.get(timestamp, 0) + 1
}

let busiest_hour = hour_counts.max_by_value().key
println(f"Busiest Hour: {busiest_hour}:00")
```

### Batch File Renamer

```ruchy
// File: batch_renamer.ruchy  
// Renames multiple files with patterns

println("=== Batch File Renamer ===")
let directory = input("Enter directory path: ")
let pattern = input("Enter pattern to find: ")
let replacement = input("Enter replacement: ")

let files = list_files(directory)
let renamed_count = 0

for file in files {
    if file.contains(pattern) {
        let new_name = file.replace(pattern, replacement)
        let old_path = join_path(directory, file)
        let new_path = join_path(directory, new_name)
        
        if rename_file(old_path, new_path) {
            println(f"Renamed: {file} -> {new_name}")
            renamed_count += 1
        } else {
            println(f"Failed to rename: {file}")
        }
    }
}

println(f"\nRenamed {renamed_count} files")
```

## Error Handling

Real tools need proper error handling:

```ruchy
// Robust file processor with error handling

fn process_file(filename) {
    // Check if file exists
    if !file_exists(filename) {
        println(f"❌ Error: File '{filename}' does not exist")
        return false
    }
    
    // Check if file is readable
    if !file_readable(filename) {
        println(f"❌ Error: Cannot read file '{filename}' (permission denied?)")
        return false
    }
    
    // Try to read file
    let content = try {
        read_file(filename)
    } catch error {
        println(f"❌ Error reading file: {error}")
        return false
    }
    
    // Process content
    let word_count = content.split_whitespace().len()
    println(f"✅ File processed: {word_count} words")
    return true
}

// Main program
let filename = input("Enter filename: ")
if process_file(filename) {
    println("Processing completed successfully!")
} else {
    println("Processing failed!")
    exit(1)
}
```

## User Experience

Make your tools user-friendly:

```ruchy
// Good CLI tool practices

fn show_help() {
    println("File Statistics Tool v1.0")
    println("")
    println("Usage:")
    println("  ruchy run file_stats.ruchy <filename>")
    println("")
    println("Examples:")
    println("  ruchy run file_stats.ruchy document.txt")
    println("  ruchy run file_stats.ruchy data/*.csv")
    println("")
    println("Options:")
    println("  --help     Show this help message")
    println("  --verbose  Show detailed output")
}

fn process_with_progress(files) {
    let total = files.len()
    
    for i, file in files.enumerate() {
        let progress = ((i + 1) * 100) / total
        print(f"\rProcessing... [{progress}%] {file}")
        
        // Do the actual work
        process_file(file)
        
        // Small delay to show progress
        sleep(100)  // 100ms
    }
    
    println("\n✅ All files processed!")
}
```

## Generated Code Insight

See how Ruchy's simple file operations become efficient system calls:

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
let content = read_file("data.txt")
let lines = content.lines().len()
println(f"File has {lines} lines")
```

Becomes this optimized Rust:
```rust
use std::fs;

fn main() -> Result<(), std::io::Error> {
    let content = fs::read_to_string("data.txt")?;
    let lines = content.lines().count();
    println!("File has {} lines", lines);
    Ok(())
}
```

**What's happening:**
- Ruchy's `read_file` becomes Rust's efficient `fs::read_to_string`
- Error handling is built-in with the `?` operator
- String operations compile to zero-cost abstractions
- Memory usage is optimized by the compiler

**Performance Benefits:**
- File I/O is as fast as C++ file operations
- No garbage collection overhead
- Optimal memory usage for large files
- System calls are direct and efficient

</details>

**The Bottom Line:** Write simple file processing code, get high-performance system tools automatically.

## Try It Yourself

Time to build real tools that solve actual problems!

```bash
$ ruchy repl
>>> # Start with simple file operations
>>> let content = read_file("test.txt")
>>> let words = content.split_whitespace()
>>> println(f"Word count: {words.len()}")
>>> 
>>> # Build interactive tools
>>> let name = input("What's your name? ")
>>> let greeting = f"Hello, {name}!"
>>> write_file("greeting.txt", greeting)
>>> println("Greeting saved to file!")
```

**Your Tool-Building Challenges:**

1. **Personal Productivity Tools**:
   - Todo list manager (add, remove, mark complete)
   - Time tracker (log activities with timestamps)
   - Password generator (customizable length and characters)
   - File organizer (sort files by type/date)

2. **Data Processing Tools**:
   - CSV analyzer (column stats, missing data detection)
   - Log file summarizer (error counts, patterns)
   - Duplicate file finder (by content or name)
   - Text formatter (markdown to HTML, etc.)

3. **System Administration Tools**:
   - Disk usage reporter (directory sizes)
   - Configuration backup/restore
   - Process monitor (simple version)
   - Network connectivity tester

4. **Creative Tools**:
   - Random quote generator (from text file)
   - Simple encryption/decryption
   - Image metadata extractor
   - Recipe manager (search, add, categorize)

**Example Complete Tool - Todo Manager:**

```ruchy
// todo_manager.ruchy - A simple but useful todo tool

let TODO_FILE = "todos.txt"

fn show_menu() {
    println("\n=== Todo Manager ===")
    println("1. List todos")
    println("2. Add todo")
    println("3. Complete todo")
    println("4. Delete todo")
    println("5. Quit")
}

fn load_todos() {
    if file_exists(TODO_FILE) {
        return read_lines(TODO_FILE)
    }
    return []
}

fn save_todos(todos) {
    let content = todos.join("\n")
    write_file(TODO_FILE, content)
}

fn list_todos(todos) {
    if todos.is_empty() {
        println("\n📝 No todos yet!")
        return
    }
    
    println(f"\n📋 Your Todos ({todos.len()} items):")
    for i, todo in todos.enumerate() {
        let status = if todo.starts_with("✅") { "DONE" } else { "TODO" }
        println(f"{i + 1:2}. {todo}")
    }
}

fn add_todo(todos) {
    let new_todo = input("\nWhat do you want to add? ")
    todos.push(f"📌 {new_todo}")
    save_todos(todos)
    println("✅ Todo added!")
}

fn complete_todo(todos) {
    list_todos(todos)
    let index = input("\nWhich todo to complete? (number): ").to_i() - 1
    
    if index >= 0 && index < todos.len() {
        todos[index] = todos[index].replace("📌", "✅")
        save_todos(todos)
        println("🎉 Todo completed!")
    } else {
        println("❌ Invalid todo number")
    }
}

// Main program loop
let todos = load_todos()

loop {
    show_menu()
    let choice = input("\nChoose option: ")
    
    match choice {
        "1" => list_todos(todos)
        "2" => add_todo(todos)
        "3" => complete_todo(todos)
        "4" => {
            list_todos(todos)
            let index = input("Which todo to delete? (number): ").to_i() - 1
            if index >= 0 && index < todos.len() {
                todos.remove(index)
                save_todos(todos)
                println("🗑️  Todo deleted!")
            }
        }
        "5" => {
            println("👋 Goodbye!")
            break
        }
        _ => println("❌ Invalid choice")
    }
}
```

**Usage:**
```bash
$ ruchy run todo_manager.ruchy

=== Todo Manager ===
1. List todos
2. Add todo  
3. Complete todo
4. Delete todo
5. Quit

Choose option: 2
What do you want to add? Learn Ruchy command-line tools
✅ Todo added!
```

Build tools that solve YOUR daily problems - that's where programming becomes powerful!

## Common Pitfalls

### No Error Handling
```ruchy
// ❌ This will crash if file doesn't exist
let content = read_file("missing.txt")
```

### Poor User Experience
```ruchy
// ❌ Confusing and unhelpful
println("Enter thing:")
let thing = input()
// What thing? What format?
```

### Hardcoded Paths
```ruchy
// ❌ Only works on your computer
let data = read_file("/Users/noah/Desktop/data.txt")
```

## Summary

- Command-line tools solve real problems with simple code
- Use `input()` for user interaction and file functions for I/O
- Always handle errors gracefully - check if files exist
- Make tools user-friendly with clear prompts and help text
- Start simple, add features incrementally
- Test your tools with real data and edge cases
- Build tools that solve YOUR problems - you'll use them daily

You can now build useful command-line tools that automate tasks and process data! Next, let's learn how to work with data files and build more sophisticated processing applications.