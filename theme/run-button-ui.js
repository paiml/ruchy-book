/**
 * Run Button UI for Interactive Ruchy Code Blocks
 *
 * EXTREME TDD: Implemented to pass E2E tests
 * Tests: tests/e2e/ruchy-ch01-run-button.spec.ts (10 tests)
 *
 * Ticket: SPRINT1-002 - Add "Run" Button UI to Code Blocks
 */

(function () {
    'use strict';

    // Global WASM runner instance (shared across all code blocks)
    let globalRunner = null;

    /**
     * Initialize WASM runner (once per page load)
     */
    async function ensureRunnerInitialized() {
        if (globalRunner && globalRunner.isReady()) {
            return globalRunner;
        }

        if (!window.RuchyInteractiveRunner) {
            throw new Error('RuchyInteractiveRunner not loaded. Ensure ruchy-interactive-runner.js is included.');
        }

        // Create and initialize runner
        globalRunner = new window.RuchyInteractiveRunner();
        await globalRunner.initialize();

        console.log('✅ Ruchy WASM runner initialized');
        return globalRunner;
    }

    /**
     * Add Run button and output area to a Ruchy code block
     *
     * Tested by E2E tests:
     * - should display Run button on Ruchy code blocks
     * - should add Run button to all Ruchy code blocks
     * - should have hidden output area initially
     */
    function addRunButtonToCodeBlock(codeBlock) {
        // Skip if already enhanced
        if (codeBlock.parentElement.querySelector('.ruchy-run-button')) {
            return;
        }

        const pre = codeBlock.parentElement;
        if (!pre || pre.tagName !== 'PRE') return;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'ruchy-button-container';

        // Create Run button
        const runButton = document.createElement('button');
        runButton.className = 'ruchy-run-button';
        runButton.innerHTML = '▶ Run';
        runButton.setAttribute('aria-label', 'Run Ruby code');
        runButton.setAttribute('tabindex', '0');

        buttonContainer.appendChild(runButton);

        // Create output area (initially hidden)
        const outputArea = document.createElement('div');
        outputArea.className = 'ruchy-output';
        outputArea.style.display = 'none'; // Initially hidden

        // Output content
        const outputContent = document.createElement('div');
        outputContent.className = 'ruchy-output-content';

        // Clear button
        const clearButton = document.createElement('button');
        clearButton.className = 'ruchy-clear-button';
        clearButton.innerHTML = '✕ Clear';
        clearButton.setAttribute('aria-label', 'Clear output');

        outputArea.appendChild(outputContent);
        outputArea.appendChild(clearButton);

        // Insert after the pre element
        pre.parentElement.insertBefore(buttonContainer, pre.nextSibling);
        pre.parentElement.insertBefore(outputArea, buttonContainer.nextSibling);

        // Add click handler
        runButton.addEventListener('click', async () => {
            await handleRunClick(runButton, codeBlock, outputArea, outputContent);
        });

        // Add clear handler
        clearButton.addEventListener('click', () => {
            outputArea.style.display = 'none';
            outputContent.textContent = '';
        });

        // Keyboard support (Enter/Space)
        runButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                runButton.click();
            }
        });
    }

    /**
     * Handle Run button click
     *
     * Tested by E2E tests:
     * - should show loading spinner when Run button clicked
     * - should show output area after Run button clicked
     */
    async function handleRunClick(button, codeBlock, outputArea, outputContent) {
        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '⏳ Running...';
        button.classList.add('loading');
        button.disabled = true;

        try {
            // Get code
            const code = codeBlock.textContent;

            // Show output area immediately
            outputArea.style.display = 'block';
            outputContent.textContent = 'Initializing WASM...';

            console.log('[Ruchy] Starting code execution...');

            // Initialize WASM runner (lazy initialization)
            console.log('[Ruchy] Initializing runner...');
            const runner = await ensureRunnerInitialized();
            console.log('[Ruchy] Runner initialized successfully');

            // Execute code
            outputContent.textContent = 'Executing...';
            console.log('[Ruchy] Executing code:', code.substring(0, 50));
            const result = await runner.runCode(code);
            console.log('[Ruchy] Execution complete:', result);

            // Display result
            if (result.error) {
                outputContent.textContent = `Error: ${result.error}`;
                outputContent.classList.add('error');
            } else {
                outputContent.textContent = result.output || '(no output)';
                outputContent.classList.remove('error');
            }
            console.log('[Ruchy] Result displayed');
        } catch (error) {
            console.error('[Ruchy] Error during execution:', error);
            outputContent.textContent = `Error: ${error.message}`;
            outputContent.classList.add('error');
        } finally {
            // Restore button state
            button.innerHTML = originalText;
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Enhance all Ruchy code blocks on the page
     */
    function enhanceRuchyCodeBlocks() {
        const ruchyBlocks = document.querySelectorAll('code.language-ruchy');

        ruchyBlocks.forEach((codeBlock) => {
            addRunButtonToCodeBlock(codeBlock);
        });

        console.log(`✅ Enhanced ${ruchyBlocks.length} Ruchy code blocks with Run buttons`);
    }

    /**
     * Initialize when DOM is ready
     */
    function initialize() {
        enhanceRuchyCodeBlocks();

        // Re-enhance when new content is loaded
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length > 0) {
                    enhanceRuchyCodeBlocks();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Export for testing
    if (typeof window !== 'undefined') {
        window.RuchyRunButtonUI = {
            addRunButtonToCodeBlock,
            enhanceRuchyCodeBlocks,
        };
    }
})();
