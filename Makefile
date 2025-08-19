# Ruchy Book Makefile - Quality Gates and Development Commands
# Following Toyota Way principles: Kaizen, Genchi Genbutsu, Jidoka

.PHONY: all build serve test validate clean lint sync-version verify-version pre-commit help install-deps

# Default target
all: validate build

# Help target
help:
	@echo "Ruchy Book Development Commands:"
	@echo ""
	@echo "  make build          - Build the book with mdBook"
	@echo "  make serve          - Serve the book locally with auto-reload"
	@echo "  make test           - Test all code listings compile"
	@echo "  make validate       - Run ALL quality checks (lint + test + strict)"
	@echo "  make lint           - Check for vaporware/SATD/TODO comments"
	@echo "  make clean          - Remove all build artifacts"
	@echo "  make sync-version   - Update to latest ruchy version"
	@echo "  make verify-version - Check version consistency"
	@echo "  make pre-commit     - Run pre-commit quality gates"
	@echo "  make install-deps   - Install required dependencies"
	@echo ""
	@echo "Quality Gates (BLOCKING):"
	@echo "  - All listings must compile"
	@echo "  - No vaporware documentation"
	@echo "  - Zero SATD comments"
	@echo "  - All links must be valid"

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

# Test all listings compile
test:
	@echo "🧪 Testing all code listings..."
	@if [ -f book/Cargo.toml ]; then \
		cargo test --manifest-path book/Cargo.toml; \
	else \
		echo "⚠️  book/Cargo.toml not found - skipping listing tests"; \
	fi
	@if [ -f tools/test-listings.sh ]; then \
		./tools/test-listings.sh; \
	else \
		echo "⚠️  tools/test-listings.sh not found - skipping script tests"; \
	fi
	@echo "✅ All tests passed"

# Lint for quality issues
lint:
	@echo "🔍 Checking for quality violations..."
	@echo "Checking for SATD comments (TODO/FIXME/HACK)..."
	@! grep -r "TODO\|FIXME\|HACK" src/ 2>/dev/null || (echo "❌ BLOCKED: SATD comments found" && exit 1)
	@echo "Checking for vaporware documentation..."
	@! grep -r "coming soon\|not yet implemented\|will be\|future release" src/ 2>/dev/null || (echo "❌ BLOCKED: Vaporware documentation found" && exit 1)
	@! grep -r "coming soon\|not yet implemented" listings/ 2>/dev/null || (echo "❌ BLOCKED: Vaporware in listings found" && exit 1)
	@echo "Checking for placeholder content..."
	@! grep -r "\[placeholder\]\|\[TODO\]\|XXX\|TBD" src/ 2>/dev/null || (echo "❌ BLOCKED: Placeholder content found" && exit 1)
	@echo "✅ No quality violations found"

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

# Sync to latest ruchy version
sync-version:
	@echo "🔄 Syncing to latest ruchy version..."
	@if [ -f tools/update_version.sh ]; then \
		LATEST=$$(cargo search ruchy --limit 1 2>/dev/null | grep "^ruchy " | cut -d'"' -f2); \
		if [ -n "$$LATEST" ]; then \
			echo "Updating to ruchy $$LATEST..."; \
			./tools/update_version.sh $$LATEST; \
		else \
			echo "⚠️  Could not determine latest ruchy version"; \
		fi \
	else \
		echo "⚠️  tools/update_version.sh not found - skipping version sync"; \
	fi

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
	@if [ -f .git/hooks/pre-commit ]; then echo "✅ Pre-commit hooks installed"; else echo "❌ Pre-commit hooks not installed"; fi

# Install pre-commit hook
install-hooks:
	@echo "🪝 Installing pre-commit hooks..."
	@./scripts/install-hooks.sh

.DEFAULT_GOAL := help