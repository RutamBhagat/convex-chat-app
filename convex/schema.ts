import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    user: v.string(),
    body: v.string(),
  }).index("by_user", ["user"]),

  events: defineTable({
    user: v.string(),
    message: v.string(),
  }).index("by_user", ["user"]),
});
