/** @module duolingo/client */

import { JsonClient } from "../common/request.ts";
import { FeedCard, Friend, League, Reaction } from "./types.ts";

export const CONCURRENCY = 1;

/** Client for Duolingo API. */
export class DuolingoClient {
  private coreClient: JsonClient;
  private leagueClient: JsonClient;
  private userid?: number;

  constructor(private username: string, token: string) {
    this.coreClient = new JsonClient("https://www.duolingo.com", { token });
    this.leagueClient = new JsonClient(
      "https://duolingo-leaderboards-prod.duolingo.com",
      { token },
    );
    this.username = username;
  }

  /** Gets the user ID for the given username. */
  async getUserId(): Promise<number> {
    if (!this.username) throw new Error("Username is required");
    if (this.userid) return this.userid;
    this.userid = (await this.coreClient.get<{ users: { id: number }[] }>(
      `/2017-06-30/users?fields=users%7Bid%7D&username=${this.username}`,
    )).users[0].id;
    return this.userid;
  }

  /** Gets the list of users that the user is following. */
  async getFollowing(): Promise<Friend[]> {
    const me = await this.getUserId();
    return (await this.coreClient.get<{ following: { users: Friend[] } }>(
      `/2017-06-30/friends/users/${me}/following`,
    )).following.users;
  }

  /** Gets the list of users that are following the user. */
  async getFollowers(): Promise<Friend[]> {
    const me = await this.getUserId();
    return (await this.coreClient.get<{ followers: { users: Friend[] } }>(
      `/2017-06-30/friends/users/${me}/followers`,
    )).followers.users;
  }

  /** Gets the feed for the user. */
  async getFeed(): Promise<FeedCard[]> {
    const me = await this.getUserId();
    return (await this.coreClient.get<{ feed: { feedCards: FeedCard[] }[] }>(
      `/2017-06-30/friends/users/${me}/feed/v2?uiLanguage=en`,
    )).feed.flatMap((feed) => feed.feedCards);
  }

  async getLeague(): Promise<League> {
    const me = await this.getUserId();
    return (await this.coreClient.get<{ active: { cohort: League } }>(
      `/leaderboards/7d9f5dd1-8423-491a-91f2-2532052038ce/users/${me}?client_unlocked=true&get_reactions=true`,
    )).active.cohort;
  }

  /** Sends a reaction to a feed event. */
  async sendReaction(
    eventId: string,
    reaction: Reaction,
  ): Promise<void> {
    await this.coreClient.post(`/card/reaction`, {
      groupId: eventId,
      reaction: reaction.toUpperCase(),
      reactionTimestamp: new Date().getTime(),
      trackingProperties: { screen: "kudos_feed" },
      userId: await this.getUserId(),
    });
  }

  /** Follows a user. */
  async followUser(
    userId: number,
  ): Promise<void> {
    const me = await this.getUserId();
    await this.coreClient.post(
      `/2017-06-30/friends/users/${me}/follow/${userId}`,
      { component: "kudos_feed" },
    );
  }
}
