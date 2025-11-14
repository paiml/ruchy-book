# Chapter 21 - MCP Examples (Feature Flag Required)

## Status: Requires MCP Feature Flag

The `ruchy mcp` command requires compilation with the `mcp` feature flag:

```bash
cargo build --features mcp
```

Current ruchy build does not have MCP enabled, so these examples are documented but not executable.

## Expected Behavior (When MCP is Enabled)

### Test 1: Basic MCP Server
```bash
$ ruchy mcp
🚀 Ruchy MCP Server started
📡 Listening on: stdio
🔧 Quality threshold: 0.8
⚡ Streaming: disabled
```

### Test 2: MCP with Custom Configuration
```bash
$ ruchy mcp --name my-project-quality \
           --min-score 0.9 \
           --max-complexity 10 \
           --streaming \
           --verbose
🚀 Ruchy MCP Server: my-project-quality
📊 Min quality score: 0.9
🔧 Max complexity: 10
⚡ Streaming updates: enabled
📡 Ready for connections
```

### Test 3: VS Code Integration
See chapter documentation for IDE integration examples.

## Documentation Reference

Full MCP documentation is available in:
- Chapter 14: Part 3 - Real-Time Quality Monitoring with MCP
- Chapter 21: Part 3 - Real-Time Quality Monitoring with MCP

## Next Steps

When MCP feature is enabled in official releases, these examples can be validated with EXTREME TDD methodology.
