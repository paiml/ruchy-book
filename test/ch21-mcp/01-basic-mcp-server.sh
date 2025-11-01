#!/usr/bin/env bash
# Test 1: Basic MCP server startup
# Verifies that ruchy mcp starts successfully

set -uo pipefail

echo "Test 1: Basic MCP server startup"
echo "================================="

# Start MCP server in background with timeout
timeout 2s ruchy mcp 2>&1 | head -10 &
MCP_PID=$!

# Wait a moment for server to start
sleep 1

# Check if output contains expected startup messages
OUTPUT=$(timeout 2s ruchy mcp 2>&1 | head -4)

if echo "$OUTPUT" | grep -q "Ruchy MCP Server"; then
    echo "✅ PASS: MCP server started successfully"
    echo "Output:"
    echo "$OUTPUT"
    exit 0
else
    echo "❌ FAIL: MCP server did not start correctly"
    echo "Output:"
    echo "$OUTPUT"
    exit 1
fi
