/** @module pulsepx/client */

import { GraphQLClient } from "../common/graphql.ts";

/** A quest that has ended. */
export interface Quest {
  title: string;
  myEntries: {
    awards: { type: "TOKEN" | string; description: string }[];
    integral: number;
    rank: number;
  }[];
  userHasUnreceivedPrizes: boolean;
}

export class PulsePxClient {
  private client: GraphQLClient;

  constructor(options: { token?: string } = {}) {
    this.client = new GraphQLClient("https://api.pulsepx.com/graphql", options);
  }

  async getEndedQuests(): Promise<Quest[]> {
    return await this.client.queryPaginated<{
      getEndedQuests: {
        edges: { node: Quest }[];
        totalCount: number;
        pageInfo: { endCursor: string; hasNextPage: boolean };
      };
    }, Quest>(
      ["quests"],
      (data) => data.getEndedQuests,
      (data) =>
        data.getEndedQuests.pageInfo.hasNextPage
          ? data.getEndedQuests.pageInfo.endCursor
          : null,
    );
  }
}
