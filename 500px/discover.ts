import { Command, EnumType } from "jsr:@cliffy/command";
import { FiveHundredPxClient } from "./client.ts";
import { CATEGORIES } from "./data.ts";

/**
 * Skip list for user IDs.
 *
 * Skips photos copied from VCG.
 */
const SKIP = [/^\/vcg-/];

/**
 * Command line interface for finding active users on 500px.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .description("Prints a list of active and high quality users on 500px.")
  .example("500px discover", "Prints a list of users with high scored photos.")
  .example("500px discover --filter food", "Finds food photographers.")
  .example("500px discover --filter macro --filter animals", "Either category.")
  .example("500px discover --json | jq", "Query users as JSON.")
  .type("category", new EnumType(Object.values(CATEGORIES).map((c) => c.opt)))
  .option(
    "--category <category:category>",
    "Categories to filter results on.",
    { collect: true },
  )
  .option("--json", "Output the list of users as JSON.")
  .action(async ({ category, json }) => {
    const categories = Object.values(CATEGORIES).filter((c) =>
      !category || category.includes(c.opt)
    );
    const client = new FiveHundredPxClient();
    const photos = await client.getForYouFeed({ categories, limit: 1000 });
    const users = photos.map((photo) => photo.photographer.canonicalPath)
      .filter((user) => !SKIP.some((re) => re.test(user)));
    const result = { discover: Array.from(new Set(users)) };
    if (json) console.log(JSON.stringify(result, undefined, 2));
    else result.discover.forEach((user) => console.log(`👤 ${user}`));
  });

if (import.meta.main) {
  await command.parse();
}
