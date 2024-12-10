/** @module common/cli */

import { ParseOptions } from "jsr:@std/cli";
import { basename, dirname } from "jsr:@std/path";

/** Arg parser type spec. */
export type Spec = ParseOptions & {
  _?: ReadonlyArray<Extract<string, string>>;
};

/** Get required arguments with exact count. */
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

/** Get all arguments with unknown count. */
export function getOptional(
  args: { _: (string | number)[] },
): string[] {
  return args._.map((arg) => arg.toString());
}

/** Returns the usage string for the script. */
function getUsage(spec: Spec): string {
  const module = basename(dirname(Deno.mainModule));
  const script = basename(Deno.mainModule);
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
  return `${module}/${script} ${
    [...required, ...strings, ...booleans].join(" ")
  }`;
}
