// Type declarations for shelf-core.js (vanilla three.js shelf shared by the demo page and Book3D).
export type ShelfBook = { key: string; title: string; subtitle?: string };
export function mountShelf(
  el: HTMLElement,
  opts: { books: ShelfBook[]; base?: string; interactive?: boolean; onLabel?: (b: ShelfBook | null) => void }
): { dispose(): void };
