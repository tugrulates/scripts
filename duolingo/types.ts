/** Language code. */
export type LanguageCode =
  | "ar"
  | "ca"
  | "cs"
  | "cy"
  | "da"
  | "de"
  | "dn"
  | "el"
  | "en"
  | "eo"
  | "es"
  | "fi"
  | "fr"
  | "ga"
  | "he"
  | "hi"
  | "hu"
  | "id"
  | "it"
  | "ja"
  | "ko"
  | "ms"
  | "nb"
  | "nl"
  | "pl"
  | "pt"
  | "ro"
  | "ru"
  | "sv"
  | "sw"
  | "th"
  | "tr"
  | "uk"
  | "vi"
  | "zh";

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

export interface League {
  creation_date: string;
  tier: LeagueTier;
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

/** Number tier of a league. */
export type LeagueTier = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
