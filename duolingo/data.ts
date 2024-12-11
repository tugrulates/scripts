/**
 * Language codes on Duolingo, with their names, and flags.
 *
 * This only lists target languages, and not source languages.
 *
 * @see {@link https://www.duolingo.com/courses/all Duolingo Language Courses}
 */
export const LANGUAGES = {
  ar: { name: "Arabic", emoji: "🇸🇦" },
  ca: { name: "Catalan", emoji: "🇪🇸" },
  cs: { name: "Czech", emoji: "🇨🇿" },
  cy: { name: "Welsh", emoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  da: { name: "Danish", emoji: "🇩🇰" },
  de: { name: "German", emoji: "🇩🇪" },
  dn: { name: "Dutch", emoji: "🇳🇱" },
  el: { name: "Greek", emoji: "🇬🇷" },
  en: { name: "English", emoji: "🇺🇸" },
  eo: { name: "Esperanto", emoji: "🌍" },
  es: { name: "Spanish", emoji: "🇪🇸" },
  fi: { name: "Finnish", emoji: "🇫🇮" },
  fr: { name: "French", emoji: "🇫🇷" },
  ga: { name: "Irish", emoji: "🇮🇪" },
  gd: { name: "Scottish Gaelic", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  gn: { name: "Guarani", emoji: "🇵🇾" },
  he: { name: "Hebrew", emoji: "🇮🇱" },
  hi: { name: "Hindi", emoji: "🇮🇳" },
  ht: { name: "Haitian Creole", emoji: "🇭🇹" },
  hu: { name: "Hungarian", emoji: "🇭🇺" },
  hv: { name: "High Valyrian", emoji: "🐉" },
  hw: { name: "Hawaiian", emoji: "🌺" },
  id: { name: "Indonesian", emoji: "🇮🇩" },
  it: { name: "Italian", emoji: "🇮🇹" },
  ja: { name: "Japanese", emoji: "🇯🇵" },
  kl: { name: "Klingon", emoji: "🖖" },
  ko: { name: "Korean", emoji: "🇰🇷" },
  la: { name: "Latin", emoji: "🏛️" },
  math: { name: "Math", emoji: "🔢" },
  music: { name: "Music", emoji: "🎵" },
  nb: { name: "Norwegian (Bokmål)", emoji: "🇳🇴" },
  nv: { name: "Navajo", emoji: "🏜️" },
  pl: { name: "Polish", emoji: "🇵🇱" },
  pt: { name: "Portuguese", emoji: "🇧🇷" },
  ro: { name: "Romanian", emoji: "🇷🇴" },
  ru: { name: "Russian", emoji: "🇷🇺" },
  sv: { name: "Swedish", emoji: "🇸🇪" },
  sw: { name: "Swahili", emoji: "🇰🇪" },
  tr: { name: "Turkish", emoji: "🇹🇷" },
  uk: { name: "Ukrainian", emoji: "🇺🇦" },
  vi: { name: "Vietnamese", emoji: "🇻🇳" },
  yi: { name: "Yiddish", emoji: "🕎" },
  zc: { name: "Chinese (Cantonese)", emoji: "🇭🇰" },
  zs: { name: "Chinese", emoji: "🇨🇳" },
  zu: { name: "Zulu", emoji: "🇿🇦" },
} as const;

/**
 * Reactions to Duolingo feed events and the corresponding emojis.
 */
export const REACTIONS = {
  congrats: "🎉",
  high_five: "🙏",
  support: "💪",
  cheer: "💯",
  love: "💖",
  like: "👍",
  haha: "😂",
} as const;

/**
 * Duolingo leagues tiers, their names, and emojis.
 */
export const LEAGUES = {
  0: { name: "Bronze League", emoji: "🧡" },
  1: { name: "Silver League", emoji: "🤍" },
  2: { name: "Gold League", emoji: "💛" },
  3: { name: "Sapphire League", emoji: "💙" },
  4: { name: "Ruby League", emoji: "❤️" },
  5: { name: "Emerald League", emoji: "💚" },
  6: { name: "Amethyst League", emoji: "💜" },
  7: { name: "Pearl League", emoji: "🩷" },
  8: { name: "Obsidian League", emoji: "🖤" },
  9: { name: "Diamond League", emoji: "💎" },
  10: { name: "Tournament", emoji: "🏆" },
} as const;
