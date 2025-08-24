# Concurrency

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/13 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 1 | Planned for future versions |
| ❌ Broken | 12 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.5*
<!-- DOC_STATUS_END -->


*"Concurrency clicked for me when I stopped thinking about threads and started thinking about tasks. It's not about doing everything at once; it's about never waiting when you don't have to. Master concurrency, and your programs will feel like they have superpowers - responsive, scalable, and efficient."* - Noah Gift

## The Problem

Modern computers have multiple cores, but most code uses only one. How do you write programs that do multiple things at once? How do you coordinate parallel work safely? How do you avoid race conditions and deadlocks?

Most languages make concurrency dangerous - data races, deadlocks, mysterious crashes. In Ruchy, concurrency is safe by default, with powerful abstractions that make parallel code as natural as sequential code.

## Quick Example

Here's safe, elegant concurrency in Ruchy:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
use std::sync;
use std::async;

// Parallel processing with channels
fun process_files(files: Vec<String>) -> Vec<Result> {
    let (sender, receiver) = channel()
    
    // Spawn worker for each file
    for file in files {
        let tx = sender.clone()
        spawn {
            let result = process_file(file)
            tx.send((file, result))
        }
    }
    
    // Collect results
    let results = Vec::new()
    for _ in files.len() {
        let (file, result) = receiver.recv()
        results.push(result)
    }
    
    return results
}

// Async/await for I/O
async fun fetch_all_data(urls: Vec<String>) -> Vec<Data> {
    let futures = urls.map(|url| async {
        let response = http::get(url).await?
        parse_response(response)
    })
    
    return join_all(futures).await
}

// Thread pool for CPU-bound work
let pool = ThreadPool::new(num_cpus())
let results = pool.parallel_map(items, |item| {
    expensive_computation(item)
})






```

That's concurrency without fear!

## Core Concepts

### Threads

OS-level parallelism:

```ruchy
// Status: ⚠️ NOT IMPLEMENTED

// Spawn a thread
let handle = spawn {
    println("Running in parallel!")
    compute_result()
}

// Wait for thread to complete
let result = handle.join()

// Spawn with move semantics
let data = vec![1, 2, 3]
let handle = spawn move {
    let sum = data.sum()  // data moved into thread
    println("Sum: " + sum.to_s())
}

// Thread builder for configuration
let handle = Thread::builder()
    .name("worker")
    .stack_size(4 * 1024 * 1024)
    .spawn(|| {
        heavy_computation()
    })






// Error: ✗ Compilation failed: Compilation failed:

```

### Channels

Message passing between threads:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Create a channel
let (sender, receiver) = channel()

// Multiple producers
for i in range(10) {
    let tx = sender.clone()
    spawn move {
        let result = process(i)
        tx.send(result)
    }
}

// Single consumer
spawn move {
    while let Ok(result) = receiver.recv() {
        println("Got: " + result.to_s())
    }
}

// Bounded channels for backpressure
let (tx, rx) = sync_channel(100)  // Buffer size 100

// Select from multiple channels
loop {
    select! {
        msg = rx1.recv() => {
            process_message(msg)
        }
        data = rx2.recv() => {
            process_data(data)
        }
        _ = timeout(1000) => {
            println("Timeout!")
        }
    }
}






```

### Shared State

Safe sharing with synchronization:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Mutex for mutual exclusion
let counter = Arc::new(Mutex::new(0))

let handles = Vec::new()
for _ in range(10) {
    let counter = counter.clone()
    handles.push(spawn move {
        let mut num = counter.lock()
        *num += 1
    })
}

for handle in handles {
    handle.join()
}

println("Result: " + (*counter.lock()).to_s())

// RwLock for multiple readers
let data = Arc::new(RwLock::new(HashMap::new()))

// Multiple readers
let data_clone = data.clone()
spawn move {
    let map = data_clone.read()  // Shared read access
    println("Value: " + map.get("key").to_s())
}

// Single writer
let data_clone = data.clone()
spawn move {
    let mut map = data_clone.write()  // Exclusive write access
    map.insert("key", "value")
}

// Atomic operations for lock-free programming
let counter = Arc::new(AtomicI32::new(0))
counter.fetch_add(1, Ordering::SeqCst)






```

### Async/Await

Cooperative concurrency:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Async function
async fun fetch_user(id: i32) -> Result<User, Error> {
    let response = http::get("/api/users/" + id.to_s()).await?
    let user = parse_json(response.body).await?
    return Ok(user)
}

// Await multiple futures
async fun fetch_all_users(ids: Vec<i32>) -> Vec<User> {
    let futures = ids.map(|id| fetch_user(id))
    let results = join_all(futures).await
    
    return results
        .filter_map(|r| r.ok())
        .collect()
}

// Select first to complete
async fun fetch_with_timeout(url: String) -> Result<Data, Error> {
    select! {
        result = fetch_data(url) => result,
        _ = sleep(5000) => Err(Error::Timeout)
    }
}

// Async streams
async fun process_stream(stream: AsyncStream<Item>) {
    while let Some(item) = stream.next().await {
        process_item(item).await
    }
}






```

## Concurrency Patterns

### Thread Pool

Reuse threads efficiently:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
struct ThreadPool {
    workers: Vec<Worker>
    sender: Sender<Job>
}

impl ThreadPool {
    fun new(size: usize) -> ThreadPool {
        let (sender, receiver) = channel()
        let receiver = Arc::new(Mutex::new(receiver))
        
        let workers = Vec::with_capacity(size)
        for id in range(size) {
            workers.push(Worker::new(id, receiver.clone()))
        }
        
        ThreadPool { workers, sender }
    }
    
    fn execute<F>(&self, f: F)
    where F: FnOnce() + Send + 'static
    {
        self.sender.send(Box::new(f))
    }
    
    fn parallel_map<T, R, F>(&self, items: Vec<T>, f: F) -> Vec<R>
    where
        F: Fn(T) -> R + Send + Clone + 'static,
        T: Send + 'static,
        R: Send + 'static
    {
        let (tx, rx) = channel()
        
        for item in items {
            let tx = tx.clone()
            let f = f.clone()
            self.execute(move || {
                let result = f(item)
                tx.send(result)
            })
        }
        
        let results = Vec::new()
        for _ in items.len() {
            results.push(rx.recv())
        }
        
        return results
    }
}

// Use thread pool
let pool = ThreadPool::new(4)

for i in range(100) {
    pool.execute(move || {
        println("Task " + i.to_s() + " on thread " + current_thread_id().to_s())
        heavy_work()
    })
}






```

### Producer-Consumer

Decouple work production from consumption:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
fun producer_consumer_pipeline<T>() {
    let (tx, rx) = channel()
    
    // Multiple producers
    for i in range(4) {
        let tx = tx.clone()
        spawn move {
            loop {
                let work = generate_work(i)
                if tx.send(work).is_err() {
                    break  // Channel closed
                }
            }
        }
    }
    
    // Multiple consumers  
    for i in range(2) {
        let rx = rx.clone()
        spawn move {
            while let Ok(work) = rx.recv() {
                process_work(work)
            }
        }
    }
}

// With bounded queue for backpressure
fun bounded_pipeline() {
    let (tx, rx) = sync_channel(100)  // Max 100 items
    
    spawn move {
        for item in generate_items() {
            tx.send(item)  // Blocks if queue full
        }
    }
    
    spawn move {
        while let Ok(item) = rx.recv() {
            slow_process(item)
        }
    }
}






```

### Fork-Join

Split work, process parallel, combine results:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
fun parallel_merge_sort<T: Ord + Send>(mut items: Vec<T>) -> Vec<T> {
    if items.len() <= 1 {
        return items
    }
    
    let mid = items.len() / 2
    let right = items.split_off(mid)
    
    // Fork: sort halves in parallel
    let (left_sorted, right_sorted) = join(
        || parallel_merge_sort(items),
        || parallel_merge_sort(right)
    )
    
    // Join: merge sorted halves
    return merge(left_sorted, right_sorted)
}

// Parallel reduce
fun parallel_sum(numbers: Vec<i32>) -> i32 {
    if numbers.len() <= 1000 {
        return numbers.sum()  // Sequential for small inputs
    }
    
    let chunk_size = numbers.len() / num_cpus()
    let chunks = numbers.chunks(chunk_size)
    
    let sums = chunks
        .parallel_map(|chunk| chunk.sum())
        .collect()
    
    return sums.sum()
}






```

### Actor Model

Isolated units with message passing:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Actor trait
trait Actor {
    type Message
    
    fun handle(&mut self, msg: Self::Message)
}

// Example actor
struct CounterActor {
    count: i32
}

enum CounterMessage {
    Increment
    Decrement
    Get(Sender<i32>)
}

impl Actor for CounterActor {
    type Message = CounterMessage
    
    fun handle(&mut self, msg: CounterMessage) {
        match msg {
            Increment => self.count += 1
            Decrement => self.count -= 1
            Get(reply) => reply.send(self.count)
        }
    }
}

// Actor system
struct ActorSystem {
    actors: HashMap<String, Box<dyn Actor>>
}

impl ActorSystem {
    fn spawn<A: Actor>(&mut self, name: String, actor: A) -> ActorRef<A> {
        let (tx, rx) = channel()
        
        spawn move {
            let mut actor = actor
            while let Ok(msg) = rx.recv() {
                actor.handle(msg)
            }
        }
        
        ActorRef { name, sender: tx }
    }
}

// Use actors
let system = ActorSystem::new()
let counter = system.spawn("counter", CounterActor { count: 0 })

counter.send(Increment)
counter.send(Increment)

let (tx, rx) = channel()
counter.send(Get(tx))
let count = rx.recv()
println("Count: " + count.to_s())  // 2






```

## Real-World Concurrency

### Web Server

Handle thousands of concurrent requests:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
async fun web_server() {
    let listener = TcpListener::bind("0.0.0.0:8080").await
    
    loop {
        let (socket, addr) = listener.accept().await
        
        // Handle each connection concurrently
        spawn async {
            handle_connection(socket, addr).await
        }
    }
}

async fun handle_connection(socket: TcpStream, addr: SocketAddr) {
    let (reader, writer) = socket.split()
    
    let request = read_http_request(reader).await
    let response = route_request(request).await
    
    write_http_response(writer, response).await
}

// Connection pool for database
let db_pool = ConnectionPool::new(20)

async fun handle_request(req: Request) -> Response {
    let conn = db_pool.get().await
    
    let data = conn.query("SELECT * FROM users").await
    
    db_pool.return(conn)
    
    Response::json(data)
}






```

### Parallel Data Processing

Process large datasets efficiently:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
fun process_dataset(data: Vec<Record>) -> Vec<Result> {
    // Partition data for parallel processing
    let chunk_size = data.len() / num_cpus()
    let chunks = data.chunks(chunk_size)
    
    // Process chunks in parallel
    let handles = chunks.map(|chunk| {
        spawn move {
            chunk.iter()
                .map(|record| process_record(record))
                .collect()
        }
    })
    
    // Collect results
    let mut results = Vec::new()
    for handle in handles {
        results.extend(handle.join())
    }
    
    return results
}

// Pipeline with stages
fun parallel_pipeline(input: Stream<Data>) -> Stream<Output> {
    input
        .parallel_map(stage1, workers: 4)
        .parallel_filter(stage2, workers: 2)
        .parallel_flat_map(stage3, workers: 4)
        .collect()
}






```

### Concurrent Testing

Test with parallelism:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
#[test]
fun test_concurrent_access() {
    let shared = Arc::new(Mutex::new(Vec::new()))
    let handles = Vec::new()
    
    // Spawn concurrent writers
    for i in range(100) {
        let shared = shared.clone()
        handles.push(spawn move {
            let mut vec = shared.lock()
            vec.push(i)
        })
    }
    
    // Wait for completion
    for handle in handles {
        handle.join()
    }
    
    // Verify all writes succeeded
    let vec = shared.lock()
    assert_eq!(vec.len(), 100)
}

#[test]
async fun test_async_operations() {
    let results = join_all(vec![
        async_operation(1),
        async_operation(2),
        async_operation(3)
    ]).await
    
    assert!(results.all(|r| r.is_ok()))
}






```

## Performance Tips

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// 1. Choose the right abstraction
// Threads: OS parallelism, CPU-bound work
// Async: I/O-bound work, many concurrent tasks
// Channels: Decoupled communication
// Shared state: When necessary, with proper synchronization

// 2. Avoid contention
let shards = (0..16).map(|_| Mutex::new(HashMap::new()))
fun get_shard(key: &str) -> &Mutex<HashMap> {
    let hash = hash(key)
    return &shards[hash % 16]
}

// 3. Use work stealing
let queue = WorkStealingQueue::new()
// Threads steal work from other threads when idle

// 4. Batch operations
instead_of {
    for item in items {
        channel.send(item)  // Many small sends
    }
}

do {
    channel.send(items)  // One batch send
}






```

## Try It Yourself

Experiment with concurrency:

```bash
$ ruchy repl
>>> # Spawn threads
>>> let handle = spawn {
>>>     println("Hello from thread!")
>>>     42
>>> }
>>> handle.join()
42
>>> 
>>> # Channels
>>> let (tx, rx) = channel()
>>> spawn move { tx.send("Hello") }
>>> rx.recv()
"Hello"
>>> 
>>> # Parallel map
>>> let nums = vec![1, 2, 3, 4, 5]
>>> nums.parallel_map(|n| n * n)
[1, 4, 9, 16, 25]
```

**Your Concurrency Challenges:**

1. **Parallel Algorithms**:
   - Parallel sort
   - Map-reduce framework
   - Parallel search
   - Matrix multiplication

2. **Concurrent Systems**:
   - Chat server
   - Task queue
   - Rate limiter
   - Cache server

3. **Async Programming**:
   - Web crawler
   - API aggregator
   - Stream processor
   - Real-time dashboard

4. **Synchronization**:
   - Dining philosophers
   - Reader-writer lock
   - Barrier synchronization
   - Semaphore

## Summary

- Threads provide OS-level parallelism
- Channels enable safe message passing
- Shared state requires proper synchronization
- Async/await handles I/O-bound concurrency
- Choose the right tool for each task
- The compiler prevents data races
- Test concurrent code thoroughly
- Profile to find bottlenecks

You now wield the power of parallelism! Next, let's explore macros and metaprogramming.