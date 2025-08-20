# Ruchy Syntax Highlighter Makefile
# Enterprise-grade build system with quality gates

.PHONY: all test lint format coverage build clean install dev quality-gate help

# Configuration
DENO = deno
SRC = src/**/*.ts
TESTS = tests/**/*.ts
MIN_COVERAGE = 80
DIST_DIR = dist
COVERAGE_DIR = coverage

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Default target
all: quality-gate build

# Help target
help:
	@echo "$(BLUE)Ruchy Syntax Highlighter - Available targets:$(NC)"
	@echo "  $(GREEN)make all$(NC)         - Run quality gates and build"
	@echo "  $(GREEN)make dev$(NC)         - Start development mode with watch"
	@echo "  $(GREEN)make test$(NC)        - Run all tests with coverage"
	@echo "  $(GREEN)make lint$(NC)        - Check code style"
	@echo "  $(GREEN)make format$(NC)      - Format code"
	@echo "  $(GREEN)make coverage$(NC)    - Generate coverage report"
	@echo "  $(GREEN)make build$(NC)       - Build production bundles"
	@echo "  $(GREEN)make bench$(NC)       - Run performance benchmarks"
	@echo "  $(GREEN)make clean$(NC)       - Remove build artifacts"
	@echo "  $(GREEN)make quality-gate$(NC) - Run all quality checks"

# Development mode
dev:
	@echo "$(BLUE)👁️  Starting development mode...$(NC)"
	@$(DENO) task dev

# Linting
lint:
	@echo "$(BLUE)🔍 Linting TypeScript files...$(NC)"
	@if $(DENO) lint $(SRC) $(TESTS); then \
		echo "$(GREEN)✅ No linting errors$(NC)"; \
	else \
		echo "$(RED)❌ Linting failed$(NC)"; \
		exit 1; \
	fi

# Formatting
format:
	@echo "$(BLUE)📐 Formatting code...$(NC)"
	@$(DENO) fmt $(SRC) $(TESTS)
	@echo "$(GREEN)✅ Code formatted$(NC)"

# Format check (CI mode)
format-check:
	@echo "$(BLUE)📐 Checking code format...$(NC)"
	@if $(DENO) fmt --check $(SRC) $(TESTS); then \
		echo "$(GREEN)✅ Code formatting correct$(NC)"; \
	else \
		echo "$(RED)❌ Code needs formatting$(NC)"; \
		echo "$(YELLOW)Run 'make format' to fix$(NC)"; \
		exit 1; \
	fi

# Testing
test:
	@echo "$(BLUE)🧪 Running tests...$(NC)"
	@rm -rf $(COVERAGE_DIR)
	@if $(DENO) test --allow-read --coverage=$(COVERAGE_DIR); then \
		echo "$(GREEN)✅ All tests passing$(NC)"; \
	else \
		echo "$(RED)❌ Tests failed$(NC)"; \
		exit 1; \
	fi

# Unit tests only
test-unit:
	@echo "$(BLUE)🧪 Running unit tests...$(NC)"
	@$(DENO) test tests/unit/ --allow-read

# Integration tests
test-integration:
	@echo "$(BLUE)🧪 Running integration tests...$(NC)"
	@$(DENO) test tests/integration/ --allow-read

# Performance tests
test-performance:
	@echo "$(BLUE)🧪 Running performance tests...$(NC)"
	@$(DENO) test tests/performance/ --allow-read

# Coverage report
coverage: test
	@echo "$(BLUE)📊 Generating coverage report...$(NC)"
	@$(DENO) coverage $(COVERAGE_DIR) --lcov > coverage.lcov
	@echo "$(BLUE)📊 Checking coverage threshold...$(NC)"
	@if $(DENO) run --allow-read scripts/check-coverage.ts; then \
		echo "$(GREEN)✅ Coverage > $(MIN_COVERAGE)%$(NC)"; \
	else \
		echo "$(RED)❌ Coverage below $(MIN_COVERAGE)%$(NC)"; \
		exit 1; \
	fi

# Benchmarking
bench:
	@echo "$(BLUE)⚡ Running benchmarks...$(NC)"
	@$(DENO) bench benchmarks/
	@echo "$(GREEN)✅ Benchmarks complete$(NC)"

# Building
build: quality-gate
	@echo "$(BLUE)🔨 Building production bundles...$(NC)"
	@mkdir -p $(DIST_DIR)
	@$(DENO) bundle src/index.ts $(DIST_DIR)/highlighter.js
	@$(DENO) bundle src/repl/index.ts $(DIST_DIR)/repl.js
	@echo "$(GREEN)✅ Build complete$(NC)"
	@echo "  $(DIST_DIR)/highlighter.js"
	@echo "  $(DIST_DIR)/repl.js"

# Install dependencies (if any)
install:
	@echo "$(BLUE)📦 Checking Deno installation...$(NC)"
	@which $(DENO) > /dev/null || (echo "$(RED)❌ Deno not found. Install from https://deno.land$(NC)" && exit 1)
	@echo "$(GREEN)✅ Deno $(shell deno --version | head -n1) installed$(NC)"

# Clean build artifacts
clean:
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	@rm -rf $(DIST_DIR) $(COVERAGE_DIR) coverage.lcov
	@echo "$(GREEN)✅ Clean complete$(NC)"

# Watch mode for development
watch:
	@echo "$(BLUE)👁️  Watching for changes...$(NC)"
	@$(DENO) run --watch --allow-read src/dev.ts

# Quality gate - must pass for commit/build
quality-gate: lint format-check test coverage
	@echo "$(GREEN)✨ All quality gates passed!$(NC)"

# CI pipeline
ci: install quality-gate build
	@echo "$(GREEN)✅ CI pipeline complete$(NC)"

# Deploy to package registries
deploy: quality-gate build
	@echo "$(BLUE)🚀 Deploying to package registries...$(NC)"
	@$(DENO) run --allow-net scripts/deploy.ts
	@echo "$(GREEN)✅ Deployment complete$(NC)"

# Check for updates
update:
	@echo "$(BLUE)🔄 Checking for Deno updates...$(NC)"
	@deno upgrade

# Generate documentation
docs:
	@echo "$(BLUE)📚 Generating documentation...$(NC)"
	@$(DENO) doc --html --output=docs src/index.ts
	@echo "$(GREEN)✅ Documentation generated in docs/$(NC)"

# Performance profiling
profile:
	@echo "$(BLUE)🔥 Running performance profiling...$(NC)"
	@$(DENO) run --allow-read --v8-flags=--prof src/profile.ts
	@echo "$(GREEN)✅ Profile data generated$(NC)"

# Security audit
audit:
	@echo "$(BLUE)🔒 Running security audit...$(NC)"
	@$(DENO) run --allow-read scripts/audit.ts
	@echo "$(GREEN)✅ Security audit complete$(NC)"

# Statistics
stats:
	@echo "$(BLUE)📈 Code statistics:$(NC)"
	@echo "  Lines of code: $$(find src -name '*.ts' | xargs wc -l | tail -1 | awk '{print $$1}')"
	@echo "  Test files: $$(find tests -name '*.ts' | wc -l)"
	@echo "  Source files: $$(find src -name '*.ts' | wc -l)"

.SILENT: help stats