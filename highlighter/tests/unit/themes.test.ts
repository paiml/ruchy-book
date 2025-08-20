/**
 * Unit tests for theme management
 */

import { assertEquals, assertThrows, assertExists } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { ThemeManager } from '../../src/highlighter/themes.ts';
import type { Theme } from '../../src/highlighter/themes.ts';

Deno.test('ThemeManager: has built-in themes', () => {
  const manager = new ThemeManager();
  
  const builtInThemes = [
    'ruchy-dark',
    'ruchy-light',
    'monokai',
    'github',
    'dracula'
  ];
  
  for (const themeName of builtInThemes) {
    assertEquals(manager.hasTheme(themeName), true);
  }
});

Deno.test('ThemeManager: gets theme by name', () => {
  const manager = new ThemeManager();
  const theme = manager.getTheme('monokai');
  
  assertEquals(theme.name, 'monokai');
  assertEquals(theme.type, 'dark');
  assertExists(theme.colors);
});

Deno.test('ThemeManager: returns default theme for unknown name', () => {
  const manager = new ThemeManager();
  const theme = manager.getTheme('non-existent-theme');
  
  // Should return default dark theme
  assertEquals(theme.name, 'ruchy-dark');
});

Deno.test('ThemeManager: accepts theme object directly', () => {
  const manager = new ThemeManager();
  const customTheme: Theme = {
    name: 'custom',
    type: 'light',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      selection: '#add6ff',
      cursor: '#000000',
      keyword: '#0000ff',
      string: '#a31515',
      number: '#098658',
      comment: '#008000',
      function: '#795e26',
      variable: '#001080',
      type: '#267f99',
      operator: '#000000',
      error: '#cd3131',
    },
  };
  
  const theme = manager.getTheme(customTheme);
  assertEquals(theme.name, 'custom');
});

Deno.test('ThemeManager: registers custom theme', () => {
  const manager = new ThemeManager();
  
  const customTheme: Theme = {
    name: 'my-theme',
    type: 'dark',
    colors: {
      background: '#1a1a1a',
      foreground: '#e0e0e0',
      selection: '#3a3a3a',
      cursor: '#ffffff',
      keyword: '#ff6b6b',
      string: '#4ecdc4',
      number: '#f7b731',
      comment: '#95a99c',
      function: '#a8e6cf',
      variable: '#ffd3b6',
      type: '#ffaaa5',
      operator: '#ff8b94',
      error: '#ff0000',
    },
  };
  
  manager.registerTheme(customTheme);
  assertEquals(manager.hasTheme('my-theme'), true);
  
  const retrieved = manager.getTheme('my-theme');
  assertEquals(retrieved.name, 'my-theme');
});

Deno.test('ThemeManager: validates theme colors', () => {
  const manager = new ThemeManager();
  
  const invalidTheme: Theme = {
    name: 'invalid',
    type: 'dark',
    colors: {
      background: '#1a1a1a',
      foreground: '#e0e0e0',
      selection: '#3a3a3a',
      cursor: '#ffffff',
      keyword: 'not-a-color', // Invalid color
      string: '#4ecdc4',
      number: '#f7b731',
      comment: '#95a99c',
      function: '#a8e6cf',
      variable: '#ffd3b6',
      type: '#ffaaa5',
      operator: '#ff8b94',
      error: '#ff0000',
    },
  };
  
  assertThrows(
    () => manager.registerTheme(invalidTheme),
    Error,
    'invalid color'
  );
});

Deno.test('ThemeManager: validates required colors', () => {
  const manager = new ThemeManager();
  
  const incompleteTheme = {
    name: 'incomplete',
    type: 'dark',
    colors: {
      background: '#1a1a1a',
      foreground: '#e0e0e0',
      // Missing required colors
    },
  } as Theme;
  
  assertThrows(
    () => manager.registerTheme(incompleteTheme),
    Error,
    'missing required color'
  );
});

Deno.test('ThemeManager: gets all theme names', () => {
  const manager = new ThemeManager();
  const names = manager.getThemeNames();
  
  assertEquals(names.includes('ruchy-dark'), true);
  assertEquals(names.includes('ruchy-light'), true);
  assertEquals(names.includes('monokai'), true);
  assertEquals(names.includes('github'), true);
  assertEquals(names.includes('dracula'), true);
  assertEquals(names.length >= 5, true);
});

Deno.test('ThemeManager: gets all themes', () => {
  const manager = new ThemeManager();
  const themes = manager.getAllThemes();
  
  assertEquals(themes.length >= 5, true);
  
  for (const theme of themes) {
    assertExists(theme.name);
    assertExists(theme.type);
    assertExists(theme.colors);
  }
});

Deno.test('ThemeManager: prevents removing built-in themes', () => {
  const manager = new ThemeManager();
  
  assertThrows(
    () => manager.removeTheme('ruchy-dark'),
    Error,
    'Cannot remove built-in theme'
  );
  
  assertThrows(
    () => manager.removeTheme('monokai'),
    Error,
    'Cannot remove built-in theme'
  );
});

Deno.test('ThemeManager: removes custom themes', () => {
  const manager = new ThemeManager();
  
  const customTheme: Theme = {
    name: 'removable',
    type: 'dark',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      selection: '#333333',
      cursor: '#ffffff',
      keyword: '#ff0000',
      string: '#00ff00',
      number: '#0000ff',
      comment: '#888888',
      function: '#ffff00',
      variable: '#ff00ff',
      type: '#00ffff',
      operator: '#ffffff',
      error: '#ff0000',
    },
  };
  
  manager.registerTheme(customTheme);
  assertEquals(manager.hasTheme('removable'), true);
  
  const removed = manager.removeTheme('removable');
  assertEquals(removed, true);
  assertEquals(manager.hasTheme('removable'), false);
});

Deno.test('ThemeManager: creates theme from partial', () => {
  const manager = new ThemeManager();
  
  const theme = manager.createTheme('partial', 'dark', {
    keyword: '#ff00ff',
    string: '#00ff00',
  });
  
  assertEquals(theme.name, 'partial');
  assertEquals(theme.type, 'dark');
  assertEquals(theme.colors.keyword, '#ff00ff');
  assertEquals(theme.colors.string, '#00ff00');
  
  // Should have other colors from base theme
  assertExists(theme.colors.background);
  assertExists(theme.colors.foreground);
  assertExists(theme.colors.comment);
});

Deno.test('ThemeManager: exports theme as JSON', () => {
  const manager = new ThemeManager();
  const json = manager.exportTheme('monokai');
  
  const parsed = JSON.parse(json);
  assertEquals(parsed.name, 'monokai');
  assertEquals(parsed.type, 'dark');
  assertExists(parsed.colors);
});

Deno.test('ThemeManager: imports theme from JSON', () => {
  const manager = new ThemeManager();
  
  const themeData = {
    name: 'imported',
    type: 'light',
    colors: {
      background: '#ffffff',
      foreground: '#000000',
      selection: '#add6ff',
      cursor: '#000000',
      keyword: '#0000ff',
      string: '#a31515',
      number: '#098658',
      comment: '#008000',
      function: '#795e26',
      variable: '#001080',
      type: '#267f99',
      operator: '#000000',
      error: '#cd3131',
    },
  };
  
  const json = JSON.stringify(themeData);
  const imported = manager.importTheme(json);
  
  assertEquals(imported.name, 'imported');
  assertEquals(manager.hasTheme('imported'), true);
});

Deno.test('ThemeManager: checks color contrast', () => {
  const manager = new ThemeManager();
  
  // High contrast (black on white)
  const highContrast = manager.checkContrast('#000000', '#ffffff');
  assertEquals(highContrast > 20, true);
  
  // Low contrast (gray on gray)
  const lowContrast = manager.checkContrast('#808080', '#888888');
  assertEquals(lowContrast < 2, true);
  
  // WCAG AAA requires 7:1 for normal text
  const wcagAAA = manager.checkContrast('#595959', '#ffffff');
  assertEquals(wcagAAA >= 7, true);
});

Deno.test('ThemeManager: validates hex colors', () => {
  const manager = new ThemeManager();
  
  const validTheme: Theme = {
    name: 'hex-test',
    type: 'dark',
    colors: {
      background: '#1a1a1a',
      foreground: '#FFF',
      selection: 'rgb(58, 58, 58)',
      cursor: 'rgba(255, 255, 255, 1)',
      keyword: '#ff6b6b',
      string: '#4ecdc4',
      number: '#f7b731',
      comment: '#95a99c',
      function: '#a8e6cf',
      variable: '#ffd3b6',
      type: '#ffaaa5',
      operator: '#ff8b94',
      error: 'red',
    },
  };
  
  // Should accept various color formats
  manager.registerTheme(validTheme);
  assertEquals(manager.hasTheme('hex-test'), true);
});

Deno.test('ThemeManager: handles theme metadata', () => {
  const manager = new ThemeManager();
  
  const themeWithMetadata: Theme = {
    name: 'with-metadata',
    type: 'dark',
    colors: {
      background: '#000000',
      foreground: '#ffffff',
      selection: '#333333',
      cursor: '#ffffff',
      keyword: '#ff0000',
      string: '#00ff00',
      number: '#0000ff',
      comment: '#888888',
      function: '#ffff00',
      variable: '#ff00ff',
      type: '#00ffff',
      operator: '#ffffff',
      error: '#ff0000',
    },
    metadata: {
      author: 'Test Author',
      description: 'A test theme',
      version: '1.0.0',
    },
  };
  
  manager.registerTheme(themeWithMetadata);
  const retrieved = manager.getTheme('with-metadata');
  
  assertEquals(retrieved.metadata?.author, 'Test Author');
  assertEquals(retrieved.metadata?.description, 'A test theme');
  assertEquals(retrieved.metadata?.version, '1.0.0');
});