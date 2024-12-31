/**
 * Generate a README.md file for a module.
 *
 * Running the module with a list of module paths will generate a README.md
 * file for each module.
 *
 * Alternatively, the `generateReadme` function can be used to generate a
 * README.md file for a module.
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
