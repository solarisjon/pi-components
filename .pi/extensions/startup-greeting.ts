/**
 * NetApp Tiger Team — Startup Greeting Extension
 *
 * Automatically greets the engineer on session startup and asks which
 * CPE case they are working on today. This fulfils the AGENTS.md requirement
 * that the very first action in this workspace is to ask for a case number.
 *
 * Fires on:
 *   - "startup"  — fresh pi launch in this directory
 *   - "new"      — user opens a new session via /new
 *
 * Does NOT fire on "resume", "fork", or "reload" (case already established).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (event, _ctx) => {
    // Only greet on fresh start or explicit new session — not resume/fork/reload
    if (event.reason !== "startup" && event.reason !== "new") return;

    // Small delay lets the UI settle before injecting the greeting turn
    await new Promise((resolve) => setTimeout(resolve, 200));

    pi.sendUserMessage(
      "Session started. Please greet the engineer and ask which CPE case we are working on today, as instructed in your project context.",
    );
  });
}
