# Systems Programming

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 44% Working (4/9 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 4 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 5 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 1.0.3*
<!-- DOC_STATUS_END -->


*"The first time I wrote a system monitor that could track CPU usage, memory consumption, and disk I/O in real-time, I finally understood what my computer was actually doing. Systems programming isn't about fighting the OS - it's about dancing with it. Learn the steps, and your programs can do things you never imagined."* - Noah Gift

## The Problem

You've built applications, but how do you interact with the operating system itself? How do you monitor processes, manage system resources, handle signals, and create tools that feel native to the platform?

Most high-level languages abstract away the system, but real power comes from understanding and controlling it. In Ruchy, systems programming should be safe yet powerful, giving you OS-level capabilities without the complexity.

## Quick Example

Here's a system resource monitor in Ruchy:

```ruchy
// Status: ✅ WORKING

// File: system_monitor.ruchy
// Real-time system resource monitoring

use std::system;
use std::process;

println("=== System Monitor ===")

// Get system information
let cpu_count = system::cpu_count()
let total_memory = system::total_memory()
let hostname = system::hostname()
let os_info = system::os_info()

println("Host: " + hostname)
println("OS: " + os_info.name + " " + os_info.version)
println("CPUs: " + cpu_count.to_s())
println("Memory: " + format_size(total_memory))
println("")

// Monitor resources in real-time
loop {
    let cpu_usage = system::cpu_usage()
    let memory_info = system::memory_info()
    let disk_io = system::disk_io_stats()
    let network_stats = system::network_stats()
    
    // Clear screen and show header
    clear_screen()
    println("System Monitor - Press Ctrl+C to exit")
    println("=" * 50)
    
    // CPU Usage
    println("CPU: " + cpu_usage.to_s() + "% |" + ("█" * (cpu_usage * 50).to_i()) + ("░" * (50 - cpu_usage * 50).to_i()) + "|")
    
    // Memory Usage
    let mem_percent = memory_info.used / memory_info.total
    println("MEM: " + mem_percent.to_s() + "% |" + ("█" * (mem_percent * 50).to_i()) + ("░" * (50 - mem_percent * 50).to_i()) + "|")
    println("     " + format_size(memory_info.used) + " / " + format_size(memory_info.total))
    
    // Disk I/O
    println("Disk Read:  " + format_size(disk_io.read_bytes) + "/s")
    println("Disk Write: " + format_size(disk_io.write_bytes) + "/s")
    
    // Network
    println("Net Down: " + format_size(network_stats.download_speed) + "/s")
    println("Net Up:   " + format_size(network_stats.upload_speed) + "/s")
    
    // Top processes
    println("\nTop Processes by CPU:")
    let processes = process::list()
        .sort_by(|p| -p.cpu_percent)
        .take(5)
    
    for proc in processes {
        println("  " + proc.pid.to_s() + " " + proc.name + " " + proc.cpu_percent.to_s() + "%")
    }
    
    sleep(1000)  // Update every second
}





```

That's systems programming - direct access to OS resources with safety!

## Core Concepts

### Process Management

Work with processes at the system level:

```ruchy
// Status: ✅ WORKING

// Current process information
let pid = process::current_pid()
let ppid = process::parent_pid()
let exe_path = process::executable_path()
let args = process::args()
let env = process::environment()

// List all processes
let all_processes = process::list()
for proc in all_processes {
    println("PID: " + proc.pid.to_s() + ", Name: " + proc.name + ", CPU: " + proc.cpu_percent.to_s() + "%")
}

// Find specific process
let chrome_procs = process::find_by_name("chrome")
let high_cpu_procs = process::list()
    .filter(|p| p.cpu_percent > 50)

// Process control
let proc = process::from_pid(1234)
proc.suspend()  // Pause process
proc.resume()   // Resume process
proc.terminate() // Request termination
proc.kill()     // Force kill

// Launch new process
let child = process::spawn("ls", ["-la"])
let output = child.wait_with_output()
println(output.stdout)





```

### Signal Handling

Respond to system signals properly:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected identifier after '::'
// Register signal handlers
signal::on(SIGINT, || {
    println("\nGracefully shutting down...")
    cleanup()
    exit(0)
})

signal::on(SIGTERM, || {
    save_state()
    exit(0)
})

signal::on(SIGUSR1, || {
    reload_config()
})

// Send signals to other processes
let target_pid = 1234
signal::send(target_pid, SIGUSR1)

// Block/unblock signals
signal::block([SIGPIPE])
critical_operation()
signal::unblock([SIGPIPE])




```

### Memory Management

Monitor and control memory usage:

```ruchy
// Status: ✅ WORKING

// Get memory information
let mem_info = system::memory_info()
println("Total: " + mem_info.total.to_s())
println("Used: " + mem_info.used.to_s())
println("Free: " + mem_info.free.to_s())
println("Available: " + mem_info.available.to_s())
println("Swap Used: " + mem_info.swap_used.to_s())

// Monitor memory pressure
if mem_info.available < 100_000_000 {  // Less than 100MB
    println("WARNING: Low memory!")
    free_caches()
}

// Memory-mapped files for large data
let mmap = memory::map_file("huge_dataset.bin", READ_ONLY)
let data = mmap.read_range(0, 1000000)  // Read 1MB
mmap.close()

// Shared memory between processes
let shared = memory::create_shared("my_buffer", 1024 * 1024)
shared.write(0, data)

// In another process
let shared = memory::open_shared("my_buffer")
let data = shared.read(0, 1024)





```

## Practical System Tools

### Service Manager

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected identifier or string key in object literal
// File: service_manager.ruchy
// Manage system services

println("=== Service Manager ===")

let services = [
    {name: "web_server", command: "./server", port: 8080},
    {name: "worker", command: "./worker", count: 4},
    {name: "scheduler", command: "./scheduler", interval: 60}
]

let running_services = {}

fun start_service(service) {
    println("Starting " + service.name + "...")
    
    match service.name {
        "web_server" => {
            let proc = process::spawn(service.command, [
                "--port", service.port.to_s()
            ])
            running_services[service.name] = proc
            
            // Wait for port to be available
            while !network::port_is_open("localhost", service.port) {
                sleep(100)
            }
            println("✅ " + service.name + " listening on port " + service.port.to_s())
        }
        "worker" => {
            let workers = []
            for i in range(service.count) {
                let proc = process::spawn(service.command, [
                    "--id", i.to_s()
                ])
                workers.push(proc)
            }
            running_services[service.name] = workers
            println("✅ Started " + service.count.to_s() + " workers")
        }
        "scheduler" => {
            let proc = process::spawn(service.command, [
                "--interval", service.interval.to_s()
            ])
            running_services[service.name] = proc
            println("✅ Scheduler running every " + service.interval.to_s() + "s")
        }
    }
}

fun stop_service(name) {
    if running_services.has_key(name) {
        println("Stopping " + name + "...")
        let proc = running_services[name]
        
        if proc.is_array() {
            // Multiple processes (workers)
            for p in proc {
                p.terminate()
                p.wait()
            }
        } else {
            // Single process
            proc.terminate()
            proc.wait()
        }
        
        running_services.remove(name)
        println("✅ " + name + " stopped")
    }
}

fun service_status() {
    println("\n=== Service Status ===")
    for service in services {
        let status = if running_services.has_key(service.name) {
            "🟢 Running"
        } else {
            "🔴 Stopped"
        }
        println(service.name + " " + status)
    }
}

// Handle shutdown gracefully
signal::on(SIGTERM, || {
    println("\nShutting down all services...")
    for name in running_services.keys() {
        stop_service(name)
    }
    exit(0)
})

// Interactive management
loop {
    service_status()
    println("\nCommands: start <name>, stop <name>, restart <name>, quit")
    let command = input("> ").split(" ")
    
    match command[0] {
        "start" => start_service(services.find(|s| s.name == command[1]))
        "stop" => stop_service(command[1])
        "restart" => {
            stop_service(command[1])
            start_service(services.find(|s| s.name == command[1]))
        }
        "quit" => break
        _ => println("Unknown command")
    }
}




```

### System Health Checker

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: Question
// File: health_check.ruchy
// Monitor system health and alert on issues

println("=== System Health Checker ===")

let checks = {
    cpu_threshold: 80,      // Alert if CPU > 80%
    memory_threshold: 90,   // Alert if memory > 90%
    disk_threshold: 95,     // Alert if disk > 95%
    load_threshold: 4.0,    // Alert if load average > 4
    temp_threshold: 80      // Alert if CPU temp > 80°C
}

let alerts = []

fun check_cpu() {
    let usage = system::cpu_usage() * 100
    if usage > checks.cpu_threshold {
        alerts.push({
            level: "WARNING",
            message: "CPU usage high: " + usage.to_s() + "%",
            time: current_datetime()
        })
        return false
    }
    return true
}

fun check_memory() {
    let mem = system::memory_info()
    let usage = (mem.used / mem.total) * 100
    if usage > checks.memory_threshold {
        alerts.push({
            level: "CRITICAL",
            message: "Memory usage critical: " + usage.to_s() + "%",
            time: current_datetime()
        })
        return false
    }
    return true
}

fun check_disk() {
    let disks = system::disk_usage()
    for disk in disks {
        let usage = (disk.used / disk.total) * 100
        if usage > checks.disk_threshold {
            alerts.push({
                level: "WARNING",
                message: "Disk " + disk.mount + " almost full: " + usage.to_s() + "%",
                time: current_datetime()
            })
            return false
        }
    }
    return true
}

fun check_load() {
    let load = system::load_average()
    let cpu_count = system::cpu_count()
    let normalized_load = load.one_minute / cpu_count
    
    if normalized_load > checks.load_threshold {
        alerts.push({
            level: "WARNING",
            message: "System load high: " + load.one_minute.to_s() + ",",
            time: current_datetime()
        })
        return false
    }
    return true
}

fun check_temperature() {
    let temps = system::temperatures()
    for sensor in temps {
        if sensor.current > checks.temp_threshold {
            alerts.push({
                level: "CRITICAL",
                message: "Temperature critical: " + sensor.name + " at " + sensor.current.to_s() + "°C",
                time: current_datetime()
            })
            return false
        }
    }
    return true
}

fun run_health_checks() {
    let all_healthy = true
    
    all_healthy = check_cpu() && all_healthy
    all_healthy = check_memory() && all_healthy
    all_healthy = check_disk() && all_healthy
    all_healthy = check_load() && all_healthy
    all_healthy = check_temperature() && all_healthy
    
    return all_healthy
}

// Main monitoring loop
loop {
    clear_screen()
    println("System Health Check - " + current_datetime())
    println("=" * 50)
    
    let healthy = run_health_checks()
    
    if healthy {
        println("✅ All systems healthy")
    } else {
        println("⚠️  Issues detected:")
        for alert in alerts.last(5) {
            let icon = alert.level == "CRITICAL" ? "🔴" : "🟡"
            println(icon + " [" + alert.level + "] " + alert.message)
        }
    }
    
    // Show current stats
    println("\nCurrent Status:")
    let cpu = system::cpu_usage() * 100
    let mem = system::memory_info()
    let mem_percent = (mem.used / mem.total) * 100
    let load = system::load_average()
    
    println("CPU:    " + cpu.to_s() + "% / " + checks.cpu_threshold.to_s() + "%")
    println("Memory: " + mem_percent.to_s() + "% / " + checks.memory_threshold.to_s() + "%")
    println("Load:   " + load.one_minute.to_s() + " / " + checks.load_threshold.to_s())
    
    // Send notifications for critical alerts
    for alert in alerts {
        if alert.level == "CRITICAL" {
            system::notify(alert.message, "System Health Alert")
        }
    }
    
    sleep(5000)  // Check every 5 seconds
}




```

### Process Tree Visualizer

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected In, found Comma
// File: process_tree.ruchy
// Visualize process hierarchy

fun build_process_tree() {
    let processes = process::list()
    let tree = {}
    
    // Build parent-child relationships
    for proc in processes {
        let ppid = proc.parent_pid
        if !tree.has_key(ppid) {
            tree[ppid] = []
        }
        tree[ppid].push(proc)
    }
    
    return tree
}

fun print_tree(pid, tree, indent = "") {
    if !tree.has_key(pid) {
        return
    }
    
    let children = tree[pid].sort_by(|p| p.pid)
    for i, proc in children.enumerate() {
        let is_last = (i == children.len() - 1)
        let prefix = is_last ? "└─" : "├─"
        let extension = is_last ? "  " : "│ "
        
        let memory = format_size(proc.memory_info.rss)
        println(indent + prefix + " [" + proc.pid.to_s() + "] " + proc.name + " (" + memory + ", " + proc.cpu_percent.to_s() + "%)")
        
        // Recursively print children
        print_tree(proc.pid, tree, indent + extension)
    }
}

println("=== Process Tree ===")
let tree = build_process_tree()

// Start from init (PID 1) or system idle (PID 0)
let root_pid = tree.has_key(0) ? 0 : 1
println("[" + root_pid.to_s() + "] System Root")
print_tree(root_pid, tree)

// Show process statistics
let all_procs = process::list()
let total_memory = all_procs.map(|p| p.memory_info.rss).sum()
let total_cpu = all_procs.map(|p| p.cpu_percent).sum()

println("\nTotal Processes: " + all_procs.len().to_s())
println("Total Memory: " + format_size(total_memory))
println("Total CPU: " + total_cpu.to_s() + "%")




```

## Advanced System Features

### File System Events

Monitor file system changes in real-time:

```ruchy
// Status: ✅ WORKING

// Watch for file system events
let watcher = fs::watch("/path/to/watch", RECURSIVE)

watcher.on("created", |path| {
    println("File created: " + path)
})

watcher.on("modified", |path| {
    println("File modified: " + path)
    process_change(path)
})

watcher.on("deleted", |path| {
    println("File deleted: " + path)
})

watcher.start()





```

### System Automation

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightParen, found Colon
// Automated system maintenance
fun auto_cleanup() {
    // Clean temp files older than 7 days
    let temp_dir = "/tmp"
    let cutoff_time = current_time() - days(7)
    
    for file in fs::walk(temp_dir) {
        if fs::modified_time(file) < cutoff_time {
            fs::remove(file)
            println("Cleaned: " + file)
        }
    }
    
    // Clear package manager cache
    if fs::dir_size("/var/cache/apt") > gb(1) {
        run_command("apt-get clean")
    }
    
    // Rotate logs
    for log in fs::glob("/var/log/*.log") {
        if fs::size(log) > mb(100) {
            fs::rotate_log(log, keep_count: 5)
        }
    }
}




```

## Try It Yourself

Time to explore your system! Start experimenting:

```bash
$ ruchy repl
>>> # Explore your system
>>> system::info()
>>> process::current()
>>> 
>>> # Monitor resources
>>> while true {
>>>     let cpu = system::cpu_usage()
>>>     print("\rCPU: " + cpu.to_s() + "%")
>>>     sleep(100)
>>> }
>>> 
>>> # Find resource hogs
>>> process::list()
>>>     .filter(|p| p.cpu_percent > 10)
>>>     .map(|p| p.name + ": " + p.cpu_percent.to_s() + "%")
```

**Your Systems Programming Challenges:**

1. **Monitoring Tools**:
   - Process monitor with kill capabilities
   - Network connection tracker
   - Disk space analyzer
   - System performance profiler

2. **System Utilities**:
   - Service watchdog
   - Log aggregator
   - Backup scheduler
   - System info reporter

3. **Process Management**:
   - Task manager GUI
   - Process priority manager
   - Resource limiter
   - Job scheduler

4. **Automation**:
   - System maintenance scripts
   - Health check automation
   - Alert system
   - Performance tuner

## Summary

- Systems programming gives you direct OS access
- Process management lets you control running programs
- Signal handling enables graceful shutdowns
- Resource monitoring helps optimize performance
- Memory management prevents resource exhaustion
- File system events enable reactive programs
- System automation saves time and prevents issues
- Always handle errors and edge cases in system code

You now have the power to create system-level tools! Next, let's explore network programming.