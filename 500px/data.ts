/**
 * Photo categories on 500px.
 *
 * Each photo belongs to a single category.
 *
 * @see {@link https://500px.com/discover/top_categories 500px Categories}
 */
export const CATEGORIES = {
  CELEBRITIES: { id: 1, opt: "celebrities", nude: false },
  FILM: { id: 2, opt: "film", nude: false },
  JOURNALISM: { id: 3, opt: "journalism", nude: false },
  NUDE: { id: 4, opt: "nude", nude: true },
  BLACK_AND_WHITE: { id: 5, opt: "black-and-white", nude: false },
  STILL_LIFE: { id: 6, opt: "still-life", nude: false },
  PEOPLE: { id: 7, opt: "people", nude: false },
  LANDSCAPES: { id: 8, opt: "landscapes", nude: false },
  CITY_AND_ARCHITECTURE: { id: 9, opt: "city-and-architecture", nude: false },
  ABSTRACT: { id: 10, opt: "abstract", nude: false },
  ANIMALS: { id: 11, opt: "animals", nude: false },
  MACRO: { id: 12, opt: "macro", nude: false },
  TRAVEL: { id: 13, opt: "travel", nude: false },
  FASHION: { id: 14, opt: "fashion", nude: false },
  COMMERCIAL: { id: 15, opt: "commercial", nude: false },
  CONCERT: { id: 16, opt: "concert", nude: false },
  SPORT: { id: 17, opt: "sport", nude: false },
  NATURE: { id: 18, opt: "nature", nude: false },
  PERFORMING_ARTS: { id: 19, opt: "performing-arts", nude: false },
  FAMILY: { id: 20, opt: "family", nude: false },
  STREET: { id: 21, opt: "street", nude: false },
  UNDERWATER: { id: 22, opt: "underwater", nude: false },
  FOOD: { id: 23, opt: "food", nude: false },
  FINE_ART: { id: 24, opt: "fine-art", nude: false },
  WEDDING: { id: 25, opt: "wedding", nude: false },
  TRANSPORTATION: { id: 26, opt: "transportation", nude: false },
  AERIAL: { id: 29, opt: "aerial", nude: false },
  URBAN_EXPLORATION: { id: 27, opt: "urban-exploration", nude: false },
  NIGHT: { id: 30, opt: "night", nude: false },
  BOUDOIR: { id: 31, opt: "boudoir", nude: true },
  UNCATEGORIZED: { id: 0, opt: "other", nude: false },
} as const;
