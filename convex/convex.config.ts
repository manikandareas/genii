// convex/convex.config.ts
import workflow from "@convex-dev/workflow/convex.config";
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();
app.use(workflow);
app.use(agent);
app.use(resend);
export default app;
