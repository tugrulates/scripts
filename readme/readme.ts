import type { Command, Example } from "@cliffy/command";
import $ from "@david/dax";
import { exists } from "@std/fs";
import { resolve } from "@std/path";
import { join } from "@std/path/join";
import { Eta } from "jsr:@eta-dev/eta";

const DOCUMENTED_KINDS = ["class", "function"];

interface JSDoc {
  nodes: {
    name: string;
    kind: string;
    jsDoc: {
      doc: string;
    };
  }[];
}

async function moduleName(module: string): Promise<string> {
  return JSON.parse(await Deno.readTextFile(join(module, "deno.json"))).name;
}

async function getCommand(module: string): Promise<Command | null> {
  const entrypoint = resolve(module, "cli.ts");
  if (!await exists(entrypoint)) return null;
  const cli = await import(entrypoint);
  return cli.getCommand() as Command;
}

function getExamples(command: Command): Example[] {
  return [
    ...command.getExamples(),
    ...command.getCommands().map((c) => getExamples(c)).flat(),
  ];
}

async function getJsdoc(module: string): Promise<JSDoc> {
  return JSON.parse(
    await $`deno doc --json ${module}/mod.ts`.text(),
  ) as JSDoc;
}

export async function generateReadme(module: string): Promise<string> {
  const eta = new Eta({ views: import.meta.dirname, autoTrim: false });
  const jsdoc = await getJsdoc(module);
  const command = await getCommand(module);
  return eta.render("./readme", {
    module: {
      name: await moduleName(module),
      doc: jsdoc.nodes.find((n) => n.kind == "moduleDoc")?.jsDoc?.doc,
      exports: jsdoc.nodes.filter((n) => DOCUMENTED_KINDS.includes(n.kind)),
    },
    cli: command && {
      name: command.getName(),
      examples: getExamples(command),
    },
  });
}
