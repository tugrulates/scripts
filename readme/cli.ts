import { Command } from "@cliffy/command";
import $ from "@david/dax";
import { join } from "@std/path";
import { generateReadme } from "./readme.ts";

export function getCommand() {
  return new Command()
    .name("readme")
    .description("Generate markdown readme for a module.")
    .example("readme ./readme", "Generate readme for the `readme` module.")
    .arguments("[modules...:string]")
    .action(async (_, ...modules) =>
      await Promise.all(modules.map(async (module) => {
        const readme = await generateReadme(module);
        const file = join(module, "README.md");
        await Deno.writeTextFile(file, readme);
        await $`deno fmt -q ${file}`;
      }))
    );
}

export async function main(): Promise<void> {
  const command = getCommand();
  await command.parse();
}
