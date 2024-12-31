import type { Command, Example } from "@cliffy/command";
import { exists } from "@std/fs";
import { basename, resolve } from "@std/path";
import { join } from "@std/path/join";

interface JSDoc {
  nodes: JSDocNode[];
}

interface JSDocNode {
  name: string;
  kind: string;
  jsDoc: {
    doc: string;
  };
}

async function moduleName(path: string): Promise<string> {
  return JSON.parse(await Deno.readTextFile(join(path, "deno.json"))).name;
}

async function getCommand(path: string): Promise<Command | null> {
  const entrypoint = resolve(path, "cli.ts");
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

async function getJsdoc(path: string): Promise<{
  module?: JSDocNode;
  classes: JSDocNode[];
  functions: JSDocNode[];
}> {
  const command = new Deno.Command("deno", {
    args: ["doc", "--json", `${path}/mod.ts`],
  });
  const { code, stdout, stderr } = await command.output();
  if (code !== 0) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`Cannot parse JSDoc: ${error}`);
  }
  const jsdoc = JSON.parse(new TextDecoder().decode(stdout)) as JSDoc;
  return {
    module: jsdoc.nodes.find((n) => n.kind == "moduleDoc"),
    classes: jsdoc.nodes
      .filter((n) => n.kind == "class")
      .toSorted((a, b) => a.name.localeCompare(b.name)),
    functions: jsdoc.nodes
      .filter((n) => n.kind == "function")
      .toSorted((a, b) => a.name.localeCompare(b.name)),
  };
}

export async function generateReadme(path: string): Promise<string> {
  const name = basename(path);
  const [jsr, jsdoc, command] = await Promise.all([
    moduleName(path),
    getJsdoc(path),
    getCommand(path),
  ]);

  const readme = [
    `# ${name} ([jsr.io](https://jsr.io/${jsr}))`,
    jsdoc.module?.jsDoc?.doc,
  ];
  if (command) {
    const cli = {
      name: command.getName(),
      examples: getExamples(command),
    };
    readme.push(
      "## CLI",
      `Run \`${cli.name}\` after installation, or run \`deno run -A ${jsr}\` without installation.`,
      "### Examples",
      "| Command | Description |",
      "| --- | --- |",
      ...cli.examples.map((e) =>
        `| \`${e.name.replace("|", "\\|")}\` | ${
          e.description.replace("|", "\\|")
        } |`
      ),
    );
  }
  if (jsdoc.classes?.length) {
    readme.push("## Classes");
    for (const c of jsdoc.classes) {
      readme.push(
        `### [${c.name}](https://jsr.io/${jsr}/doc/~/${c.name})`,
        c.jsDoc?.doc,
      );
    }
  }
  if (jsdoc.functions?.length) {
    readme.push("## Functions");
    for (const f of jsdoc.functions) {
      readme.push(
        `### [${f.name}](https://jsr.io/${jsr}/doc/~/${f.name})`,
        f.jsDoc?.doc,
      );
    }
  }

  return readme.join("\n");
}
