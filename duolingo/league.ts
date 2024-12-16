import { Command } from "jsr:@cliffy/command";
import { Table } from "jsr:@cliffy/table";
import { pool } from "../common/async.ts";
import { getClient } from "./cli.ts";
import { LANGUAGES, LEAGUES } from "./data.ts";
import { LanguageCode, League, LeagueUser } from "./types.ts";

/**
 * Follows all the users in the league.
 *
 * @param users Users to follow.
 */
async function followUsers(users: LeagueUser[]) {
  const client = await getClient();
  const userId = await client.getUserId();
  const following = await client.getFollowing();

  await pool(
    users
      .filter((user) => user.user_id !== userId)
      .filter((user) => !following.find((f) => f.userId === user.user_id)),
    async (user) => await client.followUser(user.user_id),
  );
}

/**
 * Returns the emoji for the user's reaction.
 *
 * @param user User to get the emoji for.
 * @returns Emoji for the user's reaction.
 */
function getEmoji(user: LeagueUser): string {
  if (user.reaction === "ANGRY") return "😡";
  if (user.reaction === "CAT") return "😺";
  if (user.reaction === "EYES") return "👀";
  if (user.reaction === "FLEX") return "💪";
  if (user.reaction === "POOP") return "💩";
  if (user.reaction === "POPCORN") return "🍿";
  if (user.reaction === "SUNGLASSES") return "😎";
  if (user.reaction.startsWith("FLAG")) {
    return LANGUAGES[user.reaction.split(",")[1] as LanguageCode].emoji;
  }
  return "";
}

/**
 * Outputs the league to the console.
 *
 * @param league League to output.
 */
async function output(league: League) {
  const client = await getClient();
  const following = await client.getFollowing();
  const tier = LEAGUES[league.tier];
  new Table()
    .header([tier.emoji, tier.name])
    .body(
      league.rankings.map((user, index) => [
        `${index + 1}.`,
        `${user.display_name} ${getEmoji(user)}`,
        following ? "👤" : "",
        `${user.score.toString()} XP`,
      ]),
    )
    .columns([{ align: "right" }, {}, {}, { align: "right" }])
    .render();
}

/**
 * Command line interface for interacting with the current league.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .description("Prints and interacts with the current Duolingo league.")
  .example("duolingo league", "Prints the league.")
  .example("duolingo league --follow", "Follows users in the league.")
  .example("duolingo league --json | jq", "Query JSON over the league.")
  .option("--follow", "Follow users in the league.")
  .option("--json", "Output the league as JSON.")
  .action(async ({ follow, json }) => {
    const client = await getClient();
    const league = await client.getLeague();
    if (follow) await followUsers(league.rankings);
    if (json) console.log(JSON.stringify(league, undefined, 2));
    else await output(league);
  });

if (import.meta.main) {
  await command.parse();
}
