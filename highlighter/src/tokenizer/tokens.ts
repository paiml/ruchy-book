/**
 * Token definitions for Ruchy syntax highlighter
 * Based on the 37 keywords and language specification
 */

export enum TokenType {
  // Keywords - Control Flow
  KEYWORD_IF = 'keyword.control.if',
  KEYWORD_ELSE = 'keyword.control.else',
  KEYWORD_FOR = 'keyword.control.for',
  KEYWORD_WHILE = 'keyword.control.while',
  KEYWORD_LOOP = 'keyword.control.loop',
  KEYWORD_BREAK = 'keyword.control.break',
  KEYWORD_CONTINUE = 'keyword.control.continue',
  KEYWORD_RETURN = 'keyword.control.return',
  KEYWORD_MATCH = 'keyword.control.match',

  // Keywords - Declarations
  KEYWORD_FN = 'keyword.declaration.function',
  KEYWORD_LET = 'keyword.declaration.let',
  KEYWORD_CONST = 'keyword.declaration.const',
  KEYWORD_VAR = 'keyword.declaration.var',
  KEYWORD_STRUCT = 'keyword.declaration.struct',
  KEYWORD_ENUM = 'keyword.declaration.enum',
  KEYWORD_TRAIT = 'keyword.declaration.trait',
  KEYWORD_IMPL = 'keyword.declaration.impl',
  KEYWORD_TYPE = 'keyword.declaration.type',

  // Keywords - Modifiers
  KEYWORD_PUB = 'keyword.modifier.pub',
  KEYWORD_PRIV = 'keyword.modifier.priv',
  KEYWORD_MUT = 'keyword.modifier.mut',
  KEYWORD_STATIC = 'keyword.modifier.static',
  KEYWORD_ASYNC = 'keyword.modifier.async',
  KEYWORD_AWAIT = 'keyword.modifier.await',

  // Keywords - Special
  KEYWORD_ACTOR = 'keyword.special.actor',
  KEYWORD_SPAWN = 'keyword.special.spawn',
  KEYWORD_SEND = 'keyword.special.send',
  KEYWORD_RECEIVE = 'keyword.special.receive',
  KEYWORD_USE = 'keyword.special.use',
  KEYWORD_MOD = 'keyword.special.mod',
  KEYWORD_AS = 'keyword.special.as',
  KEYWORD_IN = 'keyword.special.in',
  KEYWORD_WHERE = 'keyword.special.where',
  KEYWORD_SELF = 'keyword.special.self',
  KEYWORD_SUPER = 'keyword.special.super',
  KEYWORD_CRATE = 'keyword.special.crate',
  KEYWORD_UNSAFE = 'keyword.special.unsafe',

  // Literals
  STRING = 'string.quoted.double',
  STRING_SINGLE = 'string.quoted.single',
  STRING_TEMPLATE = 'string.template',
  STRING_RAW = 'string.raw',
  NUMBER_INTEGER = 'constant.numeric.integer',
  NUMBER_FLOAT = 'constant.numeric.float',
  NUMBER_HEX = 'constant.numeric.hex',
  NUMBER_BINARY = 'constant.numeric.binary',
  NUMBER_OCTAL = 'constant.numeric.octal',
  BOOLEAN_TRUE = 'constant.boolean.true',
  BOOLEAN_FALSE = 'constant.boolean.false',
  NULL = 'constant.null',

  // Identifiers
  IDENTIFIER = 'identifier',
  FUNCTION_NAME = 'entity.name.function',
  TYPE_NAME = 'entity.name.type',
  VARIABLE = 'variable',
  PARAMETER = 'variable.parameter',
  PROPERTY = 'variable.property',
  CONSTANT = 'variable.constant',

  // Comments
  COMMENT_LINE = 'comment.line',
  COMMENT_BLOCK = 'comment.block',
  COMMENT_DOC = 'comment.documentation',

  // Operators
  OPERATOR_ARITHMETIC = 'keyword.operator.arithmetic',
  OPERATOR_COMPARISON = 'keyword.operator.comparison',
  OPERATOR_LOGICAL = 'keyword.operator.logical',
  OPERATOR_ASSIGNMENT = 'keyword.operator.assignment',
  OPERATOR_BITWISE = 'keyword.operator.bitwise',
  OPERATOR_RANGE = 'keyword.operator.range',
  OPERATOR_ARROW = 'keyword.operator.arrow',

  // Punctuation
  PUNCTUATION_PAREN_OPEN = 'punctuation.paren.open',
  PUNCTUATION_PAREN_CLOSE = 'punctuation.paren.close',
  PUNCTUATION_BRACKET_OPEN = 'punctuation.bracket.open',
  PUNCTUATION_BRACKET_CLOSE = 'punctuation.bracket.close',
  PUNCTUATION_BRACE_OPEN = 'punctuation.brace.open',
  PUNCTUATION_BRACE_CLOSE = 'punctuation.brace.close',
  PUNCTUATION_SEMICOLON = 'punctuation.terminator.semicolon',
  PUNCTUATION_COMMA = 'punctuation.separator.comma',
  PUNCTUATION_DOT = 'punctuation.accessor.dot',
  PUNCTUATION_COLON = 'punctuation.separator.colon',
  PUNCTUATION_DOUBLE_COLON = 'punctuation.accessor.double-colon',

  // Special
  WHITESPACE = 'whitespace',
  NEWLINE = 'newline',
  EOF = 'eof',
  ERROR = 'error',
}

export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface TokenRange {
  start: Position;
  end: Position;
}

export interface SemanticToken extends Token {
  scope?: 'function' | 'class' | 'module' | 'global';
  definition?: boolean;
  mutable?: boolean;
  async?: boolean;
  deprecated?: boolean;
  builtin?: boolean;
  references?: number[];
}

// Keyword mapping for quick lookup
export const KEYWORDS = new Map<string, TokenType>([
  // Control flow
  ['if', TokenType.KEYWORD_IF],
  ['else', TokenType.KEYWORD_ELSE],
  ['for', TokenType.KEYWORD_FOR],
  ['while', TokenType.KEYWORD_WHILE],
  ['loop', TokenType.KEYWORD_LOOP],
  ['break', TokenType.KEYWORD_BREAK],
  ['continue', TokenType.KEYWORD_CONTINUE],
  ['return', TokenType.KEYWORD_RETURN],
  ['match', TokenType.KEYWORD_MATCH],

  // Declarations
  ['fn', TokenType.KEYWORD_FN],
  ['let', TokenType.KEYWORD_LET],
  ['const', TokenType.KEYWORD_CONST],
  ['var', TokenType.KEYWORD_VAR],
  ['struct', TokenType.KEYWORD_STRUCT],
  ['enum', TokenType.KEYWORD_ENUM],
  ['trait', TokenType.KEYWORD_TRAIT],
  ['impl', TokenType.KEYWORD_IMPL],
  ['type', TokenType.KEYWORD_TYPE],

  // Modifiers
  ['pub', TokenType.KEYWORD_PUB],
  ['priv', TokenType.KEYWORD_PRIV],
  ['mut', TokenType.KEYWORD_MUT],
  ['static', TokenType.KEYWORD_STATIC],
  ['async', TokenType.KEYWORD_ASYNC],
  ['await', TokenType.KEYWORD_AWAIT],

  // Special
  ['actor', TokenType.KEYWORD_ACTOR],
  ['spawn', TokenType.KEYWORD_SPAWN],
  ['send', TokenType.KEYWORD_SEND],
  ['receive', TokenType.KEYWORD_RECEIVE],
  ['use', TokenType.KEYWORD_USE],
  ['mod', TokenType.KEYWORD_MOD],
  ['as', TokenType.KEYWORD_AS],
  ['in', TokenType.KEYWORD_IN],
  ['where', TokenType.KEYWORD_WHERE],
  ['self', TokenType.KEYWORD_SELF],
  ['super', TokenType.KEYWORD_SUPER],
  ['crate', TokenType.KEYWORD_CRATE],
  ['unsafe', TokenType.KEYWORD_UNSAFE],

  // Boolean literals
  ['true', TokenType.BOOLEAN_TRUE],
  ['false', TokenType.BOOLEAN_FALSE],
  ['null', TokenType.NULL],
]);

// Operator patterns for tokenization
export const OPERATORS = new Map<string, TokenType>([
  // Arithmetic
  ['+', TokenType.OPERATOR_ARITHMETIC],
  ['-', TokenType.OPERATOR_ARITHMETIC],
  ['*', TokenType.OPERATOR_ARITHMETIC],
  ['/', TokenType.OPERATOR_ARITHMETIC],
  ['%', TokenType.OPERATOR_ARITHMETIC],
  ['++', TokenType.OPERATOR_ARITHMETIC],
  ['--', TokenType.OPERATOR_ARITHMETIC],

  // Comparison
  ['==', TokenType.OPERATOR_COMPARISON],
  ['!=', TokenType.OPERATOR_COMPARISON],
  ['<', TokenType.OPERATOR_COMPARISON],
  ['>', TokenType.OPERATOR_COMPARISON],
  ['<=', TokenType.OPERATOR_COMPARISON],
  ['>=', TokenType.OPERATOR_COMPARISON],

  // Logical
  ['&&', TokenType.OPERATOR_LOGICAL],
  ['||', TokenType.OPERATOR_LOGICAL],
  ['!', TokenType.OPERATOR_LOGICAL],

  // Assignment
  ['=', TokenType.OPERATOR_ASSIGNMENT],
  ['+=', TokenType.OPERATOR_ASSIGNMENT],
  ['-=', TokenType.OPERATOR_ASSIGNMENT],
  ['*=', TokenType.OPERATOR_ASSIGNMENT],
  ['/=', TokenType.OPERATOR_ASSIGNMENT],
  ['%=', TokenType.OPERATOR_ASSIGNMENT],

  // Bitwise
  ['&', TokenType.OPERATOR_BITWISE],
  ['|', TokenType.OPERATOR_BITWISE],
  ['^', TokenType.OPERATOR_BITWISE],
  ['~', TokenType.OPERATOR_BITWISE],
  ['<<', TokenType.OPERATOR_BITWISE],
  ['>>', TokenType.OPERATOR_BITWISE],

  // Special
  ['..', TokenType.OPERATOR_RANGE],
  ['...', TokenType.OPERATOR_RANGE],
  ['->', TokenType.OPERATOR_ARROW],
  ['=>', TokenType.OPERATOR_ARROW],
]);

// Export token categories for theme application
export const TOKEN_CATEGORIES = {
  keywords: [
    TokenType.KEYWORD_IF,
    TokenType.KEYWORD_ELSE,
    TokenType.KEYWORD_FOR,
    TokenType.KEYWORD_WHILE,
    TokenType.KEYWORD_LOOP,
    TokenType.KEYWORD_BREAK,
    TokenType.KEYWORD_CONTINUE,
    TokenType.KEYWORD_RETURN,
    TokenType.KEYWORD_MATCH,
    TokenType.KEYWORD_FN,
    TokenType.KEYWORD_LET,
    TokenType.KEYWORD_CONST,
    TokenType.KEYWORD_VAR,
    TokenType.KEYWORD_STRUCT,
    TokenType.KEYWORD_ENUM,
    TokenType.KEYWORD_TRAIT,
    TokenType.KEYWORD_IMPL,
    TokenType.KEYWORD_TYPE,
    TokenType.KEYWORD_PUB,
    TokenType.KEYWORD_PRIV,
    TokenType.KEYWORD_MUT,
    TokenType.KEYWORD_STATIC,
    TokenType.KEYWORD_ASYNC,
    TokenType.KEYWORD_AWAIT,
    TokenType.KEYWORD_ACTOR,
    TokenType.KEYWORD_SPAWN,
    TokenType.KEYWORD_SEND,
    TokenType.KEYWORD_RECEIVE,
    TokenType.KEYWORD_USE,
    TokenType.KEYWORD_MOD,
    TokenType.KEYWORD_AS,
    TokenType.KEYWORD_IN,
    TokenType.KEYWORD_WHERE,
    TokenType.KEYWORD_SELF,
    TokenType.KEYWORD_SUPER,
    TokenType.KEYWORD_CRATE,
    TokenType.KEYWORD_UNSAFE,
  ],
  literals: [
    TokenType.STRING,
    TokenType.STRING_SINGLE,
    TokenType.STRING_TEMPLATE,
    TokenType.STRING_RAW,
    TokenType.NUMBER_INTEGER,
    TokenType.NUMBER_FLOAT,
    TokenType.NUMBER_HEX,
    TokenType.NUMBER_BINARY,
    TokenType.NUMBER_OCTAL,
    TokenType.BOOLEAN_TRUE,
    TokenType.BOOLEAN_FALSE,
    TokenType.NULL,
  ],
  identifiers: [
    TokenType.IDENTIFIER,
    TokenType.FUNCTION_NAME,
    TokenType.TYPE_NAME,
    TokenType.VARIABLE,
    TokenType.PARAMETER,
    TokenType.PROPERTY,
    TokenType.CONSTANT,
  ],
  comments: [
    TokenType.COMMENT_LINE,
    TokenType.COMMENT_BLOCK,
    TokenType.COMMENT_DOC,
  ],
  operators: [
    TokenType.OPERATOR_ARITHMETIC,
    TokenType.OPERATOR_COMPARISON,
    TokenType.OPERATOR_LOGICAL,
    TokenType.OPERATOR_ASSIGNMENT,
    TokenType.OPERATOR_BITWISE,
    TokenType.OPERATOR_RANGE,
    TokenType.OPERATOR_ARROW,
  ],
  punctuation: [
    TokenType.PUNCTUATION_PAREN_OPEN,
    TokenType.PUNCTUATION_PAREN_CLOSE,
    TokenType.PUNCTUATION_BRACKET_OPEN,
    TokenType.PUNCTUATION_BRACKET_CLOSE,
    TokenType.PUNCTUATION_BRACE_OPEN,
    TokenType.PUNCTUATION_BRACE_CLOSE,
    TokenType.PUNCTUATION_SEMICOLON,
    TokenType.PUNCTUATION_COMMA,
    TokenType.PUNCTUATION_DOT,
    TokenType.PUNCTUATION_COLON,
    TokenType.PUNCTUATION_DOUBLE_COLON,
  ],
};
