# duolingo ([jsr.io](https://jsr.io/@tugrulates/duolingo))

## CLI

Run `duolingo` after installation, or run `deno run -A @tugrulates/duolingo`
without installation.

### Examples

Configure.

```sh
duolingo --username <username> --token <token>
```

Clear the cached configuration.

```sh
duolingo --clear
```

Prints the feed.

```sh
duolingo feed
```

Engages with the feed.

```sh
duolingo feed --engage
```

Query JSON over the feed.

```sh
duolingo feed --json | jq
```

Prints follow counts.

```sh
duolingo follows
```

Follow users who follow.

```sh
duolingo follows --follows
```

Unfollow users who dont' follow.

```sh
duolingo follows --unfollow
```

Matches both lists.

```sh
duolingo follows --follow --unfollow
```

Outputs JSON of follower information.

```sh
duolingo follows --json
```

Query JSON for follower information.

```sh
duolingo follows --json | jq
```

List users who are followed but don't follow back.

```sh
duolingo follows --json | jq '.dontFollowBack[].username'
```

List users who follow but are not followed back.

```sh
duolingo follows --json | jq '.notFollowingBack[].username'
```

Prints the league.

```sh
duolingo league
```

Follows users in the league.

```sh
duolingo league --follow
```

Query JSON over the league.

```sh
duolingo league --json | jq
```

## Classes

### [`DuolingoClient`](https://jsr.io/@tugrulates/duolingo/doc/~/DuolingoClient)

A client for interacting with the Duolingo API.

Requires the JWT (JSON web token) for the logged-in user.
