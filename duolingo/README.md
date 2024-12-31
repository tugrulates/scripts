# duolingo [jsr.io](https://jsr.io/@tugrulates/duolingo)

## CLI

Run `duolingo` after installation, or run `deno run -A @tugrulates/duolingo`
without installation.

### Examples

| Command                                                        | Description                                        |
| -------------------------------------------------------------- | -------------------------------------------------- |
| `duolingo --username <username> --token <token>`               | Configure.                                         |
| `duolingo --clear`                                             | Clear the cached configuration.                    |
| `duolingo feed`                                                | Prints the feed.                                   |
| `duolingo feed --engage`                                       | Engages with the feed.                             |
| `duolingo feed --json \| jq`                                   | Query JSON over the feed.                          |
| `duolingo follows`                                             | Prints follow counts.                              |
| `duolingo follows --follows`                                   | Follow users who follow.                           |
| `duolingo follows --unfollow`                                  | Unfollow users who dont' follow.                   |
| `duolingo follows --follow --unfollow`                         | Matches both lists.                                |
| `duolingo follows --json`                                      | Outputs JSON of follower information.              |
| `duolingo follows --json \| jq`                                | Query JSON for follower information.               |
| `duolingo follows --json \| jq '.dontFollowBack[].username'`   | List users who are followed but don't follow back. |
| `duolingo follows --json \| jq '.notFollowingBack[].username'` | List users who follow but are not followed back.   |
| `duolingo league`                                              | Prints the league.                                 |
| `duolingo league --follow`                                     | Follows users in the league.                       |
| `duolingo league --json \| jq`                                 | Query JSON over the league.                        |

## Classes

### [DuolingoClient](https://jsr.io/@tugrulates/duolingo/doc/~/DuolingoClient)

A client for interacting with the Duolingo API.

Requires the JWT (JSON web token) for the logged-in user.
