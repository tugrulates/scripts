/** Prints the list of ended quests for the user.
 *
 * Usage:
 *  pulsepx/quests.ts --token <token> [--json]
 *
 * Output:
 *   🏆 Frame Within a Frame        🏅119      🔥2525     💰10
 *   🏆 One Color Only              🏅17       🔥1931     💰150
 *
 * CSV:
 *   pulsepx/quests.ts --token <token> --json | jq -f pulsepx/quests.csv.jq
 */

import { parseArgs } from "jsr:@std/cli";
import { PulsePxClient, Quest } from "./client.ts";

/** Returns the display summary of the quest. */
function getSummary(quest: Quest): string {
  const title = `🏆 ${quest.title}`.padEnd(30);
  const rank = quest.myEntries.map((e) => `🏅${e.rank}`.padEnd(10));
  const integral = quest.myEntries.map((e) => `🔥${e.integral}`.padEnd(10));
  const award = quest.myEntries.map((e) =>
    e.awards.map((a) =>
      `${a.type === "TOKEN" ? "💰" : "?"}${a.description}`.padEnd(10)
    )
  );
  return `${title} ${rank} ${integral} ${award}`;
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, { string: ["token"], boolean: ["json"] });
  if (!args.token) {
    console.error(`Usage: quests.ts --token <token> [--json]`);
    Deno.exit(1);
  }

  const client = new PulsePxClient(args);
  const quests = await client.getEndedQuests();

  if (args.json) console.log(JSON.stringify(quests, undefined, 2));
  else quests.forEach((quest) => console.log(getSummary(quest)));
}
