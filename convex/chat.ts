import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    user: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("This typescript function is running on the server!");
    await ctx.db.insert("messages", {
        user: args.user,
        body: args.body,
    })

    if(args.user === "evil") throw new Error("Evil user detected!");

    await ctx.db.insert("events", {
        user: args.user,
        message: "Sent a message"
    })
  }
});

export const getMessages = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db.query("messages").order("desc").take(50)
        return messages.reverse();
    }
})