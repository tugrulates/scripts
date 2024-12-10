/** @module common/cli */

import { ParseOptions } from "jsr:@std/cli";
import { basename, dirname } from "jsr:@std/path";

/** Arg parser type spec. */
export type Spec = ParseOptions & {
  required?: readonly string[];
};

/** Checks if a required argument is missing. */
export function checkRequired<T>(
  spec: Spec,
  name: string,
  value: T,
): asserts value is NonNullable<T> {
  if (value === undefined) {
    console.error(`Missing required argument: ${name}`);
    console.error(`Usage: ${getUsage(spec)}`);
    Deno.exit(1);
  }
}

/** Returns the usage string for the script. */
function getUsage(spec: Spec): string {
  const module = basename(dirname(Deno.mainModule));
  const script = basename(Deno.mainModule);
  const strings =
    (Array.isArray(spec.string) ? spec.string : [spec.string])?.map((
      name,
    ) => maybeOptional(spec, name, `--${name} <${name}>`)) ?? [];
  const booleans =
    (Array.isArray(spec.boolean) ? spec.boolean : [spec.boolean])?.map((
      name,
    ) => maybeOptional(spec, name, `--${name}`)) ??
      [];
  return `${module}/${script} ${[...strings, ...booleans].join(" ")}`;
}

/** Returns the usage string for an argument, wrapped in brackets if optional. */
function maybeOptional(spec: Spec, name: string, usage: string) {
  if (spec.required?.includes(name)) return usage;
  return `[${usage}]`;
}
