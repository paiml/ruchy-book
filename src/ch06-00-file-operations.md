# File Operations

*"The first time I automated file organization on my cluttered desktop, I felt like a digital janitor who just got superpowers. What took me hours of manual sorting now happens in seconds. Files are the lifeblood of computing - master them, and you master your digital world."* - Noah Gift

## The Problem

You've built command-line tools and processed data, but real work involves files - reading configuration, writing reports, organizing directories, and managing your digital workspace. How do you efficiently work with the file system?

Most people manually manage files through graphical interfaces, but that doesn't scale. In Ruchy, file operations should be as natural as working with variables, but with the power to handle thousands of files automatically.

## Quick Example

Here's a practical file organizer in Ruchy:

```ruchy
// File: desktop_organizer.ruchy
// Organizes files by type into folders

println("=== Desktop Organizer ===")

// Define organization rules
let file_categories = {
    "Documents": [".pdf", ".doc", ".docx", ".txt"],
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".svg"],
    "Videos": [".mp4", ".avi", ".mov", ".mkv"],
    "Code": [".py", ".js", ".rs", ".ruchy", ".cpp"],
    "Data": [".csv", ".json", ".xml", ".xlsx"]
}

let source_dir = "~/Desktop"
let files = list_files(source_dir)

println(f"Found {files.len()} files to organize")

// Organize files
for file in files {
    let extension = get_extension(file).lower()
    
    for category, extensions in file_categories.items() {
        if extensions.contains(extension) {
            let target_dir = join_path(source_dir, category)
            
            // Create category folder if needed
            if !dir_exists(target_dir) {
                create_dir(target_dir)
                println(f"Created folder: {category}")
            }
            
            // Move file to appropriate folder
            let source = join_path(source_dir, file)
            let destination = join_path(target_dir, file)
            
            move_file(source, destination)
            println(f"  Moved {file} -> {category}/")
            break
        }
    }
}

println("✅ Desktop organized!")
```

That's file automation! Hours of manual work done in seconds.

## Core Concepts

### File System Navigation

Navigate and query the file system:
```ruchy
// Current directory operations
let current_dir = get_current_dir()
set_current_dir("/home/user/projects")

// Path operations
let full_path = absolute_path("data.txt")
let parent = parent_dir(full_path)
let filename = file_name(full_path)
let extension = file_extension(full_path)

// Path joining and normalization
let project_path = join_path(home_dir(), "projects", "my_app")
let clean_path = normalize_path(".././data//file.txt")
```

### File Information

Get detailed file metadata:
```ruchy
// Check file properties
let exists = file_exists("config.json")
let size = file_size("data.csv")  // In bytes
let modified = file_modified_time("log.txt")
let is_read_only = is_readonly("system.conf")

// File type checking
let is_file = is_file(path)
let is_dir = is_directory(path)
let is_symlink = is_symbolic_link(path)

// Permissions (Unix-like systems)
let can_read = is_readable(path)
let can_write = is_writable(path)
let can_execute = is_executable(path)
```

### Directory Operations

Work with directories efficiently:
```ruchy
// Create and remove directories
create_dir("new_folder")
create_dir_all("path/to/nested/folder")  // Creates parent dirs
remove_dir("empty_folder")
remove_dir_all("folder_with_contents")  // Recursive delete

// List directory contents
let all_items = list_dir(".")
let files_only = list_files(".")
let dirs_only = list_directories(".")

// Recursive directory walking
fn walk_directory(dir) {
    let items = list_dir(dir)
    for item in items {
        let path = join_path(dir, item)
        if is_directory(path) {
            walk_directory(path)  // Recurse into subdirectory
        } else {
            process_file(path)
        }
    }
}
```

## Practical File Tools

### Backup System

```ruchy
// File: smart_backup.ruchy
// Creates timestamped backups of important files

println("=== Smart Backup System ===")

let backup_config = {
    "documents": ["~/Documents", "*.doc", "*.pdf", "*.txt"],
    "code": ["~/Projects", "*.py", "*.js", "*.rs"],
    "config": ["~/.config", "*.conf", "*.json", "*.yaml"]
}

let backup_root = "~/Backups"
let timestamp = current_datetime().format("%Y%m%d_%H%M%S")
let backup_dir = join_path(backup_root, f"backup_{timestamp}")

create_dir_all(backup_dir)
println(f"Creating backup at: {backup_dir}")

let total_files = 0
let total_size = 0

for category, config in backup_config.items() {
    let source_dir = expand_home(config[0])
    let patterns = config[1..]
    
    let category_dir = join_path(backup_dir, category)
    create_dir(category_dir)
    
    println(f"\n📁 Backing up {category}...")
    
    for pattern in patterns {
        let files = glob(join_path(source_dir, pattern))
        
        for file in files {
            let size = file_size(file)
            let relative_path = relative_to(file, source_dir)
            let backup_path = join_path(category_dir, relative_path)
            
            // Create parent directories
            let parent = parent_dir(backup_path)
            if !dir_exists(parent) {
                create_dir_all(parent)
            }
            
            // Copy file to backup
            copy_file(file, backup_path)
            total_files += 1
            total_size += size
            
            println(f"  ✓ {relative_path} ({format_size(size)})")
        }
    }
}

println(f"\n✅ Backup complete!")
println(f"Files backed up: {total_files}")
println(f"Total size: {format_size(total_size)}")
println(f"Location: {backup_dir}")

// Create backup summary
let summary = f"Backup Summary
==============
Date: {timestamp}
Files: {total_files}
Size: {format_size(total_size)}
Categories: {backup_config.keys().join(', ')}
"

write_file(join_path(backup_dir, "summary.txt"), summary)
```

### Duplicate File Finder

```ruchy
// File: find_duplicates.ruchy
// Finds duplicate files based on content hash

println("=== Duplicate File Finder ===")

let search_dir = input("Enter directory to search: ")
let min_size = input("Minimum file size (bytes, 0 for all): ").to_i()

println(f"\nScanning {search_dir}...")

// Build file hash map
let file_hashes = {}
let duplicates = []

fn hash_file(path) {
    let content = read_bytes(path)
    return sha256(content)
}

fn scan_directory(dir) {
    let items = list_dir(dir)
    
    for item in items {
        let path = join_path(dir, item)
        
        if is_directory(path) {
            scan_directory(path)  // Recurse
        } else if is_file(path) {
            let size = file_size(path)
            
            if size >= min_size {
                let hash = hash_file(path)
                
                if file_hashes.has_key(hash) {
                    // Found duplicate
                    duplicates.push({
                        "original": file_hashes[hash],
                        "duplicate": path,
                        "size": size,
                        "hash": hash
                    })
                } else {
                    file_hashes[hash] = path
                }
            }
        }
    }
}

scan_directory(search_dir)

if duplicates.is_empty() {
    println("\n✅ No duplicate files found!")
} else {
    println(f"\n⚠️  Found {duplicates.len()} duplicate files:")
    
    let total_wasted = 0
    
    for dup in duplicates {
        println(f"\nOriginal: {dup.original}")
        println(f"Duplicate: {dup.duplicate}")
        println(f"Size: {format_size(dup.size)}")
        total_wasted += dup.size
    }
    
    println(f"\nTotal space wasted: {format_size(total_wasted)}")
    
    let action = input("\nDelete duplicates? (y/n): ")
    if action.lower() == "y" {
        for dup in duplicates {
            remove_file(dup.duplicate)
            println(f"Deleted: {dup.duplicate}")
        }
        println(f"\n✅ Freed {format_size(total_wasted)} of space!")
    }
}
```

### Log Rotation System

```ruchy
// File: log_rotator.ruchy
// Manages log files with size-based rotation

println("=== Log Rotation System ===")

let log_config = {
    "max_size": 10 * 1024 * 1024,  // 10MB
    "max_backups": 5,
    "compress": true
}

let log_dir = "/var/log/myapp"
let log_files = glob(join_path(log_dir, "*.log"))

for log_file in log_files {
    let size = file_size(log_file)
    
    if size > log_config.max_size {
        println(f"Rotating {log_file} ({format_size(size)})...")
        
        // Shift existing backups
        for i in range(log_config.max_backups - 1, 0, -1) {
            let old_backup = f"{log_file}.{i}"
            let new_backup = f"{log_file}.{i + 1}"
            
            if file_exists(old_backup) {
                if i == log_config.max_backups - 1 {
                    // Delete oldest backup
                    remove_file(old_backup)
                } else {
                    // Rename to next number
                    rename_file(old_backup, new_backup)
                }
            }
        }
        
        // Move current log to .1
        let backup_path = f"{log_file}.1"
        rename_file(log_file, backup_path)
        
        // Compress if configured
        if log_config.compress {
            compress_file(backup_path, f"{backup_path}.gz")
            remove_file(backup_path)
            println(f"  Compressed to {backup_path}.gz")
        }
        
        // Create new empty log file
        write_file(log_file, "")
        println(f"  Created new {log_file}")
    }
}

println("\n✅ Log rotation complete!")
```

### Configuration File Manager

```ruchy
// File: config_manager.ruchy
// Manages application configuration files

println("=== Configuration Manager ===")

let config_dir = "~/.config/myapp"
let config_file = join_path(config_dir, "config.json")

// Ensure config directory exists
if !dir_exists(config_dir) {
    create_dir_all(config_dir)
    println(f"Created config directory: {config_dir}")
}

// Load or create default configuration
let config = if file_exists(config_file) {
    parse_json(read_file(config_file))
} else {
    // Default configuration
    {
        "version": "1.0",
        "theme": "dark",
        "auto_save": true,
        "backup_interval": 3600,
        "recent_files": [],
        "window": {
            "width": 1200,
            "height": 800,
            "maximized": false
        }
    }
}

fn save_config() {
    let json = to_json_pretty(config)
    write_file(config_file, json)
    println("✅ Configuration saved")
}

fn update_setting(key, value) {
    config[key] = value
    save_config()
}

fn add_recent_file(path) {
    if !config.recent_files.contains(path) {
        config.recent_files.insert(0, path)
        // Keep only last 10 files
        if config.recent_files.len() > 10 {
            config.recent_files = config.recent_files[..10]
        }
        save_config()
    }
}

// Interactive configuration editor
loop {
    println("\n=== Current Configuration ===")
    for key, value in config.items() {
        println(f"{key}: {value}")
    }
    
    println("\nOptions:")
    println("1. Change theme")
    println("2. Toggle auto-save")
    println("3. Set backup interval")
    println("4. Clear recent files")
    println("5. Reset to defaults")
    println("6. Exit")
    
    let choice = input("\nChoice: ")
    
    match choice {
        "1" => {
            let theme = input("Theme (light/dark): ")
            update_setting("theme", theme)
        }
        "2" => {
            config.auto_save = !config.auto_save
            save_config()
        }
        "3" => {
            let interval = input("Backup interval (seconds): ").to_i()
            update_setting("backup_interval", interval)
        }
        "4" => {
            config.recent_files = []
            save_config()
        }
        "5" => {
            // Reset to defaults
            remove_file(config_file)
            println("Configuration reset!")
            break
        }
        "6" => break
        _ => println("Invalid choice")
    }
}
```

## Error Handling

Robust file operations need proper error handling:

```ruchy
fn safe_file_operation(path) {
    // Check permissions first
    if !file_exists(path) {
        println(f"Error: File not found: {path}")
        return false
    }
    
    if !is_readable(path) {
        println(f"Error: No read permission for: {path}")
        return false
    }
    
    // Try operation with error handling
    try {
        let content = read_file(path)
        process_content(content)
        return true
    } catch error {
        println(f"Error processing file: {error}")
        
        // Log error for debugging
        let error_log = "errors.log"
        let timestamp = current_datetime()
        append_file(error_log, f"{timestamp}: {path} - {error}\n")
        
        return false
    }
}
```

## Generated Code Insight

See how Ruchy's file operations become efficient system calls:

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
let files = list_files("data")
for file in files {
    let size = file_size(file)
    if size > 1000000 {
        move_file(file, "large_files/" + file)
    }
}
```

Becomes this optimized Rust:
```rust
use std::fs;
use std::path::Path;

fn main() -> std::io::Result<()> {
    let entries = fs::read_dir("data")?;
    
    for entry in entries {
        let entry = entry?;
        let path = entry.path();
        
        if path.is_file() {
            let metadata = fs::metadata(&path)?;
            let size = metadata.len();
            
            if size > 1_000_000 {
                let file_name = path.file_name().unwrap();
                let dest = Path::new("large_files").join(file_name);
                fs::rename(&path, dest)?;
            }
        }
    }
    Ok(())
}
```

**What's happening:**
- File operations use Rust's zero-cost abstractions
- System calls are direct and efficient
- Error handling is built into the Result type
- Memory usage is minimal with iterators

**Performance Benefits:**
- File operations as fast as C system calls
- No overhead from runtime or garbage collection
- Efficient memory usage with streaming operations
- Parallel file processing capabilities

</details>

**The Bottom Line:** Write simple file operation code, get system-level performance automatically.

## Try It Yourself

Time to master file operations! Start experimenting:

```bash
$ ruchy repl
>>> # Explore your file system
>>> let home = home_dir()
>>> let files = list_files(home)
>>> println(f"You have {files.len()} files in your home directory")
>>> 
>>> # Create a test directory structure
>>> create_dir("test_project")
>>> create_dir("test_project/src")
>>> create_dir("test_project/docs")
>>> write_file("test_project/README.md", "# My Project")
>>> 
>>> # Find large files
>>> let downloads = list_files("~/Downloads")
>>> for file in downloads {
>>>     let size = file_size(file)
>>>     if size > 100_000_000 {  // 100MB
>>>         println(f"Large file: {file} ({format_size(size)})")
>>>     }
>>> }
```

**Your File Management Challenges:**

1. **Personal Organization**:
   - Photo organizer by date taken
   - Music library organizer by artist/album
   - Download folder cleaner
   - Desktop file categorizer

2. **System Maintenance**:
   - Temp file cleaner
   - Cache directory manager
   - Old backup remover
   - Log file archiver

3. **Development Tools**:
   - Project template generator
   - Source code statistics analyzer
   - Dependency checker
   - Build artifact cleaner

4. **Data Management**:
   - File synchronization tool
   - Incremental backup system
   - File encryption/decryption utility
   - Archive extractor/creator

Build file tools that automate YOUR workflow - that's where programming saves hours!

## Summary

- File operations are fundamental to real-world programming
- Use path operations to navigate the file system safely
- Always check file existence and permissions before operations
- Handle errors gracefully with try/catch blocks
- Batch operations are more efficient than individual ones
- Test file operations on sample data first
- Be careful with delete operations - consider backups
- Use atomic operations when possible for data integrity

You can now build powerful file management tools! Next, let's combine everything to build complete applications.