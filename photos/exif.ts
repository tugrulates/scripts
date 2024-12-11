/**
 * Displays information about the jpg files for a photo directory.
 *
 * ### Usage
 *
 * ```sh
 * deno -A photos/exif.ts [photos...] [--copy] [--json]
 * ```
 *
 * ```
 * 🖼 Title [⚠️ warnings]
 * ```
 */

import $ from "jsr:@david/dax";
import { parseArgs } from "jsr:@std/cli";
import { basename, dirname, join } from "jsr:@std/path";
import { getOptional } from "../common/cli.ts";
import { Exif, Photo } from "./types.ts";

const SOURCE_FILE = "source.jpg";
const EXIFTOOL = ["exiftool", "-q", "-overwrite_original_in_place"];

/**
 * Returns true if the directory contains a source photo.
 *
 * @param dir Directory to check.
 * @returns True if the directory contains a source photo.
 */
async function isPhotoDirectory(dir: string): Promise<boolean> {
  try {
    await Deno.lstat(`${dir}/${SOURCE_FILE}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a list of all JPG files in the directory.
 *
 * @param photo Directory to check.
 * @returns List of all JPG files in the directory.
 */
async function getFiles(photo: string): Promise<string[]> {
  if (!(await isPhotoDirectory(photo))) return [photo];
  return (await Array.fromAsync(Deno.readDir(photo)))
    .filter((f) => f.isFile)
    .filter((f) => f.name.endsWith(".jpg"))
    .map((f) => join(photo, f.name))
    .toSorted();
}

/**
 * Returns a list of all photo directories under cwd.
 *
 * @returns List of all photo directories under cwd.
 */
async function* allPhotos(): AsyncGenerator<string> {
  for await (const dirEntry of Deno.readDir(".")) {
    if (dirEntry.isDirectory && await isPhotoDirectory(dirEntry.name)) {
      yield dirEntry.name;
    }
  }
}

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
async function getData(photo: string): Promise<Photo> {
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
 * Returns a warning message if the photo is missing required fields.
 *
 * @param data Photo data to check.
 * @returns Message with the following text: [⚠️ warnings...].
 */
function check(data: Photo) {
  const result = [];
  for (
    const field of [
      "title",
      "description",
      "keywords",
      "date",
      "location",
      "camera",
      "lens",
    ] as const
  ) {
    if (!data[field]) result.push(field);
  }
  if (!data.title) result.push("title");
  if (!data.description) result.push("description");
  if (!data.keywords) result.push("keywords");
  if (!data.date) result.push("date");
  if (!data.location) result.push("location");
  if (!data.camera) result.push("camera");
  if (!data.lens) result.push("lens");
  if (!data.sizes.every((size) => size.sameExif)) result.push("same");
  if (result.length) return `[⚠️ ${result.join(", ")}]`;
  return "";
}

/**
 * Copies the EXIF data from source.jpg to all other jpg files.
 *
 * @param photo Directory containing jpg files or a single JPG file.
 */
async function copyExif(photo: string) {
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

if (import.meta.main) {
  const spec = { boolean: "json" } as const;
  const args = parseArgs(Deno.args, spec);
  const photos = args._.length ? getOptional(args) : allPhotos();

  for await (const photo of photos) {
    if (args.copy) await copyExif(photo);
    const data = await getData(photo);
    if (args.json) console.log(JSON.stringify(data));
    else console.log(`🖼  ${data.title} ${check(data)}`);
  }

  Deno.exit(0);
}
