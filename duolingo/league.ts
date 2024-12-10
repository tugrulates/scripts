/** Prints the current league status, and optionally follows leaguemates.
 *
 * Usage:
 *   Usage: duolingo/league.ts --username <username> --token <token> [--json] [--follow]
 *
 * Output:
 *   🩷 Pearl League
 *   1. Friend     👤 400 XP
 *   3. You            80 XP
 *   4. Non-friend     10 XP
 */

import { parseArgs } from "jsr:@std/cli";
import { checkRequired } from "../common/cli.ts";
import { printTable, right, Row } from "../common/display.ts";
import { pool } from "../common/pool.ts";
import { DuolingoClient } from "./client.ts";
import { LANGUAGES, LEAGUES } from "./data.ts";
import { LanguageCode, LeagueUser } from "./types.ts";

/** Returns the emoji for the user's reaction. */
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

/** Returns the display summary of the league user. */
function getRow(user: LeagueUser, index: number, following: boolean): Row {
  return [
    right(`${index + 1}.`),
    `${user.display_name} ${getEmoji(user)}`,
    following ? "👤" : "",
    right(`${user.score.toString()} XP`),
  ];
}

/** Follows all the users in the league. */
async function followUsers(
  client: DuolingoClient,
  users: LeagueUser[],
): Promise<void> {
  const userId = await client.getUserId();
  const following = await client.getFollowing();

  await pool(
    users
      .filter((user) => user.user_id !== userId)
      .filter((user) => !following.find((f) => f.userId === user.user_id)),
    async (user) => await client.followUser(user.user_id),
  );
}

if (import.meta.main) {
  const spec = {
    required: ["username", "token"],
    string: ["username", "token"],
    boolean: ["follow", "json"],
  } as const;
  const args = parseArgs(Deno.args, spec);
  checkRequired(spec, "username", args.username);
  checkRequired(spec, "token", args.token);

  const client = new DuolingoClient(args.username, args.token);
  const league = await client.getLeague();
  const tier = LEAGUES[league.tier];
  if (args.follow) await followUsers(client, league.rankings);
  const following = await client.getFollowing();

  if (args.json) console.log(JSON.stringify(league, undefined, 2));
  else {
    console.log(`${tier.emoji} ${tier.name}`);
    printTable(
      league.rankings.map((user, index) =>
        getRow(
          user,
          index,
          following.find((f) => f.userId === user.user_id) !== undefined,
        )
      ),
    );
  }
}
