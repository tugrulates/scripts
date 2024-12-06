/** @module 500px/client */

import { GraphQLClient } from "../common/graphql.ts";

/** A user. */
export interface User {
  id: string;
  canonicalPath: string;
  displayName: string;
}

/** A submitted photo. */
export interface Photo {
  id: string;
  canonicalPath: string;
  name: string;
  categoryId: number;
  category: keyof typeof CATEGORIES;
  uploadedAt: string;
  timesViewed: number;
  likedByUsers: { totalCount: number };
  pulse: { highest: number };
  photographer: User;
}

/** A photo category. */
export interface Category {
  id: number;
  nude: boolean;
}

/** All categories. */
export const CATEGORIES = {
  UNCATEGORIZED: { id: 0, nude: false },
  CELEBRITIES: { id: 1, nude: false },
  FILM: { id: 2, nude: false },
  JOURNALISM: { id: 3, nude: false },
  NUDE: { id: 4, nude: true },
  BLACK_AND_WHITE: { id: 5, nude: false },
  STILL_LIFE: { id: 6, nude: false },
  PEOPLE: { id: 7, nude: false },
  LANDSCAPES: { id: 8, nude: false },
  CITY_AND_ARCHITECTURE: { id: 9, nude: false },
  ABSTRACT: { id: 10, nude: false },
  ANIMALS: { id: 11, nude: false },
  MACRO: { id: 12, nude: false },
  TRAVEL: { id: 13, nude: false },
  FASHION: { id: 14, nude: false },
  COMMERCIAL: { id: 15, nude: false },
  CONCERT: { id: 16, nude: false },
  SPORT: { id: 17, nude: false },
  NATURE: { id: 18, nude: false },
  PERFORMING_ARTS: { id: 19, nude: false },
  FAMILY: { id: 20, nude: false },
  STREET: { id: 21, nude: false },
  UNDERWATER: { id: 22, nude: false },
  FOOD: { id: 23, nude: false },
  FINE_ART: { id: 24, nude: false },
  WEDDING: { id: 25, nude: false },
  TRANSPORTATION: { id: 26, nude: false },
  URBAN_EXPLORATION: { id: 27, nude: false },
  AERIAL: { id: 29, nude: false },
  NIGHT: { id: 30, nude: false },
  BOUDOIR: { id: 31, nude: true },
} as const;

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
      },
    )).map((card) => card.cardNode);
  }
}
