import type { CATEGORIES } from "./data.ts";

/** A user on 500px. */
export interface User {
  /** The user's unique numeric ID. */
  id: string;
  /** The user's unique profile handle. */
  canonicalPath: string;
  /** The user's display name. */
  displayName: string;
}

/** A photo submitted to 500px and its stats. */
export interface Photo {
  /** The unique identifier of the photo. */
  id: string;
  /** The unique path of the photo. */
  canonicalPath: string;
  /** The title of the photo. */
  name: string;
  /** The numeric category ID of the photo. */
  categoryId: number;
  /** The category of the photo. */
  category: typeof CATEGORIES.UNCATEGORIZED;
  /** The date the photo was uploaded. */
  uploadedAt: string;
  /** The number of times the photo has been viewed. */
  timesViewed: number;
  /** The number of times the photo has been liked. */
  likedByUsers: { totalCount: number };
  /** The 500px pulse of the photo. */
  pulse: { highest: number };
  /** The user who submitted the photo. */
  photographer: User;
}

/** A photo category on 500px. */
export interface Category {
  /** The numeric ID of the category. */
  id: number;
  /** Whether the category contains nude content. */
  nude: boolean;
}
