import { main } from "./main.ts";
export * from "./client.ts";

if (import.meta.main) await main();
