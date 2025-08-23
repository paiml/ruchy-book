# Real-World Projects

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/4 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 4 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 1.1.0*
<!-- DOC_STATUS_END -->


*"After 20 years of building software, I've learned that the best way to master a language isn't through tutorials - it's by building something real that solves actual problems. Every project teaches you something new. Build things people need, ship them, learn from feedback, iterate. That's how you become a real developer."* - Noah Gift

## The Problem

You've learned the language, patterns, and tools. But how do you put it all together? How do you build complete, production-ready applications? What does real Ruchy code look like in the wild?

This chapter presents complete, real-world projects you can build, deploy, and use. Each project demonstrates different aspects of Ruchy, from CLI tools to web services to system utilities.

## Project 1: Task Management CLI

A complete productivity tool:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// taskmaster.ruchy - Complete task management system
use std::cli::{App, Arg, SubCommand};
use std::fs;
use std::chrono::{DateTime, Local};

#[derive(Serialize, Deserialize, Clone)]
struct Task {
    id: String,
    title: String,
    description: Option<String>,
    status: TaskStatus,
    priority: Priority,
    due_date: Option<DateTime<Local>>,
    tags: Vec<String>,
    created_at: DateTime<Local>,
    completed_at: Option<DateTime<Local>>,
}

#[derive(Serialize, Deserialize, Clone)]
enum TaskStatus {
    Todo,
    InProgress,
    Done,
    Archived
}

#[derive(Serialize, Deserialize, Clone)]
enum Priority {
    Low,
    Medium,
    High,
    Critical
}

struct TaskStore {
    path: PathBuf,
    tasks: Vec<Task>,
}

impl TaskStore {
    fun load(path: PathBuf) -> Result<Self> {
        let tasks = if path.exists() {
            let content = fs::read_to_string(&path)?;
            serde_json::from_str(&content)?
        } else {
            Vec::new()
        };
        
        Ok(TaskStore { path, tasks })
    }
    
    fun save(&self) -> Result<()> {
        let json = serde_json::to_string_pretty(&self.tasks)?;
        fs::write(&self.path, json)?;
        Ok(())
    }
    
    fun add(&mut self, task: Task) -> Result<()> {
        self.tasks.push(task);
        self.save()
    }
    
    fun find(&self, id: &str) -> Option<&Task> {
        self.tasks.iter().find(|t| t.id == id)
    }
    
    fun update<F>(&mut self, id: &str, updater: F) -> Result<()>
    where F: FnOnce(&mut Task)
    {
        if let Some(task) = self.tasks.iter_mut().find(|t| t.id == id) {
            updater(task);
            self.save()?;
        }
        Ok(())
    }
    
    fun list(&self, filter: Option<TaskFilter>) -> Vec<&Task> {
        self.tasks.iter()
            .filter(|t| {
                if let Some(ref f) = filter {
                    f.matches(t)
                } else {
                    true
                }
            })
            .collect()
    }
}

struct TaskFilter {
    status: Option<TaskStatus>,
    priority: Option<Priority>,
    tags: Vec<String>,
    search: Option<String>,
}

impl TaskFilter {
    fun matches(&self, task: &Task) -> bool {
        if let Some(ref status) = self.status {
            if task.status != *status {
                return false;
            }
        }
        
        if let Some(ref priority) = self.priority {
            if task.priority != *priority {
                return false;
            }
        }
        
        if !self.tags.is_empty() {
            if !self.tags.iter().any(|tag| task.tags.contains(tag)) {
                return false;
            }
        }
        
        if let Some(ref search) = self.search {
            let search_lower = search.to_lowercase();
            if !task.title.to_lowercase().contains(&search_lower) &&
               !task.description.as_ref()
                   .map(|d| d.to_lowercase().contains(&search_lower))
                   .unwrap_or(false) {
                return false;
            }
        }
        
        true
    }
}

fun main() -> Result<()> {
    let app = App::new("taskmaster")
        .version("1.0.0")
        .author("Your Name")
        .about("Powerful task management from the command line")
        .subcommand(
            SubCommand::with_name("add")
                .about("Add a new task")
                .arg(Arg::with_name("title").required(true))
                .arg(Arg::with_name("description").short("d").takes_value(true))
                .arg(Arg::with_name("priority").short("p").takes_value(true))
                .arg(Arg::with_name("due").long("due").takes_value(true))
                .arg(Arg::with_name("tags").short("t").multiple(true))
        )
        .subcommand(
            SubCommand::with_name("list")
                .about("List tasks")
                .arg(Arg::with_name("status").short("s").takes_value(true))
                .arg(Arg::with_name("priority").short("p").takes_value(true))
                .arg(Arg::with_name("tags").short("t").multiple(true))
        )
        .subcommand(
            SubCommand::with_name("done")
                .about("Mark task as done")
                .arg(Arg::with_name("id").required(true))
        )
        .get_matches();
    
    let store_path = dirs::home_dir()
        .unwrap()
        .join(".taskmaster")
        .join("tasks.json");
    
    let mut store = TaskStore::load(store_path)?;
    
    match app.subcommand() {
        ("add", Some(matches)) => {
            let task = Task {
                id: generate_id(),
                title: matches.value_of("title").unwrap().to_string(),
                description: matches.value_of("description").map(String::from),
                status: TaskStatus::Todo,
                priority: matches.value_of("priority")
                    .and_then(|p| p.parse().ok())
                    .unwrap_or(Priority::Medium),
                due_date: matches.value_of("due")
                    .and_then(|d| parse_date(d).ok()),
                tags: matches.values_of("tags")
                    .map(|tags| tags.map(String::from).collect())
                    .unwrap_or_default(),
                created_at: Local::now(),
                completed_at: None,
            };
            
            store.add(task)?;
            println!("✅ Task added successfully!");
        }
        
        ("list", Some(matches)) => {
            let filter = TaskFilter {
                status: matches.value_of("status").and_then(|s| s.parse().ok()),
                priority: matches.value_of("priority").and_then(|p| p.parse().ok()),
                tags: matches.values_of("tags")
                    .map(|tags| tags.map(String::from).collect())
                    .unwrap_or_default(),
                search: None,
            };
            
            let tasks = store.list(Some(filter));
            
            for task in tasks {
                let status_emoji = match task.status {
                    TaskStatus::Todo => "⬜",
                    TaskStatus::InProgress => "🔄",
                    TaskStatus::Done => "✅",
                    TaskStatus::Archived => "📦",
                };
                
                let priority_marker = match task.priority {
                    Priority::Critical => "🔴",
                    Priority::High => "🟠",
                    Priority::Medium => "🟡",
                    Priority::Low => "🟢",
                };
                
                println!("{} {} {} {}", 
                    status_emoji, 
                    priority_marker,
                    task.id[..8].to_string(),
                    task.title
                );
                
                if let Some(ref desc) = task.description {
                    println!("    {}", desc);
                }
                
                if !task.tags.is_empty() {
                    println!("    Tags: {}", task.tags.join(", "));
                }
            }
        }
        
        ("done", Some(matches)) => {
            let id = matches.value_of("id").unwrap();
            store.update(id, |task| {
                task.status = TaskStatus::Done;
                task.completed_at = Some(Local::now());
            })?;
            println!("✅ Task marked as done!");
        }
        
        _ => {
            println!("Use --help for usage information");
        }
    }
    
    Ok(())
}




```

## Project 2: Web API Service

A production-ready REST API:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBrace, found ColonColon
// api_server.ruchy - Complete web service
use warp::{Filter, Reply, Rejection};
use sqlx::{PgPool, FromRow};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, FromRow)]
struct User {
    id: i32,
    username: String,
    email: String,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Deserialize)]
struct CreateUser {
    username: String,
    email: String,
    password: String,
}

#[derive(Clone)]
struct AppState {
    db: PgPool,
    jwt_secret: String,
}

async fun create_user(
    user: CreateUser,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let hashed_password = hash_password(&user.password)?;
    
    let result = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
        "#,
        user.username,
        user.email,
        hashed_password
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| reject::custom(DatabaseError(e)))?;
    
    Ok(warp::reply::json(&result))
}

async fun get_user(
    id: i32,
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let user = sqlx::query_as!(
        User,
        "SELECT id, username, email, created_at FROM users WHERE id = $1",
        id
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| reject::custom(DatabaseError(e)))?;
    
    Ok(warp::reply::json(&user))
}

async fun list_users(
    state: AppState,
) -> Result<impl Reply, Rejection> {
    let users = sqlx::query_as!(
        User,
        "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| reject::custom(DatabaseError(e)))?;
    
    Ok(warp::reply::json(&users))
}

fun with_state(
    state: AppState,
) -> impl Filter<Extract = (AppState,), Error = Infallible> + Clone {
    warp::any().map(move || state.clone())
}

fun routes(state: AppState) -> impl Filter<Extract = impl Reply> + Clone {
    let users_create = warp::path("users")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(state.clone()))
        .and_then(create_user);
    
    let users_get = warp::path!("users" / i32)
        .and(warp::get())
        .and(with_state(state.clone()))
        .and_then(get_user);
    
    let users_list = warp::path("users")
        .and(warp::get())
        .and(with_state(state.clone()))
        .and_then(list_users);
    
    let health = warp::path("health")
        .and(warp::get())
        .map(|| "OK");
    
    users_create
        .or(users_get)
        .or(users_list)
        .or(health)
        .with(warp::cors().allow_any_origin())
        .with(warp::log("api"))
        .recover(handle_rejection)
}

async fun handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let code;
    let message;
    
    if err.is_not_found() {
        code = StatusCode::NOT_FOUND;
        message = "Not Found";
    } else if let Some(DatabaseError(_)) = err.find() {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "Database Error";
    } else {
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "Internal Server Error";
    }
    
    let json = warp::reply::json(&ErrorResponse {
        message: message.to_string(),
    });
    
    Ok(warp::reply::with_status(json, code))
}

#[tokio::main]
async fun main() -> Result<()> {
    env_logger::init();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = PgPool::connect(&database_url).await?;
    
    // Run migrations
    sqlx::migrate!("./migrations").run(&pool).await?;
    
    let state = AppState {
        db: pool,
        jwt_secret: env::var("JWT_SECRET")
            .expect("JWT_SECRET must be set"),
    };
    
    let routes = routes(state);
    
    println!("🚀 Server running on http://localhost:3030");
    
    warp::serve(routes)
        .run(([0, 0, 0, 0], 3030))
        .await;
    
    Ok(())
}




```

## Project 3: System Monitor

Real-time system monitoring tool:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected ',' or '}' in import list
// sysmon.ruchy - System monitoring dashboard
use sysinfo::{System, SystemExt, ProcessExt, CpuExt};
use tui::{Terminal, Frame, backend::CrosstermBackend};
use crossterm::event::{self, Event, KeyCode};

struct App {
    system: System,
    cpu_history: Vec<f32>,
    memory_history: Vec<f32>,
    selected_process: Option<usize>,
    processes: Vec<ProcessInfo>,
}

#[derive(Clone)]
struct ProcessInfo {
    pid: u32,
    name: String,
    cpu_usage: f32,
    memory: u64,
    status: String,
}

impl App {
    fun new() -> Self {
        let mut system = System::new_all();
        system.refresh_all();
        
        App {
            system,
            cpu_history: Vec::with_capacity(60),
            memory_history: Vec::with_capacity(60),
            selected_process: None,
            processes: Vec::new(),
        }
    }
    
    fun update(&mut self) {
        self.system.refresh_all();
        
        // Update CPU history
        let cpu_usage = self.system.global_cpu_info().cpu_usage();
        self.cpu_history.push(cpu_usage);
        if self.cpu_history.len() > 60 {
            self.cpu_history.remove(0);
        }
        
        // Update memory history
        let used_memory = self.system.used_memory();
        let total_memory = self.system.total_memory();
        let memory_usage = (used_memory as f32 / total_memory as f32) * 100.0;
        self.memory_history.push(memory_usage);
        if self.memory_history.len() > 60 {
            self.memory_history.remove(0);
        }
        
        // Update process list
        self.processes = self.system.processes()
            .iter()
            .map(|(pid, process)| ProcessInfo {
                pid: pid.as_u32(),
                name: process.name().to_string(),
                cpu_usage: process.cpu_usage(),
                memory: process.memory(),
                status: format!("{:?}", process.status()),
            })
            .collect();
        
        // Sort by CPU usage
        self.processes.sort_by(|a, b| 
            b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap()
        );
    }
    
    fun draw(&self, frame: &mut Frame<impl Backend>) {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Percentage(30),
                Constraint::Percentage(30),
                Constraint::Percentage(40),
            ])
            .split(frame.size());
        
        // Header
        let header = Paragraph::new("System Monitor - Press 'q' to quit")
            .style(Style::default().fg(Color::Cyan))
            .block(Block::default().borders(Borders::ALL));
        frame.render_widget(header, chunks[0]);
        
        // CPU Chart
        let cpu_data: Vec<(f64, f64)> = self.cpu_history
            .iter()
            .enumerate()
            .map(|(i, &val)| (i as f64, val as f64))
            .collect();
        
        let cpu_chart = Chart::new(vec![
            Dataset::default()
                .name("CPU")
                .marker(symbols::Marker::Dot)
                .style(Style::default().fg(Color::Yellow))
                .data(&cpu_data),
        ])
        .block(Block::default().title("CPU Usage").borders(Borders::ALL))
        .x_axis(Axis::default()
            .bounds([0.0, 60.0])
            .labels(vec!["60s", "30s", "Now"]))
        .y_axis(Axis::default()
            .bounds([0.0, 100.0])
            .labels(vec!["0%", "50%", "100%"]));
        
        frame.render_widget(cpu_chart, chunks[1]);
        
        // Memory Chart
        let memory_data: Vec<(f64, f64)> = self.memory_history
            .iter()
            .enumerate()
            .map(|(i, &val)| (i as f64, val as f64))
            .collect();
        
        let memory_chart = Chart::new(vec![
            Dataset::default()
                .name("Memory")
                .marker(symbols::Marker::Dot)
                .style(Style::default().fg(Color::Blue))
                .data(&memory_data),
        ])
        .block(Block::default().title("Memory Usage").borders(Borders::ALL))
        .x_axis(Axis::default()
            .bounds([0.0, 60.0])
            .labels(vec!["60s", "30s", "Now"]))
        .y_axis(Axis::default()
            .bounds([0.0, 100.0])
            .labels(vec!["0%", "50%", "100%"]));
        
        frame.render_widget(memory_chart, chunks[2]);
        
        // Process List
        let processes: Vec<ListItem> = self.processes
            .iter()
            .take(10)
            .map(|p| {
                let content = format!("{:5} {:20} {:6.1}% {:8}",
                    p.pid,
                    p.name,
                    p.cpu_usage,
                    format_bytes(p.memory)
                );
                ListItem::new(content)
            })
            .collect();
        
        let process_list = List::new(processes)
            .block(Block::default()
                .title("Top Processes (PID | Name | CPU | Memory)")
                .borders(Borders::ALL))
            .highlight_style(Style::default().bg(Color::DarkGray));
        
        frame.render_widget(process_list, chunks[3]);
    }
}

#[tokio::main]
async fun main() -> Result<()> {
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    
    let mut app = App::new();
    let mut last_update = Instant::now();
    
    loop {
        // Update data every second
        if last_update.elapsed() >= Duration::from_secs(1) {
            app.update();
            last_update = Instant::now();
        }
        
        // Draw UI
        terminal.draw(|f| app.draw(f))?;
        
        // Handle events
        if event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') => break,
                    KeyCode::Up => {
                        if let Some(selected) = &mut app.selected_process {
                            if *selected > 0 {
                                *selected -= 1;
                            }
                        }
                    }
                    KeyCode::Down => {
                        if let Some(selected) = &mut app.selected_process {
                            if *selected < app.processes.len() - 1 {
                                *selected += 1;
                            }
                        } else {
                            app.selected_process = Some(0);
                        }
                    }
                    _ => {}
                }
            }
        }
    }
    
    // Restore terminal
    disable_raw_mode()?;
    execute!(terminal.backend_mut(), LeaveAlternateScreen)?;
    terminal.show_cursor()?;
    
    Ok(())
}




```

## Project Ideas

Build these to master Ruchy:

### 1. Developer Tools
- **Code Generator**: Template-based project scaffolding
- **Documentation Generator**: Parse code, generate beautiful docs
- **Dependency Analyzer**: Visualize project dependencies
- **Performance Profiler**: Profile and optimize Ruchy code

### 2. Web Applications
- **Blog Engine**: Markdown-based with themes
- **URL Shortener**: With analytics and QR codes
- **File Sharing**: Secure, temporary file sharing
- **Chat Application**: Real-time with WebSockets

### 3. System Utilities
- **Backup Tool**: Incremental, encrypted backups
- **Log Analyzer**: Parse and analyze system logs
- **Network Scanner**: Discover devices and services
- **Process Manager**: Like htop but better

### 4. Data Tools
- **CSV Processor**: Transform, analyze, visualize
- **JSON Explorer**: Interactive JSON viewer/editor
- **Database Client**: Universal database GUI
- **Data Pipeline**: ETL tool for data processing

### 5. Games
- **Text Adventure**: Parser-based adventure game
- **Roguelike**: Procedural dungeon crawler
- **Puzzle Game**: Sudoku, crossword solver
- **Multiplayer Game**: Simple networked game

## Best Practices

When building real projects:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: Dot
// 1. Project structure
my-project/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── models/
│   ├── handlers/
│   └── utils/
├── tests/
├── benches/
├── docs/
├── Cargo.toml
├── README.md
└── .github/
    └── workflows/

// 2. Error handling
type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
}

// 3. Configuration
#[derive(Debug, Deserialize)]
struct Config {
    server: ServerConfig,
    database: DatabaseConfig,
    #[serde(default)]
    features: Features,
}

impl Config {
    fun load() -> Result<Self> {
        // Try multiple sources
        let config = config::Config::builder()
            .add_source(config::File::with_name("config"))
            .add_source(config::Environment::with_prefix("APP"))
            .build()?;
        
        Ok(config.try_deserialize()?)
    }
}

// 4. Logging
fun init_logging() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .with_target(false)
        .with_thread_ids(true)
        .with_file(true)
        .with_line_number(true)
        .init();
}

// 5. Testing
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fun test_functionality() {
        // Arrange
        let input = prepare_test_data();
        
        // Act
        let result = function_under_test(input);
        
        // Assert
        assert_eq!(result, expected);
    }
}




```

## Deployment Checklist

Before shipping:

- [ ] All tests pass
- [ ] Documentation complete
- [ ] Security audit clean
- [ ] Performance benchmarked
- [ ] Error handling comprehensive
- [ ] Logging configured
- [ ] Configuration externalized
- [ ] Docker image built
- [ ] CI/CD pipeline setup
- [ ] Monitoring configured
- [ ] Backup strategy defined
- [ ] Rollback plan ready

## Summary

- Start with a real problem to solve
- Build incrementally, ship early
- Test everything, automate everything
- Document as you go
- Handle errors gracefully
- Monitor in production
- Listen to user feedback
- Iterate and improve

You're now ready to build production Ruchy applications! Go forth and create amazing software!

## Final Words

*"You've completed the journey from basics to production systems. You know Ruchy, you know software engineering, you know how to ship. The rest is practice. Build things that matter, solve real problems, help real people. The world needs what you're going to create. Now go build it!"* - Noah Gift

Welcome to the Ruchy community. Your adventure begins now!