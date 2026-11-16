import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_profile",
  title: "Update profile",
  description: "Update the signed-in learner's display name and/or study level (A1 or A2).",
  inputSchema: {
    display_name: z.string().trim().min(1).max(60).optional().describe("New display name."),
    level: z.enum(["A1", "A2"]).optional().describe("Study level to set."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ display_name, level }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!display_name && !level) {
      return { content: [{ type: "text", text: "Provide display_name and/or level." }], isError: true };
    }
    const patch: Record<string, string> = {};
    if (display_name) patch['display_name'] = display_name;
    if (level) patch['level'] = level;

    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", ctx.getUserId())
      .select("display_name, native_lang, level")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { profile: data },
    };
  },
});
