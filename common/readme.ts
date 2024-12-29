import { Command } from "@cliffy/command";
import { exists } from "@std/fs";
import { join } from "@std/path";

/**
 * Print out a README file from a command and its subcommands recursively.
 */
function logReadme(command: Command, { depth = 1 } = {}) {
  console.log(`${"#".repeat(depth)} ${command.getName()}`);
  console.log();
  console.log("```" + trimLines(command.getHelp({ colors: false })) + "```");
  for (const subCommand of command.getCommands()) {
    console.log();
    logReadme(subCommand, { depth: depth + 1 });
  }
}

function trimLines(text: string) {
  return text.split("\n").map((line) => line.replace(/\s+$/, "")).join("\n");
}

const entrypoint = join(Deno.cwd(), "cli.ts");
if (await exists(entrypoint)) {
  const cli = await import(entrypoint);
  logReadme(await cli.getCommand());
}
