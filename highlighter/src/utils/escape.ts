/**
 * Utility functions for escaping and sanitizing
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHTML(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'\/]/g, (char) => escapeMap[char]!);
}

/**
 * Unescape HTML entities
 */
export function unescapeHTML(str: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
  };

  return str.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
    (entity) => unescapeMap[entity]!,
  );
}

/**
 * Sanitize input by removing control characters
 */
export function sanitizeInput(input: string, maxSize: number = 10 * 1024 * 1024): string {
  // Check size limit (10MB default)
  if (input.length > maxSize) {
    throw new Error(`Input too large: ${input.length} bytes (max: ${maxSize})`);
  }

  // Remove null bytes and control characters (except tab, newline, carriage return)
  // deno-lint-ignore no-control-regex
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Convert tabs to spaces
 */
export function tabsToSpaces(str: string, tabSize: number = 2): string {
  return str.replace(/\t/g, ' '.repeat(tabSize));
}

/**
 * Normalize line endings to \n
 */
export function normalizeLineEndings(str: string): string {
  return str.replace(/\r\n|\r/g, '\n');
}
