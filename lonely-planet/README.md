# lonely-planet ([jsr.io](https://jsr.io/@tugrulates/lonely-planet))

## CLI

Run `lonely-planet` after installation, or run
`deno run -A @tugrulates/lonely-planet` without installation.

### Examples

| Command                                                | Description                        |
| ------------------------------------------------------ | ---------------------------------- |
| `lonely-planet big sur`                                | Search destinations for 'big sur'. |
| `lonely-planet --attractions amsterdam`                | Search attractions.                |
| `lonely-planet --stories amsterdam`                    | Search stories.                    |
| `lonely-planet --destinations --attractions --stories` | All.                               |
| `lonely-planet --json \| jq`                           | Stream destinations as json.       |

## Classes

### [LonelyPlanetClient](https://jsr.io/@tugrulates/lonely-planet/doc/~/LonelyPlanetClient)

Client for interacting with the Lonely Planet API.

Requires credentials to the Typesense API, which can be obtained from the Lonely
Planet frontend.
