import { Command } from "jsr:@cliffy/command";
import { Table } from "jsr:@cliffy/table";
import { pool } from "../common/async.ts";
import { Config } from "../common/cli.ts";
import { DuolingoClient } from "./client.ts";
import { LANGUAGES, LEAGUES, REACTIONS } from "./data.ts";
import type {
  FeedCard,
  Friend,
  LanguageCode,
  League,
  LeagueUser,
  Reaction,
} from "./types.ts";

const username = new Config("username");
const token = new Config("token", { secret: true });

/** Duolingo client built from common CLI options. */
export async function getClient(): Promise<DuolingoClient> {
  return new DuolingoClient(await username.get(), await token.get());
}

/**
 * Engages with the event, following the user or sending a reaction.
 *
 * @param followers List of followers, to skip in follow-backs.
 * @param card Card to engage with.
 * @returns True if the event was engaged with.
 */
async function engageWithCard(
  followers: Friend[],
  card: FeedCard,
): Promise<boolean> {
  const client = await getClient();
  if (card.cardType === "FOLLOW") {
    const user = followers.find((user) => user.userId === card.userId);
    if (!user?.isFollowing) {
      await client.followUser(card.userId);
      return true;
    }
  } else if (
    card.cardType === "KUDOS_OFFER" ||
    card.cardType === "SHARE_SENTENCE_OFFER"
  ) {
    if (!card.reactionType) {
      await client.sendReaction(card.eventId, getReaction(card));
      return true;
    }
  }
  return false;
}

/**
 * Fetches and organizes follow information.
 *
 * @returns Users who are followed, users who follow, and their difference sets.
 */
async function getFollows() {
  const client = await getClient();
  const [following, followers] = await Promise.all([
    client.getFollowing(),
    client.getFollowers(),
  ]);
  return {
    following,
    followers,
    dontFollowBack: following.filter(({ userId }) =>
      !followers.some((user) => user.userId === userId)
    ),
    notFollowingBack: followers.filter(({ userId }) =>
      !following.some((user) => user.userId === userId)
    ),
  };
}

/**
 * Follows all the users in the league.
 *
 * @param users Users to follow.
 */
async function followLeagueUsers(users: LeagueUser[]) {
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
function getLeagueUserEmoji(user: LeagueUser): string {
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
async function outputLeague(league: League) {
  const client = await getClient();
  const following = await client.getFollowing();
  const tier = LEAGUES[league.tier];
  new Table()
    .header([tier.emoji, tier.name])
    .body(
      league.rankings.map((user, index) => [
        `${index + 1}.`,
        `${user.display_name} ${getLeagueUserEmoji(user)}`,
        following ? "👤" : "",
        `${user.score.toString()} XP`,
      ]),
    )
    .columns([{ align: "right" }, {}, {}, { align: "right" }])
    .render();
}

/**
 * Returns the reaction on the card, or picks an appripriate one.
 *
 * @param card Card to get the reaction for.
 * @returns Reaction on the card.
 */
function getReaction(card: FeedCard): Reaction {
  if (card.reactionType) return card.reactionType;
  if (card.cardType === "SHARE_SENTENCE_OFFER") return "like";
  const number = card.body.match(/\d+/);
  if (number && Number(number[0]) % 100 === 0) return "cheer";
  if (
    card.triggerType === "top_three" || card.triggerType === "league_promotion"
  ) return "love";
  if (card.triggerType === "resurrection") return "high_five";
  if (card.triggerType === "monthly_goal") return "support";
  if (card.defaultReaction !== null) return card.defaultReaction;
  return "cheer";
}

/**
 * Returns the display emoji for the card.
 *
 * @param card Card to get the emoji for.
 * @returns Display emoji for the card.
 */
function getEmoji(card: FeedCard): string {
  if (card.cardType === "FOLLOW" || card.cardType === "FOLLOW_BACK") {
    return "👤";
  }
  return REACTIONS[getReaction(card)];
}

/**
 * Returns the display summary of the card.
 *
 * @param card Card to get the summary for.
 * @returns Display summary of the card.
 */
function getSummary(card: FeedCard): string {
  return card.header?.replace(/<[^>]+>/g, "") ??
    `${card.displayName} ${card.body.toLowerCase()}`;
}

export const feedCommand = new Command()
  .description("Prints and interacts with the feed.")
  .example("duolingo feed", "Prints the feed.")
  .example("duolingo feed --engage", "Engages with the feed.")
  .example("duolingo feed --json | jq", "Query JSON over the feed.")
  .option("--engage", "Engage with the feed events.")
  .option("--json", "Output the feed as JSON.")
  .action(async ({ engage, json }) => {
    const client = await getClient();
    const followers = await client.getFollowers();
    const cards = await client.getFeedCards();
    if (json) console.log(JSON.stringify(cards, undefined, 2));
    await pool(
      cards,
      async (card) => {
        if (!engage || await engageWithCard(followers, card)) {
          if (!json) console.log(`${getEmoji(card)} ${getSummary(card)}`);
        }
      },
    );
  });

export const followsCommand = new Command()
  .description("Prints and manages follower information on Duolingo.")
  .example("duolingo follows", "Prints follow counts.")
  .example("duolingo follows --follows", "Follow users who follow.")
  .example("duolingo follows --unfollow", "Unfollow users who dont' follow.")
  .example("duolingo follows --follow --unfollow", "Matches both lists.")
  .example("duolingo follows --json", "Outputs JSON of follower information.")
  .example(
    "duolingo follows --json | jq",
    "Query JSON for follower information.",
  )
  .example(
    "duolingo follows --json | jq '.dontFollowBack[].username'",
    "List users who are followed but don't follow back.",
  )
  .example(
    "duolingo follows --json | jq '.notFollowingBack[].username'",
    "List users who follow but are not followed back.",
  )
  .option("--follow", "Follow users who follow.")
  .option("--unfollow", "Unfollow users who don't follow.")
  .option("--json", "Output the follower information as JSON.")
  .action(async ({ follow, unfollow, json }) => {
    const client = await getClient();
    let result = await getFollows();

    if (follow || unfollow) {
      if (follow) {
        await pool(
          result.notFollowingBack,
          async (user) => {
            await client.followUser(user.userId);
            if (!json) console.log(`✅ Followed ${user.username}.`);
          },
        );
      }
      if (unfollow) {
        await pool(
          result.dontFollowBack,
          async (user) => {
            await client.unfollowUser(user.userId);
            if (!json) console.log(`❌ Unfollowed ${user.username}.`);
          },
        );
      }
      result = await getFollows();
    }

    if (json) console.log(JSON.stringify(result, undefined, 2));
    else {
      console.log(`👤 Following ${result.following.length} people.`);
      console.log(`👤 Followed by ${result.followers.length} people.`);
    }
  });
export const leagueCommand = new Command()
  .description("Prints and interacts with the current Duolingo league.")
  .example("duolingo league", "Prints the league.")
  .example("duolingo league --follow", "Follows users in the league.")
  .example("duolingo league --json | jq", "Query JSON over the league.")
  .option("--follow", "Follow users in the league.")
  .option("--json", "Output the league as JSON.")
  .action(async ({ follow, json }) => {
    const client = await getClient();
    const league = await client.getLeague();
    if (follow) await followLeagueUsers(league.rankings);
    if (json) console.log(JSON.stringify(league, undefined, 2));
    else await outputLeague(league);
  });

/**
 * Command line interface for Duolingo.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .name("duolingo")
  .description("Interact with Duolingo.")
  .example("duolingo --username <username> --token <token>", "Configure.")
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
  .command("feed", feedCommand)
  .command("follows", followsCommand)
  .command("league", leagueCommand);

if (import.meta.main) {
  await command.parse();
}
