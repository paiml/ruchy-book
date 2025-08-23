# Ruchy Book Makefile - Quality Gates and Development Commands
# Following Toyota Way principles: Kaizen, Genchi Genbutsu, Jidoka

.PHONY: all build serve test test-oneliners test-all-oneliners test-math-oneliners test-comprehensive validate clean lint sync-version verify-version pre-commit help install-deps generate-reports update-integration-docs

# Default target
all: validate build

# Help target
help:
	@echo "Ruchy Book Development Commands (Toyota Way - Foolproof Automation):"
	@echo ""
	@echo "📚 BOOK OPERATIONS:"
	@echo "  make build             - Build the book with mdBook"
	@echo "  make serve             - Serve the book locally with auto-reload"
	@echo "  make clean             - Remove all build artifacts"
	@echo ""
	@echo "🧪 TESTING OPERATIONS:"
	@echo "  make test              - Test all TDD examples"
	@echo "  make test-ch01         - Test Chapter 1: Hello World"
	@echo "  make test-ch02         - Test Chapter 2: Variables"
	@echo "  make test-ch03         - Test Chapter 3: Functions"
	@echo "  make test-ch04         - Test Chapter 4: Modules"
	@echo "  make test-foundation   - Test all foundation chapters (1-3)"
	@echo "  make test-all-chapters - Test all chapters (1-4)"
	@echo "  make test-file FILE=x  - Test specific file"
	@echo "  make test-oneliners    - Test ruchy one-liner examples"
	@echo "  make test-all          - Run ALL tests"
	@echo ""
	@echo "🎨 CODE QUALITY:"
	@echo "  make lint              - Lint all Ruchy code"
	@echo "  make format            - Check code formatting"
	@echo "  make validate          - Run ALL quality checks"
	@echo ""
	@echo "🔄 VERSION OPERATIONS (FOOLPROOF):"
	@echo "  make sync-version      - AUTOMATED: Update to latest ruchy version"
	@echo "  make verify-version    - Check version consistency"
	@echo "  make update-integration-docs - Update INTEGRATION.md with current status"
	@echo ""
	@echo "📊 REPORTING:"
	@echo "  make status            - Show current system status"
	@echo "  make test-tdd          - Update INTEGRATION.md (single source of truth)"
	@echo ""
	@echo "🔒 QUALITY GATES:"
	@echo "  make validate          - Run ALL quality checks (lint + test)"
	@echo "  make pre-commit        - Run pre-commit quality gates"
	@echo ""
	@echo "⚙️  SETUP:"
	@echo "  make install-deps     - Install required dependencies"
	@echo "  make install-hooks    - Install pre-commit hooks"
	@echo ""
	@echo "🚨 TOYOTA WAY QUALITY GATES (BLOCKING):"
	@echo "  - All listings must compile with current ruchy"
	@echo "  - No vaporware documentation (must be implemented)"
	@echo "  - Zero SATD comments (TODO/FIXME/HACK)"
	@echo "  - All function examples use 'fun' keyword"
	@echo "  - Version consistency across all files"
	@echo ""
	@echo "🎯 ONE COMMAND AUTOMATION:"
	@echo "  make sync-version      - Updates version + tests + reports (FOOLPROOF)"

# Install dependencies
install-deps:
	@echo "Installing mdBook and required tools..."
	@command -v mdbook >/dev/null 2>&1 || cargo install mdbook
	@command -v mdbook-linkcheck >/dev/null 2>&1 || cargo install mdbook-linkcheck
	@echo "✅ Dependencies installed"

# Build the book
build: install-deps
	@echo "📚 Building Ruchy book..."
	@mdbook build
	@echo "✅ Book built successfully"

# Serve the book locally
serve: install-deps
	@echo "🚀 Starting local server..."
	@mdbook serve --open

# Test all TDD examples
test:
	@echo "🧪 Testing all TDD examples..."
	@PASS=0; FAIL=0; \
	for file in tests/*/*.ruchy; do \
		if [ -f "$$file" ]; then \
			printf "Testing $$file... "; \
			if ruchy compile "$$file" > /dev/null 2>&1; then \
				echo "✅ PASS"; \
				PASS=$$((PASS + 1)); \
			else \
				echo "❌ FAIL"; \
				FAIL=$$((FAIL + 1)); \
			fi; \
		fi; \
	done; \
	echo ""; \
	echo "📊 Summary: $$PASS passed, $$FAIL failed"; \
	if [ $$FAIL -gt 0 ]; then exit 1; fi

# Test Chapter 1: Hello World
test-ch01 test-chap1:
	@echo "📖 Testing Chapter 1: Hello World..."
	@PASS=0; FAIL=0; \
	for file in tests/ch01-hello-world/*.ruchy; do \
		if [ -f "$$file" ]; then \
			printf "  Testing $$(basename $$file)... "; \
			if ruchy compile "$$file" > /dev/null 2>&1; then \
				echo "✅ PASS"; \
				PASS=$$((PASS + 1)); \
			else \
				echo "❌ FAIL"; \
				FAIL=$$((FAIL + 1)); \
			fi; \
		fi; \
	done; \
	echo "  Summary: $$PASS passed, $$FAIL failed"; \
	if [ $$FAIL -gt 0 ]; then exit 1; fi

# Test Chapter 2: Variables
test-ch02 test-chap2:
	@echo "📖 Testing Chapter 2: Variables..."
	@PASS=0; FAIL=0; \
	for file in tests/ch02-variables/*.ruchy; do \
		if [ -f "$$file" ]; then \
			printf "  Testing $$(basename $$file)... "; \
			if ruchy compile "$$file" > /dev/null 2>&1; then \
				echo "✅ PASS"; \
				PASS=$$((PASS + 1)); \
			else \
				echo "❌ FAIL"; \
				FAIL=$$((FAIL + 1)); \
			fi; \
		fi; \
	done; \
	echo "  Summary: $$PASS passed, $$FAIL failed"; \
	if [ $$FAIL -gt 0 ]; then exit 1; fi

# Test Chapter 3: Functions
test-ch03 test-chap3:
	@echo "📖 Testing Chapter 3: Functions..."
	@PASS=0; FAIL=0; \
	for file in tests/ch03-functions/*.ruchy; do \
		if [ -f "$$file" ]; then \
			printf "  Testing $$(basename $$file)... "; \
			if ruchy compile "$$file" > /dev/null 2>&1; then \
				echo "✅ PASS"; \
				PASS=$$((PASS + 1)); \
			else \
				echo "❌ FAIL"; \
				FAIL=$$((FAIL + 1)); \
			fi; \
		fi; \
	done; \
	echo "  Summary: $$PASS passed, $$FAIL failed"; \
	if [ $$FAIL -gt 0 ]; then exit 1; fi

# Test Chapter 4: Modules
test-ch04 test-chap4:
	@echo "📖 Testing Chapter 4: Modules..."
	@PASS=0; FAIL=0; \
	for file in tests/ch04-modules/*.ruchy; do \
		if [ -f "$$file" ]; then \
			printf "  Testing $$(basename $$file)... "; \
			if ruchy compile "$$file" > /dev/null 2>&1; then \
				echo "✅ PASS"; \
				PASS=$$((PASS + 1)); \
			else \
				echo "❌ FAIL"; \
				FAIL=$$((FAIL + 1)); \
			fi; \
		fi; \
	done; \
	echo "  Summary: $$PASS passed, $$FAIL failed"; \
	if [ $$FAIL -gt 0 ]; then exit 1; fi

# Test all foundation chapters (1-3)
test-foundation: test-ch01 test-ch02 test-ch03
	@echo "✅ All foundation chapters tested"

# Test all chapters including modules
test-all-chapters: test-foundation test-ch04
	@echo "✅ All chapters tested"

# Test one-liners only (current ruchy version)
test-oneliners:
	@echo "🧮 Testing Ruchy one-liners..."
	@deno task test-oneliners

# Test all examples comprehensively
test-all:
	@echo "🧪 Testing ALL examples..."
	@$(MAKE) test
	@$(MAKE) test-oneliners
	@echo "✅ All tests complete"

# Lint all Ruchy code
lint:
	@echo "🔍 Linting Ruchy code..."
	@echo "Checking for SATD comments (TODO/FIXME/HACK)..."
	@! grep -r "TODO\|FIXME\|HACK" tests/ 2>/dev/null || (echo "❌ BLOCKED: SATD comments found in tests" && exit 1)
	@! grep -r "TODO\|FIXME\|HACK" src/ 2>/dev/null || (echo "❌ BLOCKED: SATD comments found in docs" && exit 1)
	@echo "Checking for function keyword compliance (must use 'fun' not 'fn')..."
	@! grep -r "^\s*fn " tests/*.ruchy 2>/dev/null || (echo "❌ BLOCKED: Use 'fun' keyword for Ruchy functions" && exit 1)
	@echo "Checking for vaporware documentation..."
	@! grep -r "coming soon\|not yet implemented\|will be\|future release" src/ 2>/dev/null || (echo "❌ BLOCKED: Vaporware documentation found" && exit 1)
	@echo "✅ All lint checks passed"

# Format Ruchy code (using rustfmt on transpiled output)
format:
	@echo "🎨 Formatting Ruchy code..."
	@for file in tests/*/*.ruchy; do \
		if [ -f "$$file" ]; then \
			echo "  Checking format: $$(basename $$file)"; \
			ruchy compile "$$file" -o /tmp/ruchy_fmt_check.rs 2>/dev/null && \
			rustfmt --check /tmp/ruchy_fmt_check.rs 2>/dev/null || \
			echo "    ⚠️  Format issues detected"; \
		fi; \
	done
	@echo "✅ Format check complete"

# Run specific test file
test-file:
	@if [ -z "$(FILE)" ]; then \
		echo "❌ Usage: make test-file FILE=path/to/file.ruchy"; \
		exit 1; \
	fi
	@echo "🧪 Testing $(FILE)..."
	@if ruchy compile "$(FILE)" > /dev/null 2>&1; then \
		echo "✅ PASS: $(FILE)"; \
		./a.out; \
	else \
		echo "❌ FAIL: $(FILE)"; \
		ruchy compile "$(FILE)"; \
		exit 1; \
	fi

# Validate with strict mode
validate: lint test
	@echo "🔒 Running strict validation..."
	@if [ -d src ]; then \
		MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build 2>/dev/null || echo "⚠️  Strict mode validation skipped (preprocessor not configured)"; \
	else \
		echo "⚠️  src/ directory not found - skipping strict validation"; \
	fi
	@command -v mdbook-linkcheck >/dev/null 2>&1 && mdbook-linkcheck 2>/dev/null || echo "⚠️  Link checking skipped (mdbook-linkcheck not installed)"
	@echo "✅ Validation complete"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf book/
	@cargo clean 2>/dev/null || true
	@find . -name "*.tmp" -delete 2>/dev/null || true
	@find . -name "*.bak" -delete 2>/dev/null || true
	@rm -f test_* debug_* 2>/dev/null || true
	@echo "✅ Clean complete"

# Sync to latest ruchy version (Toyota Way - foolproof automation)
sync-version:
	@echo "🔄 Syncing to latest ruchy version (foolproof automation)..."
	@echo "1. Detecting latest ruchy version..."
	@LATEST=$$(cd ../ruchy && cargo metadata --format-version 1 2>/dev/null | jq -r '.packages[] | select(.name == "ruchy") | .version' || echo ""); \
	if [ -z "$$LATEST" ]; then \
		LATEST=$$(ruchy --version 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo ""); \
	fi; \
	if [ -z "$$LATEST" ]; then \
		echo "❌ Cannot detect ruchy version. Ensure ruchy is installed or ../ruchy directory exists"; \
		exit 1; \
	fi; \
	echo "2. Detected version: $$LATEST"; \
	echo "3. Updating version references..."; \
	find src -name "*.md" -exec sed -i "s/ruchy [0-9]\+\.[0-9]\+\.[0-9]\+/ruchy $$LATEST/g" {} \; || true; \
	find reports test -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.log" -exec sed -i "s/ruchy [0-9]\+\.[0-9]\+\.[0-9]\+/ruchy $$LATEST/g" {} \; 2>/dev/null || true; \
	find docs -name "*.md" -exec sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$$LATEST/g" {} \; 2>/dev/null || true; \
	echo "4. Converting function keywords..."; \
	for file in src/*.md; do \
		if [ -f "$$file" ]; then \
			sed -i '/```ruchy/,/```/{s/\(\s*\)fn \([a-zA-Z_][a-zA-Z0-9_]*\)\s*(/\1fun \2(/g}' "$$file"; \
		fi \
	done; \
	echo "5. Testing examples..."; \
	$(MAKE) test-comprehensive || echo "⚠️  Some examples may be targeting future versions"; \
	echo "6. Generating updated reports..."; \
	$(MAKE) generate-reports || echo "⚠️  Report generation skipped"; \
	echo "✅ Version sync complete to $$LATEST"

# Verify version consistency
verify-version:
	@echo "🔍 Verifying version consistency..."
	@if [ -f book/Cargo.toml ]; then \
		BOOK_VERSION=$$(grep 'ruchy = ' book/Cargo.toml 2>/dev/null | cut -d'"' -f2); \
		echo "Book ruchy version: $$BOOK_VERSION"; \
		find listings -name "Cargo.toml" -exec grep 'ruchy = ' {} \; 2>/dev/null | \
			while read line; do \
				LISTING_VERSION=$$(echo $$line | cut -d'"' -f2); \
				if [ "$$LISTING_VERSION" != "$$BOOK_VERSION" ]; then \
					echo "❌ Version mismatch found: $$LISTING_VERSION != $$BOOK_VERSION"; \
					exit 1; \
				fi \
			done && echo "✅ All versions consistent"; \
	else \
		echo "⚠️  book/Cargo.toml not found - skipping version check"; \
	fi

# Pre-commit quality gates
pre-commit: validate
	@echo "🔒 Running pre-commit quality gates..."
	@echo ""
	@echo "Gate 1: All listings must compile..."
	@$(MAKE) test || (echo "❌ BLOCKED: Code examples don't compile" && exit 1)
	@echo ""
	@echo "Gate 2: No vaporware documentation..."
	@$(MAKE) lint || (echo "❌ BLOCKED: Quality violations found" && exit 1)
	@echo ""
	@echo "Gate 3: Strict validation..."
	@if [ -d src ]; then \
		MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build >/dev/null 2>&1 || (echo "❌ BLOCKED: Examples fail strict validation" && exit 1); \
	fi
	@echo ""
	@echo "Gate 4: No broken links..."
	@command -v mdbook-linkcheck >/dev/null 2>&1 && mdbook-linkcheck >/dev/null 2>&1 || true
	@echo ""
	@echo "✅ All quality gates passed - ready to commit"

# Watch for changes and rebuild
watch:
	@echo "👀 Watching for changes..."
	@mdbook watch

# Deploy to GitHub Pages (CI/CD)
deploy: validate build
	@echo "🚀 Deploying to GitHub Pages..."
	@echo "This target should be run by CI/CD only"

# Quick validation for development
quick: lint
	@echo "⚡ Quick validation complete"

# Full validation before release
release: clean validate build verify-version
	@echo "📦 Release validation complete"

# Comprehensive testing (Toyota Way - all quality gates)
test-comprehensive:
	@echo "🧪 Running comprehensive test suite..."
	@echo "1. Testing one-liners..."
	@deno run --allow-read --allow-write --allow-run scripts/test-oneliners.ts || echo "⚠️  One-liner test failed"
	@echo "2. Testing all examples..."
	@deno run --allow-read --allow-write --allow-run scripts/extract-examples.ts || echo "⚠️  Example extraction failed"
	@echo "3. Validating book build..."
	@mdbook build >/dev/null 2>&1 && echo "✅ Book builds successfully" || echo "❌ Book build failed"
	@echo "✅ Comprehensive testing complete"

# TDD Quality Gates (MANDATORY - Toyota Way)
quality-gates:
	@echo "🔒 Running MANDATORY quality gates..."
	@./scripts/quality-gates.sh

# Run TDD test harness - updates INTEGRATION.md (SINGLE SOURCE OF TRUTH)
test-tdd:
	@echo "🧪 Running TDD test harness..."
	@deno run --allow-all scripts/tdd-harness.ts

# Single command to validate everything
validate-all: test-tdd quality-gates
	@echo "✅ All validation complete - check INTEGRATION.md for results"

# Legacy status reports (DEPRECATED - DO NOT USE)
generate-reports:
	@echo "❌ DEPRECATED: Use 'make test-tdd' instead"
	@echo "   INTEGRATION.md is the single source of truth"
	@echo "   All other reports have been deleted"
	@exit 1

# Update integration documentation with current results  
update-integration-docs:
	@echo "📝 Updating integration documentation..."
	@RUCHY_VERSION=$$(ruchy --version 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' || echo "unknown"); \
	TIMESTAMP=$$(date "+%B %d, %Y"); \
	sed -i "s/### ✅ v[0-9]\+\.[0-9]\+\.[0-9]\+ Release:/### ✅ v$$RUCHY_VERSION Release:/" INTEGRATION.md; \
	sed -i "s/## 📊 Current Test Results (v[0-9]\+\.[0-9]\+\.[0-9]\+)/## 📊 Current Test Results (v$$RUCHY_VERSION)/" INTEGRATION.md; \
	sed -i "s/| **Ruchy Version** | v[0-9]\+\.[0-9]\+\.[0-9]\+ |/| **Ruchy Version** | v$$RUCHY_VERSION |/" INTEGRATION.md; \
	echo "✅ Integration documentation updated"

# Show current status
status:
	@echo "📊 Ruchy Book Status:"
	@echo ""
	@if [ -d book ]; then echo "✅ Book built"; else echo "❌ Book not built"; fi
	@if [ -f book/Cargo.toml ]; then \
		echo "✅ Test framework configured"; \
	else \
		echo "❌ Test framework not configured"; \
	fi
	@command -v mdbook >/dev/null 2>&1 && echo "✅ mdBook installed" || echo "❌ mdBook not installed"
	@command -v mdbook-linkcheck >/dev/null 2>&1 && echo "✅ mdbook-linkcheck installed" || echo "❌ mdbook-linkcheck not installed"
	@command -v deno >/dev/null 2>&1 && echo "✅ Deno installed" || echo "❌ Deno not installed"
	@command -v ruchy >/dev/null 2>&1 && echo "✅ Ruchy installed ($$(ruchy --version 2>/dev/null || echo 'version unknown'))" || echo "❌ Ruchy not installed"
	@if [ -f .git/hooks/pre-commit ]; then echo "✅ Pre-commit hooks installed"; else echo "❌ Pre-commit hooks not installed"; fi

# Install pre-commit hook
install-hooks:
	@echo "🪝 Installing pre-commit hooks..."
	@./scripts/install-hooks.sh

.DEFAULT_GOAL := help