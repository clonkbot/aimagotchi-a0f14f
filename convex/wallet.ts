import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const STARTING_BALANCE = 150;

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return wallet;
  },
});

export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("wallets", {
      userId,
      balance: STARTING_BALANCE,
    });
  },
});

export const getPool = query({
  args: {},
  handler: async (ctx) => {
    const pool = await ctx.db.query("coinPool").first();
    return pool?.totalCoins ?? 0;
  },
});
