"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import dynamic from "next/dynamic";
import world from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import { getSupabase } from "../lib/supabase";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

// Name of the Supabase Storage bucket that holds artwork images.
// Create it in Supabase (Storage -> New bucket) and make it public.
const ARTWORK_BUCKET = "artworks";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="p-10 text-center text-white">Preparing the Earth...</div>
  ),
}) as any;

const countriesGeo = (
  feature(world as any, (world as any).objects.countries) as any
).features as any[];

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type Artwork = {
  id?: string;
  artistId?: string;
  title: string;
  artist: string;
  artistUsername?: string;
  country: string;
  category: string;
  image: string;
  description?: string;
  isOwn?: boolean;
};

type Artist = {
  id?: string;
  name: string;
  username: string;
  country: string;
  category: string;
  bio: string;
  image: string;
};

type Follow = {
  follower_id: string;
  following_id: string;
};

type Exhibition = {
  id: number;
  title: string;
  country: string;
  city: string;
  venue: string;
  type: string;
  format: string;
  date: string;
  description: string;
  image: string;
  status: string;
};

type ChatMessage = { from: "me" | "them"; text: string };

// ---------------------------------------------------------------------------
// DEMO DATA (used until real data exists in Supabase)
// ---------------------------------------------------------------------------

const artworks: Artwork[] = [
  { title: "The Quiet Between", artist: "Amara N.", country: "Kenya", category: "Painting", image: "photo-1579783902614-a3fb3927b6a5" },
  { title: "Urban Fragments", artist: "David K.", country: "Nigeria", category: "Photography", image: "photo-1519608487953-e999c86e7455" },
  { title: "Form and Space", artist: "Lena M.", country: "France", category: "Sculpture", image: "photo-1578749556568-bc2c40e68b61" },
  { title: "A Different World", artist: "Joel A.", country: "Japan", category: "Digital Art", image: "photo-1549490349-8643362247b5" },
  { title: "Untitled No. 04", artist: "Nia W.", country: "Ghana", category: "Painting", image: "photo-1577083552431-6e5fd01aa342" },
  { title: "Light Studies", artist: "Brian T.", country: "South Africa", category: "Photography", image: "photo-1470770841072-f978cf4d019e" },
  { title: "Beyond the Horizon", artist: "Daniel O.", country: "Kenya", category: "Digital Art", image: "photo-1549490349-8643362247b5" },
];

const artists: Artist[] = [
  { name: "Amara N.", username: "@amara.creates", country: "Kenya", category: "Painter", bio: "Exploring memory, colour and everyday life through painting.", image: "photo-1534528741775-53994a69daeb" },
  { name: "David K.", username: "@david.frames", country: "Nigeria", category: "Photographer", bio: "Finding stories in ordinary streets and unexpected moments.", image: "photo-1500648767791-00dcc994a43e" },
  { name: "Lena M.", username: "@lena.forms", country: "France", category: "Sculptor", bio: "Interested in form, space, material and the relationship between objects.", image: "photo-1531123897727-8f129e1688ce" },
  { name: "Joel A.", username: "@joel.digital", country: "Japan", category: "Digital artist", bio: "Building imagined worlds through digital experimentation.", image: "photo-1506794778202-cad84cf45f1d" },
  { name: "Nia W.", username: "@nia.works", country: "Ghana", category: "Painter", bio: "A visual diary of people, places and changing identities.", image: "photo-1524504388940-b1c1722653e1" },
  { name: "Brian T.", username: "@brian.sees", country: "South Africa", category: "Photographer", bio: "Light, landscapes and the details people often walk past.", image: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Daniel O.", username: "@daniel.makes", country: "Kenya", category: "Digital artist", bio: "Experiments in shape, colour and visual storytelling.", image: "photo-1500648767791-00dcc994a43e" },
];

const exhibitions: Exhibition[] = [
  { id: 1, title: "The Future of African Art", country: "Kenya", city: "Nairobi", venue: "Nairobi National Museum", type: "Art Exhibition", format: "Physical", date: "December 12, 2026", description: "An exploration of contemporary African creativity, identity and visual storytelling.", image: "photo-1579783902614-a3fb3927b6a5", status: "Upcoming" },
  { id: 2, title: "Beyond the Canvas", country: "France", city: "Paris", venue: "Paris Art Gallery", type: "Art Exhibition", format: "Virtual", date: "November 25, 2026", description: "Discover contemporary painting, experimental techniques and emerging artists.", image: "photo-1577083552431-6e5fd01aa342", status: "Upcoming" },
  { id: 3, title: "Digital Dimensions", country: "Japan", city: "Tokyo", venue: "Tokyo Digital Arts Centre", type: "Digital Art Festival", format: "Virtual", date: "November 30, 2026", description: "A celebration of digital creativity, 3D art and experimental visual experiences.", image: "photo-1549490349-8643362247b5", status: "Upcoming" },
  { id: 4, title: "Photography and Humanity", country: "South Africa", city: "Cape Town", venue: "Cape Town Art Space", type: "Photography Exhibition", format: "Physical", date: "December 5, 2026", description: "Photographers explore humanity through portraits, landscapes and everyday life.", image: "photo-1470770841072-f978cf4d019e", status: "Upcoming" },
  { id: 5, title: "Sculpture Without Borders", country: "Nigeria", city: "Lagos", venue: "Lagos Creative Centre", type: "Sculpture Exhibition", format: "Virtual", date: "December 18, 2026", description: "A collection celebrating form, materials and contemporary sculpture.", image: "photo-1578749556568-bc2c40e68b61", status: "Upcoming" },
];

const navigation = [
  { name: "Home", icon: "⌂" },
  { name: "Explore", icon: "◎" },
  { name: "Upload", icon: "+" },
  { name: "Chats", icon: "▤" },
  { name: "Profile", icon: "○" },
];

const exploreCategories = [
  "All",
  "Painters",
  "Sculptors",
  "Photographers",
  "Illustrators",
  "Digital Artists",
  "Graphic Designers",
  "Mixed Media",
  "Printmakers",
];

const uploadCategories = [
  "Painting",
  "Photography",
  "Sculpture",
  "Digital Art",
  "Illustration",
  "Mixed Media",
  "Other",
];

const demoChats = [
  { name: "Amara N.", message: "Thank you for appreciating my work!", time: "10:42", image: "photo-1534528741775-53994a69daeb", unread: true },
  { name: "David K.", message: "I have uploaded something new.", time: "Yesterday", image: "photo-1500648767791-00dcc994a43e", unread: false },
  { name: "Lena M.", message: "That exhibition looks interesting.", time: "Monday", image: "photo-1531123897727-8f129e1688ce", unread: false },
];

const initialProfile = {
  name: "Artist Name",
  username: "@yourname",
  country: "Your country",
  category: "Visual artist",
  bio: "Welcome to my creative space. This is where I share my work, experiments, inspirations and visual stories.",
  avatar: "",
};

// ---------------------------------------------------------------------------
// HELPERS (outside the component so they are not re-created every render)
// ---------------------------------------------------------------------------

function imageUrl(image: string) {
  if (!image) return "";
  if (
    image.startsWith("data:") ||
    image.startsWith("blob:") ||
    image.startsWith("http")
  ) {
    return image;
  }
  return `https://images.unsplash.com/${image}?w=900&q=85`;
}

function exhibitionStatus(dateText: string) {
  const eventDate = new Date(dateText);
  if (isNaN(eventDate.getTime())) return "Upcoming";
  const today = new Date();
  const a = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (a === b) return "Today";
  return a > b ? "Upcoming" : "Ended";
}

function Avatar({
  src,
  name,
  size = 48,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const url = src ? imageUrl(src) : "";
  const style = { width: size, height: size };

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={style}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={{ ...style, fontSize: size / 2.6 }}
      className="rounded-full bg-[#d6a437] text-black font-bold flex items-center justify-center shrink-0"
    >
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full p-1 transition shrink-0 ${
        checked ? "bg-[#d6a437]" : "bg-gray-400/50"
      }`}
    >
      <span
        className={`block w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// PAGE
// ---------------------------------------------------------------------------

export default function Home() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [homeCategory, setHomeCategory] = useState("For you");
  const [selectedChat, setSelectedChat] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const [profile, setProfile] = useState(initialProfile);
  const [editDraft, setEditDraft] = useState(initialProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Detected from your real `profiles` table so load and save always agree.
  const [profileSchema, setProfileSchema] = useState({
    avatarColumn: "avatar_url",
    hasNiches: false,
  });

  const [dbArtworks, setDbArtworks] = useState<Artwork[]>([]);
  const [registeredArtists, setRegisteredArtists] = useState<Artist[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [followBusy, setFollowBusy] = useState(false);
  const [feedMessage, setFeedMessage] = useState("");

  const [view, setView] = useState<
    "main" | "settings" | "edit-profile" | "artist-profile"
  >("main");

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [systemDark, setSystemDark] = useState(false);

  const [notifications, setNotifications] = useState({
    followers: true,
    likes: true,
    messages: true,
    activity: false,
  });

  const [exploreTab, setExploreTab] = useState("Overview");
  const [exploreCategory, setExploreCategory] = useState("All");
  const [exhibitionFilter, setExhibitionFilter] = useState("All");
  const [followedExhibitions, setFollowedExhibitions] = useState<number[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);
  const [messagePermission, setMessagePermission] = useState("Everyone");

  const [chatLog, setChatLog] = useState<Record<string, ChatMessage[]>>({});
  const [chatDraft, setChatDraft] = useState("");

  const [globeSize, setGlobeSize] = useState({ width: 900, height: 650 });

  // UPLOAD STATE
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Painting");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const isDark = theme === "dark" || (theme === "system" && systemDark);

  const pageBg = isDark
    ? "bg-[#111111] text-[#f5f2eb]"
    : "bg-[#faf9f6] text-[#191919]";
  const panel = isDark
    ? "bg-[#1c1c1c] border-white/10"
    : "bg-white border-black/10";
  const muted = isDark ? "text-gray-400" : "text-gray-500";
  const border = isDark ? "border-white/10" : "border-black/10";
  const inputStyle = `w-full border rounded-xl px-4 py-3 outline-none mt-2 ${
    isDark
      ? "bg-[#111] border-white/15 text-white"
      : "bg-white border-black/15 text-black"
  }`;

  // -------------------------------------------------------------------------
  // EFFECTS
  // -------------------------------------------------------------------------

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    function resize() {
      setGlobeSize({
        width: Math.min(window.innerWidth - 20, 1100),
        height: Math.max(400, window.innerHeight - 220),
      });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPlatformData() {
      const supabase = getSupabase();

      if (!supabase) {
        if (isMounted) {
          setProfileError("Supabase is not configured. Check your environment variables.");
          setFeedMessage("Supabase is not configured. Showing demo content.");
          setProfileLoading(false);
        }
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (isMounted && user) setCurrentUserId(user.id);

        // Registered artists (select("*") so a missing column can't break loading)
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*");

        if (profilesError) throw profilesError;

        const loadedArtists: Artist[] = (profilesData || []).map((item: any) => {
          const cleanUsername = (item.username || "").replace(/^@/, "");
          const niches = Array.isArray(item.niches) ? item.niches.join(", ") : "";

          return {
            id: item.id,
            name: cleanUsername || "Artist",
            username: cleanUsername ? `@${cleanUsername}` : "@artist",
            country: item.country || "Unknown",
            category: niches || "Visual artist",
            bio: item.bio || "",
            image: item.avatar_url || item.avatar || "",
          };
        });

        // Artworks
        const { data: artworkData, error: artworkError } = await supabase
          .from("artworks")
          .select("id, artist_id, title, description, image_url, category, created_at")
          .order("created_at", { ascending: false });

        if (artworkError) throw artworkError;

        const artistLookup = new Map(loadedArtists.map((a) => [a.id, a]));

        const loadedArtworks: Artwork[] = (artworkData || []).map((item: any) => {
          const artist = artistLookup.get(item.artist_id);
          return {
            id: item.id,
            artistId: item.artist_id,
            title: item.title || "Untitled",
            artist: artist?.name || "Unknown artist",
            artistUsername: artist?.username || "",
            country: artist?.country || "Unknown",
            category: item.category || "Other",
            image: item.image_url,
            description: item.description || "",
            isOwn: !!user && item.artist_id === user.id,
          };
        });

        // Follows (non-fatal if the table is missing)
        const { data: followsData, error: followsError } = await supabase
          .from("follows")
          .select("follower_id, following_id");

        if (followsError) console.error("Follows loading error:", followsError);

        if (!isMounted) return;

        setRegisteredArtists(loadedArtists);
        setDbArtworks(loadedArtworks);
        setFollows(followsData || []);

        if (user) {
          const own = (profilesData || []).find((p: any) => p.id === user.id);

          if (own) {
            const cleanUsername = (own.username || "").replace(/^@/, "");
            const avatarColumn = "avatar_url" in own ? "avatar_url" : "avatar";

            const loadedProfile = {
              name: cleanUsername || "Artist",
              username: cleanUsername ? `@${cleanUsername}` : "@yourname",
              country: own.country || "",
              category: Array.isArray(own.niches) && own.niches.length > 0
                ? own.niches.join(", ")
                : "Visual artist",
              bio: own.bio || "",
              avatar: own[avatarColumn] || "",
            };

            setProfileSchema({ avatarColumn, hasNiches: "niches" in own });
            setProfile(loadedProfile);
            setEditDraft(loadedProfile);
            setProfileError("");
          } else {
            setProfileError("No profile was found. Please complete onboarding first.");
          }
        } else {
          setProfileError("Please log in to view your profile.");
        }

        setFeedMessage(
          followsError
            ? "Artists and artwork loaded. Follow information could not be loaded."
            : ""
        );
        setProfileLoading(false);
      } catch (error: any) {
        console.error("Platform loading error:", error);
        if (isMounted) {
          setProfileError(error?.message || "Could not load your profile.");
          setFeedMessage("Could not load the artwork feed. Showing demo content.");
          setProfileLoading(false);
        }
      }
    }

    loadPlatformData();
    return () => {
      isMounted = false;
    };
  }, []);

  // -------------------------------------------------------------------------
  // DERIVED DATA
  // -------------------------------------------------------------------------

  const categories = ["For you", "Painting", "Photography", "Sculpture", "Digital Art"];

  const availableArtists = registeredArtists.length > 0 ? registeredArtists : artists;

  const feedArtworks = dbArtworks.length > 0 ? dbArtworks : artworks;

  const homeArtworks = useMemo(
    () =>
      homeCategory === "For you"
        ? feedArtworks
        : feedArtworks.filter((art) => art.category === homeCategory),
    [homeCategory, feedArtworks]
  );

  const allArtworks = useMemo(
    () => [...dbArtworks, ...artworks],
    [dbArtworks]
  );

  // Countries that have artwork AND exist on the globe (used by "Surprise me").
  const surpriseCountries = useMemo(() => {
    const geoNames = new Map<string, string>(
      countriesGeo.map((f: any) => [
        String(f.properties?.name || "").toLowerCase(),
        String(f.properties?.name || ""),
      ])
    );
    const found = new Set<string>();
    allArtworks.forEach((art) => {
      const name = geoNames.get((art.country || "").toLowerCase());
      if (name) found.add(name);
    });
    return Array.from(found);
  }, [allArtworks]);

  const filteredArtworks = useMemo(
    () =>
      allArtworks.filter((art) => {
        const matchesCountry =
          art.country.toLowerCase() === selectedCountry.toLowerCase();
        const q = search.toLowerCase();
        const matchesSearch =
          art.title.toLowerCase().includes(q) ||
          art.artist.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q);
        return matchesCountry && matchesSearch;
      }),
    [allArtworks, selectedCountry, search]
  );

  const countryExhibitions = exhibitions.filter(
    (event) => event.country.toLowerCase() === selectedCountry.toLowerCase()
  );

  const filteredExhibitions = exhibitions.filter(
    (event) =>
      exhibitionFilter === "All" ||
      event.format === exhibitionFilter ||
      event.type === exhibitionFilter
  );

  const filteredArtists = availableArtists.filter((artist) => {
    const matchesCountry =
      !selectedCountry ||
      artist.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesCategory =
      exploreCategory === "All" ||
      artist.category
        .toLowerCase()
        .includes(exploreCategory.replace(/s$/, "").toLowerCase());
    const q = search.toLowerCase();
    const matchesSearch =
      artist.name.toLowerCase().includes(q) ||
      artist.username.toLowerCase().includes(q);
    return matchesCountry && matchesCategory && matchesSearch;
  });

  const artistOfDay = useMemo(() => {
    if (availableArtists.length === 0) return null;
    const today = new Date();
    const dayNumber = Math.floor(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000
    );
    return availableArtists[dayNumber % availableArtists.length];
  }, [availableArtists]);

  const myArtworks = dbArtworks.filter((art) => art.isOwn);

  function followerCount(id?: string) {
    return id ? follows.filter((f) => f.following_id === id).length : 0;
  }

  function followingCount(id?: string) {
    return id ? follows.filter((f) => f.follower_id === id).length : 0;
  }

  function isFollowing(id?: string) {
    return (
      !!id &&
      !!currentUserId &&
      follows.some((f) => f.follower_id === currentUserId && f.following_id === id)
    );
  }

  // -------------------------------------------------------------------------
  // ACTIONS
  // -------------------------------------------------------------------------

  function goTo(page: string) {
    setActivePage(page);
    setSelectedCountry("");
    setSearch("");
    setSelectedChat("");
    setSelectedArtist(null);
    setSelectedExhibition(null);
    setShowNotifications(false);
    setView("main");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function enterCountry(country: any) {
    const name = country?.properties?.name;
    if (name) {
      setSelectedCountry(name);
      setSearch("");
      setExploreTab("Overview");
      setExploreCategory("All");
    }
  }

  function surpriseMe() {
    const options = surpriseCountries.filter(
      (name) => name.toLowerCase() !== selectedCountry.toLowerCase()
    );
    if (options.length === 0) return;

    const pick = options[Math.floor(Math.random() * options.length)];
    setSelectedCountry(pick);
    setSearch("");
    setExploreTab("Overview");
    setExploreCategory("All");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openArtist(name: string, id?: string) {
    const artist =
      availableArtists.find((item) => (id ? item.id === id : false)) ||
      availableArtists.find((item) => item.name === name) ||
      artists.find((item) => item.name === name);

    if (artist) {
      setSelectedArtist(artist);
      setView("artist-profile");
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    }
  }

  function toggleFollowExhibition(id: number) {
    setFollowedExhibitions((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  async function toggleFollowArtist(artist: Artist) {
    if (!artist.id) {
      setFeedMessage("This is a demo artist and cannot be followed yet.");
      return;
    }
    if (!currentUserId) {
      setFeedMessage("Please log in to follow artists.");
      return;
    }
    if (artist.id === currentUserId) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setFollowBusy(true);
    setFeedMessage("");

    try {
      if (isFollowing(artist.id)) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", artist.id);
        if (error) throw error;

        setFollows((prev) =>
          prev.filter(
            (f) => !(f.follower_id === currentUserId && f.following_id === artist.id)
          )
        );
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: currentUserId, following_id: artist.id });
        if (error) throw error;

        setFollows((prev) => [
          ...prev,
          { follower_id: currentUserId, following_id: artist.id as string },
        ]);
      }
    } catch (error: any) {
      console.error("Follow error:", error);
      setFeedMessage(error?.message || "Could not update follow.");
    } finally {
      setFollowBusy(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadMessage("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadMessage("Please choose an image smaller than 10 MB.");
      return;
    }

    setUploadFile(file);
    setUploadMessage("");

    const reader = new FileReader();
    reader.onload = () => setUploadPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function publishArtwork() {
    if (!uploadFile || !uploadPreview) {
      setUploadMessage("Please select an image first.");
      return;
    }
    if (!uploadTitle.trim()) {
      setUploadMessage("Please give your artwork a title.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setUploadMessage("Supabase is not configured. Check your environment variables.");
      return;
    }
    if (!currentUserId) {
      setUploadMessage("Please log in before uploading artwork.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    let uploadedPath = "";

    try {
      const extension =
        uploadFile.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      uploadedPath = `${currentUserId}/${Date.now()}.${extension}`;

      const { error: storageError } = await supabase.storage
        .from(ARTWORK_BUCKET)
        .upload(uploadedPath, uploadFile, {
          contentType: uploadFile.type,
          upsert: false,
        });

      if (storageError) throw storageError;

      const { data: publicData } = supabase.storage
        .from(ARTWORK_BUCKET)
        .getPublicUrl(uploadedPath);

      const { data: row, error: insertError } = await supabase
        .from("artworks")
        .insert({
          artist_id: currentUserId,
          title: uploadTitle.trim(),
          description: uploadDescription.trim(),
          image_url: publicData.publicUrl,
          category: uploadCategory,
        })
        .select("id, artist_id, title, description, image_url, category")
        .single();

      if (insertError) {
        // Don't leave an orphaned file behind if the database insert failed.
        await supabase.storage.from(ARTWORK_BUCKET).remove([uploadedPath]);
        throw insertError;
      }

      const newArtwork: Artwork = {
        id: row.id,
        artistId: row.artist_id,
        title: row.title || "Untitled",
        artist: profile.name,
        artistUsername: profile.username,
        country: profile.country || "Unknown",
        category: row.category || "Other",
        image: row.image_url,
        description: row.description || "",
        isOwn: true,
      };

      setDbArtworks((prev) => [newArtwork, ...prev]);

      setUploadFile(null);
      setUploadPreview("");
      setUploadTitle("");
      setUploadDescription("");
      setUploadCategory("Painting");
      setHomeCategory("For you");
      goTo("Home");
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadMessage(
        error?.message
          ? `Upload failed: ${error.message}`
          : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileError("");

    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase is not configured. Check your environment variables.");
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const cleanUsername = editDraft.username.trim().replace(/^@/, "");
      const niches = editDraft.category
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const update: Record<string, any> = {
        username: cleanUsername,
        country: editDraft.country.trim(),
        bio: editDraft.bio.trim(),
        [profileSchema.avatarColumn]: editDraft.avatar.trim() || null,
      };

      if (profileSchema.hasNiches) update.niches = niches;

      const { error } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", user.id);

      if (error) throw error;

      const updatedProfile = {
        ...editDraft,
        name: cleanUsername || "Artist",
        username: cleanUsername ? `@${cleanUsername}` : "@yourname",
        category: niches.join(", ") || "Visual artist",
      };

      setProfile(updatedProfile);
      setEditDraft(updatedProfile);

      // Keep the artist list and feed in sync with the new profile details.
      setRegisteredArtists((prev) =>
        prev.map((a) =>
          a.id === user.id
            ? {
                ...a,
                name: updatedProfile.name,
                username: updatedProfile.username,
                country: updatedProfile.country || "Unknown",
                bio: updatedProfile.bio,
                image: updatedProfile.avatar,
                category: updatedProfile.category,
              }
            : a
        )
      );
      setDbArtworks((prev) =>
        prev.map((art) =>
          art.artistId === user.id
            ? {
                ...art,
                artist: updatedProfile.name,
                artistUsername: updatedProfile.username,
                country: updatedProfile.country || "Unknown",
              }
            : art
        )
      );

      setView("main");
    } catch (error: any) {
      console.error("Profile update error:", error);
      setProfileError(error?.message || "Could not save your profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function logOut() {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setCurrentUserId("");
    setProfile(initialProfile);
    setEditDraft(initialProfile);
    setProfileError("Please log in to view your profile.");
    setDbArtworks((prev) => prev.map((a) => ({ ...a, isOwn: false })));
    goTo("Home");
  }

  function sendChatMessage() {
    const text = chatDraft.trim();
    if (!text || !selectedChat) return;

    setChatLog((prev) => ({
      ...prev,
      [selectedChat]: [
        ...(prev[selectedChat] || []),
        { from: "me", text },
      ],
    }));
    setChatDraft("");
  }

  // -------------------------------------------------------------------------
  // SMALL RENDER HELPERS (plain functions, not components, so inputs keep focus)
  // -------------------------------------------------------------------------

  function artistLink(name: string, id?: string) {
    return (
      <button
        onClick={() => openArtist(name, id)}
        className="text-left hover:text-[#b1842d] transition underline-offset-4 hover:underline"
      >
        {name}
      </button>
    );
  }

  function artworkCard(art: Artwork, index: number) {
    return (
      <article
        key={`${art.id || art.title}-${index}`}
        className="break-inside-avoid mb-8 group"
      >
        <div
          className={`overflow-hidden rounded-sm ${
            isDark ? "bg-[#222]" : "bg-gray-200"
          }`}
        >
          <img
            src={imageUrl(art.image)}
            alt={art.title}
            loading="lazy"
            className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
              index % 3 === 0 ? "h-72" : index % 3 === 1 ? "h-96" : "h-80"
            }`}
          />
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="font-semibold text-base">{art.title}</h3>
              <p className={`${muted} text-sm mt-1`}>
                By {artistLink(art.artist, art.artistId)}
              </p>
            </div>
            <span className={`${muted} text-xs whitespace-nowrap`}>
              {art.country}
            </span>
          </div>

          <p className="text-xs text-[#a17a29] mt-2 uppercase tracking-wider">
            {art.category}
          </p>

          {art.description && (
            <p className={`${muted} text-sm mt-2`}>{art.description}</p>
          )}
        </div>
      </article>
    );
  }

  function artistCard(artist: Artist) {
    return (
      <div
        key={artist.id || artist.username}
        className={`border rounded-2xl p-5 flex gap-4 ${panel}`}
      >
        <Avatar src={artist.image} name={artist.name} size={64} />

        <div className="min-w-0 flex-1">
          <button
            onClick={() => openArtist(artist.name, artist.id)}
            className="font-semibold hover:text-[#b1842d] text-left"
          >
            {artist.name}
          </button>
          <p className={`${muted} text-xs mt-0.5`}>{artist.username}</p>
          <p className="text-xs text-[#a17a29] mt-1">
            {artist.category} · {artist.country}
          </p>
          <p className={`${muted} text-sm mt-2 line-clamp-2`}>{artist.bio}</p>
        </div>
      </div>
    );
  }

  function exhibitionCard(event: Exhibition) {
    const following = followedExhibitions.includes(event.id);
    const status = exhibitionStatus(event.date);

    return (
      <div
        key={event.id}
        className={`border rounded-2xl overflow-hidden ${panel}`}
      >
        <img
          src={imageUrl(event.image)}
          alt={event.title}
          className="w-full h-44 object-cover"
        />
        <div className="p-5">
          <div className="flex justify-between gap-3 items-start">
            <h3 className="font-semibold">{event.title}</h3>
            <span
              className={`text-[10px] px-2 py-1 rounded-full shrink-0 ${
                status === "Ended"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-[#d6a437]/20 text-[#b1842d]"
              }`}
            >
              {status}
            </span>
          </div>

          <p className={`${muted} text-xs mt-2`}>
            {event.city}, {event.country} · {event.format}
          </p>
          <p className="text-xs text-[#b1842d] mt-1">{event.date}</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setSelectedExhibition(event)}
              className={`border ${border} rounded-full px-4 py-2 text-xs hover:border-[#d6a437]`}
            >
              Details
            </button>
            <button
              onClick={() => toggleFollowExhibition(event.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                following
                  ? "bg-[#d6a437] text-black"
                  : `border ${border} hover:border-[#d6a437]`
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function followButton(artist: Artist) {
    if (artist.id && artist.id === currentUserId) {
      return (
        <span className={`${muted} text-sm border ${border} rounded-full px-5 py-2`}>
          This is you
        </span>
      );
    }

    const following = isFollowing(artist.id);

    return (
      <button
        onClick={() => toggleFollowArtist(artist)}
        disabled={followBusy}
        className={`rounded-full px-6 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
          following
            ? `border ${border} hover:border-red-400`
            : "bg-[#d6a437] text-black hover:bg-[#e5bd55]"
        }`}
      >
        {following ? "Following" : "Follow"}
      </button>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <main className={`min-h-screen pb-20 md:pb-0 transition-colors ${pageBg}`}>
      {/* TOP NAVIGATION */}

      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b px-5 md:px-10 py-4 ${
          isDark ? "bg-[#111]/95 border-white/10" : "bg-[#faf9f6]/95 border-black/10"
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <button
            onClick={() => goTo("Home")}
            className="text-3xl font-black tracking-tight"
          >
            e-ART<span className="text-[#d6a437]">.</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => goTo(item.name)}
                className={`text-sm transition ${
                  activePage === item.name
                    ? "font-bold text-[#d6a437]"
                    : `${muted} hover:text-[#d6a437]`
                } ${
                  item.name === "Upload"
                    ? "bg-[#d6a437] text-black rounded-full w-10 h-10 text-xl font-bold hover:bg-[#e5bd55]"
                    : ""
                }`}
                aria-label={item.name}
              >
                {item.name === "Upload" ? "+" : item.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-xl hover:text-[#d6a437] transition"
                aria-label="Notifications"
              >
                ♧
                {followedExhibitions.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#d6a437] text-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {followedExhibitions.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`absolute right-0 top-10 w-80 max-w-[90vw] rounded-xl border shadow-2xl p-5 z-[100] ${panel}`}
                >
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className={muted}>
                      ✕
                    </button>
                  </div>

                  <p className="text-xs uppercase tracking-widest text-[#a17a29] mb-4">
                    Exhibition updates
                  </p>

                  {followedExhibitions.length > 0 ? (
                    exhibitions
                      .filter((event) => followedExhibitions.includes(event.id))
                      .map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedExhibition(event);
                            setShowNotifications(false);
                          }}
                          className={`block w-full text-left py-3 border-b ${border}`}
                        >
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className={`${muted} text-xs mt-1`}>
                            {event.city}, {event.country}
                          </p>
                          <p className="text-xs text-[#b1842d] mt-1">{event.date}</p>
                        </button>
                      ))
                  ) : (
                    <div className="py-5">
                      <p className="text-sm">No exhibition notifications yet.</p>
                      <p className={`${muted} text-xs mt-2`}>
                        Follow exhibitions in Explore to receive updates here.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      goTo("Explore");
                      setExploreTab("Exhibitions");
                    }}
                    className="text-[#b1842d] text-sm mt-4"
                  >
                    Discover exhibitions ↗
                  </button>
                </div>
              )}
            </div>

            <div className={`text-xs hidden md:block ${muted}`}>
              A world of visual expression
            </div>
          </div>
        </div>
      </nav>

      {/* HOME FEED */}

      {activePage === "Home" && view === "main" && (
        <section className="max-w-[1600px] mx-auto px-5 md:px-10 pt-10 pb-20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-3">
                A world of visual expression
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Discover art.
              </h1>
              <p className={`${muted} mt-3 text-sm`}>
                Different perspectives. Different worlds. One creative space.
              </p>
            </div>

            <button
              onClick={() => goTo("Explore")}
              className={`border ${border} px-6 py-3 rounded-full text-sm hover:bg-[#d6a437] hover:text-black transition w-fit`}
            >
              Explore the world ↗
            </button>
          </div>

          {feedMessage && (
            <p className={`${muted} text-sm mb-6`}>{feedMessage}</p>
          )}

          {/* ARTIST OF THE DAY */}

          {artistOfDay && (
            <div className={`border rounded-2xl p-5 mb-8 flex items-center gap-5 ${panel}`}>
              <Avatar src={artistOfDay.image} name={artistOfDay.name} size={64} />
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-[#a17a29]">
                  Artist of the day
                </p>
                <h3 className="font-semibold text-lg mt-1">{artistOfDay.name}</h3>
                <p className={`${muted} text-sm truncate`}>
                  {artistOfDay.category} · {artistOfDay.country}
                </p>
              </div>
              <button
                onClick={() => openArtist(artistOfDay.name, artistOfDay.id)}
                className={`border ${border} rounded-full px-5 py-2 text-sm hover:bg-[#d6a437] hover:text-black transition shrink-0`}
              >
                View
              </button>
            </div>
          )}

          {/* CATEGORIES */}

          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-7">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setHomeCategory(category)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm transition ${
                  homeCategory === category
                    ? "bg-[#d6a437] text-black"
                    : `${panel} border ${muted}`
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ARTWORK FEED */}

          {homeArtworks.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
              {homeArtworks.map((art, index) => artworkCard(art, index))}
            </div>
          ) : (
            <p className={`${muted} text-center py-20`}>
              No artwork in this category yet. Be the first to upload one.
            </p>
          )}

          <div className={`text-center mt-16 border-t ${border} pt-10`}>
            <p className={`${muted} text-sm`}>
              You're exploring the beginning of a world of art.
            </p>
          </div>
        </section>
      )}

      {/* EXPLORE */}

      {activePage === "Explore" && view === "main" && (
        <section className="max-w-[1600px] mx-auto px-5 md:px-10 py-10 min-h-[85vh]">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-3">
              {selectedCountry || "The world"}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {selectedCountry ? `Art from ${selectedCountry}.` : "Explore the world."}
            </h1>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6">
            {["Overview", "Artists", "Exhibitions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setExploreTab(tab)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm transition ${
                  exploreTab === tab
                    ? "bg-[#d6a437] text-black"
                    : `${panel} border ${muted}`
                }`}
              >
                {tab}
              </button>
            ))}

            <button
              onClick={surpriseMe}
              disabled={surpriseCountries.length === 0}
              className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#d6a437] text-black hover:bg-[#e5bd55] transition disabled:opacity-50"
            >
              ✦ Surprise me
            </button>

            {selectedCountry && (
              <button
                onClick={() => setSelectedCountry("")}
                className={`shrink-0 px-5 py-2.5 rounded-full text-sm border ${border} hover:border-[#d6a437]`}
              >
                Back to globe ✕
              </button>
            )}
          </div>

          {/* OVERVIEW: GLOBE OR COUNTRY */}

          {exploreTab === "Overview" && !selectedCountry && (
            <div className="rounded-2xl overflow-hidden bg-black flex flex-col items-center">
              <p className="text-white/70 text-sm pt-5 px-5 text-center">
                Drag to rotate, then click a country to see its art.
              </p>
              <Globe
                width={globeSize.width}
                height={globeSize.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"
                polygonsData={countriesGeo}
                polygonCapColor={() => "rgba(214,164,55,0.30)"}
                polygonSideColor={() => "rgba(214,164,55,0.08)"}
                polygonStrokeColor={() => "#6b5420"}
                polygonLabel={(d: any) => d?.properties?.name || ""}
                onPolygonClick={enterCountry}
              />
            </div>
          )}

          {exploreTab === "Overview" && selectedCountry && (
            <div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artwork, artists or categories"
                className={`${inputStyle} mb-8 max-w-xl`}
              />

              {countryExhibitions.length > 0 && (
                <div className="mb-10">
                  <h2 className="font-semibold text-lg mb-4">Exhibitions</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {countryExhibitions.map(exhibitionCard)}
                  </div>
                </div>
              )}

              <h2 className="font-semibold text-lg mb-4">Artwork</h2>
              {filteredArtworks.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
                  {filteredArtworks.map((art, index) => artworkCard(art, index))}
                </div>
              ) : (
                <p className={`${muted} py-10`}>
                  No artwork from {selectedCountry} yet.
                </p>
              )}
            </div>
          )}

          {/* ARTISTS TAB */}

          {exploreTab === "Artists" && (
            <div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artists"
                className={`${inputStyle} mb-5 max-w-xl`}
              />

              <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-5">
                {exploreCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setExploreCategory(category)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs transition ${
                      exploreCategory === category
                        ? "bg-[#d6a437] text-black"
                        : `${panel} border ${muted}`
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filteredArtists.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredArtists.map(artistCard)}
                </div>
              ) : (
                <p className={`${muted} py-10`}>No artists match your search.</p>
              )}
            </div>
          )}

          {/* EXHIBITIONS TAB */}

          {exploreTab === "Exhibitions" && (
            <div>
              <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-5">
                {["All", "Physical", "Virtual"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setExhibitionFilter(filter)}
                    className={`shrink-0 px-4 py-2 rounded-full text-xs transition ${
                      exhibitionFilter === filter
                        ? "bg-[#d6a437] text-black"
                        : `${panel} border ${muted}`
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExhibitions.map(exhibitionCard)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* UPLOAD ARTWORK */}

      {activePage === "Upload" && view === "main" && (
        <section className="max-w-4xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-3">
              Share your creativity
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Upload artwork.
            </h1>
            <p className={`${muted} text-sm mt-3`}>
              Give your work a place in the world.
            </p>
          </div>

          <div className={`border rounded-2xl p-5 md:p-8 ${panel}`}>
            <div>
              <label className="block text-sm font-semibold mb-3">Your artwork</label>

              {uploadPreview ? (
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Artwork preview"
                    className="w-full max-h-[550px] object-contain rounded-xl bg-black/5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadPreview("");
                    }}
                    className="absolute top-3 right-3 bg-black/75 text-white rounded-full px-4 py-2 text-sm hover:bg-black"
                  >
                    Remove image ✕
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="artwork-upload"
                  className={`min-h-[300px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-8 cursor-pointer transition hover:border-[#d6a437] ${
                    isDark ? "border-white/20 bg-[#111]" : "border-black/20 bg-[#faf9f6]"
                  }`}
                >
                  <span className="text-5xl text-[#b1842d] mb-5">＋</span>
                  <h3 className="text-lg font-semibold">Browse your computer</h3>
                  <p className={`${muted} text-sm mt-2`}>
                    Select an image of your artwork to upload.
                  </p>
                  <span className="mt-6 bg-[#d6a437] text-black rounded-full px-6 py-3 text-sm font-semibold">
                    Choose image
                  </span>
                  <p className={`${muted} text-xs mt-4`}>
                    JPG, PNG, WEBP · Maximum size 10 MB
                  </p>
                </label>
              )}

              <input
                id="artwork-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-8 space-y-6">
              <label className="block text-sm font-medium">
                Artwork title
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Give your artwork a name"
                  maxLength={100}
                  className={inputStyle}
                />
              </label>

              <label className="block text-sm font-medium">
                Description
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Tell people a little about your work..."
                  rows={4}
                  maxLength={1000}
                  className={inputStyle}
                />
              </label>

              <label className="block text-sm font-medium">
                Category
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className={inputStyle}
                >
                  {uploadCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              {uploadMessage && (
                <p className="text-sm text-red-500">{uploadMessage}</p>
              )}

              {!currentUserId && !profileLoading && (
                <p className={`${muted} text-sm`}>
                  You need to be logged in to publish artwork.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={publishArtwork}
                  disabled={uploading}
                  className="bg-[#d6a437] text-black rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#e5bd55] transition disabled:opacity-50"
                >
                  {uploading ? "Publishing..." : "Publish artwork"}
                </button>
                <button
                  type="button"
                  onClick={() => goTo("Home")}
                  disabled={uploading}
                  className={`border ${border} rounded-full px-8 py-3 text-sm hover:border-[#d6a437] disabled:opacity-50`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CHATS */}

      {activePage === "Chats" && view === "main" && (
        <section className="max-w-4xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          {!selectedChat ? (
            <>
              <h1 className="text-4xl font-semibold tracking-tight mb-8">Chats.</h1>
              <div className={`border rounded-2xl overflow-hidden ${panel}`}>
                {demoChats.map((chat) => (
                  <button
                    key={chat.name}
                    onClick={() => setSelectedChat(chat.name)}
                    className={`w-full flex items-center gap-4 p-5 text-left border-b last:border-b-0 ${border} hover:bg-[#d6a437]/10`}
                  >
                    <Avatar src={chat.image} name={chat.name} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{chat.name}</p>
                      <p className={`${muted} text-sm truncate`}>{chat.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`${muted} text-xs`}>{chat.time}</p>
                      {chat.unread && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d6a437] mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className={`${muted} text-xs mt-4`}>
                Chats are a preview for now. Messages are not saved yet.
              </p>
            </>
          ) : (
            <div className={`border rounded-2xl overflow-hidden flex flex-col h-[70vh] ${panel}`}>
              <div className={`flex items-center gap-3 p-4 border-b ${border}`}>
                <button onClick={() => setSelectedChat("")} className="text-xl px-2">
                  ←
                </button>
                <Avatar
                  src={demoChats.find((c) => c.name === selectedChat)?.image}
                  name={selectedChat}
                  size={36}
                />
                <p className="font-semibold">{selectedChat}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                <div className="flex justify-start">
                  <p className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isDark ? "bg-[#2a2a2a]" : "bg-gray-100"}`}>
                    {demoChats.find((c) => c.name === selectedChat)?.message}
                  </p>
                </div>

                {(chatLog[selectedChat] || []).map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        msg.from === "me"
                          ? "bg-[#d6a437] text-black"
                          : isDark
                          ? "bg-[#2a2a2a]"
                          : "bg-gray-100"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`flex gap-3 p-4 border-t ${border}`}>
                <input
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChatMessage();
                  }}
                  placeholder="Write a message"
                  className={`${inputStyle} mt-0 flex-1`}
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-[#d6a437] text-black rounded-full px-6 text-sm font-semibold"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* PROFILE */}

      {activePage === "Profile" && view === "main" && (
        <section className="max-w-4xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          {profileLoading ? (
            <p className={muted}>Loading your profile...</p>
          ) : (
            <>
              {profileError && (
                <p className="text-sm text-red-500 mb-6">{profileError}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                <Avatar src={profile.avatar} name={profile.name} size={96} />

                <div className="flex-1">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {profile.name}
                  </h1>
                  <p className={`${muted} text-sm mt-1`}>{profile.username}</p>
                  <p className="text-xs text-[#a17a29] mt-2">
                    {profile.category}
                    {profile.country ? ` · ${profile.country}` : ""}
                  </p>
                  <p className={`${muted} text-sm mt-3 max-w-xl`}>{profile.bio}</p>

                  <div className="flex gap-6 mt-4 text-sm">
                    <span>
                      <strong>{myArtworks.length}</strong>{" "}
                      <span className={muted}>artworks</span>
                    </span>
                    <span>
                      <strong>{followerCount(currentUserId)}</strong>{" "}
                      <span className={muted}>followers</span>
                    </span>
                    <span>
                      <strong>{followingCount(currentUserId)}</strong>{" "}
                      <span className={muted}>following</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-10">
                <button
                  onClick={() => {
                    setEditDraft(profile);
                    setView("edit-profile");
                  }}
                  className="bg-[#d6a437] text-black rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#e5bd55]"
                >
                  Edit profile
                </button>
                <button
                  onClick={() => setView("settings")}
                  className={`border ${border} rounded-full px-6 py-2.5 text-sm hover:border-[#d6a437]`}
                >
                  Settings
                </button>
              </div>

              <h2 className="font-semibold text-lg mb-5">Your artwork</h2>

              {myArtworks.length > 0 ? (
                <div className="columns-1 sm:columns-2 gap-5">
                  {myArtworks.map((art, index) => artworkCard(art, index))}
                </div>
              ) : (
                <div className={`border rounded-2xl p-8 text-center ${panel}`}>
                  <p className="text-sm">You haven't uploaded any artwork yet.</p>
                  <button
                    onClick={() => goTo("Upload")}
                    className="mt-4 bg-[#d6a437] text-black rounded-full px-6 py-2.5 text-sm font-semibold"
                  >
                    Upload artwork
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* EDIT PROFILE */}

      {view === "edit-profile" && (
        <section className="max-w-2xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          <button
            onClick={() => setView("main")}
            className={`${muted} text-sm mb-6 hover:text-[#d6a437]`}
          >
            ← Back
          </button>

          <h1 className="text-3xl font-semibold tracking-tight mb-8">Edit profile.</h1>

          <div className={`border rounded-2xl p-6 space-y-6 ${panel}`}>
            <label className="block text-sm font-medium">
              Username
              <input
                value={editDraft.username}
                onChange={(e) => setEditDraft({ ...editDraft, username: e.target.value })}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm font-medium">
              Country
              <input
                value={editDraft.country}
                onChange={(e) => setEditDraft({ ...editDraft, country: e.target.value })}
                className={inputStyle}
              />
            </label>

            {profileSchema.hasNiches && (
              <label className="block text-sm font-medium">
                Art categories (separate with commas)
                <input
                  value={editDraft.category}
                  onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                  className={inputStyle}
                />
              </label>
            )}

            <label className="block text-sm font-medium">
              Profile picture URL
              <input
                value={editDraft.avatar}
                onChange={(e) => setEditDraft({ ...editDraft, avatar: e.target.value })}
                placeholder="https://..."
                className={inputStyle}
              />
            </label>

            <label className="block text-sm font-medium">
              Bio
              <textarea
                value={editDraft.bio}
                onChange={(e) => setEditDraft({ ...editDraft, bio: e.target.value })}
                rows={4}
                maxLength={500}
                className={inputStyle}
              />
            </label>

            {profileError && <p className="text-sm text-red-500">{profileError}</p>}

            <div className="flex gap-3">
              <button
                onClick={saveProfile}
                disabled={profileSaving}
                className="bg-[#d6a437] text-black rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#e5bd55] disabled:opacity-50"
              >
                {profileSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                onClick={() => {
                  setEditDraft(profile);
                  setProfileError("");
                  setView("main");
                }}
                className={`border ${border} rounded-full px-8 py-3 text-sm hover:border-[#d6a437]`}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SETTINGS */}

      {view === "settings" && (
        <section className="max-w-2xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          <button
            onClick={() => setView("main")}
            className={`${muted} text-sm mb-6 hover:text-[#d6a437]`}
          >
            ← Back
          </button>

          <h1 className="text-3xl font-semibold tracking-tight mb-8">Settings.</h1>

          <div className={`border rounded-2xl p-6 mb-6 ${panel}`}>
            <h2 className="font-semibold mb-4">Appearance</h2>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setTheme(option)}
                  className={`px-5 py-2 rounded-full text-sm capitalize ${
                    theme === option
                      ? "bg-[#d6a437] text-black"
                      : `border ${border}`
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className={`border rounded-2xl p-6 mb-6 ${panel}`}>
            <h2 className="font-semibold mb-4">Notifications</h2>
            {(
              [
                ["followers", "New followers"],
                ["likes", "Likes on your artwork"],
                ["messages", "Messages"],
                ["activity", "Activity from artists you follow"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-3">
                <span className="text-sm">{label}</span>
                <Toggle
                  label={label}
                  checked={notifications[key]}
                  onChange={(value) =>
                    setNotifications({ ...notifications, [key]: value })
                  }
                />
              </div>
            ))}
          </div>

          <div className={`border rounded-2xl p-6 mb-6 ${panel}`}>
            <h2 className="font-semibold mb-4">Privacy</h2>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm">Private account</span>
              <Toggle label="Private account" checked={isPrivate} onChange={setIsPrivate} />
            </div>

            <label className="block text-sm mt-3">
              Who can message you
              <select
                value={messagePermission}
                onChange={(e) => setMessagePermission(e.target.value)}
                className={inputStyle}
              >
                <option>Everyone</option>
                <option>People you follow</option>
                <option>No one</option>
              </select>
            </label>
          </div>

          <p className={`${muted} text-xs mb-6`}>
            Notification and privacy settings are saved on this device only for now.
          </p>

          <button
            onClick={logOut}
            className="border border-red-500/50 text-red-500 rounded-full px-8 py-3 text-sm hover:bg-red-500/10"
          >
            Log out
          </button>
        </section>
      )}

      {/* ARTIST PROFILE */}

      {view === "artist-profile" && selectedArtist && (
        <section className="max-w-4xl mx-auto px-5 md:px-10 py-12 min-h-[85vh]">
          <button
            onClick={() => {
              setView("main");
              setSelectedArtist(null);
            }}
            className={`${muted} text-sm mb-6 hover:text-[#d6a437]`}
          >
            ← Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
            <Avatar src={selectedArtist.image} name={selectedArtist.name} size={96} />

            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight">
                {selectedArtist.name}
              </h1>
              <p className={`${muted} text-sm mt-1`}>{selectedArtist.username}</p>
              <p className="text-xs text-[#a17a29] mt-2">
                {selectedArtist.category} · {selectedArtist.country}
              </p>
              <p className={`${muted} text-sm mt-3 max-w-xl`}>{selectedArtist.bio}</p>

              <div className="flex flex-wrap items-center gap-5 mt-4">
                <span className="text-sm">
                  <strong>{followerCount(selectedArtist.id)}</strong>{" "}
                  <span className={muted}>followers</span>
                </span>
                {followButton(selectedArtist)}
              </div>

              {feedMessage && (
                <p className="text-sm text-red-500 mt-3">{feedMessage}</p>
              )}
            </div>
          </div>

          <h2 className="font-semibold text-lg mb-5">Artwork</h2>

          {(() => {
            const theirWork = allArtworks.filter((art) =>
              selectedArtist.id
                ? art.artistId === selectedArtist.id
                : art.artist === selectedArtist.name
            );

            return theirWork.length > 0 ? (
              <div className="columns-1 sm:columns-2 gap-5">
                {theirWork.map((art, index) => artworkCard(art, index))}
              </div>
            ) : (
              <p className={`${muted} py-6`}>
                {selectedArtist.name} hasn't uploaded any artwork yet.
              </p>
            );
          })()}
        </section>
      )}

      {/* EXHIBITION DETAILS */}

      {selectedExhibition && (
        <div
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-5"
          onClick={() => setSelectedExhibition(null)}
        >
          <div
            className={`max-w-lg w-full rounded-2xl overflow-hidden border ${panel}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl(selectedExhibition.image)}
              alt={selectedExhibition.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold">{selectedExhibition.title}</h2>
              <p className={`${muted} text-sm mt-2`}>
                {selectedExhibition.venue}, {selectedExhibition.city},{" "}
                {selectedExhibition.country}
              </p>
              <p className="text-sm text-[#b1842d] mt-1">
                {selectedExhibition.date} · {selectedExhibition.format} ·{" "}
                {exhibitionStatus(selectedExhibition.date)}
              </p>
              <p className="text-sm mt-4">{selectedExhibition.description}</p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => toggleFollowExhibition(selectedExhibition.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold ${
                    followedExhibitions.includes(selectedExhibition.id)
                      ? "bg-[#d6a437] text-black"
                      : `border ${border} hover:border-[#d6a437]`
                  }`}
                >
                  {followedExhibitions.includes(selectedExhibition.id)
                    ? "Following"
                    : "Follow exhibition"}
                </button>
                <button
                  onClick={() => setSelectedExhibition(null)}
                  className={`border ${border} rounded-full px-6 py-2.5 text-sm`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION */}

      <nav
        className={`md:hidden fixed bottom-0 inset-x-0 z-50 border-t flex justify-around items-center py-2 ${
          isDark ? "bg-[#111] border-white/10" : "bg-[#faf9f6] border-black/10"
        }`}
      >
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => goTo(item.name)}
            aria-label={item.name}
            className={`flex flex-col items-center text-[10px] px-3 py-1 ${
              activePage === item.name ? "text-[#d6a437] font-bold" : muted
            } ${
              item.name === "Upload"
                ? "bg-[#d6a437] !text-black rounded-full w-11 h-11 justify-center"
                : ""
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            {item.name !== "Upload" && <span className="mt-1">{item.name}</span>}
          </button>
        ))}
      </nav>
    </main>
  );
}