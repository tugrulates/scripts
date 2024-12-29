import { main } from "./cli.ts";
export * from "./client.ts";

if (import.meta.main) {
  await main();
}
