/**
 * Prints a list of active and high quality users on 500px.
 *
 * ### Usage
 *
 * ```sh
 * $ deno -A 500px/discover.ts [--categories...] [--json]
 * 👤 /user1
 * 👤 /user2
 * 👤 /user3
 * ```
 *
 * ### Categories
 *
 * ```sh
 * deno -A 500px/discover.ts --animals --city-architecture --landscapes
 * ```
 *
 * ### JSON
 *
 * ```json
 * { "discover": ["/user2", "/user3"] }
 * ```
 */

import { parseArgs } from "jsr:@std/cli/parse-args";
import { printTable } from "../common/console.ts";
import { FiveHundredPxClient } from "./client.ts";
import { CATEGORIES } from "./data.ts";

/**
 * Skip list for user IDs.
 *
 * Skips photos copied from VCG.
 */
const SKIP = [/^\/vcg-/];

if (import.meta.main) {
  const spec = {
    boolean: [...Object.values(CATEGORIES).map((c) => c.arg), "json"],
  } as const;
  const args = parseArgs(Deno.args, spec);
  const categories = Object.values(CATEGORIES).filter((c) => args[c.arg]);

  const client = new FiveHundredPxClient();
  const photos = await client.getForYouFeed({ categories, limit: 1000 });
  const users = photos.map((photo) => photo.photographer.canonicalPath).filter(
    (user) => !SKIP.some((re) => re.test(user)),
  );

  const result = { discover: Array.from(new Set(users)) };
  if (args.json) console.log(JSON.stringify(result, undefined, 2));
  else printTable(result.discover.map((user) => ["👤", user]));
}
