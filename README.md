# The Ruchy Programming Language Book

The official book for the [Ruchy programming language](https://github.com/paiml/ruchy) - implementation-first documentation that evolves with the language.

📖 **Read the book**: https://paiml.github.io/ruchy-book/

## About

This book follows Toyota Way principles with implementation-first documentation:
- Every code example compiles with the current Ruchy compiler
- All examples are tested automatically in CI/CD 
- Zero vaporware - only documented features work
- Quality gates ensure consistency and accuracy

## Related Projects

- **[Ruchy Compiler](https://github.com/paiml/ruchy)** - The Ruchy programming language compiler
- **[PMAT](https://github.com/paiml/paiml-mcp-agent-toolkit)** - PAIML's MCP Agent Toolkit
- **[PAIML](https://paiml.com)** - Practical AI for Machine Learning
- **[Rust](https://rust-lang.org)** - The systems programming language that powers Ruchy's backend

## Development

Built with [mdBook](https://rust-lang.github.io/mdBook/) and deployed automatically via GitHub Actions.

### Quick Start

```bash
make serve  # Start local development server
make build  # Build the book
make test   # Run all quality gates
```

### Quality Gates

This project enforces 8 mandatory quality gates following Toyota Way principles:
- SATD detection (TODO/FIXME/HACK)  
- Vaporware documentation prevention
- Placeholder content elimination
- Code example compilation testing
- Broken link detection
- Debug artifact cleanup
- File size monitoring

See `CLAUDE.md` for complete development guide.

## License

MIT License - see [LICENSE](LICENSE) file for details.
