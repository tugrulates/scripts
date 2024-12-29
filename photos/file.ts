import { join } from "@std/path";

const SOURCE_FILE = "source.jpg";

/**
 * Returns true if the directory contains a source photo.
 *
 * @param dir Directory to check.
 * @returns True if the directory contains a source photo.
 */
export async function isPhotoDirectory(dir: string): Promise<boolean> {
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
export async function getFiles(photo: string): Promise<string[]> {
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
export async function* allPhotos(): AsyncGenerator<string> {
  for await (const dirEntry of Deno.readDir(".")) {
    if (dirEntry.isDirectory && await isPhotoDirectory(dirEntry.name)) {
      yield dirEntry.name;
    }
  }
}
