import { Command } from "@cliffy/command";
import { generateReadme } from "./readme.ts";

export function getCommand() {
  return new Command()
    .name("readme")
    .description("Generate markdown readme for a module.")
    .example("readme ./readme", "Generate readme for the `readme` module.")
    .arguments("<module:string>")
    .action(async (_, module) => console.log(await generateReadme(module)));
}

export async function main(): Promise<void> {
  const command = getCommand();
  await command.parse();
}
