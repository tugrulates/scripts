import { Command } from "jsr:@cliffy/command";
import { Config } from "../common/cli.ts";
import { DuolingoClient } from "./client.ts";
import { command as feed } from "./feed.ts";
import { command as follows } from "./follows.ts";
import { command as league } from "./league.ts";

const username = new Config("username");
const token = new Config("token", { secret: true });

/**
 * Duolingo client built from common CLI options.
 */
export async function getClient(): Promise<DuolingoClient> {
  return new DuolingoClient(await username.get(), await token.get());
}

/**
 * Command line interface for Duolingo.
 *
 * @ignore missing-explicit-type
 * @todo Use `"secret"` type from cliffy when it's available.
 */
export const command = new Command()
  .name("duolingo")
  .description("Interact with Duolingo.")
  .example(
    "duolingo --username <username> --token <token> feed",
    "Configure Duolingo client.",
  )
  .example("duolingo --clear", "Clear the cached configuration.")
  .usage("<command> [options]")
  .globalOption(
    "--username <username:string>",
    "Username.",
    await username.option(),
  )
  .globalOption(
    "--token <token:string>",
    "JWT token.",
    await token.option(),
  )
  .option("--clear", "Clear the cached configuration.", {
    standalone: true,
    action: async () => {
      await username.clear();
      await token.clear();
    },
  })
  .action((): void => command.showHelp())
  .command("feed", feed)
  .command("follows", follows)
  .command("league", league);

if (import.meta.main) {
  await command.parse();
}
