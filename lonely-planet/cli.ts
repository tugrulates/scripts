import { Command } from "jsr:@cliffy/command";
import { Table } from "jsr:@cliffy/table";
import { Config } from "../common/cli.ts";
import { LonelyPlanetClient } from "./client.ts";
import { EMOJIS } from "./data.ts";
import type { Attraction, Destination } from "./types.ts";

const endpoint = new Config("endpoint");
const token = new Config("token", { secret: true });

/** Lonely Planet client built from common CLI options. */
export async function getClient(): Promise<LonelyPlanetClient> {
  return new LonelyPlanetClient(await endpoint.get(), await token.get());
}

/** Breadcrumb text from a location. */
function breadcrumb(document: Destination | Attraction) {
  return `[ ${
    document.breadcrumb.map((breadcrumb) => breadcrumb.title).join(" > ")
  } ]`;
}

/**
 * Command line interface for Lonely Planet.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .name("lonely-planet")
  .description("Explores data from Lonely Planet.")
  .example("lonely-planet big sur", "Search destinations for 'big sur'.")
  .example("lonely-planet --attractions amsterdam", "Search attractions.")
  .example("lonely-planet --stories amsterdam", "Search stories.")
  .example("lonely-planet --destinations --attractions --stories", "All.")
  .example("lonely-planet --json | jq", "Stream destinations as json.")
  .option(
    "--endpoint <endpoint:string>",
    "Typesense endpoint for Lonely Planet.",
    await endpoint.option(),
  )
  .option(
    "--token <token:string>",
    "Typesense token for Lonely Planet.",
    await token.option(),
  )
  .arguments("[...keywords:string]")
  .option("--destinations", "Include destinations in the results.")
  .option("--attractions", "Include attractions in the results.")
  .option("--stories", "Include stories in the results.")
  .option("--json", "Output the search results as concatenated JSON.")
  .action(async ({ destinations, attractions, stories, json }, ...keywords) => {
    if (!destinations && !attractions && !stories) destinations = true;
    const client = await getClient();
    const rows: string[][] = [];
    if (destinations) {
      for await (const doc of client.searchDestionations(keywords)) {
        if (json) console.log(JSON.stringify(doc));
        else rows.push([EMOJIS[doc.type], doc.title, breadcrumb(doc)]);
      }
    }
    if (attractions) {
      for await (const doc of client.searchAttractions(keywords)) {
        if (json) console.log(JSON.stringify(doc));
        else rows.push([EMOJIS[doc.type], doc.title, breadcrumb(doc)]);
      }
    }
    if (stories) {
      for await (const doc of client.searchStories(keywords)) {
        if (json) console.log(JSON.stringify(doc));
        else rows.push([EMOJIS[doc.type], doc.title]);
      }
    }
    Table.from(rows).render();
  });

if (import.meta.main) {
  await command.parse();
}
