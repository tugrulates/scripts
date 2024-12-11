/**
 * Represents the EXIF (Exchangeable Image File Format) metadata of a photo.
 *
 * This only lists the fields relevant for my photography workflow.
 */
export interface Exif {
  /** The title of the photo. */
  title?: string;
  /** Text describing the contents of the photo. */
  description?: string;
  /** Keywords for findability. */
  keywords?: string[];
  /** The date the photo was taken. */
  date?: string;
  /** The location where the photo was taken. */
  location?: string;
  /** The camera or phone used to take the photo. */
  camera?: string;
  /** Lens properties that were used to take the photo. */
  lens?: string;
  /** The pixel resolution of the photo. */
  size?: string;
}

/**
 * Represents a photo with additional metadata and sizes.
 *
 * @extends Exif with all fields except resolution, which are listed on individial
 * file sizes instead.
 */
export interface Photo extends Omit<Exif, "size"> {
  /** Exchangable id of the photo. */
  slug: string;
  /** Different size variants of this photo. */
  sizes: {
    file: string;
    description?: string;
    size?: string;
    sameExif: boolean;
  }[];
}
