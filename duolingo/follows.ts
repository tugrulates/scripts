/** Prints follow information, and optionally follows or unfollows users
 *
 * Usage:
 *   duolingo/follows.ts --username <username> --token <token> [--follow] [--unfollow] [--json]
 *
 * Output:
 *   👤 Following 10 people.
 *   👤 Followed by 10 people.
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
import { checkRequired } from "../common/cli.ts";
import { pool } from "../common/pool.ts";
import { DuolingoClient } from "./client.ts";

async function getFollows(client: DuolingoClient) {
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

if (import.meta.main) {
  const spec = {
    required: ["username", "token"],
    string: ["username", "token"],
    boolean: ["follow", "unfollow", "json"],
  } as const;
  const args = parseArgs(Deno.args, spec);
  checkRequired(spec, "username", args.username);
  checkRequired(spec, "token", args.token);
  console.log(args.test);

  const client = new DuolingoClient(args.username, args.token);
  let result = await getFollows(client);

  if (args.follow || args.unfollow) {
    if (args.follow) {
      await pool(
        result.notFollowingBack,
        async (user) => await client.followUser(user.userId),
      );
    }
    if (args.unfollow) {
      await pool(
        result.dontFollowBack,
        async (user) => await client.unfollowUser(user.userId),
      );
    }
    result = await getFollows(client);
  }

  if (args.json) console.log(JSON.stringify(result, undefined, 2));
  else {
    console.log(`👤 Following ${result.following.length} people.`);
    console.log(`👤 Followed by ${result.followers.length} people.`);
  }
}
