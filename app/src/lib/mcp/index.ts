import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import updateProfileTool from "./tools/update-profile";
import getProgressTool from "./tools/get-progress";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// value that survives publish unchanged.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "deutsch-delight",
  title: "Deutsch Delight",
  version: "0.1.0",
  instructions:
    "Tools for the Deutsch Delight German-learning app (A1/A2, Spanish speakers). Use `get_profile` and `get_progress` to read the signed-in learner's level, XP, streak and review cards, and `update_profile` to change their display name or study level.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfileTool, getProgressTool, updateProfileTool] as unknown as Parameters<
    typeof defineMcp
  >[0]["tools"],
});
