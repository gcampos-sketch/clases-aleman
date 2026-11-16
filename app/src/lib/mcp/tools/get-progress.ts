import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

type ProgressData = Record<string, unknown> & {
  xp?: number;
  streak?: number;
  level?: string;
  completedLessons?: unknown[];
  srs?: Record<string, unknown>;
};

export default defineTool({
  name: "get_progress",
  title: "Get learning progress",
  description:
    "Read the signed-in learner's saved progress: XP, streak, level, completed lessons and review-card counts.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("learning_progress")
      .select("data, updated_at")
      .eq("user_id", ctx.getUserId())
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const raw = (data?.data ?? {}) as ProgressData;
    const summary = {
      xp: typeof raw.xp === "number" ? raw.xp : 0,
      streak: typeof raw.streak === "number" ? raw.streak : 0,
      level: typeof raw.level === "string" ? raw.level : null,
      completed_lessons: Array.isArray(raw.completedLessons) ? raw.completedLessons.length : 0,
      srs_cards: raw.srs && typeof raw.srs === "object" ? Object.keys(raw.srs).length : 0,
      updated_at: data?.updated_at ?? null,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary) }],
      structuredContent: { summary, progress: raw },
    };
  },
});
