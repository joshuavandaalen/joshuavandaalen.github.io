/**
 * A focused TSX/JSX syntax highlighter.
 *
 * The plan called for Shiki at build time. Once the decision was made to avoid
 * adding a highlighting dependency at all, build-time versus runtime became
 * only a performance question — and for the short snippets on these pages,
 * tokenising costs well under a millisecond. Doing it at runtime keeps the
 * examples as ordinary source strings next to the components they document,
 * rather than coupling them to a generation step.
 *
 * It handles the subset these examples actually use: comments, strings and
 * template literals, JSX tags and attributes, keywords, numbers and
 * punctuation. It is not a parser and does not try to be.
 */

export type TokenKind =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'tag'
  | 'attr'
  | 'punct'
  | 'fn'
  | 'plain';

export interface Token {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'for', 'while', 'new', 'class', 'extends', 'async',
  'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in',
  'of', 'this', 'null', 'undefined', 'true', 'false', 'interface', 'type',
  'implements', 'public', 'private', 'readonly', 'as', 'satisfies', 'void',
]);

const PUNCT = new Set([
  '{', '}', '(', ')', '[', ']', '<', '>', '=', '/', ',', ';', ':', '.', '?',
  '|', '&', '+', '-', '*', '!', '=>', '...',
]);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  // Tracks whether the cursor sits inside a JSX tag, so `foo` reads as an
  // attribute there and as a plain identifier elsewhere.
  let inJsxTag = false;

  const push = (kind: TokenKind, value: string) => {
    if (!value) return;
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.value += value;
    else tokens.push({ kind, value });
  };

  while (i < source.length) {
    const ch = source[i]!;
    const next = source[i + 1];

    // Comments
    if (ch === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      push('comment', source.slice(i, stop));
      i = stop;
      continue;
    }
    if (ch === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      push('comment', source.slice(i, stop));
      i = stop;
      continue;
    }

    // Strings and template literals
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === '\\') {
          j += 2;
          continue;
        }
        if (source[j] === ch) {
          j += 1;
          break;
        }
        j += 1;
      }
      push('string', source.slice(i, j));
      i = j;
      continue;
    }

    // JSX open/close tag names
    if (ch === '<' && /[A-Za-z/]/.test(next ?? '')) {
      let j = i + 1;
      if (source[j] === '/') j += 1;
      const start = j;
      while (j < source.length && /[A-Za-z0-9._]/.test(source[j]!)) j += 1;
      push('punct', source.slice(i, start));
      push('tag', source.slice(start, j));
      inJsxTag = true;
      i = j;
      continue;
    }

    if (ch === '>' || (ch === '/' && next === '>')) {
      push('punct', ch === '/' ? '/>' : '>');
      inJsxTag = false;
      i += ch === '/' ? 2 : 1;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9._a-fA-Fxn]/.test(source[j]!)) j += 1;
      push('number', source.slice(i, j));
      i = j;
      continue;
    }

    // Identifiers
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < source.length && /[A-Za-z0-9_$]/.test(source[j]!)) j += 1;
      const word = source.slice(i, j);

      if (KEYWORDS.has(word)) {
        push('keyword', word);
      } else if (inJsxTag) {
        push('attr', word);
      } else if (source[j] === '(') {
        push('fn', word);
      } else if (/^[A-Z]/.test(word)) {
        push('tag', word);
      } else {
        push('plain', word);
      }
      i = j;
      continue;
    }

    // Punctuation and everything else
    const two = ch + (next ?? '');
    if (PUNCT.has(two)) {
      push('punct', two);
      i += 2;
      continue;
    }
    if (PUNCT.has(ch)) {
      push('punct', ch);
      i += 1;
      continue;
    }

    push('plain', ch);
    i += 1;
  }

  return tokens;
}
