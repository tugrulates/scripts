import { Command } from "jsr:@cliffy/command";
import { pool } from "../common/async.ts";
import { getClient } from "./cli.ts";

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
 * Command line interface for managing followers.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
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

if (import.meta.main) {
  await command.parse();
}
