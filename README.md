# Various scripts

## `500px/discover.ts`

Prints a list of active and high quality users on 500px.

### Usage

```sh
$ deno -A 500px/discover.ts [--categories...] [--json]
👤 /user1
👤 /user2
👤 /user3
```

### Categories

```sh
deno -A 500px/discover.ts --animals --city-architecture --landscapes
```

### JSON

```json
{ "discover": ["/user2", "/user3"] }
```

## `500px/follows.ts`

Prints follow information on 500px.

### Usage

```sh
deno -A 500px/follows.ts <username> [--json]
```

```sh
👤 Following 10 people.
👤 Followed by 10 people.
```

### JSON

```json
{
  "following": [{ "id": "id1", "displayName": "example1" }],
  "followers": [{ "id": "id2", "displayName": "example2" }],
  "dontFollowBack": [],
  "notFollowingBack": []
}
```

## `500px/photos.ts`

Prints the list of photos for a 500px user.

### Usage

```sh
deno -A 500px/photos.ts <username> [--json]
```

```
🏞️ Coordinating Phoenix  📈91.1 👁️1085 ❤️95
🏞️ Architectural Lasagna 📈91.9 👁️1176 ❤️142
```

### CSV

```sh
deno -A 500px/photos.ts <username> --json | jq -rf 500px/photos.csv.jq
```

```csv
"Link","Title","Date","Views","Likes","Pulse"
...
```

## `duolingo/feed.ts`

Prints the current Duolingo feed.

Optionally and jovially engages with the events.

### Usage

```sh
deno -A duolingo/feed.ts <username> <token> [--engage] [--json]
```

```
🎉 John Doe Completed a 30 day streak!
👤 Jane Doe started following you!
```

## `duolingo/follows.ts`

Prints follow information on Duolingo.

Optionally follows users who follow, or unfollows users who don't.

### Usage

```sh
$ deno -A duolingo/follows.ts <username> <token> [--follow] [--unfollow] [--json]
```

```
👤 Following 10 people.
👤 Followed by 10 people.
```

### JSON

```
{
  "following": [ { "userId": 123456, "username": "example" } ],
  "followers": [ { "userId": 123456, "username": "example" } ],
  "dontFollowBack": [],
  "notFollowingBack": []
}
```

## `duolingo/league.ts`

Prints the current league status on Duolingo.

Optionally follows leaguemates.

### Usage

```sh
deno -A duolingo/league.ts <username> <token> [--json] [--follow]
```

```
🩷 Pearl League
1. Friend     👤 400 XP
3. You            80 XP
4. Non-friend     10 XP
```

## `instagram/discover.js`

Discover relevant accounts to follow on Instagram.

Paste the whole file into web console, and call these functions.

### On any page

```js
openNotifications();
openNotificationFilters();
enableFollowsFilter();
applyFilters();
const profiles = getProfiles();
profiles;
```

### On a post page

```js
openPostLikes();
scrollToLikesDialogBottom();
const profiles = getProfiles();
profiles;
```

## `instagram/follows.js`

Pull follower information on Instagram.

### On any page

Paste the whole file into web console, and wait for results.

```js
follows.following;
follows.followers;
follows.dontFollowBack;
follows.notFollowingBack;
copy(follows);
```

## `instagram/stats.js`

Pull post insights on Instagram.

Paste the whole file into web console, and call these functions.

### On a profile page

```js
const posts = getPosts();
posts;
window.open(posts[0]);
```

### On a post page

```js
openPostMetrics();
const metrics = getMetrics();
metrics;
```

## `photos/exif.ts`

Displays information about the jpg files for a photo directory.

### Usage

```sh
deno -A photos/exif.ts [photos...] [--copy] [--json]
```

```
🖼 Title [⚠️ warnings]
```
