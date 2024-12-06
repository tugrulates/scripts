/** Prints a list of users to engage with.
 *
 * Usage:
 *  500px/discover.ts
 *  500px/discover.ts --animals
 *  500px/discover.ts --landscapes --city-and-architecture
 *
 * Output:
 * {
 *   "discover": [
 *     "/tugrulates"
 *   ]
 * }
 */

import { parseArgs } from "jsr:@std/cli/parse-args";
import { toSnakeCase } from "jsr:@std/text";
import { CATEGORIES, Category, FiveHundredPxClient } from "./client.ts";

if (import.meta.main) {
  const categories: Category[] = [];
  parseArgs(Deno.args, {
    unknown: (option) => {
      const name = toSnakeCase(option).toUpperCase();
      if (Object.keys(CATEGORIES).includes(name)) {
        categories.push(CATEGORIES[name as keyof typeof CATEGORIES]);
        return true;
      }
      throw new Error(`Unknown option: ${option}`);
    },
  });

  const client = new FiveHundredPxClient();
  const photos = await client.getForYouFeed({ categories, limit: 1000 });
  const users = photos.map((photo) => photo.photographer.canonicalPath);

  const result = { discover: Array.from(new Set(users)) };
  console.log(JSON.stringify(result, undefined, 2));
}
