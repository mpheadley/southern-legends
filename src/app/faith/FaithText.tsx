// Renders column text from the snapshot. Only *italic* is supported; everything else is plain
// text. No HTML from data is ever injected.
import type { ReactNode } from "react";

export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<em key={i++}>{m[1]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function plain(text: string): string {
  return text.replace(/\*/g, "");
}
