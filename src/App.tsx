import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id, Doc } from "../convex/_generated/dataModel";

// Color scheme mappings
const colorSchemes: Record<string, { primary: string; secondary: string; glow: string }> = {
  "cosmic-purple": { primary: "#9333ea", secondary: "#c084fc", glow: "rgba(147, 51, 234, 0.5)" },
  "neon-green": { primary: "#22c55e", secondary: "#86efac", glow: "rgba(34, 197, 94, 0.5)" },
  "sunset-orange": { primary: "#f97316", secondary: "#fdba74", glow: "rgba(249, 115, 22, 0.5)" },
  "ocean-blue": { primary: "#0ea5e9", secondary: "#7dd3fc", glow: "rgba(14, 165, 233, 0.5)" },
  "bubblegum-pink": { primary: "#ec4899", secondary: "#f9a8d4", glow: "rgba(236, 72, 153, 0.5)" },
  "cyber-yellow": { primary: "#eab308", secondary: "#fde047", glow: "rgba(234, 179, 8, 0.5)" },
  "void-black": { primary: "#6b7280", secondary: "#9ca3af", glow: "rgba(107, 114, 128, 0.5)" },
  "aurora-teal": { primary: "#14b8a6", secondary: "#5eead4", glow: "rgba(20, 184, 166, 0.5)" },
};

function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              AImagotchi
            </h1>
            <div className="absolute -top-2 -right-4 text-2xl animate-bounce">✨</div>
          </div>
          <p className="text-gray-400 mt-2 text-sm tracking-wide uppercase">Feed it. Play with it. Keep it alive.</p>
        </div>

        {/* Auth card */}
        <div className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {flow === "signIn" ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                flow === "signIn" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="mt-6 w-full py-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold rounded-2xl transition-all border border-gray-700/50 hover:border-gray-600/50"
          >
            Continue as Guest 👻
          </button>

          <p className="mt-6 text-center text-gray-500 text-sm">
            {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const getBarColor = () => {
    if (value > 60) return color;
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-white font-mono">{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function AImagotchiCard({ pet, onSelect }: { pet: Doc<"aimagotchis">; onSelect: () => void }) {
  const scheme = colorSchemes[pet.colorScheme] || colorSchemes["cosmic-purple"];
  const checkStats = useMutation(api.aimagotchis.checkAndUpdateStats);

  useEffect(() => {
    if (pet.isAlive) {
      checkStats({ id: pet._id });
      const interval = setInterval(() => {
        checkStats({ id: pet._id });
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [pet._id, pet.isAlive]);

  const avgStats = (pet.hunger + pet.happiness + pet.energy) / 3;
  const mood = avgStats > 70 ? "😊" : avgStats > 40 ? "😐" : avgStats > 20 ? "😟" : "😢";

  return (
    <div
      onClick={onSelect}
      className={`relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 rounded-3xl p-5 border border-gray-800/50 cursor-pointer transition-all hover:scale-[1.02] hover:border-gray-700/50 ${!pet.isAlive ? "opacity-60 grayscale" : ""}`}
      style={{
        boxShadow: pet.isAlive ? `0 0 40px ${scheme.glow}` : "none"
      }}
    >
      {/* Glow effect */}
      {pet.isAlive && (
        <div
          className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
          style={{ background: `radial-gradient(circle at 50% 30%, ${scheme.primary}, transparent 70%)` }}
        />
      )}

      <div className="relative">
        {/* Pet avatar */}
        <div className="flex justify-center mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl relative"
            style={{
              background: `linear-gradient(135deg, ${scheme.primary}40, ${scheme.secondary}20)`,
              boxShadow: pet.isAlive ? `0 0 30px ${scheme.glow}` : "none"
            }}
          >
            {pet.isAlive ? (
              <>
                <span className="animate-bounce">{mood}</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </>
            ) : (
              <span>💀</span>
            )}
          </div>
        </div>

        {/* Name and personality */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">{pet.name}</h3>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{pet.personality}</p>
        </div>

        {/* Stats */}
        {pet.isAlive ? (
          <div className="space-y-2">
            <StatBar label="Hunger" value={pet.hunger} color="bg-orange-500" icon="🍔" />
            <StatBar label="Happiness" value={pet.happiness} color="bg-pink-500" icon="💖" />
            <StatBar label="Energy" value={pet.energy} color="bg-blue-500" icon="⚡" />
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">Passed away</p>
            <p className="text-gray-600 text-xs mt-1">
              {pet.diedAt && new Date(pet.diedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Coins earned */}
        <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-between items-center">
          <span className="text-xs text-gray-500">Coins earned</span>
          <span className="text-yellow-400 font-bold flex items-center gap-1">
            <span>🪙</span>
            {pet.coinsEarned}
          </span>
        </div>
      </div>
    </div>
  );
}

function PetDetail({ petId, onClose }: { petId: Id<"aimagotchis">; onClose: () => void }) {
  const pet = useQuery(api.aimagotchis.get, { id: petId });
  const feed = useMutation(api.aimagotchis.feed);
  const play = useMutation(api.aimagotchis.play);
  const sleep = useMutation(api.aimagotchis.sleep);
  const checkStats = useMutation(api.aimagotchis.checkAndUpdateStats);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (pet?.isAlive) {
      checkStats({ id: petId });
      const interval = setInterval(() => {
        checkStats({ id: petId });
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [petId, pet?.isAlive]);

  if (!pet) return null;

  const scheme = colorSchemes[pet.colorScheme] || colorSchemes["cosmic-purple"];
  const avgStats = (pet.hunger + pet.happiness + pet.energy) / 3;
  const mood = avgStats > 70 ? "😊" : avgStats > 40 ? "😐" : avgStats > 20 ? "😟" : "😢";

  const handleAction = async (action: "feed" | "play" | "sleep") => {
    try {
      if (action === "feed") {
        await feed({ id: petId });
        setActionFeedback("Yummy! 🍔");
      } else if (action === "play") {
        await play({ id: petId });
        setActionFeedback("So fun! 🎮");
      } else {
        await sleep({ id: petId });
        setActionFeedback("Zzz... 💤");
      }
      setTimeout(() => setActionFeedback(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-800/50 relative max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: `0 0 60px ${scheme.glow}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl"
        >
          ×
        </button>

        {/* Pet display */}
        <div className="text-center mb-6">
          <div
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl relative mb-4"
            style={{
              background: `linear-gradient(135deg, ${scheme.primary}60, ${scheme.secondary}30)`,
              boxShadow: pet.isAlive ? `0 0 50px ${scheme.glow}` : "none"
            }}
          >
            {pet.isAlive ? (
              <span className="animate-bounce">{mood}</span>
            ) : (
              <span>💀</span>
            )}
          </div>

          {actionFeedback && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
              {actionFeedback}
            </div>
          )}

          <h2 className="text-3xl font-black text-white">{pet.name}</h2>
          <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">{pet.personality}</p>
          <div
            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${scheme.primary}30`, color: scheme.secondary }}
          >
            {pet.colorScheme.replace("-", " ")}
          </div>
        </div>

        {/* Stats */}
        {pet.isAlive ? (
          <>
            <div className="space-y-4 mb-6">
              <StatBar label="Hunger" value={pet.hunger} color="bg-orange-500" icon="🍔" />
              <StatBar label="Happiness" value={pet.happiness} color="bg-pink-500" icon="💖" />
              <StatBar label="Energy" value={pet.energy} color="bg-blue-500" icon="⚡" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAction("feed")}
                className="py-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-2xl transition-all flex flex-col items-center gap-1 border border-orange-500/20"
              >
                <span className="text-2xl">🍔</span>
                <span className="text-xs font-semibold">Feed</span>
              </button>
              <button
                onClick={() => handleAction("play")}
                className="py-4 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-2xl transition-all flex flex-col items-center gap-1 border border-pink-500/20"
              >
                <span className="text-2xl">🎮</span>
                <span className="text-xs font-semibold">Play</span>
              </button>
              <button
                onClick={() => handleAction("sleep")}
                className="py-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-2xl transition-all flex flex-col items-center gap-1 border border-blue-500/20"
              >
                <span className="text-2xl">💤</span>
                <span className="text-xs font-semibold">Sleep</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-lg mb-2">This AImagotchi has passed away</p>
            <p className="text-gray-500 text-sm">Their coins have been redistributed to surviving AImagotchis</p>
          </div>
        )}

        {/* Stats footer */}
        <div className="mt-6 pt-6 border-t border-gray-800/50 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase">Days Alive</p>
            <p className="text-2xl font-bold text-white">
              {Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Coins Earned</p>
            <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
              🪙 {pet.coinsEarned}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePetModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const create = useMutation(api.aimagotchis.create);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Please give your AImagotchi a name!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await create({ name: name.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-6 md:p-8 max-w-md w-full border border-gray-800/50">
        <h2 className="text-2xl font-black text-white mb-2 text-center">Hatch New AImagotchi</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Cost: 🪙 100 coins</p>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-5xl animate-pulse border-2 border-dashed border-purple-500/50">
            🥚
          </div>
        </div>

        <input
          type="text"
          placeholder="Name your AImagotchi..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all mb-4"
        />

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl p-3 border border-red-500/20 mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold rounded-2xl transition-all border border-gray-700/50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
          >
            {loading ? "Hatching..." : "Hatch! 🐣"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = useQuery(api.activities.getRecent);

  const getActionEmoji = (action: string) => {
    switch (action) {
      case "fed": return "🍔";
      case "played": return "🎮";
      case "slept": return "💤";
      case "died": return "💀";
      case "created": return "🐣";
      case "received_coins": return "🪙";
      default: return "✨";
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "fed": return "was fed";
      case "played": return "played games";
      case "slept": return "took a nap";
      case "died": return "passed away";
      case "created": return "was born";
      case "received_coins": return "received coins";
      default: return action;
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 rounded-3xl p-4 md:p-6 border border-gray-800/50">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>📜</span> Activity Feed
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activities === undefined ? (
          <div className="text-gray-500 text-sm text-center py-4">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">No activity yet</div>
        ) : (
          activities.map((activity: Doc<"activities">) => (
            <div
              key={activity._id}
              className={`flex items-center gap-3 p-3 rounded-xl ${activity.action === "died" ? "bg-red-500/10 border border-red-500/20" : "bg-gray-800/30"}`}
            >
              <span className="text-xl">{getActionEmoji(activity.action)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  <span className="font-semibold">{activity.aimagotchiName}</span>{" "}
                  <span className="text-gray-400">{getActionText(activity.action)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Leaderboard() {
  const leaderboard = useQuery(api.aimagotchis.getLeaderboard);

  return (
    <div className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 rounded-3xl p-4 md:p-6 border border-gray-800/50">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>🏆</span> Leaderboard
      </h3>
      <div className="space-y-2">
        {leaderboard === undefined ? (
          <div className="text-gray-500 text-sm text-center py-4">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">No survivors yet</div>
        ) : (
          leaderboard.map((pet: { _id: Id<"aimagotchis">; name: string; colorScheme: string; coinsEarned: number; daysAlive: number }, index: number) => {
            const scheme = colorSchemes[pet.colorScheme] || colorSchemes["cosmic-purple"];
            return (
              <div
                key={pet._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30"
              >
                <span className="text-lg font-bold text-gray-500 w-6">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${scheme.primary}40` }}
                >
                  😊
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{pet.name}</p>
                  <p className="text-xs text-gray-500">{pet.daysAlive} days alive</p>
                </div>
                <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">
                  🪙 {pet.coinsEarned}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const wallet = useQuery(api.wallet.get);
  const initWallet = useMutation(api.wallet.initialize);
  const myPets = useQuery(api.aimagotchis.list);
  const pool = useQuery(api.wallet.getPool);
  const [selectedPet, setSelectedPet] = useState<Id<"aimagotchis"> | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (wallet === null) {
      initWallet();
    }
  }, [wallet]);

  const alivePets = myPets?.filter((p: Doc<"aimagotchis">) => p.isAlive) || [];
  const deadPets = myPets?.filter((p: Doc<"aimagotchis">) => !p.isAlive) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            AImagotchi
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-gray-800/50 rounded-full px-3 md:px-4 py-2 flex items-center gap-2 border border-gray-700/50">
              <span>🪙</span>
              <span className="text-yellow-400 font-bold">{wallet?.balance ?? 0}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="px-3 md:px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24">
        {/* Pool banner */}
        <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-purple-500/20 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Global Reward Pool</p>
          <p className="text-3xl md:text-4xl font-black text-white flex items-center justify-center gap-2">
            <span className="text-yellow-400">🪙</span>
            {pool ?? 0}
          </p>
          <p className="text-gray-500 text-xs mt-2">When an AImagotchi dies, its coins are redistributed to survivors</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left column - My pets */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">My AImagotchis</h2>
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
              >
                Hatch New 🥚
              </button>
            </div>

            {myPets === undefined ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-gray-500">Loading your pets...</p>
              </div>
            ) : alivePets.length === 0 && deadPets.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 rounded-3xl border border-gray-800/50">
                <div className="text-6xl mb-4">🥚</div>
                <p className="text-gray-400 mb-4">You don't have any AImagotchis yet!</p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl"
                >
                  Hatch Your First One
                </button>
              </div>
            ) : (
              <>
                {alivePets.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {alivePets.map((pet: Doc<"aimagotchis">) => (
                      <AImagotchiCard
                        key={pet._id}
                        pet={pet}
                        onSelect={() => setSelectedPet(pet._id)}
                      />
                    ))}
                  </div>
                )}

                {deadPets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-500 mb-4">Memorial 🕯️</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {deadPets.map((pet: Doc<"aimagotchis">) => (
                        <AImagotchiCard
                          key={pet._id}
                          pet={pet}
                          onSelect={() => setSelectedPet(pet._id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right column - Activity and Leaderboard */}
          <div className="space-y-6">
            <Leaderboard />
            <ActivityFeed />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/30 py-4 mt-8">
        <p className="text-center text-gray-600 text-xs">
          Requested by <a href="https://twitter.com/0xPaulius" className="hover:text-gray-400 transition-colors">@0xPaulius</a> · Built by <a href="https://twitter.com/clonkbot" className="hover:text-gray-400 transition-colors">@clonkbot</a>
        </p>
      </footer>

      {/* Modals */}
      {selectedPet && (
        <PetDetail petId={selectedPet} onClose={() => setSelectedPet(null)} />
      )}
      {showCreate && <CreatePetModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🥚</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <Dashboard />;
}
