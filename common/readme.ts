import { Command } from "jsr:@cliffy/command";
import { join } from "jsr:@std/path";

/**
 * Print out a README file from a command and its subcommands recursively.
 */
function logReadme(command: Command, { depth = 1 } = {}) {
  console.log(`${"#".repeat(depth)} ${command.getName()}`);
  console.log();
  console.log("```" + command.getHelp({ colors: false }) + "```");
  for (const subCommand of command.getCommands()) {
    console.log();
    logReadme(subCommand, { depth: depth + 1 });
  }
}

const cli = await import(join(Deno.cwd(), "cli.ts"));
logReadme(cli.command);
