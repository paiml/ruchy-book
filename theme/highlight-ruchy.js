/*
 * Ruchy Language Definition for highlight.js
 * Based on Ruchy Grammar Specification v4.0
 * Author: PAIML Team
 * Category: system
 */

(function(hljs) {
  const RUCHY_KEYWORDS = {
    keyword: 'actor as async await break const continue defer else enum ' +
             'for fun guard if impl import in let loop match mod mut ' +
             'pub return self Self static struct super trait type use ' +
             'where while',
    literal: 'true false',
    built_in: 'Result Option Vec HashMap String'
  };

  const RUCHY_TYPES = {
    className: 'type',
    begin: '\\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\\b'
  };

  const RUCHY_NUMBERS = {
    className: 'number',
    variants: [
      { begin: '\\b0b[01_]+' },           // Binary
      { begin: '\\b0o[0-7_]+' },          // Octal  
      { begin: '\\b0x[0-9a-fA-F_]+' },    // Hex
      { begin: '\\b[0-9][0-9_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?' } // Decimal/Float
    ],
    relevance: 0
  };

  const RUCHY_STRING = {
    className: 'string',
    variants: [
      // Regular string
      {
        begin: '"',
        end: '"',
        contains: [
          {
            className: 'subst',
            begin: '\\\\.',
            relevance: 0
          }
        ]
      },
      // Interpolated string
      {
        begin: 'f"',
        end: '"',
        contains: [
          {
            className: 'subst',
            begin: '\\\\.',
            relevance: 0
          },
          {
            className: 'subst',
            begin: '\\{',
            end: '\\}',
            contains: ['self'] // Allows nested expressions
          }
        ]
      },
      // Character literal
      {
        begin: "'",
        end: "'",
        contains: [
          {
            className: 'subst',
            begin: '\\\\.',
            relevance: 0
          }
        ]
      }
    ]
  };

  const RUCHY_FUNCTION = {
    className: 'function',
    beginKeywords: 'fun',
    end: '\\{|;',
    excludeEnd: true,
    contains: [
      {
        className: 'title',
        begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*',
        relevance: 0
      },
      {
        className: 'params',
        begin: '\\(',
        end: '\\)',
        excludeBegin: true,
        excludeEnd: true,
        contains: [
          'self',
          RUCHY_TYPES,
          {
            className: 'variable',
            begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*\\b'
          }
        ]
      },
      {
        begin: '->',
        end: '\\s*(?:\\{|where|$)',
        excludeEnd: true,
        contains: [RUCHY_TYPES, 'self']
      }
    ]
  };

  const RUCHY_STRUCT = {
    className: 'class',
    beginKeywords: 'struct enum trait',
    end: '\\{',
    excludeEnd: true,
    contains: [
      {
        className: 'title',
        begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*',
        relevance: 0
      },
      {
        begin: '<',
        end: '>',
        contains: ['self', RUCHY_TYPES]
      }
    ]
  };

  const RUCHY_IMPL = {
    className: 'class',
    beginKeywords: 'impl',
    end: '\\{',
    excludeEnd: true,
    contains: [
      RUCHY_TYPES,
      {
        className: 'title',
        begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*',
        relevance: 0
      },
      {
        begin: 'for',
        end: '(?=\\{)',
        keywords: 'for',
        contains: [RUCHY_TYPES, 'self']
      }
    ]
  };

  const RUCHY_ATTRIBUTE = {
    className: 'meta',
    begin: '#\\[',
    end: '\\]',
    contains: [
      {
        className: 'meta-string',
        begin: '"',
        end: '"'
      }
    ]
  };

  const RUCHY_LIFETIME = {
    className: 'symbol',
    begin: "'[a-zA-Z_][a-zA-Z0-9_]*"
  };

  const RUCHY_MACRO = {
    className: 'meta',
    begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*!',
    end: '(?=\\(|\\{|\\[)',
    relevance: 0
  };

  return {
    name: 'Ruchy',
    aliases: ['ruc'],
    keywords: RUCHY_KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      RUCHY_STRING,
      RUCHY_NUMBERS,
      RUCHY_FUNCTION,
      RUCHY_STRUCT,
      RUCHY_IMPL,
      RUCHY_ATTRIBUTE,
      RUCHY_LIFETIME,
      RUCHY_MACRO,
      RUCHY_TYPES,
      {
        className: 'variable',
        begin: '\\b[a-zA-Z_][a-zA-Z0-9_]*\\b::',
        relevance: 0
      },
      {
        className: 'operator',
        begin: '(->|=>|::|\\.\\.\\.|\\.\\.=?|[+\\-*/%]=?|[=!<>]=?|&&?|\\|\\|?|\\^|<<|>>)',
        relevance: 0
      }
    ]
  };
})(hljs);

// Register the language with highlight.js
if (typeof hljs !== 'undefined') {
  hljs.registerLanguage('ruchy', function() {
    return {
      name: 'Ruchy',
      aliases: ['ruc'],
      keywords: {
        keyword: 'actor as async await break const continue defer else enum ' +
                 'for fun guard if impl import in let loop match mod mut ' +
                 'pub return self Self static struct super trait type use ' +
                 'where while',
        literal: 'true false',
        built_in: 'Result Option Vec HashMap String'
      },
      contains: [
        // Comments
        {
          className: 'comment',
          begin: '//',
          end: '$'
        },
        {
          className: 'comment',
          begin: '/\\*',
          end: '\\*/'
        },
        // Strings
        {
          className: 'string',
          begin: 'f"',
          end: '"',
          contains: [
            {
              className: 'subst',
              begin: '\\{',
              end: '\\}'
            }
          ]
        },
        {
          className: 'string',
          begin: '"',
          end: '"',
          contains: [{begin: '\\\\.'}]
        },
        {
          className: 'string',
          begin: "'",
          end: "'",
          contains: [{begin: '\\\\.'}]
        },
        // Numbers
        {
          className: 'number',
          begin: '\\b(0b[01_]+|0o[0-7_]+|0x[0-9a-fA-F_]+|[0-9][0-9_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)\\b'
        },
        // Types
        {
          className: 'type',
          begin: '\\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Result|Option)\\b'
        },
        // Functions
        {
          className: 'function',
          beginKeywords: 'fun',
          end: '\\{',
          excludeEnd: true,
          contains: [
            {
              className: 'title',
              begin: '[a-zA-Z_][a-zA-Z0-9_]*'
            }
          ]
        }
      ]
    };
  });
}