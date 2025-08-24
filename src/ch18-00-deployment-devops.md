# Deployment & DevOps

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/8 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 8 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.1*
<!-- DOC_STATUS_END -->


*"Deployment used to terrify me - one wrong command and production was down. Then I learned to automate everything. Now deployment is boring, and boring is beautiful. When deployment is a single command that can't fail, you can focus on building features instead of fighting fires."* - Noah Gift

## The Problem

Your code works on your machine, but how do you get it running in production? How do you deploy without downtime? Handle scaling? Monitor health? Rollback bad deploys? Manage secrets?

Most deployments are manual, error-prone nightmares. In Ruchy, deployment is automated, reliable, and even reversible. Ship with confidence, scale with ease, sleep at night.

## Quick Example

Here's modern deployment in Ruchy:

```ruchy
// Status: ❌ BROKEN

// deploy.ruchy - One-command deployment
use std::deploy;

let config = DeployConfig {
    app: "my-app",
    environment: env::var("DEPLOY_ENV"),  // staging/production
    strategy: BlueGreen,
    health_check: "/health",
    rollback_on_failure: true
}

// Build and test
deploy::build()
    .test()
    .security_scan()
    .create_artifact()

// Deploy with zero downtime
let deployment = deploy::start(config)
    .provision_infrastructure()
    .deploy_new_version()
    .run_smoke_tests()
    .switch_traffic()
    .verify_metrics()

if deployment.is_healthy() {
    deployment.commit()
    println("✅ Deployment successful!")
} else {
    deployment.rollback()
    println("⚠️  Rolled back to previous version")
}






// Error: ✗ Compilation failed: Compilation failed:

```

That's deployment without drama!

## Core Concepts

### Continuous Integration

Automate testing and building:

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        rust: [stable, beta, nightly]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: ${{ matrix.rust }}
      
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: |
            ~/.cargo/registry
            ~/.cargo/git
            target
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
      
      - name: Run tests
        run: |
          cargo test --all-features
          cargo test --doc
      
      - name: Check formatting
        run: cargo fmt -- --check
      
      - name: Run clippy
        run: cargo clippy -- -D warnings
      
      - name: Security audit
        run: cargo audit
      
      - name: Build release
        run: cargo build --release
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: binary-${{ matrix.rust }}
          path: target/release/my-app
```

### Docker Containerization

Package for consistent deployment:

```dockerfile
# Multi-stage Dockerfile for minimal image
FROM rust:1.70 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./

# Cache dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Build application
COPY . .
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/my-app /usr/local/bin/

# Non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8080
ENV RUST_LOG=info

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["my-app"]
```

### Kubernetes Deployment

Scale with container orchestration:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: myregistry/my-app:v1.2.3
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: my-app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
  type: LoadBalancer

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Deployment Strategies

### Blue-Green Deployment

Zero-downtime deployment:

```ruchy
// Status: ❌ BROKEN

// blue_green.ruchy
fun deploy_blue_green(new_version: String) {
    // Current production is "blue"
    let blue = Environment::current()
    
    // Provision identical "green" environment
    let green = Environment::provision(new_version)
    
    // Deploy to green
    green.deploy()
    green.run_health_checks()
    green.run_smoke_tests()
    
    // Verify green is healthy
    if !green.is_healthy() {
        green.destroy()
        panic!("Green environment unhealthy")
    }
    
    // Switch traffic to green
    LoadBalancer::switch_to(green)
    
    // Monitor for issues
    sleep(Duration::from_mins(5))
    
    if green.error_rate() > 0.01 {
        // Rollback
        LoadBalancer::switch_to(blue)
        green.destroy()
        panic!("High error rate, rolled back")
    }
    
    // Success - green is now production
    blue.destroy()
    println!("✅ Deployed version {}", new_version)
}






// Error: ✗ Compilation failed: Failed to transpile to Rust

```

### Canary Deployment

Gradual rollout:

```ruchy
// Status: ❌ BROKEN

// canary.ruchy
fun deploy_canary(new_version: String) {
    let deployment = CanaryDeployment::new(new_version)
    
    // Start with 5% traffic
    deployment.set_traffic_percentage(5)
    deployment.deploy()
    
    // Monitor metrics
    let baseline = Metrics::baseline()
    
    // Gradually increase traffic
    for percentage in [5, 10, 25, 50, 100] {
        deployment.set_traffic_percentage(percentage)
        
        sleep(Duration::from_mins(10))
        
        let current = Metrics::current()
        if current.error_rate > baseline.error_rate * 1.1 {
            deployment.rollback()
            panic!("Error rate increased by >10%")
        }
        
        if current.p99_latency > baseline.p99_latency * 1.2 {
            deployment.rollback()
            panic!("Latency increased by >20%")
        }
        
        println!("✅ Canary at {}% - metrics healthy", percentage)
    }
    
    deployment.finalize()
}






// Error: ✗ Compilation failed: Failed to transpile to Rust

```

### Feature Flags

Deploy code without releasing features:

```ruchy
// Status: ❌ BROKEN

// feature_flags.ruchy
use feature_flags::{Client, Flag};

let flags = Client::new("api_key")

// Define feature flag
let new_algorithm = Flag::new("new-algorithm")
    .default(false)
    .rollout_percentage(10)  // 10% of users
    .targeting_rules([
        Rule::new("beta_users", true),
        Rule::new("internal_users", true)
    ])

// Use in code
if flags.is_enabled(new_algorithm, user) {
    use_new_algorithm()
} else {
    use_old_algorithm()
}

// Gradual rollout
for percentage in [10, 25, 50, 75, 100] {
    flags.set_rollout(new_algorithm, percentage)
    monitor_metrics()
    
    if metrics_degraded() {
        flags.disable(new_algorithm)
        break
    }
}






// Error: ✗ Compilation failed: Compilation failed:

```

## Infrastructure as Code

### Terraform

```hcl
# infrastructure.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_ecs_cluster" "main" {
  name = "my-app-cluster"
}

resource "aws_ecs_service" "app" {
  name            = "my-app"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 3

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "my-app"
    container_port   = 8080
  }
}

resource "aws_autoscaling_policy" "scale_up" {
  name                   = "scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 60
  autoscaling_group_name = aws_autoscaling_group.app.name
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-usage"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name        = "CPUUtilization"
  namespace          = "AWS/ECS"
  period             = "120"
  statistic          = "Average"
  threshold          = "70"
  alarm_description  = "Triggers when CPU exceeds 70%"
  alarm_actions      = [aws_autoscaling_policy.scale_up.arn]
}
```

## Monitoring & Observability

### Metrics

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// metrics.ruchy
use metrics::{counter, gauge, histogram};

// Application metrics
counter!("requests_total", 1, "endpoint" => "/api/users")
histogram!("request_duration_seconds", duration.as_secs_f64())
gauge!("active_connections", connections.len() as f64)

// Prometheus endpoint
#[get("/metrics")]
async fun metrics_endpoint() -> String {
    prometheus::gather()
}

// Grafana dashboard configuration
let dashboard = json!({
    "title": "Application Metrics",
    "panels": [
        {
            "title": "Request Rate",
            "targets": [{
                "expr": "rate(requests_total[5m])"
            }]
        },
        {
            "title": "Error Rate",
            "targets": [{
                "expr": "rate(requests_total{status=~'5..'}[5m])"
            }]
        },
        {
            "title": "P99 Latency",
            "targets": [{
                "expr": "histogram_quantile(0.99, request_duration_seconds)"
            }]
        }
    ]
})






```

### Logging

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// logging.ruchy
use tracing::{info, warn, error, debug, span, Level};

// Structured logging
#[instrument]
async fun process_request(req: Request) -> Result<Response, Error> {
    let span = span!(Level::INFO, "request", 
        method = %req.method(),
        path = %req.path(),
        request_id = %generate_id()
    );
    
    let _enter = span.enter();
    
    info!("Processing request");
    
    let result = match handle_request(req).await {
        Ok(response) => {
            info!(status = response.status(), "Request successful");
            Ok(response)
        }
        Err(e) => {
            error!(error = ?e, "Request failed");
            Err(e)
        }
    };
    
    result
}

// Log aggregation config
let config = json!({
    "sinks": {
        "elasticsearch": {
            "type": "elasticsearch",
            "endpoints": ["http://elasticsearch:9200"],
            "index": "logs-%Y.%m.%d"
        },
        "s3": {
            "type": "aws_s3",
            "bucket": "my-app-logs",
            "compression": "gzip"
        }
    }
})






```

### Distributed Tracing

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// tracing.ruchy
use opentelemetry::{global, sdk, trace::Tracer};

// Initialize tracing
let tracer = global::tracer("my-app")

// Trace requests
#[instrument(skip(db))]
async fun handle_request(req: Request, db: &Database) -> Result<Response> {
    let span = tracer.start("handle_request")
    
    // Trace database query
    let user = db.with_span("fetch_user", |db| {
        db.query_one("SELECT * FROM users WHERE id = $1", &[req.user_id()])
    }).await?
    
    // Trace external API call
    let data = http_client.with_span("fetch_external_data", |client| {
        client.get("https://api.example.com/data").send()
    }).await?
    
    span.end()
    
    Ok(Response::new(data))
}






```

## CI/CD Pipeline

Complete automation:

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  CARGO_HOME: ${CI_PROJECT_DIR}/.cargo

cache:
  paths:
    - .cargo/
    - target/

test:
  stage: test
  script:
    - cargo test --all
    - cargo clippy -- -D warnings
    - cargo audit

build:
  stage: build
  script:
    - cargo build --release
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  artifacts:
    paths:
      - target/release/my-app

deploy:staging:
  stage: deploy
  environment: staging
  script:
    - kubectl set image deployment/my-app my-app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/my-app
  only:
    - develop

deploy:production:
  stage: deploy
  environment: production
  script:
    - kubectl set image deployment/my-app my-app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/my-app
  only:
    - main
  when: manual
```

## Secret Management

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to transpile to Rust
// secrets.ruchy
use vault::Client;

// Vault integration
let vault = Client::new("https://vault.example.com")
    .auth_kubernetes()  // Use K8s service account

// Fetch secrets
let db_password = vault.read("secret/database/password").await?
let api_key = vault.read("secret/external/api_key").await?

// Rotate secrets
vault.rotate("secret/database/password").await?

// Environment injection
env::set_var("DATABASE_URL", 
    format!("postgres://user:{}@host/db", db_password))






```

## Try It Yourself

Deploy like a pro:

```bash
$ ruchy deploy --environment staging
Building application...
Running tests...
Creating Docker image...
Deploying to staging...
Running health checks...
✅ Deployment successful!

$ ruchy rollback --environment production
Rolling back to previous version...
✅ Rollback complete!

$ ruchy metrics
Current metrics:
  Requests/sec: 1,234
  Error rate: 0.01%
  P99 latency: 45ms
  CPU usage: 62%
```

**Your DevOps Challenges:**

1. **CI/CD Pipeline**:
   - Multi-stage pipeline
   - Automated testing
   - Security scanning
   - Artifact management

2. **Infrastructure**:
   - Container orchestration
   - Auto-scaling
   - Load balancing
   - Disaster recovery

3. **Monitoring**:
   - Metrics dashboard
   - Log aggregation
   - Distributed tracing
   - Alerting system

4. **Deployment**:
   - Zero-downtime deploy
   - Canary releases
   - Feature flags
   - Rollback automation

## Summary

- Automate everything that can fail
- Test in CI, deploy with CD
- Container images ensure consistency
- Use infrastructure as code
- Monitor everything in production
- Deploy gradually with canaries
- Feature flags decouple deploy from release
- Always have a rollback plan

You now deploy with confidence! Next, let's build complete real-world projects.