import { Command } from "jsr:@cliffy/command";
import { pool } from "../common/async.ts";
import { getClient } from "./cli.ts";
import { REACTIONS } from "./data.ts";
import { FeedCard, Friend, Reaction } from "./types.ts";

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

/**
 * Command line interface for interacting with the feed.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
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

if (import.meta.main) {
  await command.parse();
}
