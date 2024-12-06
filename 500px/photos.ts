/** Prints the list of photos for a user.
 *
 * Usage:
 *  500px/photos.ts --username <username> [--json]
 *
 * Output:
 *  🏞️ Coordinating Phoenix                📈91.1     👁️1085   ❤️95
 *  🏞️ Architectural Lasagna               📈91.9     👁️1176   ❤️142
 *
 * CSV:
 *   500px/photos.ts --username <username> --json | jq -f 500px/photos.csv.jq
 */

import { parseArgs } from "jsr:@std/cli";
import { FiveHundredPxClient, Photo } from "./client.ts";

/** Returns the display summary of the photo. */
function getSummary(photo: Photo): string {
  const title = `🏞️  ${photo.name}`.padEnd(40);
  const pulse = `📈${photo.pulse.highest}`.padEnd(10);
  const likes = `❤️ ${photo.likedByUsers.totalCount}`.padEnd(10);
  const views = `👁️ ${photo.timesViewed}`.padEnd(10);
  return `${title} ${pulse} ${views} ${likes}`;
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["username"],
    boolean: ["json"],
  });
  if (!args.username) {
    console.error(`Usage: photos.ts --username <username> [--json]`);
    Deno.exit(1);
  }

  const client = new FiveHundredPxClient();
  const photos = await client.getPhotos(args.username);

  if (args.json) console.log(JSON.stringify(photos, undefined, 2));
  else photos.forEach((photo) => console.log(getSummary(photo)));
}
