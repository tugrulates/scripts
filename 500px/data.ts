/** @module 500px/data */

/** Photo categories. */
export const CATEGORIES = {
  UNCATEGORIZED: { id: 0, arg: "other", nude: false },
  CELEBRITIES: { id: 1, arg: "celebrities", nude: false },
  FILM: { id: 2, arg: "film", nude: false },
  JOURNALISM: { id: 3, arg: "journalism", nude: false },
  NUDE: { id: 4, arg: "nude", nude: true },
  BLACK_AND_WHITE: { id: 5, arg: "black-and-white", nude: false },
  STILL_LIFE: { id: 6, arg: "still-life", nude: false },
  PEOPLE: { id: 7, arg: "people", nude: false },
  LANDSCAPES: { id: 8, arg: "landscapes", nude: false },
  CITY_AND_ARCHITECTURE: { id: 9, arg: "city-and-architecture", nude: false },
  ABSTRACT: { id: 10, arg: "abstract", nude: false },
  ANIMALS: { id: 11, arg: "animals", nude: false },
  MACRO: { id: 12, arg: "macro", nude: false },
  TRAVEL: { id: 13, arg: "travel", nude: false },
  FASHION: { id: 14, arg: "fashion", nude: false },
  COMMERCIAL: { id: 15, arg: "commercial", nude: false },
  CONCERT: { id: 16, arg: "concert", nude: false },
  SPORT: { id: 17, arg: "sport", nude: false },
  NATURE: { id: 18, arg: "nature", nude: false },
  PERFORMING_ARTS: { id: 19, arg: "performing-arts", nude: false },
  FAMILY: { id: 20, arg: "family", nude: false },
  STREET: { id: 21, arg: "street", nude: false },
  UNDERWATER: { id: 22, arg: "underwater", nude: false },
  FOOD: { id: 23, arg: "food", nude: false },
  FINE_ART: { id: 24, arg: "fine-art", nude: false },
  WEDDING: { id: 25, arg: "wedding", nude: false },
  TRANSPORTATION: { id: 26, arg: "transportation", nude: false },
  AERIAL: { id: 29, arg: "aerial", nude: false },
  URBAN_EXPLORATION: { id: 27, arg: "urban-exploration", nude: false },
  NIGHT: { id: 30, arg: "night", nude: false },
  BOUDOIR: { id: 31, arg: "boudoir", nude: true },
} as const;
