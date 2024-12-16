import { Command } from "jsr:@cliffy/command";
import { Table } from "jsr:@cliffy/table";
import { FiveHundredPxClient } from "./client.ts";
import { Photo } from "./types.ts";

/**
 * Outputs the photos to the console.
 *
 * @param photos Photos to output.
 */
function output(photos: Photo[]) {
  new Table()
    .body(photos.map((photo) => [
      `🏞️ ${photo.name}`,
      `📈${photo.pulse.highest}`,
      `❤️ ${photo.likedByUsers.totalCount}`,
      `👁️ ${photo.timesViewed}`,
    ]))
    .render();
}

/**
 * Command line interface for managing user photos.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .description("Prints the list of photos for a 500px user.")
  .example("500px photos <username>", "Prints the list of photos for a user.")
  .example("500px photos <username> --json | jq", "Query photos as JSON.")
  .arguments("<username:string>")
  .option("--json", "Output the photo information as JSON.")
  .action(async ({ json }, username) => {
    const client = new FiveHundredPxClient();
    const photos = await client.getPhotos(username);

    if (json) console.log(JSON.stringify(photos, undefined, 2));
    else output(photos);
  });

if (import.meta.main) {
  await command.parse();
}
