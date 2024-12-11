/**
 * Prints the list of photos for a 500px user.
 *
 * ### Usage
 *
 * ```sh
 * deno -A 500px/photos.ts <username> [--json]
 * ```
 *
 * ```
 * 🏞️ Coordinating Phoenix  📈91.1 👁️1085 ❤️95
 * 🏞️ Architectural Lasagna 📈91.9 👁️1176 ❤️142
 * ```
 *
 * ### CSV
 *
 * ```sh
 * deno -A 500px/photos.ts <username> --json | jq -rf 500px/photos.csv.jq
 * ```
 *
 * ```csv
 * "Link","Title","Date","Views","Likes","Pulse"
 * ...
 * ```
 */

import { parseArgs } from "jsr:@std/cli";
import { getRequired } from "../common/cli.ts";
import { printTable, Row } from "../common/console.ts";
import { FiveHundredPxClient } from "./client.ts";
import { Photo } from "./types.ts";

/**
 * Returns the display row of the photo.
 *
 * @param photo Photo to display.
 * @returns Display row of the photo.
 */
function getRow(photo: Photo): Row {
  return [
    `🏞️  ${photo.name}`,
    `📈${photo.pulse.highest}`,
    `❤️ ${photo.likedByUsers.totalCount}`,
    `👁️ ${photo.timesViewed}`,
  ];
}

if (import.meta.main) {
  const spec = { _: ["username"], boolean: ["json"] } as const;
  const args = parseArgs(Deno.args, spec);
  const [username] = getRequired(args, spec);

  const client = new FiveHundredPxClient();
  const photos = await client.getPhotos(username);

  if (args.json) console.log(JSON.stringify(photos, undefined, 2));
  else printTable(photos.map(getRow));
}
