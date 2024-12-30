# @tugrulates/500px ([jsr.io](https://jsr.io/@tugrulates/500px))

Test doc

## CLI

Run `500px` after installation,
or run `deno run -A @tugrulates/500px` without installation.

### Examples

```sh
# Prints a list of users with high scored photos.
500px discover
# Finds food photographers.
500px discover --filter food
# Either category.
500px discover --filter macro --filter animals
# Query users as JSON.
500px discover --json | jq
# Prints follow counts.
500px follows
# Follow users who follow.
500px follows --follows
# Unfollow users who dont' follow.
500px follows --unfollow
# Matches both lists.
500px follows --follow --unfollow
# Outputs JSON of follower information.
500px follows --json
# Query JSON for follower information.
500px follows --json | jq
# List users who are followed but don't follow back.
500px follows --json | jq '.dontFollowBack[].username'
# List users who follow but are not followed back.
500px follows --json | jq '.notFollowingBack[].username'
# Prints the list of photos for a user.
500px photos <username>
# Query photos as JSON.
500px photos <username> --json | jq
```

## Exports

### [`FiveHundredPxClient`](https://jsr.io/@tugrulates/500px/doc/~/FiveHundredPxClient)

Client for interacting with the 500px GraphQL API.

Provides the logged out experience, and does not require authentication.


### [`main`](https://jsr.io/@tugrulates/500px/doc/~/main)

Test doc



