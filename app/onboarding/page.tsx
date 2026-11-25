
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

const countries = [
  "Kenya", "Uganda", "Tanzania", "Rwanda", "Nigeria",
  "South Africa", "Ghana", "United States", "United Kingdom",
  "Canada", "Germany", "France", "India", "Japan", "Other",
];

const artCategories = {
  "Visual Arts": [
    "Painting", "Drawing", "Digital Art", "Illustration",
    "Sculpture", "Photography", "Graphic Design",
    "3D Art", "Mixed Media", "Collage",
  ],
  "Body & Wearable Art": [
    "Tattoo Art", "Piercing Art", "Body Painting",
    "Makeup Art", "Nail Art", "Fashion Design",
  ],
  "Crafts & Handmade": [
    "Woodworking", "Pottery", "Ceramics", "Jewelry Making",
    "Crochet", "Knitting", "Sewing", "Leatherwork",
  ],
  "Performing Arts": [
    "Dance", "Theatre", "Acting", "Spoken Word",
    "Performance Art", "Comedy",
  ],
  "Music & Sound": [
    "Music Production", "Singing", "Songwriting",
    "Instrumental Music", "Sound Design", "DJing",
  ],
  "Writing & Literature": [
    "Poetry", "Creative Writing", "Storytelling",
    "Screenwriting", "Fiction",
  ],
  "Film & Animation": [
    "Filmmaking", "Directing", "Video Editing",
    "Animation", "Motion Graphics", "VFX",
  ],
};

export default function OnboardingPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleNiche(niche: string) {
    setSelectedNiches((previous) =>
      previous.includes(niche)
        ? previous.filter((item) => item !== niche)
        : [...previous, niche]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !country || selectedNiches.length === 0) {
      setError(
        "Please complete your username, country and at least one art niche."
      );
      return;
    }

    if (!/^[a-z0-9_]{3,25}$/i.test(username.trim())) {
      setError(
        "Username must be 3–25 characters and contain only letters, numbers or underscores."
      );
      return;
    }

    if (profilePicture && profilePicture.size > 5 * 1024 * 1024) {
      setError("Profile picture must be smaller than 5MB.");
      return;
    }

    if (
      profilePicture &&
      !["image/jpeg", "image/png", "image/webp"].includes(profilePicture.type)
    ) {
      setError("Please upload a JPG, PNG or WebP image.");
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      if (!supabase) {
        throw new Error("Supabase is not configured. Check your environment variables.");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please sign in before creating your artist profile.");
      }

      const cleanUsername = username.trim().toLowerCase();

      console.log("Checking username...");

      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser && existingUser.id !== user.id) {
        throw new Error("That username is already taken.");
      }

      let avatarUrl: string | null = null;

      if (profilePicture) {
        console.log("Uploading profile picture...");

        const extension = profilePicture.name.split(".").pop()?.toLowerCase();

        if (!["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
          throw new Error("Please upload a JPG, PNG or WebP image.");
        }

        const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, profilePicture, {
            upsert: true,
            contentType: profilePicture.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = publicUrl.publicUrl;
      }

      console.log("Saving artist profile...");

      const { error: saveError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            username: cleanUsername,
            country,
            bio: bio.trim(),
            niches: selectedNiches,
            ...(avatarUrl ? { avatar: avatarUrl } : {}),
          },
          { onConflict: "id" }
        );

      if (saveError) throw saveError;

      console.log("Artist profile saved successfully.");

      router.push("/");
      router.refresh();

    } catch (err: unknown) {
      console.error("Profile setup failed:", err);

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
              err !== null &&
              "message" in err &&
              typeof err.message === "string"
            ? err.message
            : "Something went wrong. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white px-5 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <p className="text-yellow-400 font-semibold tracking-widest text-sm">
            E-ART / ARTIST SETUP
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Your art. Your identity.
          </h1>

          <p className="text-gray-400 mt-3">
            Tell the world who you are and what you create.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div>
            <label className="block mb-2 font-medium">
              Artist username *
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. edyt_creates"
              maxLength={25}
              required
              className="w-full bg-[#171717] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400"
            />

            <p className="text-gray-500 text-sm mt-2">
              This will be your unique identity on E-ART.
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Country *
            </label>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full bg-[#171717] border border-gray-700 rounded-xl p-4"
            >
              <option value="">Select your country</option>

              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Your art categories & niches *
            </label>

            <p className="text-gray-400 text-sm mb-5">
              Select everything you create. You can choose multiple niches.
            </p>

            <div className="space-y-6">
              {Object.entries(artCategories).map(([category, niches]) => (
                <div key={category}>
                  <h3 className="text-yellow-400 font-semibold mb-3">
                    {category}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {niches.map((niche) => {
                      const selected = selectedNiches.includes(niche);

                      return (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => toggleNiche(niche)}
                          className={`px-4 py-2 rounded-full border text-sm transition ${
                            selected
                              ? "bg-yellow-400 text-black border-yellow-400"
                              : "bg-[#171717] border-gray-700 text-gray-300 hover:border-yellow-400"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {niche}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-400 text-sm mt-4">
              Selected: {selectedNiches.length}
            </p>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Artist bio
            </label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself and your art..."
              maxLength={300}
              rows={4}
              className="w-full bg-[#171717] border border-gray-700 rounded-xl p-4 outline-none focus:border-yellow-400 resize-none"
            />

            <p className="text-gray-500 text-sm text-right">
              {bio.length}/300
            </p>
          </div>

          <div>
            <label className="block mb-3 font-medium">
              Profile picture
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) =>
                setProfilePicture(e.target.files?.[0] || null)
              }
              className="w-full bg-[#171717] border border-gray-700 rounded-xl p-4 text-gray-300"
            />

            <p className="text-gray-500 text-sm mt-2">
              JPG, PNG or WebP. Maximum 5MB.
            </p>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 p-4 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold p-4 rounded-xl transition"
          >
            {loading ? "Creating your profile..." : "Complete artist profile →"}
          </button>

        </form>
      </div>
    </main>
  );
}
