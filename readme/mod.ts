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

import { join } from "@std/path";
import { $ } from "jsr:@david/dax";
import { generateReadme } from "./readme.ts";

export * from "./readme.ts";

if (import.meta.main) {
  await Promise.all(Deno.args.map(async (module) => {
    const readme = await generateReadme(module);
    const file = join(module, "README.md");
    await Deno.writeTextFile(file, readme);
    await $`deno fmt -q ${file}`;
  }));
}
