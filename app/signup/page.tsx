

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = getSupabase();

      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      if (data.session) {
        router.replace("/onboarding");
      } else {
        setMessage(
          "Account created! Please verify your email, then log in to complete your profile."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">Join e-ART.</h1>

        <p className="text-gray-400 mb-8">
          Create an account and share your art with the world.
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm">Artist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 outline-none focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-400 text-black font-semibold p-3 hover:bg-yellow-300 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p className="text-sm text-center text-yellow-300">
              {message}
            </p>
          )}
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
