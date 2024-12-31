import type { Command, Example } from "@cliffy/command";
import { exists } from "@std/fs";
import { basename, resolve } from "@std/path";
import { join } from "@std/path/join";

interface JSDoc {
  nodes: {
    name: string;
    kind: string;
    jsDoc: {
      doc: string;
    };
  }[];
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

async function getJsdoc(path: string): Promise<JSDoc> {
  const command = new Deno.Command("deno", {
    args: ["doc", "--json", `${path}/mod.ts`],
  });
  const { code, stdout, stderr } = await command.output();
  if (code !== 0) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`Cannot parse JSDoc: ${error}`);
  }
  return JSON.parse(new TextDecoder().decode(stdout)) as JSDoc;
}

export async function generateReadme(path: string): Promise<string> {
  const name = basename(path);
  const [jsdoc, command] = await Promise.all([
    getJsdoc(path),
    await getCommand(path),
  ]);
  const module = {
    name: await moduleName(path),
    doc: jsdoc.nodes.find((n) => n.kind == "moduleDoc")?.jsDoc?.doc,
    classes: jsdoc.nodes.filter((n) => n.kind === "class") || undefined,
    functions: jsdoc.nodes.filter((n) => n.kind === "function") || undefined,
  };

  const readme = [
    `# ${name} [jsr.io](https://jsr.io/${module.name})`,
    module.doc,
  ];
  if (command) {
    const cli = {
      name: command.getName(),
      examples: getExamples(command),
    };
    readme.push(
      "## CLI",
      `Run \`${cli.name}\` after installation, or run \`deno run -A ${module.name}\` without installation.`,
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
  if (module.classes.length) {
    readme.push("## Classes");
    for (const c of module.classes) {
      readme.push(
        `### [${c.name}](https://jsr.io/${module.name}/doc/~/${c.name})`,
        c.jsDoc?.doc,
      );
    }
  }
  if (module.functions.length) {
    readme.push("## Functions");
    for (const f of module.functions) {
      readme.push(
        `### [${f.name}](https://jsr.io/${module.name}/doc/~/${f.name})`,
        f.jsDoc?.doc,
      );
    }
  }

  return readme.join("\n");
}
