import $ from "jsr:@david/dax";
import { basename, dirname, join } from "jsr:@std/path";
import { getFiles, isPhotoDirectory } from "./file.ts";
import type { Exif, Photo } from "./types.ts";

const SOURCE_FILE = "source.jpg";
const EXIFTOOL = ["exiftool", "-q", "-overwrite_original_in_place"];

/**
 * Returns the EXIF data for the file.
 *
 * @param file File to get EXIF data for.
 * @returns EXIF data for the file.
 */
async function getExif(file: string): Promise<Exif> {
  const lines = await $`${EXIFTOOL} ${file}`.lines();
  const data = Object.fromEntries(
    lines.map((line) => line.match(/^([^:]+?)\s*:\s*(.*?)$/)?.slice(1) ?? []),
  );
  const date = new Date(
    data["Date/Time Original"]
      ?.replace(/:/, "-")
      ?.replace(/:/, "-")
      ?.replace(/ /, "T"),
  );
  return {
    title: data["Title (en)"],
    description: data["Image Description"],
    keywords: data["Keywords"]?.split(",").map((s: string) => s.trim()),
    date: date.toJSON(),
    location: data["Location"],
    camera: data["Camera Model Name"],
    lens: data["Lens Model"],
    size: data["Image Size"],
  };
}

/**
 * Returns the data for a photo or a single file.
 *
 * @param photo Photo or file to get data for.
 * @returns Data for the photo or file.
 */
export async function getData(photo: string): Promise<Photo> {
  const files = await getFiles(photo);
  const exif = Object.fromEntries(
    await Promise.all(
      files.map(async (f) => [basename(f), await getExif(f)] as const),
    ),
  );
  const base = exif[SOURCE_FILE] ?? Object.values(exif)[0];
  return {
    slug: basename(photo),
    ...{ ...base, size: undefined },
    sizes: Object.entries(exif).map(([file, data]) => ({
      file,
      description: data.description,
      size: data.size,
      sameExif:
        JSON.stringify({ ...data, description: undefined, size: undefined }) ===
          JSON.stringify({ ...base, description: undefined, size: undefined }),
    })),
  };
}

/**
 * Copies the EXIF data from source.jpg to all other jpg files.
 *
 * @param photo Directory containing jpg files or a single JPG file.
 */
export async function copyExif(photo: string) {
  const base = join(
    await isPhotoDirectory(photo) ? photo : dirname(photo),
    SOURCE_FILE,
  );
  const files = (await getFiles(photo)).filter((f) => f !== base);
  await Promise.all(files.map(async (file) => {
    await $`${EXIFTOOL} -tagsfromfile ${base} -codedcharacterset=UTF8 -all ${file}`;
    let description = await $`${EXIFTOOL} -ImageDescription ${base} -args`
      .text();
    if (description === "") description = "-ImageDescription:";
    const groupMatch = /.*-(\d+).jpg/.exec(file);
    if (groupMatch !== null) description += ` (image ${groupMatch[1]})`;
    await $`${EXIFTOOL} -tagsfromfile ${base} -codedcharacterset=UTF8 ${description} -all ${file}`;
  }));
}
