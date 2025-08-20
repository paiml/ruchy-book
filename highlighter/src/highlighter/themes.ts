/**
 * Theme management system for Ruchy syntax highlighter
 * Provides built-in themes and custom theme support
 */

export interface Color {
  hex: string;
  rgb?: [number, number, number];
  hsl?: [number, number, number];
}

export interface ColorScheme {
  // Base colors
  background: string;
  foreground: string;
  selection: string;
  cursor: string;
  lineNumber?: string;

  // Syntax colors
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  variable: string;
  type: string;
  operator: string;
  punctuation?: string;
  constant?: string;

  // Semantic colors
  deprecated?: string;
  error: string;
  warning?: string;
  info?: string;
  success?: string;
}

export interface FontStyles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface Theme {
  name: string;
  type: 'light' | 'dark';
  colors: ColorScheme;
  fontStyles?: FontStyles;
  metadata?: {
    author?: string;
    description?: string;
    version?: string;
  };
}

// Built-in themes
const RUCHY_DARK_THEME: Theme = {
  name: 'ruchy-dark',
  type: 'dark',
  colors: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    selection: '#264f78',
    cursor: '#aeafad',
    lineNumber: '#858585',

    keyword: '#569cd6',
    string: '#ce9178',
    number: '#b5cea8',
    comment: '#6a9955',
    function: '#dcdcaa',
    variable: '#9cdcfe',
    type: '#4ec9b0',
    operator: '#d4d4d4',
    punctuation: '#808080',
    constant: '#4fc1ff',

    error: '#f48771',
    warning: '#cca700',
    info: '#75beff',
    success: '#89d185',
  },
  fontStyles: {
    bold: true,
    italic: true,
  },
};

const RUCHY_LIGHT_THEME: Theme = {
  name: 'ruchy-light',
  type: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    selection: '#add6ff',
    cursor: '#000000',
    lineNumber: '#6e7681',

    keyword: '#0000ff',
    string: '#a31515',
    number: '#098658',
    comment: '#008000',
    function: '#795e26',
    variable: '#001080',
    type: '#267f99',
    operator: '#000000',
    punctuation: '#000000',
    constant: '#0070c1',

    error: '#cd3131',
    warning: '#e9a700',
    info: '#0078d4',
    success: '#00bc00',
  },
  fontStyles: {
    bold: true,
    italic: true,
  },
};

const MONOKAI_THEME: Theme = {
  name: 'monokai',
  type: 'dark',
  colors: {
    background: '#272822',
    foreground: '#f8f8f2',
    selection: '#49483e',
    cursor: '#f8f8f0',
    lineNumber: '#75715e',

    keyword: '#f92672',
    string: '#e6db74',
    number: '#ae81ff',
    comment: '#75715e',
    function: '#a6e22e',
    variable: '#f8f8f2',
    type: '#66d9ef',
    operator: '#f92672',
    punctuation: '#f8f8f2',
    constant: '#ae81ff',

    error: '#f92672',
    warning: '#e6db74',
    info: '#66d9ef',
    success: '#a6e22e',
  },
  fontStyles: {
    italic: true,
  },
};

const GITHUB_THEME: Theme = {
  name: 'github',
  type: 'light',
  colors: {
    background: '#ffffff',
    foreground: '#24292e',
    selection: '#c8c8fa',
    cursor: '#044289',
    lineNumber: '#959da5',

    keyword: '#d73a49',
    string: '#032f62',
    number: '#005cc5',
    comment: '#6a737d',
    function: '#6f42c1',
    variable: '#e36209',
    type: '#005cc5',
    operator: '#d73a49',
    punctuation: '#24292e',
    constant: '#005cc5',

    error: '#cb2431',
    warning: '#f9c513',
    info: '#0366d6',
    success: '#28a745',
  },
};

const DRACULA_THEME: Theme = {
  name: 'dracula',
  type: 'dark',
  colors: {
    background: '#282a36',
    foreground: '#f8f8f2',
    selection: '#44475a',
    cursor: '#f8f8f2',
    lineNumber: '#6272a4',

    keyword: '#ff79c6',
    string: '#f1fa8c',
    number: '#bd93f9',
    comment: '#6272a4',
    function: '#50fa7b',
    variable: '#f8f8f2',
    type: '#8be9fd',
    operator: '#ff79c6',
    punctuation: '#f8f8f2',
    constant: '#bd93f9',

    error: '#ff5555',
    warning: '#ffb86c',
    info: '#8be9fd',
    success: '#50fa7b',
  },
  fontStyles: {
    italic: true,
  },
};

export class ThemeManager {
  private themes: Map<string, Theme>;

  constructor() {
    this.themes = new Map();

    // Register built-in themes
    this.registerTheme(RUCHY_DARK_THEME);
    this.registerTheme(RUCHY_LIGHT_THEME);
    this.registerTheme(MONOKAI_THEME);
    this.registerTheme(GITHUB_THEME);
    this.registerTheme(DRACULA_THEME);
  }

  /**
   * Register a new theme
   */
  registerTheme(theme: Theme): void {
    this.validateTheme(theme);
    this.themes.set(theme.name, theme);
  }

  /**
   * Get a theme by name
   */
  getTheme(nameOrTheme: string | Theme): Theme {
    if (typeof nameOrTheme !== 'string') {
      return nameOrTheme;
    }

    const theme = this.themes.get(nameOrTheme);
    if (!theme) {
      // Default to dark theme if not found
      console.warn(`Theme '${nameOrTheme}' not found, using default dark theme`);
      return this.themes.get('ruchy-dark')!;
    }
    return theme;
  }

  /**
   * Get all theme names
   */
  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get all themes
   */
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Remove a theme
   */
  removeTheme(name: string): boolean {
    // Don't allow removing built-in themes
    const builtInThemes = ['ruchy-dark', 'ruchy-light', 'monokai', 'github', 'dracula'];
    if (builtInThemes.includes(name)) {
      throw new Error(`Cannot remove built-in theme '${name}'`);
    }
    return this.themes.delete(name);
  }

  /**
   * Check if a theme exists
   */
  hasTheme(name: string): boolean {
    return this.themes.has(name);
  }

  /**
   * Create a theme from a partial definition
   */
  createTheme(
    name: string,
    type: 'light' | 'dark',
    colors: Partial<ColorScheme>,
  ): Theme {
    const baseTheme = type === 'dark' ? RUCHY_DARK_THEME : RUCHY_LIGHT_THEME;

    return {
      name,
      type,
      colors: {
        ...baseTheme.colors,
        ...colors,
      } as ColorScheme,
      ...(baseTheme.fontStyles ? { fontStyles: baseTheme.fontStyles } : {}),
    };
  }

  /**
   * Validate theme has all required colors
   */
  private validateTheme(theme: Theme): void {
    const required: (keyof ColorScheme)[] = [
      'background',
      'foreground',
      'selection',
      'cursor',
      'keyword',
      'string',
      'number',
      'comment',
      'function',
      'variable',
      'type',
      'operator',
      'error',
    ];

    for (const key of required) {
      if (!theme.colors[key]) {
        throw new Error(`Theme '${theme.name}' missing required color: ${key}`);
      }
    }

    // Validate color format (basic hex validation)
    for (const [key, value] of Object.entries(theme.colors)) {
      if (value && typeof value === 'string') {
        if (!this.isValidColor(value)) {
          throw new Error(`Theme '${theme.name}' has invalid color for ${key}: ${value}`);
        }
      }
    }
  }

  /**
   * Check if a color string is valid
   */
  private isValidColor(color: string): boolean {
    // Support hex colors and named colors
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;

    return (
      hexPattern.test(color) ||
      rgbPattern.test(color) ||
      rgbaPattern.test(color) ||
      this.isNamedColor(color)
    );
  }

  /**
   * Check if a color is a valid CSS named color
   */
  private isNamedColor(color: string): boolean {
    // Basic list of CSS named colors
    const namedColors = [
      'black',
      'white',
      'red',
      'green',
      'blue',
      'yellow',
      'cyan',
      'magenta',
      'gray',
      'grey',
      'orange',
      'purple',
      'brown',
      'pink',
      'lime',
      'navy',
      'teal',
      'silver',
    ];
    return namedColors.includes(color.toLowerCase());
  }

  /**
   * Export theme as JSON
   */
  exportTheme(name: string): string {
    const theme = this.getTheme(name);
    return JSON.stringify(theme, null, 2);
  }

  /**
   * Import theme from JSON
   */
  importTheme(json: string): Theme {
    const theme = JSON.parse(json) as Theme;
    this.validateTheme(theme);
    this.registerTheme(theme);
    return theme;
  }

  /**
   * Check color contrast for accessibility (WCAG AAA)
   */
  checkContrast(foreground: string, background: string): number {
    // Convert hex to RGB
    const fg = this.hexToRgb(foreground);
    const bg = this.hexToRgb(background);

    if (!fg || !bg) return 0;

    // Calculate relative luminance
    const lum1 = this.getLuminance(fg);
    const lum2 = this.getLuminance(bg);

    // Calculate contrast ratio
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  private hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
        parseInt(result[1]!, 16),
        parseInt(result[2]!, 16),
        parseInt(result[3]!, 16),
      ]
      : null;
  }

  private getLuminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb.map((val) => {
      const s = val / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  }
}
