
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = getSupabase();

      if (!supabase) {
        throw new Error("Supabase is not configured. Check your environment variables.");
      }

      // Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(`Login failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error("Login succeeded but no user was returned.");
      }

      // Check the artist's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, country, niches")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Profile lookup failed: ${profileError.message}`);
      }

      // Determine whether onboarding is complete
      const onboardingComplete =
        Boolean(profile?.username?.trim()) &&
        Boolean(profile?.country) &&
        Array.isArray(profile?.niches) &&
        profile.niches.length > 0;

      // Redirect to the correct page
      if (onboardingComplete) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }

    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);

      const details =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      setMessage(details);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md">

        <h1 className="text-4xl font-bold mb-2">
          e-<span className="text-yellow-400">ART</span>
        </h1>

        <p className="text-gray-400 mb-10">
          Your art. Your world. Your platform.
        </p>

        <h2 className="text-2xl font-semibold mb-2">
          Welcome back.
        </h2>

        <p className="text-gray-400 mb-8">
          Sign in to continue exploring.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 outline-none focus:border-yellow-400"
              placeholder="Enter your password"
            />
          </div>

          {message && (
            <div className="bg-red-950 border border-red-800 text-red-300 p-3 rounded-lg text-sm break-words">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-8 text-center">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-yellow-400 hover:underline"
          >
            Sign up
          </a>
        </p>

      </div>
    </main>
  );
}
