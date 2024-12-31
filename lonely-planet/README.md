# @tugrulates/lonely-planet ([jsr.io](https://jsr.io/@tugrulates/lonely-planet))

## CLI

Run `lonely-planet` after installation, or run
`deno run -A @tugrulates/lonely-planet` without installation.

### Examples

Search destinations for 'big sur'.

```sh
lonely-planet big sur
```

Search attractions.

```sh
lonely-planet --attractions amsterdam
```

Search stories.

```sh
lonely-planet --stories amsterdam
```

All.

```sh
lonely-planet --destinations --attractions --stories
```

Stream destinations as json.

```sh
lonely-planet --json | jq
```

## Exports

### [`LonelyPlanetClient`](https://jsr.io/@tugrulates/lonely-planet/doc/~/LonelyPlanetClient) (class)

Client for interacting with the Lonely Planet API.

Requires credentials to the Typesense API, which can be obtained from the Lonely
Planet frontend.
