#!/usr/bin/env -S ../bashrs/target/release/bashrs
# Mark all non-working chapters as "NOT IMPLEMENTED"

set -e

echo "🔄 Marking unimplemented chapters..."

# Function to add NOT IMPLEMENTED banner to a chapter
mark_chapter_unimplemented() {
    local file=$1
    local feature=$2
    local target_version=$3
    
    echo "  Updating $(basename $file)..."
    
    # Create a temporary file with the new content
    cat > /tmp/chapter_header.md << EOF
# $(grep '^# ' "$file" | head -1 | sed 's/^# //')

<!-- DOC_STATUS_START -->
**Chapter Status**: 🚧 NOT IMPLEMENTED - Future Feature

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | No support yet |
| ⚠️ Not Implemented | All | Entire feature planned |
| ❌ Broken | 0 | N/A |
| 📋 Planned | All | Target: $target_version |

*Last updated: $(date +%Y-%m-%d)*  
*Ruchy version: ruchy 1.9.1*
<!-- DOC_STATUS_END -->

## ⚠️ IMPORTANT: Feature Not Yet Implemented

**$feature is a planned feature for Ruchy $target_version**. This chapter describes the intended design but **none of these examples currently work**.

## What You Can Do Today

Instead of waiting for this feature, you can:
- Use the working features documented in TDD chapters
- Contribute to the implementation at [github.com/paiml/ruchy](https://github.com/paiml/ruchy)
- See the [roadmap](../appendix-roadmap.md) for timeline

## Original Content (For Reference Only)

⚠️ The content below is aspirational and does not work in current Ruchy:

---

EOF
    
    # Get the content after the status block
    sed -n '/<!-- DOC_STATUS_END -->/,$p' "$file" | tail -n +2 >> /tmp/chapter_header.md
    
    # Replace the file
    mv /tmp/chapter_header.md "$file"
}

# Chapters with 0% working that need to be marked
echo "📝 Processing chapters with 0% success rate..."

# Performance Optimization
mark_chapter_unimplemented \
    "src/ch10-00-performance-optimization.md" \
    "Performance optimization and profiling" \
    "v2.5+"

# Advanced Patterns  
mark_chapter_unimplemented \
    "src/ch11-00-advanced-patterns.md" \
    "Advanced programming patterns" \
    "v3.0+"

# Error Handling (non-TDD version)
mark_chapter_unimplemented \
    "src/ch13-00-error-handling.md" \
    "Advanced error handling with Result/Option types" \
    "v2.0+"

# Testing & Quality
mark_chapter_unimplemented \
    "src/ch16-00-testing-quality.md" \
    "Advanced testing and quality tools" \
    "v2.5+"

# Documentation
mark_chapter_unimplemented \
    "src/ch17-00-documentation.md" \
    "Documentation generation tools" \
    "v2.0+"

# Deployment & DevOps
mark_chapter_unimplemented \
    "src/ch18-00-deployment-devops.md" \
    "Deployment and DevOps integration" \
    "v3.0+"

# Real World Projects
mark_chapter_unimplemented \
    "src/ch19-00-real-world-projects.md" \
    "Complete real-world applications" \
    "v2.5+"

# Tooling (non-TDD version)
mark_chapter_unimplemented \
    "src/ch20-00-tooling.md" \
    "Advanced developer tooling" \
    "v2.0+"

# Network Programming
mark_chapter_unimplemented \
    "src/ch09-00-network-programming.md" \
    "Network programming and web services" \
    "v3.0+"

# Systems Programming
mark_chapter_unimplemented \
    "src/ch08-00-systems-programming.md" \
    "Systems programming and OS integration" \
    "v3.0+"

# Building Applications
mark_chapter_unimplemented \
    "src/ch07-00-building-applications.md" \
    "Building complete applications" \
    "v2.0+"

# File Operations (non-TDD version)
mark_chapter_unimplemented \
    "src/ch06-00-file-operations.md" \
    "Advanced file operations" \
    "v2.0+"

# Data Processing
mark_chapter_unimplemented \
    "src/ch05-00-data-processing.md" \
    "Data processing and pipelines" \
    "v2.5+"

# Traits & Generics
mark_chapter_unimplemented \
    "src/ch12-00-traits-generics.md" \
    "Traits and generic programming" \
    "v2.5+"

echo "✅ Marked all unimplemented chapters"
echo ""
echo "📊 Summary:"
echo "  - 14 chapters marked as NOT IMPLEMENTED"
echo "  - Clear warnings added to prevent confusion"
echo "  - Timeline expectations set for each feature"