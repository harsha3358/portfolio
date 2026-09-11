export const CODE_COLORS = {
  keyword: "#7aa2f7",
  string: "#e8c893",
  func: "#7ee787",
  default: "#c9c9ce",
  punct: "#8f8f99",
};

const KEYWORDS = new Set(["class", "def", "self", "return"]);
const FUNC_CONTEXT = new Set(["class", "def"]);

export type Token = { text: string; color: string };

const TOKEN_RE = /("(?:[^"\\]|\\.)*")|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g;

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let prevWord = "";
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    const [, str, word, space, punct] = match;
    if (str !== undefined) {
      tokens.push({ text: str, color: CODE_COLORS.string });
      prevWord = "";
    } else if (word !== undefined) {
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, color: CODE_COLORS.keyword });
      } else if (FUNC_CONTEXT.has(prevWord)) {
        tokens.push({ text: word, color: CODE_COLORS.func });
      } else {
        tokens.push({ text: word, color: CODE_COLORS.default });
      }
      prevWord = word;
    } else if (space !== undefined) {
      tokens.push({ text: space, color: CODE_COLORS.default });
    } else if (punct !== undefined) {
      tokens.push({ text: punct, color: CODE_COLORS.punct });
    }
  }
  return tokens;
}

export function tokenizeSource(source: string): Token[][] {
  return source.split("\n").map(tokenizeLine);
}

export function totalChars(lines: Token[][]): number {
  return lines.reduce((sum, line) => sum + line.reduce((s, t) => s + t.text.length, 0), 0);
}

function escapeHTML(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildTypedHTML(lines: Token[][], visibleChars: number, showCursor: boolean): string {
  let remaining = visibleChars;
  const lineHTML: string[] = [];
  let cursorLine = lines.length - 1;
  let cursorPlaced = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (remaining <= 0 && i > 0) {
      lineHTML.push("<div>&nbsp;</div>");
      continue;
    }
    let html = "";
    for (const token of line) {
      if (remaining <= 0) break;
      if (token.text.length <= remaining) {
        html += `<span style="color:${token.color}">${escapeHTML(token.text)}</span>`;
        remaining -= token.text.length;
      } else {
        html += `<span style="color:${token.color}">${escapeHTML(token.text.slice(0, remaining))}</span>`;
        remaining = 0;
      }
    }
    const wasCutoffHere = remaining === 0 && !cursorPlaced;
    if (wasCutoffHere) {
      cursorLine = i;
      cursorPlaced = true;
    }
    if (showCursor && wasCutoffHere) {
      html += `<span class="typing-cursor">▍</span>`;
    }
    lineHTML.push(`<div>${html || (showCursor && cursorLine === i ? "" : "&nbsp;")}</div>`);
  }

  return lineHTML.join("");
}
