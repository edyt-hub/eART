"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // After any successful sign-in: finished profile -> home, otherwise onboarding.
  async function routeAfterAuth(userId: string) {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data } = await supabase
      .from("profiles")
      .select("username, country")
      .eq("id", userId)
      .maybeSingle();

    router.replace(data?.username && data?.country ? "/" : "/onboarding");
  }

  // Already signed in (or just confirmed their email)? Skip the form.
  useEffect(() => {
    async function checkSession() {
      const supabase = getSupabase();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) routeAfterAuth(user.id);
    }

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured. Check your environment variables.");
      return;
    }
    if (!email.trim() || password.length < 6) {
      setError("Enter your email and a password of at least 6 characters.");
      return;
    }

    setBusy(true);

    try {
      if (mode === "signin") {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
        if (data.user) await routeAfterAuth(data.user.id);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          // Email confirmation is off: they are signed in already.
          router.replace("/onboarding");
        } else {
          setMessage("Check your email and click the confirmation link, then sign in.");
          setMode("signin");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full border border-black/15 bg-white rounded-xl px-4 py-3 outline-none mt-2 text-black focus:border-[#d6a437]";

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#191919] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-black tracking-tight text-center">
          e-ART<span className="text-[#d6a437]">.</span>
        </h1>
        <p className="text-center text-sm text-gray-500 mt-3">
          A world of visual expression
        </p>

        <form
          onSubmit={submit}
          className="bg-white border border-black/10 rounded-2xl p-6 md:p-8 mt-8 space-y-5"
        >
          <h2 className="text-xl font-semibold">
            {mode === "signin" ? "Welcome back." : "Create your account."}
          </h2>

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={input}
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className={input}
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-[#a17a29]">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#d6a437] text-black rounded-full py-3 text-sm font-semibold hover:bg-[#e5bd55] transition disabled:opacity-50"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-500">
            {mode === "signin" ? "New to e-ART?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setMessage("");
              }}
              className="text-[#b1842d] font-medium hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}