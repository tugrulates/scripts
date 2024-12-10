/** @module 500px/client */

import { GraphQLClient } from "../common/graphql.ts";
import { Category, Photo, User } from "./types.ts";

/** Client for 500px API. */
export class FiveHundredPxClient {
  private client: GraphQLClient;

  constructor(options: { token?: string } = {}) {
    this.client = new GraphQLClient("https://api.500px.com/graphql", options);
  }

  async getPhotos(username: string) {
    return await this.client.queryPaginated<
      {
        user: {
          photos: {
            edges: { node: Photo }[];
            totalCount: number;
            pageInfo: { endCursor: string; hasNextPage: boolean };
          };
        };
      },
      Photo
    >(
      ["photos", "photo"],
      (data) => data.user.photos,
      (data) =>
        data.user.photos.pageInfo.hasNextPage
          ? data.user.photos.pageInfo.endCursor
          : null,
      { username },
    );
  }

  async getFollowing(username: string) {
    return await this.client.queryPaginated<
      {
        user: {
          following: {
            users: {
              edges: { node: User }[];
              totalCount: number;
              pageInfo: { endCursor: string; hasNextPage: boolean };
            };
          };
        };
      },
      User
    >(
      ["following", "user"],
      (data) => data.user.following.users,
      (data) =>
        data.user.following.users.pageInfo.hasNextPage
          ? data.user.following.users.pageInfo.endCursor
          : null,
      { username },
    );
  }

  async getFollowers(username: string) {
    return await this.client.queryPaginated<
      {
        user: {
          followedBy: {
            users: {
              edges: { node: User }[];
              totalCount: number;
              pageInfo: { endCursor: string; hasNextPage: boolean };
            };
          };
        };
      },
      User
    >(
      ["followers", "user"],
      (data) => data.user.followedBy.users,
      (data) =>
        data.user.followedBy.users.pageInfo.hasNextPage
          ? data.user.followedBy.users.pageInfo.endCursor
          : null,
      { username },
    );
  }

  async getForYouFeed(
    options: { limit?: number; categories?: Category[] } = {},
  ): Promise<Photo[]> {
    return (await this.client.queryPaginated<
      {
        feed: {
          edges: { node: { cardNode: Photo } }[];
          totalCount: number;
          pageInfo: { endCursor: string; hasNextPage: boolean };
        };
      },
      { cardNode: Photo }
    >(
      ["foryou"],
      (data) => data.feed,
      (
        data,
      ) => (data.feed.pageInfo.hasNextPage
        ? data.feed.pageInfo.endCursor
        : null),
      {
        categories: options.categories?.map((category) => category.id),
        showNude: options.categories?.some((category) => category.nude),
        limit: options.limit,
      },
    )).map((card) => card.cardNode);
  }
}
