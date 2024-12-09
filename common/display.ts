import { unicodeWidth } from "jsr:@std/cli";
import { isatty } from "node:tty";
import process from "npm:process";
import terminalLink from "npm:terminal-link";

interface RichCell {
  text: string;
  align: "left" | "right";
  url: string | null;
}
export type Cell = string | RichCell;
export type Row = Cell[];

export function printTable(rows: Row[]): void {
  const widths = rows.reduce((widths: number[], row: Row) => {
    for (const [i, cell] of row.entries()) {
      widths[i] = Math.max(
        unicodeWidth(render(cell, false)),
        widths[i] ?? 0,
      );
    }
    return widths;
  }, []);

  for (const row of rows) {
    const text = row.map((c, i) =>
      render(c, isatty(process.stdout.fd), widths[i])
    ).join(" ").trimEnd();
    console.log(text);
  }
}

export function link(text: string, url?: string): Cell {
  return url !== undefined ? { text, url, align: "left" } : text;
}

export function right(text: Cell): RichCell {
  const cell = typeof text === "string" ? { text, url: null } : text;
  return { ...cell, align: "right" };
}

function render(cell: Cell, links: boolean, width?: number): string {
  const {
    text,
    align,
    url = null,
  } = typeof cell === "string" ? { text: cell, align: "left" } : cell;

  if (width !== undefined) {
    const bare = render(cell, false);
    const pad = " ".repeat(width - unicodeWidth(bare));
    const unpadded = links ? render(cell, links) : bare;
    return align === "left" ? unpadded + pad : pad + unpadded;
  }

  return !links || url === null ? text : terminalLink(text, url);
}
