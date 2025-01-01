import { main } from "./main.ts";
export * from "./exif.ts";
export * from "./file.ts";

if (import.meta.main) await main();
