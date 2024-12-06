/** Prints follow information.
 *
 * Usage:
 *   500px/follows.ts --username <username> --token <token>
 *
 * Output:
 *   {
 *     "following": [ { "userId": 123456, "username": "example" } ],
 *     "followers": [ { "userId": 123456, "username": "example" } ],
 *     "dontFollowBack": [],
 *     "notFollowingBack": []
 *   }
 */

import { parseArgs } from "jsr:@std/cli";
import { DuolingoClient } from "./client.ts";

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["username", "token"],
    boolean: ["json"],
  });
  if (!args.username || !args.token) {
    console.error(
      `Usage: follows.ts --username <username> --token <token> [--json]`,
    );
    Deno.exit(1);
  }

  const client = new DuolingoClient(args.username, args.token);
  const [following, followers] = await Promise.all([
    client.getFollowing(),
    client.getFollowers(),
  ]);
  const result = {
    following,
    followers,
    dontFollowBack: following.filter(({ userId }) =>
      !followers.some((user) => user.userId === userId)
    ),
    notFollowingBack: followers.filter(({ userId }) =>
      !following.some((user) => user.userId === userId)
    ),
  };

  if (args.json) console.log(JSON.stringify(result, undefined, 2));
  else {
    console.log(`👤 Following ${result.following.length} people.`);
    console.log(`👤 Followed by ${result.followers.length} people.`);
  }
}
