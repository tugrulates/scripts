import type { Command, Example } from "@cliffy/command";
import { exists } from "@std/fs";
import { basename, resolve } from "@std/path";
import { join } from "@std/path/join";
import { Eta } from "jsr:@eta-dev/eta";

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
  const command = new Deno.Command("deno", {
    args: ["doc", "--json", `${module}/mod.ts`],
  });
  const { code, stdout, stderr } = await command.output();
  if (code !== 0) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`Cannot parse JSDoc: ${error}`);
  }
  return JSON.parse(new TextDecoder().decode(stdout)) as JSDoc;
}

export async function generateReadme(module: string): Promise<string> {
  const eta = new Eta({
    views: import.meta.dirname,
    useWith: true,
    autoTrim: false,
  });
  const jsdoc = await getJsdoc(module);
  const command = await getCommand(module);
  return eta.render("./readme", {
    name: basename(module),
    module: {
      name: await moduleName(module),
      doc: jsdoc.nodes.find((n) => n.kind == "moduleDoc")?.jsDoc?.doc,
      classes: jsdoc.nodes.filter((n) => n.kind === "class") || undefined,
      functions: jsdoc.nodes.filter((n) => n.kind === "function") || undefined,
    },
    cli: command && {
      name: command.getName(),
      examples: getExamples(command),
    },
  });
}
