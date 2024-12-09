/** Prints the current feed, and optionally and jovially engages with it.
 *
 * Usage:
 *  500px/feed.ts --username <username> --token <token> [--engage] [--json]
 *
 * Output:
 *   🎉 John Doe Completed a 30 day streak!
 *   👤 Jane Doe started following you!
 */

import { pooledMap } from "jsr:@std/async";
import { parseArgs } from "jsr:@std/cli";
import { DuolingoClient, FeedCard, Friend, Reaction } from "./client.ts";

const CONCURRENCY = 1;
const REACTIONS: Record<Reaction, string> = {
  congrats: "🎉",
  high_five: "🙏",
  support: "💪",
  cheer: "💯",
  love: "💖",
  like: "👍",
  haha: "😂",
};

/** Returns the reaction on the card, or picks an appripriate one. */
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

/** Returns the display emoji for the card. */
function getEmoji(card: FeedCard): string {
  if (card.cardType === "FOLLOW" || card.cardType === "FOLLOW_BACK") {
    return "👤";
  }
  return REACTIONS[getReaction(card)];
}

/** Returns the display summary of the card. */
function getSummary(card: FeedCard): string {
  return card.header?.replace(/<[^>]+>/g, "") ??
    `${card.displayName} ${card.body.toLowerCase()}`;
}

/** Engages with the event, following the user or sending a reaction. */
async function engage(
  client: DuolingoClient,
  followers: Friend[],
  card: FeedCard,
): Promise<boolean> {
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

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["username", "token"],
    boolean: ["json", "engage"],
  });
  if (!args.username || !args.token) {
    console.error(
      `Usage: feed.ts --username <username> --token <token> [--json] [--engage]`,
    );
    Deno.exit(1);
  }
  const client = new DuolingoClient(args.username, args.token);
  const followers = await client.getFollowers();
  const feed = await client.getFeed();
  if (args.json) console.log(JSON.stringify(feed, undefined, 2));
  await Array.fromAsync(
    pooledMap(
      CONCURRENCY,
      feed,
      async (card) => {
        if (!args.engage || await engage(client, followers, card)) {
          if (!args.json) console.log(getEmoji(card), getSummary(card));
        }
      },
    ),
  );
}
