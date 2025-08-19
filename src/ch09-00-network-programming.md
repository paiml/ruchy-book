# Network Programming

*"The day I wrote my first networked application - a simple chat server - everything clicked. Suddenly my programs weren't isolated islands anymore; they could talk to the world. Network programming isn't about memorizing socket APIs; it's about connecting ideas across machines. Master the network, and distance disappears."* - Noah Gift

## The Problem

You've built standalone applications, but how do you make them communicate? How do you build web servers, API clients, real-time chat systems, or distributed tools that work across networks?

Most developers fear network programming because of its complexity - protocols, sockets, concurrency. In Ruchy, networking should be as natural as file I/O, with powerful abstractions that don't hide the important details.

## Quick Example

Here's a complete web server in Ruchy:

```ruchy
// File: web_server.ruchy
// HTTP server with routing and middleware

use std::net::http;

let server = http::Server::new("0.0.0.0:8080")

// Middleware for logging
server.use(|req, res, next| {
    let start = current_time_ms()
    next()
    let duration = current_time_ms() - start
    println(f"{req.method} {req.path} - {res.status} ({duration}ms)")
})

// Routes
server.get("/", |req, res| {
    res.html("<h1>Welcome to Ruchy Server!</h1>")
})

server.get("/api/users", |req, res| {
    let users = [
        {id: 1, name: "Alice", email: "alice@example.com"},
        {id: 2, name: "Bob", email: "bob@example.com"}
    ]
    res.json(users)
})

server.post("/api/users", |req, res| {
    let user = req.json()
    println(f"Creating user: {user.name}")
    user.id = generate_id()
    user.created = current_datetime()
    res.status(201).json(user)
})

// Static files
server.static("/public", "./static")

// Start server
println(f"🚀 Server running on http://localhost:8080")
server.listen()
```

That's a production-ready web server in under 30 lines!

## Core Concepts

### TCP Networking

Build reliable network connections:

```ruchy
// TCP Server
let server = net::TcpListener::bind("127.0.0.1:9000")
println("Server listening on port 9000")

loop {
    let client = server.accept()
    
    // Handle each client in a separate thread
    spawn {
        println(f"Client connected: {client.remote_addr()}")
        
        loop {
            let message = client.read_line()
            if message.is_empty() {
                break
            }
            
            println(f"Received: {message}")
            client.write(f"Echo: {message}\n")
        }
        
        println("Client disconnected")
    }
}

// TCP Client
let client = net::TcpStream::connect("127.0.0.1:9000")
client.write("Hello, server!\n")
let response = client.read_line()
println(f"Server replied: {response}")
```

### HTTP Client

Make HTTP requests easily:

```ruchy
// Simple GET request
let response = http::get("https://api.example.com/data")
let data = response.json()
println(f"Got {data.items.len()} items")

// POST with JSON
let user = {
    name: "Alice",
    email: "alice@example.com"
}
let response = http::post("https://api.example.com/users")
    .json(user)
    .send()

// Advanced requests
let response = http::request("https://api.example.com/data")
    .method("GET")
    .header("Authorization", f"Bearer {token}")
    .header("User-Agent", "Ruchy/1.0")
    .query("page", 1)
    .query("limit", 100)
    .timeout(5000)
    .send()

if response.is_success() {
    let data = response.json()
    process_data(data)
} else {
    println(f"Error: {response.status} - {response.text()}")
}

// Download file with progress
http::download("https://example.com/big-file.zip", "downloads/file.zip")
    .on_progress(|downloaded, total| {
        let percent = (downloaded / total) * 100
        print(f"\rDownloading: {percent:.1}%")
    })
    .await()
```

### WebSocket Communication

Real-time bidirectional communication:

```ruchy
// WebSocket Server
let ws_server = ws::Server::new("0.0.0.0:8081")

ws_server.on_connection(|socket| {
    println(f"WebSocket connected: {socket.id}")
    
    socket.on("message", |data| {
        println(f"Received: {data}")
        
        // Broadcast to all clients
        ws_server.broadcast({
            type: "chat",
            user: socket.id,
            message: data
        })
    })
    
    socket.on("close", || {
        println(f"WebSocket disconnected: {socket.id}")
    })
})

ws_server.listen()

// WebSocket Client
let ws = ws::connect("ws://localhost:8081")

ws.on("open", || {
    println("Connected to server")
    ws.send("Hello, server!")
})

ws.on("message", |data| {
    println(f"Server says: {data}")
})

ws.on("error", |err| {
    println(f"WebSocket error: {err}")
})
```

## Practical Network Applications

### REST API Server

```ruchy
// File: api_server.ruchy
// RESTful API with database

use std::net::http;
use std::db;

let app = http::Server::new("0.0.0.0:3000")
let database = db::connect("sqlite:data.db")

// CORS middleware
app.use(|req, res, next| {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
    next()
})

// Authentication middleware
fn require_auth(req, res, next) {
    let token = req.header("Authorization")
    if !token || !validate_token(token) {
        return res.status(401).json({error: "Unauthorized"})
    }
    req.user = decode_token(token)
    next()
}

// Routes
app.get("/api/posts", |req, res| {
    let page = req.query("page", 1)
    let limit = req.query("limit", 10)
    
    let posts = database.query("
        SELECT * FROM posts 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
    ", [limit, (page - 1) * limit])
    
    res.json({
        posts: posts,
        page: page,
        total: database.count("posts")
    })
})

app.get("/api/posts/:id", |req, res| {
    let id = req.params.id
    let post = database.find("posts", id)
    
    if post {
        res.json(post)
    } else {
        res.status(404).json({error: "Post not found"})
    }
})

app.post("/api/posts", require_auth, |req, res| {
    let post = req.json()
    post.author_id = req.user.id
    post.created_at = current_datetime()
    
    let id = database.insert("posts", post)
    let created = database.find("posts", id)
    
    res.status(201).json(created)
})

app.put("/api/posts/:id", require_auth, |req, res| {
    let id = req.params.id
    let updates = req.json()
    
    // Check ownership
    let post = database.find("posts", id)
    if post.author_id != req.user.id {
        return res.status(403).json({error: "Forbidden"})
    }
    
    updates.updated_at = current_datetime()
    database.update("posts", id, updates)
    
    res.json(database.find("posts", id))
})

app.delete("/api/posts/:id", require_auth, |req, res| {
    let id = req.params.id
    
    // Check ownership
    let post = database.find("posts", id)
    if post.author_id != req.user.id {
        return res.status(403).json({error: "Forbidden"})
    }
    
    database.delete("posts", id)
    res.status(204).send()
})

// Error handling
app.use(|err, req, res, next| {
    console.error(f"Error: {err}")
    res.status(500).json({
        error: "Internal server error",
        message: err.message
    })
})

println("🚀 API server running on http://localhost:3000")
app.listen()
```

### Real-time Chat Application

```ruchy
// File: chat_server.ruchy
// Multi-room chat server with history

use std::net::ws;

let server = ws::Server::new("0.0.0.0:8080")
let rooms = {}
let users = {}

fn broadcast_to_room(room_id, message, exclude_user = null) {
    if rooms.has_key(room_id) {
        for user_id in rooms[room_id] {
            if user_id != exclude_user {
                users[user_id].socket.send(message)
            }
        }
    }
}

server.on_connection(|socket| {
    let user = {
        id: generate_id(),
        socket: socket,
        name: null,
        room: null,
        joined_at: current_datetime()
    }
    
    users[user.id] = user
    
    socket.send(json({
        type: "welcome",
        user_id: user.id,
        message: "Welcome to chat! Send /help for commands"
    }))
    
    socket.on("message", |data| {
        let msg = parse_json(data)
        
        match msg.type {
            "join" => {
                user.name = msg.name
                user.room = msg.room
                
                // Add user to room
                if !rooms.has_key(msg.room) {
                    rooms[msg.room] = []
                }
                rooms[msg.room].push(user.id)
                
                // Notify room
                broadcast_to_room(msg.room, json({
                    type: "user_joined",
                    user: user.name,
                    time: current_datetime()
                }))
                
                // Send room history
                let history = get_room_history(msg.room)
                socket.send(json({
                    type: "history",
                    messages: history
                }))
            }
            
            "message" => {
                let chat_msg = {
                    type: "message",
                    user: user.name,
                    text: msg.text,
                    time: current_datetime()
                }
                
                // Save to history
                save_message(user.room, chat_msg)
                
                // Broadcast to room
                broadcast_to_room(user.room, json(chat_msg))
            }
            
            "private" => {
                let target = find_user_by_name(msg.to)
                if target {
                    target.socket.send(json({
                        type: "private",
                        from: user.name,
                        text: msg.text,
                        time: current_datetime()
                    }))
                }
            }
            
            "typing" => {
                broadcast_to_room(user.room, json({
                    type: "typing",
                    user: user.name
                }), user.id)
            }
        }
    })
    
    socket.on("close", || {
        // Remove from room
        if user.room && rooms.has_key(user.room) {
            rooms[user.room] = rooms[user.room].filter(|id| id != user.id)
            
            broadcast_to_room(user.room, json({
                type: "user_left",
                user: user.name,
                time: current_datetime()
            }))
        }
        
        users.remove(user.id)
    })
})

println("💬 Chat server running on ws://localhost:8080")
server.listen()
```

### Network Scanner

```ruchy
// File: network_scanner.ruchy
// Scan network for open ports and services

use std::net;
use std::async;

println("=== Network Scanner ===")

fn scan_port(host, port, timeout = 1000) {
    try {
        let socket = net::TcpStream::connect_timeout(
            f"{host}:{port}", 
            timeout
        )
        socket.close()
        return true
    } catch {
        return false
    }
}

fn identify_service(port) {
    let services = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        3306: "MySQL",
        5432: "PostgreSQL",
        6379: "Redis",
        8080: "HTTP-Alt",
        8443: "HTTPS-Alt",
        27017: "MongoDB"
    }
    
    return services.get(port, "Unknown")
}

fn scan_host(host, ports) {
    println(f"\nScanning {host}...")
    let open_ports = []
    
    // Parallel port scanning
    let tasks = []
    for port in ports {
        tasks.push(async {
            if scan_port(host, port) {
                return port
            }
            return null
        })
    }
    
    let results = async::wait_all(tasks)
    
    for port in results {
        if port {
            let service = identify_service(port)
            open_ports.push({port: port, service: service})
            println(f"  ✓ Port {port:5} open - {service}")
        }
    }
    
    return open_ports
}

// Get scan parameters
let target = input("Target host (IP or domain): ")
let scan_type = input("Scan type (quick/full/custom): ")

let ports = match scan_type {
    "quick" => [21, 22, 23, 25, 80, 443, 3306, 5432, 8080]
    "full" => range(1, 65535)
    "custom" => {
        let range_str = input("Port range (e.g., 1-1000): ")
        let parts = range_str.split("-")
        range(parts[0].to_i(), parts[1].to_i())
    }
    _ => [80, 443]
}

println(f"\nScanning {ports.len()} ports on {target}...")
let start_time = current_time_ms()

let results = scan_host(target, ports)

let duration = (current_time_ms() - start_time) / 1000
println(f"\nScan complete in {duration:.1}s")
println(f"Found {results.len()} open ports")

// Generate report
if results.len() > 0 {
    println("\n=== Open Services ===")
    for item in results.sort_by(|r| r.port) {
        println(f"{item.port:5} - {item.service}")
    }
}
```

### Load Balancer

```ruchy
// File: load_balancer.ruchy
// HTTP load balancer with health checking

use std::net::http;

let backends = [
    {url: "http://server1:8080", weight: 1, healthy: true},
    {url: "http://server2:8080", weight: 2, healthy: true},
    {url: "http://server3:8080", weight: 1, healthy: true}
]

let current_backend = 0

fn select_backend() {
    // Weighted round-robin selection
    let healthy_backends = backends.filter(|b| b.healthy)
    
    if healthy_backends.is_empty() {
        throw "No healthy backends available"
    }
    
    // Simple round-robin for now
    current_backend = (current_backend + 1) % healthy_backends.len()
    return healthy_backends[current_backend]
}

fn health_check() {
    for backend in backends {
        try {
            let response = http::get(f"{backend.url}/health")
                .timeout(2000)
                .send()
            
            backend.healthy = response.status == 200
        } catch {
            backend.healthy = false
        }
        
        let status = backend.healthy ? "✓" : "✗"
        println(f"Health check {backend.url}: {status}")
    }
}

// Start health check timer
spawn {
    loop {
        health_check()
        sleep(10000)  // Check every 10 seconds
    }
}

// Create load balancer server
let balancer = http::Server::new("0.0.0.0:80")

balancer.all("*", |req, res| {
    let backend = select_backend()
    
    println(f"Routing {req.method} {req.path} -> {backend.url}")
    
    // Forward request
    let backend_response = http::request(backend.url + req.path)
        .method(req.method)
        .headers(req.headers)
        .body(req.body)
        .send()
    
    // Return response
    res.status(backend_response.status)
        .headers(backend_response.headers)
        .send(backend_response.body)
})

println("🔄 Load balancer running on port 80")
println(f"Backends: {backends.len()}")
balancer.listen()
```

## Advanced Networking

### Protocol Implementation

Build custom network protocols:

```ruchy
// Custom protocol over TCP
fn send_packet(socket, type, data) {
    let packet = {
        version: 1,
        type: type,
        timestamp: current_time_ms(),
        data: data
    }
    
    let json = to_json(packet)
    let length = json.len()
    
    // Send length-prefixed message
    socket.write_u32(length)
    socket.write(json)
}

fn receive_packet(socket) {
    let length = socket.read_u32()
    let json = socket.read(length)
    return parse_json(json)
}
```

### Network Monitoring

```ruchy
// Monitor network traffic
let monitor = net::PacketCapture::new("eth0")

monitor.on_packet(|packet| {
    if packet.protocol == "TCP" {
        println(f"TCP: {packet.src}:{packet.src_port} -> {packet.dst}:{packet.dst_port}")
    } else if packet.protocol == "UDP" {
        println(f"UDP: {packet.src} -> {packet.dst} ({packet.size} bytes)")
    }
})

monitor.start()
```

## Try It Yourself

Time to build networked applications! Start experimenting:

```bash
$ ruchy repl
>>> # Quick HTTP server
>>> http::serve(8080, |req, res| {
>>>     res.text(f"Hello from {req.path}!")
>>> })
>>> 
>>> # Fetch data from API
>>> let weather = http::get("https://api.weather.com/city/london").json()
>>> println(f"Temperature: {weather.temp}°C")
>>> 
>>> # Simple port check
>>> net::is_port_open("google.com", 443)
```

**Your Network Programming Challenges:**

1. **Web Applications**:
   - Personal blog engine
   - File sharing service
   - URL shortener
   - API gateway

2. **Real-time Systems**:
   - Chat application
   - Collaborative editor
   - Live dashboard
   - Game server

3. **Network Tools**:
   - Port scanner
   - Bandwidth monitor
   - Proxy server
   - VPN client

4. **Distributed Systems**:
   - Message queue
   - Service discovery
   - Rate limiter
   - Cache server

## Summary

- Network programming connects your applications to the world
- TCP provides reliable connections for most uses
- HTTP/WebSocket handle web communication
- Async operations prevent blocking on network I/O
- Always handle network errors gracefully
- Use timeouts to prevent hanging connections
- Consider security in all network code
- Test with real network conditions

You can now build powerful networked applications! Next, let's optimize for performance.