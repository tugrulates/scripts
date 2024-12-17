import { Command } from "jsr:@cliffy/command";
import { FiveHundredPxClient } from "./client.ts";

/**
 * Command line interface for managing followers.
 *
 * @ignore missing-explicit-type
 */
export const command = new Command()
  .description("Prints follower information on 500px.")
  .example("500px follows", "Prints follow counts.")
  .example("500px follows --follows", "Follow users who follow.")
  .example("500px follows --unfollow", "Unfollow users who dont' follow.")
  .example("500px follows --follow --unfollow", "Matches both lists.")
  .example("500px follows --json", "Outputs JSON of follower information.")
  .example(
    "500px follows --json | jq",
    "Query JSON for follower information.",
  )
  .example(
    "500px follows --json | jq '.dontFollowBack[].username'",
    "List users who are followed but don't follow back.",
  )
  .example(
    "500px follows --json | jq '.notFollowingBack[].username'",
    "List users who follow but are not followed back.",
  )
  .arguments("<username:string>")
  .option("--json", "Output the follower information as JSON.")
  .action(async ({ json }, username) => {
    const client = new FiveHundredPxClient();
    const [following, followers] = await Promise.all([
      client.getFollowing(username),
      client.getFollowers(username),
    ]);
    const result = {
      following,
      followers,
      dontFollowBack: following.filter(({ id }) =>
        !followers.some((user) => user.id === id)
      ),
      notFollowingBack: followers.filter(({ id }) =>
        !following.some((user) => user.id === id)
      ),
    };

    if (json) console.log(JSON.stringify(result, undefined, 2));
    else {
      console.log(`👤 Following ${result.following.length} people.`);
      console.log(`👤 Followed by ${result.followers.length} people.`);
    }
  });

if (import.meta.main) {
  await command.parse();
}
