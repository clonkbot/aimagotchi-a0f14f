import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  aimagotchis: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    // Stats (0-100)
    hunger: v.number(),
    happiness: v.number(),
    energy: v.number(),
    // Appearance
    colorScheme: v.string(),
    personality: v.string(),
    // State
    isAlive: v.boolean(),
    lastFed: v.number(),
    lastPlayed: v.number(),
    lastSlept: v.number(),
    createdAt: v.number(),
    diedAt: v.optional(v.number()),
    // Economy
    coinsEarned: v.number(),
  }).index("by_owner", ["ownerId"])
    .index("by_alive", ["isAlive"])
    .index("by_created", ["createdAt"]),

  // Global coin pool that redistributes from dead pets
  coinPool: defineTable({
    totalCoins: v.number(),
    lastDistribution: v.number(),
  }),

  // Activity log for the feed
  activities: defineTable({
    aimagotchiId: v.id("aimagotchis"),
    aimagotchiName: v.string(),
    action: v.string(), // "fed", "played", "slept", "died", "created", "received_coins"
    timestamp: v.number(),
    coinsAmount: v.optional(v.number()),
  }).index("by_timestamp", ["timestamp"])
    .index("by_aimagotchi", ["aimagotchiId"]),

  // User wallet
  wallets: defineTable({
    userId: v.id("users"),
    balance: v.number(),
  }).index("by_user", ["userId"]),
});
