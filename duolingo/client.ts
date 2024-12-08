/** @module duolingo/client */

import { JsonClient } from "../common/request.ts";

/** Another user, like a follower. */
export interface Friend {
  canFollow: boolean;
  displayName: string;
  hasSubscription: boolean;
  isCurrentlyActive: boolean;
  isFollowedBy: boolean;
  isFollowing: boolean;
  isVerified: boolean;
  picture: string;
  subscriptionItemType: string;
  totalXp: number;
  userId: number;
  username: string;
}

/** A reaction to a feed event. */
export type Reaction =
  | "congrats"
  | "high_five"
  | "support"
  | "cheer"
  | "love"
  | "like"
  | "haha";

/** A feed card, like a milestone. */
export interface FeedCard {
  body: string;
  cardId: string;
  cardType:
    | "FOLLOW"
    | "FOLLOW_BACK"
    | "KUDOS_MILESTONE"
    | "KUDOS_OFFER"
    | "SHARE_SENTENCE_OFFER";
  displayName: string;
  defaultReaction: null | Reaction;
  eventId: string;
  header: string;
  isInteractionEnabled: boolean;
  isVerified: boolean;
  learningLanguage: string;
  notificationType?: "MILESTONE" | "OFFER";
  reactionCounts: {
    cheer?: number;
    congrats?: number;
    high_five?: number;
    love?: number;
    support?: number;
  };
  reactionType?: null | Reaction;
  timestamp: number;
  triggerType?:
    | "friends_quest_complete"
    | "friends_quest_streak"
    | "league_promotion"
    | "monthly_goal"
    | "resurrection"
    | "sage"
    | "streak_milestone"
    | "top_three"
    | "x_lesson";
  userId: number;
}

/** Client for Duolingo API. */
export class DuolingoClient {
  private client: JsonClient;
  private userid?: number;

  constructor(private username: string, token: string) {
    this.client = new JsonClient("https://www.duolingo.com", { token });
    this.username = username;
  }

  /** Gets the user ID for the given username. */
  private async getUserId(): Promise<number> {
    if (!this.username) throw new Error("Username is required");
    if (this.userid) return this.userid;
    this.userid = (await this.client.get<{ users: { id: number }[] }>(
      `/2017-06-30/users?fields=users%7Bid%7D&username=${this.username}`,
    )).users[0].id;
    return this.userid;
  }

  /** Gets the list of users that the user is following. */
  async getFollowing(): Promise<Friend[]> {
    const me = await this.getUserId();
    return (await this.client.get<{ following: { users: Friend[] } }>(
      `/2017-06-30/friends/users/${me}/following`,
    )).following.users;
  }

  /** Gets the list of users that are following the user. */
  async getFollowers(): Promise<Friend[]> {
    const me = await this.getUserId();
    return (await this.client.get<{ followers: { users: Friend[] } }>(
      `/2017-06-30/friends/users/${me}/followers`,
    )).followers.users;
  }

  /** Gets the feed for the user. */
  async getFeed(): Promise<FeedCard[]> {
    const me = await this.getUserId();
    return (await this.client.get<{ feed: { feedCards: FeedCard[] }[] }>(
      `/2017-06-30/friends/users/${me}/feed/v2?uiLanguage=en`,
    )).feed.flatMap((feed) => feed.feedCards);
  }

  /** Sends a reaction to a feed event. */
  async sendReaction(
    eventId: string,
    reaction: Reaction,
  ): Promise<void> {
    await this.client.post(`/card/reaction`, {
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
    await this.client.post(
      `/2017-06-30/friends/users/${me}/follow/${userId}`,
      { component: "kudos_feed" },
    );
  }
}
