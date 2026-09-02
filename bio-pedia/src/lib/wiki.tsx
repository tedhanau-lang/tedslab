import { NODE_BY_ID, TITLE_TO_ID } from "@/data/atlas/catalog";
import type { ReactNode } from "react";

const WIKI = /\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g;
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

function resolveId(raw: string): string | null {
  const key = raw.trim();
  if (NODE_BY_ID[key]) return key;
  const byTitle = TITLE_TO_ID[key.toLowerCase()];
  return byTitle ?? null;
}

function inline(text: string, onNavigate: (id: string) => void, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(WIKI.source + "|" + INLINE.source, "g");
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("[[")) {
      const idRaw = m[1] ?? "";
      const label = m[2] ?? NODE_BY_ID[idRaw]?.title ?? idRaw;
      const id = resolveId(idRaw);
      if (id) {
        parts.push(
          <button
            key={`${keyPrefix}-w-${i++}`}
            type="button"
            className="wiki-link"
            onClick={() => onNavigate(id)}
          >
            {label}
          </button>,
        );
      } else {
        parts.push(
          <span key={`${keyPrefix}-m-${i++}`} className="text-fg-muted">
            {label}
          </span>,
        );
      }
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i++}`}>{token.slice(2, -2)}</strong>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded-xs bg-bg-elevated px-1 font-mono text-[0.85em] text-accent"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(<em key={`${keyPrefix}-i-${i++}`}>{token.slice(1, -1)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function WikiBody({
  markdown,
  onNavigate,
}: {
  markdown: string;
  onNavigate: (id: string) => void;
}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let bi = 0;

  const flushPara = () => {
    if (!para.length) return;
    const text = para.join(" ");
    blocks.push(
      <p key={`p-${bi++}`}>{inline(text, onNavigate, `p${bi}`)}</p>,
    );
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`ul-${bi++}`}>
        {list.map((item, idx) => (
          <li key={idx}>{inline(item, onNavigate, `li${bi}-${idx}`)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push(
        <h2 key={`h-${bi++}`}>{inline(line.slice(3), onNavigate, `h${bi}`)}</h2>,
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push(
        <h3 key={`h3-${bi++}`}>{inline(line.slice(4), onNavigate, `h3${bi}`)}</h3>,
      );
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      flushList();
      blocks.push(
        <blockquote key={`q-${bi++}`}>
          {inline(line.slice(2), onNavigate, `q${bi}`)}
        </blockquote>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();

  return <div className="article-body">{blocks}</div>;
}

export function extractHeadings(markdown: string): string[] {
  return markdown
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.replace(/^##\s+/, "").replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, id, label) => label || id));
}
