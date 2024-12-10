/** @module common/graphql */

import {
  AnyVariables,
  cacheExchange,
  Client,
  fetchExchange,
  gql,
} from "npm:@urql/core";
import { retryExchange } from "npm:@urql/exchange-retry";
import { RequestError } from "./request.ts";

/** Client for GraphQL APIs. */
export class GraphQLClient {
  private client;

  constructor(private url: string, private options: { token?: string } = {}) {
    this.client = new Client({
      url,
      exchanges: [cacheExchange, retryExchange({}), fetchExchange],
      fetchOptions: () => {
        return {
          headers: {
            ...(options.token
              ? { "Authorization": `Bearer ${options.token}` }
              : {}),
          },
        };
      },
    });
  }

  /** Make a GraphQL query. */
  async query<T>(
    queryPaths: string[],
    variables: AnyVariables = {},
  ): Promise<T> {
    const query = (await Promise.all(
      queryPaths.map(async (path) =>
        await Deno.readTextFile(
          new URL(`${path}.graphql`, Deno.mainModule),
        )
      ),
    )).join("\n");
    const response = await this.client.query(query, variables);
    if (response.error) {
      throw new RequestError(response.error.message);
    }
    return response.data as T;
  }

  /** Make a paginated GraphQL query. */
  async queryPaginated<T, U>(
    queryPaths: string[],
    getEdges: (data: T) => { edges: { node: U }[] },
    getCursor: (data: T) => string | null,
    variables: AnyVariables & { cursor?: string; limit?: number } = {},
  ): Promise<U[]> {
    let nodes: U[] = [];
    let cursor: string | null = null;
    do {
      const data = await this.query<T>(queryPaths, { ...variables, cursor });
      nodes = nodes.concat(getEdges(data).edges.map((edge) => edge.node));
      cursor = getCursor(data);
    } while (
      cursor &&
      (variables.limit === undefined || nodes.length < variables.limit)
    );
    return nodes;
  }
}

export { gql };
