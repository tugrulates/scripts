import { unicodeWidth } from "jsr:@std/cli";
import { isatty } from "node:tty";
import process from "npm:process";
import terminalLink from "npm:terminal-link";

/**
 * Represents a printed table row.
 */
export type Row = Cell[];

/** Represents a printed table cell type.
 *
 * A cell can contain either a simple or formatted string. */
export type Cell = string | FormattedCell;

/**
 * Represents a formatted cell.
 *
 * Support left or right alignment, and linking.
 */
export interface FormattedCell {
  /** The text content of the cell. */
  text: string;
  /** The alignment of the cell content. */
  align: "left" | "right";
  /** The URL to link the cell to. */
  url: string | null;
}

/**
 * Prints a well formatted table to stdout.
 *
 * Uses `console.log`.
 *
 * @param rows The rows to print.
 */
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

/**
 * Creates a cell with a clickable link.
 *
 * @param text The text content of the cell.
 * @param url The URL to link the cell to.
 */
export function link(text: string, url?: string): Cell {
  return url !== undefined ? { text, url, align: "left" } : text;
}

/**
 * Creates a cell aligned to the right.
 *
 * @param text The text content of the cell.
 */
export function right(text: Cell): FormattedCell {
  const cell = typeof text === "string" ? { text, url: null } : text;
  return { ...cell, align: "right" };
}

/**
 * Renders a cell, optionally padding to a width.
 *
 * @param cell The cell to render.
 * @param links Whether to render links.
 * @param width The width to pad to.
 */
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
