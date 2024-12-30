/**
 * Generate a README.md file for a module.
 *
 * Example:
 * ```ts
 * generateReadme("./readme")
 * ```
 *
 * @module
 */

import { main } from "./cli.ts";

export * from "./readme.ts";

if (import.meta.main) main();
