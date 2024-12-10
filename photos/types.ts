/** @module photos/types */

export interface Exif {
  title?: string;
  description?: string;
  keywords?: string[];
  date?: string;
  location?: string;
  camera?: string;
  lens?: string;
  size?: string;
}

export interface Photo extends Omit<Exif, "size"> {
  slug: string;
  sizes: {
    file: string;
    description?: string;
    size?: string;
    sameExif: boolean;
  }[];
}
