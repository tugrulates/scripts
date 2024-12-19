/** A Lonely Planet destination type. */
export type DestionationType =
  | "Continent"
  | "Country"
  | "Region"
  | "City"
  | "Neighborhood";

/** A Lonely Planet attraction type. */
export type AttractionType = "Attractions";

/** A Lonely Planet story type. */
export type StoryType = "Feature" | "News";

/** A Lonely Planet document. */
export interface Document {
  /** Document ID. */
  id: string;
  /** Document URL. */
  slug: string;
  /** Document title. */
  title: string;
  /** Summary for topic of the document. */
  excerpt: string;
  /** Document image. */
  featuredImage: Image;
}

/** A Lonely Planet destination. */
export interface Destination extends Document {
  /** Destination type. */
  type: DestionationType;
  /** Global breadcrumb to the location. */
  breadcrumb: Breadcrumb[];
}

/** A Lonely Planet attraction. */
export interface Attraction extends Document {
  /** Attraction type. */
  type: AttractionType;
  /** Global breadcrumb to the location. */
  breadcrumb: Breadcrumb[];
}

/** A Lonely Planet story. */
export interface Story extends Document {
  /** Story type. */
  type: StoryType;
  /** Story publication date in ISO string. */
  date: string;
  /** Story read time in minutes. */
  readTime: number;
}

/** Global path component of a Lonely Planet document. */
export interface Breadcrumb {
  /** Node URL. */
  slug: string;
  /** Node title. */
  title: string;
  /** Node type. */
  type: DestionationType | AttractionType;
}

/** A Lonely Planet image. */
export interface Image {
  /** Alt text for the image. */
  alt: string;
  /** Caption for the image. */
  caption: string;
  /** Image credit. */
  credit: string;
  /** Image width in pixels. */
  width: number;
  /** Image height in pixels. */
  height: number;
  /** Image URL. */
  title: string;
  /** Image URL. */
  url: string;
}

/** A results page for a query on the Lonely Planet. */
export interface SearchResults {
  /** Number of results in this page. */
  found: number;
  /** Number of results in all pages. */
  out_of: number;
  /** The current page number. */
  page: number;
  /** Results and scoring info. */
  hits: [
    {
      document: Destination | Attraction | Story;
      text_match: number;
      text_match_info: {
        best_field_score: string;
        best_field_weight: number;
        fields_matched: number;
        num_tokens_dropped: number;
        score: string;
        tokens_matched: number;
        typo_prefix_score: number;
      };
    },
  ];
  /** The query parameters. */
  request_params: {
    collection_name: string;
    first_q: string;
    per_page: number;
    q: string;
  };
  /** ? */
  search_cutoff: boolean;
  /** Time it took to retrieve the results. */
  search_time_ms: number;
}

/** A Typesense server error. */
export interface Error {
  /** HTTP response code. */
  code: number;
  /** Error message. */
  error: string;
}
