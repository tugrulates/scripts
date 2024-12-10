import { LANGUAGES, LEAGUES, REACTIONS } from "./data.ts";

/** Language code. */
export type LanguageCode = keyof typeof LANGUAGES;

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
export type Reaction = keyof typeof REACTIONS;

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

export interface League {
  creation_date: string;
  tier: keyof typeof LEAGUES;
  rankings: LeagueUser[];
}

export interface LeagueUser {
  "avatar_url": string;
  "display_name": string;
  "has_plus": boolean;
  "has_recent_activity_15": boolean;
  "reaction":
    | "NONE"
    | "ANGRY"
    | "CAT"
    | "EYES"
    | `FLAG,${LanguageCode}`
    | "FLEX"
    | "POOP"
    | "POPCORN"
    | "SUNGLASSES"
    | "YEAR_IN_REVIEW,2023_top1"
    | "YIR_2022";
  "score": number;
  "streak_extended_today": boolean;
  "user_id": number;
}
