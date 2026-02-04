import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const CREATION_COST = 100;
const DECAY_RATE = 2; // Points lost per hour
const DEATH_THRESHOLD = 0;

const COLOR_SCHEMES = [
  "cosmic-purple",
  "neon-green",
  "sunset-orange",
  "ocean-blue",
  "bubblegum-pink",
  "cyber-yellow",
  "void-black",
  "aurora-teal",
];

const PERSONALITIES = [
  "Mischievous",
  "Sleepy",
  "Hyperactive",
  "Wise",
  "Grumpy",
  "Cheerful",
  "Mysterious",
  "Dramatic",
];

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("aimagotchis")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aimagotchis")
      .withIndex("by_alive", (q) => q.eq("isAlive", true))
      .order("desc")
      .take(50);
  },
});

export const get = query({
  args: { id: v.id("aimagotchis") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check wallet balance
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!wallet || wallet.balance < CREATION_COST) {
      throw new Error("Insufficient funds! Need 100 coins to create an AImagotchi.");
    }

    // Deduct from wallet
    await ctx.db.patch(wallet._id, {
      balance: wallet.balance - CREATION_COST,
    });

    // Add to coin pool
    let pool = await ctx.db.query("coinPool").first();
    if (!pool) {
      pool = await ctx.db.insert("coinPool", {
        totalCoins: CREATION_COST,
        lastDistribution: Date.now(),
      }).then(id => ctx.db.get(id));
    } else {
      await ctx.db.patch(pool._id, {
        totalCoins: pool.totalCoins + CREATION_COST,
      });
    }

    const now = Date.now();
    const colorScheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];

    const id = await ctx.db.insert("aimagotchis", {
      name: args.name,
      ownerId: userId,
      hunger: 80,
      happiness: 80,
      energy: 80,
      colorScheme,
      personality,
      isAlive: true,
      lastFed: now,
      lastPlayed: now,
      lastSlept: now,
      createdAt: now,
      coinsEarned: 0,
    });

    await ctx.db.insert("activities", {
      aimagotchiId: id,
      aimagotchiName: args.name,
      action: "created",
      timestamp: now,
    });

    return id;
  },
});

export const feed = mutation({
  args: { id: v.id("aimagotchis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pet = await ctx.db.get(args.id);
    if (!pet) throw new Error("AImagotchi not found");
    if (pet.ownerId !== userId) throw new Error("Not your AImagotchi");
    if (!pet.isAlive) throw new Error("This AImagotchi has passed away");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      hunger: Math.min(100, pet.hunger + 30),
      lastFed: now,
    });

    await ctx.db.insert("activities", {
      aimagotchiId: args.id,
      aimagotchiName: pet.name,
      action: "fed",
      timestamp: now,
    });
  },
});

export const play = mutation({
  args: { id: v.id("aimagotchis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pet = await ctx.db.get(args.id);
    if (!pet) throw new Error("AImagotchi not found");
    if (pet.ownerId !== userId) throw new Error("Not your AImagotchi");
    if (!pet.isAlive) throw new Error("This AImagotchi has passed away");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      happiness: Math.min(100, pet.happiness + 25),
      energy: Math.max(0, pet.energy - 10),
      lastPlayed: now,
    });

    await ctx.db.insert("activities", {
      aimagotchiId: args.id,
      aimagotchiName: pet.name,
      action: "played",
      timestamp: now,
    });
  },
});

export const sleep = mutation({
  args: { id: v.id("aimagotchis") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pet = await ctx.db.get(args.id);
    if (!pet) throw new Error("AImagotchi not found");
    if (pet.ownerId !== userId) throw new Error("Not your AImagotchi");
    if (!pet.isAlive) throw new Error("This AImagotchi has passed away");

    const now = Date.now();
    await ctx.db.patch(args.id, {
      energy: Math.min(100, pet.energy + 40),
      lastSlept: now,
    });

    await ctx.db.insert("activities", {
      aimagotchiId: args.id,
      aimagotchiName: pet.name,
      action: "slept",
      timestamp: now,
    });
  },
});

export const checkAndUpdateStats = mutation({
  args: { id: v.id("aimagotchis") },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.id);
    if (!pet || !pet.isAlive) return null;

    const now = Date.now();
    const hoursSinceLastFed = (now - pet.lastFed) / (1000 * 60 * 60);
    const hoursSinceLastPlayed = (now - pet.lastPlayed) / (1000 * 60 * 60);
    const hoursSinceLastSlept = (now - pet.lastSlept) / (1000 * 60 * 60);

    const newHunger = Math.max(0, pet.hunger - hoursSinceLastFed * DECAY_RATE);
    const newHappiness = Math.max(0, pet.happiness - hoursSinceLastPlayed * DECAY_RATE);
    const newEnergy = Math.max(0, pet.energy - hoursSinceLastSlept * DECAY_RATE * 0.5);

    // Check if pet dies
    if (newHunger <= DEATH_THRESHOLD || newHappiness <= DEATH_THRESHOLD) {
      await ctx.db.patch(args.id, {
        hunger: newHunger,
        happiness: newHappiness,
        energy: newEnergy,
        isAlive: false,
        diedAt: now,
      });

      await ctx.db.insert("activities", {
        aimagotchiId: args.id,
        aimagotchiName: pet.name,
        action: "died",
        timestamp: now,
      });

      // Distribute coins to surviving pets
      const alivePets = await ctx.db
        .query("aimagotchis")
        .withIndex("by_alive", (q) => q.eq("isAlive", true))
        .collect();

      const pool = await ctx.db.query("coinPool").first();
      if (pool && alivePets.length > 0) {
        const coinsPerPet = Math.floor(pool.totalCoins / alivePets.length / 10); // Distribute 10% of pool
        for (const alivePet of alivePets) {
          const ownerWallet = await ctx.db
            .query("wallets")
            .withIndex("by_user", (q) => q.eq("userId", alivePet.ownerId))
            .unique();

          if (ownerWallet && coinsPerPet > 0) {
            await ctx.db.patch(ownerWallet._id, {
              balance: ownerWallet.balance + coinsPerPet,
            });
            await ctx.db.patch(alivePet._id, {
              coinsEarned: alivePet.coinsEarned + coinsPerPet,
            });
          }
        }
        await ctx.db.patch(pool._id, {
          totalCoins: pool.totalCoins - (coinsPerPet * alivePets.length),
          lastDistribution: now,
        });
      }

      return { ...pet, hunger: newHunger, happiness: newHappiness, energy: newEnergy, isAlive: false };
    }

    await ctx.db.patch(args.id, {
      hunger: newHunger,
      happiness: newHappiness,
      energy: newEnergy,
    });

    return { ...pet, hunger: newHunger, happiness: newHappiness, energy: newEnergy };
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const pets = await ctx.db
      .query("aimagotchis")
      .withIndex("by_alive", (q) => q.eq("isAlive", true))
      .collect();

    return pets
      .map((pet) => ({
        _id: pet._id,
        name: pet.name,
        colorScheme: pet.colorScheme,
        coinsEarned: pet.coinsEarned,
        daysAlive: Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => b.coinsEarned - a.coinsEarned)
      .slice(0, 10);
  },
});
