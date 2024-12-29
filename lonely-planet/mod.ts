import { command } from "./cli.ts";
export * from "./client.ts";

if (import.meta.main) {
  await command.parse();
}
