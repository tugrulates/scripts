# 500px ([jsr.io](https://jsr.io/@tugrulates/500px))

Test doc.

## CLI

Run `500px` after installation, or run `deno run -A @tugrulates/500px` without
installation.

### Examples

Prints a list of users with high scored photos.

```sh
500px discover
```

Finds food photographers.

```sh
500px discover --filter food
```

Either category.

```sh
500px discover --filter macro --filter animals
```

Query users as JSON.

```sh
500px discover --json | jq
```

Prints follow counts.

```sh
500px follows
```

Follow users who follow.

```sh
500px follows --follows
```

Unfollow users who dont' follow.

```sh
500px follows --unfollow
```

Matches both lists.

```sh
500px follows --follow --unfollow
```

Outputs JSON of follower information.

```sh
500px follows --json
```

Query JSON for follower information.

```sh
500px follows --json | jq
```

List users who are followed but don't follow back.

```sh
500px follows --json | jq '.dontFollowBack[].username'
```

List users who follow but are not followed back.

```sh
500px follows --json | jq '.notFollowingBack[].username'
```

Prints the list of photos for a user.

```sh
500px photos <username>
```

Query photos as JSON.

```sh
500px photos <username> --json | jq
```

## Classes

### [`FiveHundredPxClient`](https://jsr.io/@tugrulates/500px/doc/~/FiveHundredPxClient)

Client for interacting with the 500px GraphQL API.

Provides the logged out experience, and does not require authentication.
