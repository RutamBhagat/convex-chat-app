import { mutation, query, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

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
    });

    if (args.body.startsWith("/wiki")) {
      const topic = args.body.slice(args.body.indexOf(" ") + 1);
      await ctx.scheduler.runAfter(0, internal.chat.getWikipediaSummary, {
        topic,
      });
    }

    if (args.user === "evil") throw new Error("Evil user detected!");

    await ctx.db.insert("events", {
      user: args.user,
      message: "Sent a message",
    });
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);
    return messages.reverse();
  },
});

export const getWikipediaSummary = internalAction({
  args: { topic: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch(
      "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" +
        args.topic
    );

    const summary = getSummaryFromJSON(await response.json());
    await ctx.scheduler.runAfter(0, api.chat.sendMessage, {
      user: "Wikipedia",
      body: summary || "Info not found",
    });
  },
});

function getSummaryFromJSON(data: any) {
  if (!data.query || !data.query.pages) {
    return null;
  }
  
  const firstPageId = Object.keys(data.query.pages)[0];
  const page = data.query.pages[firstPageId];
  
  if (page.missing || !page.extract) {
    return null;
  }
  
  return page.extract;
}
