import { ParseOptions } from "jsr:@std/cli";
import { basename, dirname } from "jsr:@std/path";

/**
 * Arg parser type spec.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * import { parseArgs } from "jsr:@std/cli";
 *
 * const spec = {
 *   _: ["username"],
 *   string: ["token"],
 *   boolean: ["json", "verbose"],
 * } as const;
 *
 * const args = parseArgs(["USERNAME", "--token=TOKEN", "--json"], spec);
 * const [username] = getRequired(args, spec);
 *
 * assertEquals(username, "USERNAME");
 * assertEquals(args.token, "TOKEN");
 * assertEquals(args.json, true);
 * assertEquals(args.verbose, false);
 * ```
 *
 * @extends ParseOptions to add names for bare arguments captured in `_`.
 *
 * @todo Add support for cases without optional arguments.
 */
export interface Spec extends ParseOptions {
  /** Names for the bare arguments. */
  _?: ReadonlyArray<Extract<string, string>>;
}

/**
 * Get required arguments from parsed spec with names.
 *
 * Prints usage and exits if required arguments are missing.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * import { parseArgs } from "jsr:@std/cli";
 *
 * const spec = {
 *   _: ["username"],
 *  boolean: ["json"],
 * } as const;
 *
 * const args = parseArgs(["USERNAME"], spec);
 * const [username] = getRequired(args, spec);
 * assertEquals(username, "USERNAME");
 * ```
 *
 * @param args Parsed arguments.
 * @param spec Argument spec.
 * @returns Parsed arguments as a tuple.
 *
 * @todo Use exact count on return type to match spec.
 */
export function getRequired(
  args: { _: (string | number)[] },
  spec: Spec,
): [string, ...string[]] {
  const requiredCount = spec._?.length ?? 0;
  if (args._.length > requiredCount) {
    console.error(`Too many arguments.`);
    console.error(`Usage: ${getUsage(spec)}`);
    Deno.exit(1);
  } else if (args._.length < requiredCount) {
    for (const name of (spec._ ?? []).slice(args._.length)) {
      console.error(`Missing required argument: ${name}`);
    }
    console.error(`Usage: ${getUsage(spec)}`);
    Deno.exit(1);
  }
  return getOptional(args) as [string, ...string[]];
}

/**
 * Get all arguments with unknown count.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 * import { parseArgs } from "jsr:@std/cli";
 *
 * const spec = {
 *   _: ["numbers"],
 *  boolean: ["json"],
 * } as const;
 *
 * const args = parseArgs(["ONE", "TWO", "THREE"], spec);
 * const numbers = getOptional(args);
 * assertEquals(numbers, ["ONE", "TWO", "THREE"]);
 * ```
 *
 * @param args Parsed arguments.
 * @returns All arguments as strings.
 */
export function getOptional(args: { _: (string | number)[] }): string[] {
  return args._.map((arg) => arg.toString());
}

/**
 * Returns the usage string for the script.
 *
 * @example Usage
 * ```ts
 * import { assertEquals } from "jsr:@std/assert";
 *
 * const spec = {
 *  _: ["username"],
 * string: ["token"],
 * boolean: ["json", "verbose"],
 * } as const;
 *
 * const usage = getUsage(spec, "command");
 * assertEquals(usage, "command <username> [--token <token>] [--json] [--verbose]");
 * ```
 *
 * @param spec Argument spec.
 * @param command Optional command name, uses `Deno.mainModule` if not provided.
 * @returns Usage string.
 */
export function getUsage(spec: Spec, command?: string): string {
  if (!command) {
    const module = basename(dirname(Deno.mainModule));
    const script = basename(Deno.mainModule);
    command = `${module}/${script}`;
  }

  const required = spec._ ? spec._.map((name) => `<${name}>`) : [];
  const strings = spec.string
    ? (Array.isArray(spec.string) ? spec.string : [spec.string]).map(
      (name) => `[--${name} <${name}>]`,
    )
    : [];
  const booleans = spec.boolean
    ? (Array.isArray(spec.boolean) ? spec.boolean : [spec.boolean])?.map(
      (name) => `[--${name}]`,
    )
    : [];

  return `${command} ${[...required, ...strings, ...booleans].join(" ")}`;
}
