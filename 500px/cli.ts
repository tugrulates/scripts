import { Command } from "jsr:@cliffy/command";
import { command as discover } from "./discover.ts";
import { command as follows } from "./follows.ts";
import { command as photos } from "./photos.ts";

/**
 * Command line interface for 500px.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .name("500px")
  .description("Interact with 500px.")
  .usage("<command> [options]")
  .action((): void => command.showHelp())
  .command("discover", discover)
  .command("follows", follows)
  .command("photos", photos);

if (import.meta.main) {
  await command.parse();
}
