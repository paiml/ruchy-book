/**
 * Ruchy Interactive Code Runner
 *
 * Loads Ruchy WASM module and provides code execution API
 * for interactive book features.
 *
 * EXTREME TDD: Implementation based on passing unit tests
 * Tests: tests/unit/ruchy-interactive-runner.test.ts (13 tests, 100% passing)
 *
 * Usage:
 *   const runner = new RuchyInteractiveRunner();
 *   await runner.initialize();
 *   const result = await runner.runCode('println("Hello")');
 *   console.log(result.output); // "Hello"
 */

class RuchyInteractiveRunner {
    constructor() {
        this.wasmModule = null;
        this.ready = false;
        this.wasmInit = null;
        this.RuchyWasmModule = null;
    }

    /**
     * Initialize WASM module
     *
     * Tested by:
     * - should initialize with mock WASM
     * - should not be ready before initialization
     */
    async initialize() {
        try {
            // Dynamic import of WASM module
            // Use absolute path from page root (not relative to script location)
            const wasmPath = '/ruchy/wasm/pkg/ruchy_wasm.js';
            const wasmModule = await import(wasmPath);

            // Initialize WASM
            this.wasmInit = wasmModule.default;
            this.RuchyWasmModule = wasmModule.RuchyWasmModule;

            await this.wasmInit();

            // Create module instance
            this.wasmModule = new this.RuchyWasmModule();

            this.ready = true;

            console.log('✅ Ruchy WASM initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Ruchy WASM:', error);
            throw new Error(`WASM initialization failed: ${error.message}`);
        }
    }

    /**
     * Execute Ruby code
     *
     * @param {string} code - Ruby code to execute
     * @returns {Promise<{output: string, error?: string}>}
     *
     * Tested by:
     * - should execute hello world
     * - should execute println with multiple args
     * - should execute arithmetic
     * - should handle syntax errors
     * - should handle runtime errors
     * - should throw if run before initialization
     */
    async runCode(code) {
        if (!this.ready) {
            throw new Error('Runner not initialized. Call initialize() first.');
        }

        try {
            // Execute code via WASM
            const output = this.wasmModule.eval(code);

            return { output, error: undefined };
        } catch (error) {
            // Extract error message
            const errorMessage = error.message || String(error);

            return {
                output: '',
                error: errorMessage,
            };
        }
    }

    /**
     * Check if runner is ready
     *
     * Tested by:
     * - should not be ready before initialization
     * - should initialize with mock WASM
     * - should reset state
     */
    isReady() {
        return this.ready;
    }

    /**
     * Reset runner state
     *
     * Tested by:
     * - should reset state
     */
    reset() {
        this.ready = false;
        this.wasmModule = null;
        this.wasmInit = null;
        this.RuchyWasmModule = null;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.RuchyInteractiveRunner = RuchyInteractiveRunner;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RuchyInteractiveRunner;
}
