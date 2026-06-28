// VS Code-style editor with real token-based syntax highlighting and
// frame-math typing. Fills its parent container; scenes position it.

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONTS} from './theme';

// ─── Tokenizer ────────────────────────────────────────────────────────────────
// Hand-written, good enough for the fixed lines this video renders. Order
// matters: comments, then strings, then keywords/components/props.

interface Token {
  text: string;
  color: string;
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'const',
  'return',
  'function',
  'async',
  'await',
  'map',
]);

export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /(\/\/.*$)|('[^']*'?|"[^"]*"?)|([A-Za-z_$][\w$]*)|(\d+)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  let prev = '';
  while ((m = re.exec(line)) !== null) {
    const [, comment, str, ident, num, ws, other] = m;
    if (comment) tokens.push({text: comment, color: C.synComment});
    else if (str) tokens.push({text: str, color: C.synString});
    else if (ident) {
      let color: string = C.synPlain;
      if (KEYWORDS.has(ident)) color = C.synKeyword;
      else if (/^[A-Z]/.test(ident)) color = C.synComponent;
      else if (re.lastIndex < line.length && line[re.lastIndex] === '=' && prev !== '')
        color = C.synProp; // JSX prop name
      tokens.push({text: ident, color});
    } else if (num) tokens.push({text: num, color: C.synString});
    else if (ws) tokens.push({text: ws, color: C.synPlain});
    else if (other) tokens.push({text: other, color: C.synPunct});
    if (m[0].trim()) prev = m[0];
  }
  return tokens;
}

// Clip a tokenized line to the first `chars` characters (typing reveal).
function clipTokens(tokens: Token[], chars: number): Token[] {
  const out: Token[] = [];
  let used = 0;
  for (const t of tokens) {
    if (used >= chars) break;
    const take = Math.min(t.text.length, chars - used);
    out.push({text: t.text.slice(0, take), color: t.color});
    used += take;
  }
  return out;
}

// ─── Lines ────────────────────────────────────────────────────────────────────

export interface CodeLine {
  text: string;
  dim?: boolean; // pre-existing code, greyed back
  typeStart?: number; // frame typing begins (chars/frame below)
  paste?: boolean; // whole line lands at typeStart with an emerald sweep
  flashGutter?: boolean; // emerald gutter marker once the line completes
}

const CHARS_PER_FRAME = 2;

export function lineProgress(line: CodeLine, frame: number): number {
  if (line.typeStart === undefined) return line.text.length;
  if (frame < line.typeStart) return 0;
  if (line.paste) return line.text.length;
  return Math.min(line.text.length, Math.floor((frame - line.typeStart) * CHARS_PER_FRAME));
}

export function lineDone(line: CodeLine, frame: number): boolean {
  return lineProgress(line, frame) >= line.text.length && (line.typeStart === undefined || frame >= line.typeStart);
}

// Frame at which a typed line finishes — for sequencing follow-up beats.
export function typeEnd(line: CodeLine): number {
  if (line.typeStart === undefined) return 0;
  if (line.paste) return line.typeStart;
  return line.typeStart + Math.ceil(line.text.length / CHARS_PER_FRAME);
}

// ─── File tree ────────────────────────────────────────────────────────────────

const TREE: Array<{label: string; depth: number; active?: boolean; folder?: boolean}> = [
  {label: 'app', depth: 0, folder: true},
  {label: 'layout.tsx', depth: 1},
  {label: 'page.tsx', depth: 1},
  {label: 'pricing', depth: 1, folder: true},
  {label: 'page.tsx', depth: 2, active: true},
  {label: 'components', depth: 0, folder: true},
  {label: 'public', depth: 0, folder: true},
  {label: 'package.json', depth: 0},
  {label: 'next.config.mjs', depth: 0},
];

// ─── Editor ───────────────────────────────────────────────────────────────────

interface Props {
  lines: CodeLine[];
  showTree?: boolean;
  fontSize?: number;
  fileName?: string;
  chromeOpacity?: number; // morph: lets S3 fade the editor chrome out
  contentOpacity?: number;
}

export const CodeEditor: React.FC<Props> = ({
  lines,
  showTree = true,
  fontSize = 21,
  fileName = 'pricing/page.tsx',
  chromeOpacity = 1,
  contentOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const lineHeight = fontSize * 1.62;

  // The line currently being typed (for the blinking caret).
  let caretLine = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.typeStart !== undefined && frame >= l.typeStart && !l.paste && !lineDone(l, frame)) {
      caretLine = i;
    }
  }
  const caretOn = Math.floor(frame / 16) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: C.edBg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: FONTS.mono,
      }}
    >
      {/* Title bar: traffic lights + tab */}
      <div
        style={{
          height: 52,
          background: C.edChrome,
          borderBottom: `1px solid ${C.edBorder}`,
          display: 'flex',
          alignItems: 'stretch',
          flexShrink: 0,
          opacity: chromeOpacity,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px'}}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <div key={c} style={{width: 13, height: 13, borderRadius: '50%', background: c}} />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 22px',
            background: C.edBg,
            borderRight: `1px solid ${C.edBorder}`,
            borderTop: `2px solid ${C.emerald}`,
            color: C.synPlain,
            fontSize: 15,
          }}
        >
          {fileName}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 22px',
            color: C.edGutter,
            fontSize: 15,
          }}
        >
          layout.tsx
        </div>
      </div>

      <div style={{display: 'flex', flex: 1, minHeight: 0}}>
        {/* File tree */}
        {showTree && (
          <div
            style={{
              width: 248,
              flexShrink: 0,
              background: C.edChrome,
              borderRight: `1px solid ${C.edBorder}`,
              padding: '18px 0',
              fontFamily: FONTS.body,
              fontSize: 15.5,
              opacity: chromeOpacity,
            }}
          >
            <div
              style={{
                padding: '0 20px 12px',
                color: C.edGutter,
                fontSize: 12,
                letterSpacing: '0.12em',
              }}
            >
              FORGE-WEB
            </div>
            {TREE.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: `5px 20px 5px ${20 + item.depth * 18}px`,
                  color: item.active ? C.white : C.dim,
                  background: item.active ? `${C.emerald}14` : 'transparent',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{fontSize: 11, color: C.edGutter}}>{item.folder ? '▾' : '·'}</span>
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* Code area */}
        <div style={{flex: 1, padding: '20px 0', overflow: 'hidden', opacity: contentOpacity}}>
          {lines.map((line, i) => {
            const chars = lineProgress(line, frame);
            if (line.typeStart !== undefined && frame < line.typeStart) {
              return <div key={i} style={{height: lineHeight}} />;
            }
            const tokens = clipTokens(tokenize(line.text), chars);
            const done = lineDone(line, frame);
            const pasteFlash =
              line.paste && line.typeStart !== undefined && frame - line.typeStart < 14
                ? 1 - (frame - line.typeStart) / 14
                : 0;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  height: lineHeight,
                  alignItems: 'center',
                  background: pasteFlash > 0 ? `rgba(61,217,164,${pasteFlash * 0.18})` : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 64,
                    flexShrink: 0,
                    textAlign: 'right',
                    paddingRight: 22,
                    fontSize: fontSize - 4,
                    color: line.flashGutter && done ? C.emerald : C.edGutter,
                    borderLeft:
                      line.flashGutter && done
                        ? `3px solid ${C.emerald}`
                        : '3px solid transparent',
                  }}
                >
                  {i + 1}
                </div>
                <div style={{fontSize, whiteSpace: 'pre', opacity: line.dim ? 0.42 : 1}}>
                  {tokens.map((t, j) => (
                    <span key={j} style={{color: line.dim ? C.edDimCode : t.color}}>
                      {t.text}
                    </span>
                  ))}
                  {i === caretLine && caretOn && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: Math.max(2, fontSize * 0.52),
                        height: fontSize * 1.15,
                        background: C.white,
                        verticalAlign: 'text-bottom',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
