/** @module 500px/types */

import { CATEGORIES } from "./data.ts";

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
  category: typeof CATEGORIES.UNCATEGORIZED;
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
