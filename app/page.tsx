




"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import world from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="p-10 text-center text-white">
      Preparing the Earth...
    </div>
  ),
});

const countriesGeo = (
  feature(
    world as any,
    (world as any).objects.countries
  ) as any
).features as any[];

type Artwork = {
  title: string;
  artist: string;
  country: string;
  category: string;
  image: string;
  description?: string;
};

type Artist = {
  name: string;
  username: string;
  country: string;
  category: string;
  bio: string;
  image: string;
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
  {
    id: 1,
    title: "The Future of African Art",
    country: "Kenya",
    city: "Nairobi",
    venue: "Nairobi National Museum",
    type: "Art Exhibition",
    format: "Physical",
    date: "December 12, 2026",
    description: "An exploration of contemporary African creativity, identity and visual storytelling.",
    image: "photo-1579783902614-a3fb3927b6a5",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Beyond the Canvas",
    country: "France",
    city: "Paris",
    venue: "Paris Art Gallery",
    type: "Art Exhibition",
    format: "Virtual",
    date: "November 25, 2026",
    description: "Discover contemporary painting, experimental techniques and emerging artists.",
    image: "photo-1577083552431-6e5fd01aa342",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Digital Dimensions",
    country: "Japan",
    city: "Tokyo",
    venue: "Tokyo Digital Arts Centre",
    type: "Digital Art Festival",
    format: "Virtual",
    date: "November 30, 2026",
    description: "A celebration of digital creativity, 3D art and experimental visual experiences.",
    image: "photo-1549490349-8643362247b5",
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Photography and Humanity",
    country: "South Africa",
    city: "Cape Town",
    venue: "Cape Town Art Space",
    type: "Photography Exhibition",
    format: "Physical",
    date: "December 5, 2026",
    description: "Photographers explore humanity through portraits, landscapes and everyday life.",
    image: "photo-1470770841072-f978cf4d019e",
    status: "Upcoming",
  },
  {
    id: 5,
    title: "Sculpture Without Borders",
    country: "Nigeria",
    city: "Lagos",
    venue: "Lagos Creative Centre",
    type: "Sculpture Exhibition",
    format: "Virtual",
    date: "December 18, 2026",
    description: "A collection celebrating form, materials and contemporary sculpture.",
    image: "photo-1578749556568-bc2c40e68b61",
    status: "Upcoming",
  },
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

export default function Home() {
  const [activePage, setActivePage] = useState("Home");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [homeCategory, setHomeCategory] = useState("For you");
  const [selectedChat, setSelectedChat] = useState("");
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const [profile, setProfile] = useState(initialProfile);
  const [editDraft, setEditDraft] = useState(initialProfile);

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

  const [globeSize, setGlobeSize] = useState({
    width: 900,
    height: 650,
  });

  // UPLOAD STATES

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Painting");
  const [uploadedArtworks, setUploadedArtworks] = useState<Artwork[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");

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

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = () => setSystemDark(media.matches);

    updateSystemTheme();

    media.addEventListener?.("change", updateSystemTheme);

    return () => {
      media.removeEventListener?.("change", updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    function resize() {
      setGlobeSize({
        width: Math.min(window.innerWidth - 20, 1100),
        height: Math.max(400, window.innerHeight - 170),
      });
    }

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const categories = [
    "For you",
    "Painting",
    "Photography",
    "Sculpture",
    "Digital Art",
  ];

  const allArtworks = [...uploadedArtworks, ...artworks];

  const homeArtworks = useMemo(
    () =>
      homeCategory === "For you"
        ? [...uploadedArtworks, ...artworks]
        : [...uploadedArtworks, ...artworks].filter(
            (art) => art.category === homeCategory
          ),
    [homeCategory, uploadedArtworks]
  );

  const filteredArtworks = useMemo(
    () =>
      allArtworks.filter((art) => {
        const matchesCountry =
          art.country.toLowerCase() === selectedCountry.toLowerCase();

        const matchesSearch =
          art.title.toLowerCase().includes(search.toLowerCase()) ||
          art.artist.toLowerCase().includes(search.toLowerCase()) ||
          art.category.toLowerCase().includes(search.toLowerCase());

        return matchesCountry && matchesSearch;
      }),
    [selectedCountry, search, uploadedArtworks]
  );

  const countryExhibitions = exhibitions.filter(
    (event) => event.country.toLowerCase() === selectedCountry.toLowerCase()
  );

  const filteredExhibitions = exhibitions.filter((event) => {
    const matchesFilter =
      exhibitionFilter === "All" ||
      event.format === exhibitionFilter ||
      event.type === exhibitionFilter;

    return matchesFilter;
  });

  const filteredArtists = artists.filter((artist) => {
    const matchesCountry =
      !selectedCountry ||
      artist.country.toLowerCase() === selectedCountry.toLowerCase();

    const matchesCategory =
      exploreCategory === "All" ||
      artist.category.toLowerCase().includes(
        exploreCategory.replace(/s$/, "").toLowerCase()
      );

    const matchesSearch =
      artist.name.toLowerCase().includes(search.toLowerCase()) ||
      artist.username.toLowerCase().includes(search.toLowerCase());

    return matchesCountry && matchesCategory && matchesSearch;
  });

  function goTo(page: string) {
    setActivePage(page);
    setSelectedCountry("");
    setSearch("");
    setSelectedChat("");
    setSelectedArtist(null);
    setSelectedExhibition(null);
    setShowNotifications(false);
    setView("main");
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

  function imageUrl(image: string) {
    if (
      image.startsWith("data:") ||
      image.startsWith("blob:") ||
      image.startsWith("http")
    ) {
      return image;
    }

    return `https://images.unsplash.com/${image}?w=900&q=85`;
  }

  function openArtist(name: string) {
    const artist = artists.find((item) => item.name === name);

    if (artist) {
      setSelectedArtist(artist);
      setView("artist-profile");
    }
  }

  function toggleFollowExhibition(id: number) {
    setFollowedExhibitions((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  // SELECT AN IMAGE FROM THE COMPUTER

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    reader.onload = () => {
      setUploadPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  // PUBLISH ARTWORK TO THE LOCAL DEMO FEED

  function publishArtwork() {
    if (!uploadFile || !uploadPreview) {
      setUploadMessage("Please select an image first.");
      return;
    }

    if (!uploadTitle.trim()) {
      setUploadMessage("Please give your artwork a title.");
      return;
    }

    const newArtwork: Artwork = {
      title: uploadTitle.trim(),
      artist: profile.name,
      country: profile.country,
      category: uploadCategory,
      image: uploadPreview,
      description: uploadDescription.trim(),
    };

    setUploadedArtworks((previous) => [newArtwork, ...previous]);

    setUploadFile(null);
    setUploadPreview("");
    setUploadTitle("");
    setUploadDescription("");
    setUploadCategory("Painting");
    setUploadMessage("");

    goTo("Home");
  }

  function ArtistLink({ name }: { name: string }) {
    return (
      <button
        onClick={() => openArtist(name)}
        className="text-left hover:text-[#b1842d] transition underline-offset-4 hover:underline"
      >
        {name}
      </button>
    );
  }

  return (
    <main className={`min-h-screen pb-20 md:pb-0 transition-colors ${pageBg}`}>

      {/* TOP NAVIGATION */}

      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b px-5 md:px-10 py-4 ${
          isDark
            ? "bg-[#111]/95 border-white/10"
            : "bg-[#faf9f6]/95 border-black/10"
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

            {/* NOTIFICATION BELL */}

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
                <div className={`absolute right-0 top-10 w-80 max-w-[90vw] rounded-xl border shadow-2xl p-5 z-[100] ${panel}`}>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className={muted}
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs uppercase tracking-widest text-[#a17a29] mb-4">
                    Exhibition updates
                  </p>

                  {followedExhibitions.length > 0 ? (
                    exhibitions
                      .filter((event) =>
                        followedExhibitions.includes(event.id)
                      )
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
                          <p className="text-xs text-[#b1842d] mt-1">
                            {event.date}
                          </p>
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

          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {homeArtworks.map((art, index) => (
              <article
                key={`${art.title}-${index}`}
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
                      index % 3 === 0
                        ? "h-72"
                        : index % 3 === 1
                        ? "h-96"
                        : "h-80"
                    }`}
                  />
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-base">
                        {art.title}
                      </h3>

                      <p className={`${muted} text-sm mt-1`}>
                        By <ArtistLink name={art.artist} />
                      </p>
                    </div>

                    <span className={`${muted} text-xs whitespace-nowrap`}>
                      {art.country}
                    </span>
                  </div>

                  <p className="text-xs text-[#a17a29] mt-2 uppercase tracking-wider">
                    {art.category}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className={`text-center mt-16 border-t ${border} pt-10`}>
            <p className={`${muted} text-sm`}>
              You're exploring the beginning of a world of art.
            </p>
          </div>

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

            {/* IMAGE SELECTOR */}

            <div>
              <label className="block text-sm font-semibold mb-3">
                Your artwork
              </label>

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
                    isDark
                      ? "border-white/20 bg-[#111]"
                      : "border-black/20 bg-[#faf9f6]"
                  }`}
                >
                  <span className="text-5xl text-[#b1842d] mb-5">＋</span>

                  <h3 className="text-lg font-semibold">
                    Browse your computer
                  </h3>

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

            {/* ARTWORK DETAILS */}

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
                  <option>Painting</option>
                  <option>Photography</option>
                  <option>Sculpture</option>
                  <option>Digital Art</option>
                  <option>Illustration</option>
                  <option>Graphic Design</option>
                  <option>Mixed Media</option>
                  <option>Printmaking</option>
                  <option>Other</option>
                </select>
              </label>

              <div className={`border-t ${border} pt-6`}>
                <p className="text-sm font-medium">Publishing as</p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8dfcd] flex items-center justify-center text-black font-semibold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{profile.name}</p>
                    <p className={`${muted} text-xs`}>
                      {profile.username}
                    </p>
                  </div>
                </div>
              </div>

              {uploadMessage && (
                <p className="text-sm text-red-500">
                  {uploadMessage}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={publishArtwork}
                  className="bg-[#d6a437] text-black rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-[#e5bd55] transition"
                >
                  Publish artwork ↗
                </button>

                <button
                  onClick={() => {
                    setUploadFile(null);
                    setUploadPreview("");
                    setUploadTitle("");
                    setUploadDescription("");
                    setUploadCategory("Painting");
                    setUploadMessage("");
                  }}
                  className={`border ${border} rounded-full px-8 py-3.5 text-sm`}
                >
                  Clear
                </button>
              </div>

            </div>
          </div>

          <p className={`${muted} text-xs mt-5 text-center`}>
            Your artwork will appear in the local demo feed after publishing.
          </p>

        </section>
      )}

      {/* EXPLORE GLOBE */}

      {activePage === "Explore" && view === "main" && !selectedCountry && (
        <section className="bg-[#05070c] min-h-screen text-white overflow-hidden">

          <div className="text-center pt-8 relative z-10 px-5">
            <p className="text-[#d6a437] uppercase tracking-[0.3em] text-xs">
              e-ART / WORLD EXPLORER
            </p>

            <h2 className="text-3xl md:text-5xl font-semibold mt-4">
              Explore the world.
            </h2>

            <p className="text-gray-400 text-sm mt-3">
              Discover artists, artwork, exhibitions and creative cultures.
            </p>
          </div>

          <div className="flex justify-center items-center relative">
            <Globe
              width={globeSize.width}
              height={globeSize.height}
              backgroundColor="#05070c"
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              showAtmosphere
              atmosphereColor="#6ba9e8"
              atmosphereAltitude={0.18}
              polygonsData={countriesGeo}
              polygonAltitude={0.008}
              polygonCapColor={(d: any) =>
                d.properties?.name === selectedCountry
                  ? "#d6a437"
                  : "rgba(40,100,150,0.12)"
              }
              polygonSideColor={() => "rgba(0,0,0,0.2)"}
              polygonStrokeColor={() => "rgba(220,220,220,0.45)"}
              polygonLabel={(d: any) => `
                <div style="background:#111;color:white;padding:10px 15px;border-radius:8px;border:1px solid #d6a437">
                  <b>${d.properties?.name || "Country"}</b>
                  <div style="font-size:11px;color:#d6a437">Explore artwork and events ↗</div>
                </div>
              `}
              onPolygonClick={enterCountry}
              polygonsTransitionDuration={300}
              enablePointerInteraction
              animateIn
            />
          </div>

          <div className="text-center pb-8 -mt-3 relative z-10">
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Drag to rotate · Scroll to zoom · Click a country
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-5 pb-16">

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {["Overview", "Artists", "Exhibitions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExploreTab(tab)}
                  className={`rounded-full px-6 py-3 text-sm transition ${
                    exploreTab === tab
                      ? "bg-[#d6a437] text-black"
                      : "border border-white/20 text-gray-300 hover:border-[#d6a437]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {exploreTab === "Overview" && (
              <div className="grid md:grid-cols-3 gap-5">

                <button
                  onClick={() => setExploreTab("Artists")}
                  className="text-left border border-white/10 rounded-xl p-7 hover:border-[#d6a437] transition"
                >
                  <span className="text-3xl">✦</span>
                  <h3 className="text-xl font-semibold mt-5">Discover artists</h3>
                  <p className="text-gray-400 text-sm mt-3">
                    Find painters, photographers, sculptors and creators from different parts of the world.
                  </p>
                </button>

                <button
                  onClick={() => setExploreTab("Exhibitions")}
                  className="text-left border border-white/10 rounded-xl p-7 hover:border-[#d6a437] transition"
                >
                  <span className="text-3xl">▧</span>
                  <h3 className="text-xl font-semibold mt-5">Art exhibitions</h3>
                  <p className="text-gray-400 text-sm mt-3">
                    Discover upcoming exhibitions, art fairs, festivals and virtual galleries around the world.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setExploreTab("Exhibitions");
                    setExhibitionFilter("Virtual");
                  }}
                  className="text-left border border-white/10 rounded-xl p-7 hover:border-[#d6a437] transition"
                >
                  <span className="text-3xl">▷</span>
                  <h3 className="text-xl font-semibold mt-5">Watch art events</h3>
                  <p className="text-gray-400 text-sm mt-3">
                    Find virtual exhibitions and discover art events beyond your country.
                  </p>
                </button>

              </div>
            )}

            {exploreTab === "Artists" && (
              <div>
                <h2 className="text-3xl font-semibold mb-3">
                  Discover creative disciplines.
                </h2>

                <p className="text-gray-400 text-sm mb-7">
                  Explore different forms of visual expression.
                </p>

                <div className="flex flex-wrap gap-2">
                  {exploreCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setExploreCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        exploreCategory === category
                          ? "bg-[#d6a437] text-black border-[#d6a437]"
                          : "border-white/20 text-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {artists
                    .filter((artist) => {
                      if (exploreCategory === "All") return true;

                      const category = exploreCategory.toLowerCase();

                      if (category === "painters") return artist.category === "Painter";
                      if (category === "sculptors") return artist.category === "Sculptor";
                      if (category === "photographers") return artist.category === "Photographer";
                      if (category === "digital artists") return artist.category === "Digital artist";

                      return false;
                    })
                    .map((artist) => (
                      <button
                        key={artist.username}
                        onClick={() => openArtist(artist.name)}
                        className="text-left border border-white/10 rounded-xl p-5 hover:border-[#d6a437] transition"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={imageUrl(artist.image)}
                            alt={artist.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />

                          <div>
                            <h3 className="font-semibold">{artist.name}</h3>
                            <p className="text-gray-400 text-xs mt-1">
                              {artist.username}
                            </p>
                            <p className="text-[#d6a437] text-xs mt-1">
                              {artist.category}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mt-4">
                          {artist.country}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {exploreTab === "Exhibitions" && (
              <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-8">
                  <div>
                    <p className="text-[#d6a437] uppercase tracking-widest text-xs">
                      Art without borders
                    </p>
                    <h2 className="text-3xl font-semibold mt-3">
                      Exhibitions around the world.
                    </h2>
                    <p className="text-gray-400 text-sm mt-3">
                      Discover what is happening in the global art community.
                    </p>
                  </div>

                  <span className="text-gray-400 text-xs">
                    {exhibitions.length} featured events
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 mb-5">
                  {["All", "Virtual", "Physical"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setExhibitionFilter(filter)}
                      className={`shrink-0 rounded-full px-5 py-2 text-sm border ${
                        exhibitionFilter === filter
                          ? "bg-[#d6a437] text-black border-[#d6a437]"
                          : "border-white/20 text-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-7">
                  {filteredExhibitions.map((event) => (
                    <article
                      key={event.id}
                      className="border border-white/10 rounded-xl overflow-hidden"
                    >
                      <img
                        src={imageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />

                      <div className="p-6">
                        <div className="flex justify-between gap-3 items-center">
                          <span className="text-[#d6a437] text-xs uppercase tracking-wider">
                            {event.type}
                          </span>

                          <span className="text-xs text-gray-400">
                            {event.format}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold mt-3">
                          {event.title}
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                          {event.city}, {event.country}
                        </p>

                        <p className="text-gray-400 text-sm mt-3 leading-6">
                          {event.description}
                        </p>

                        <div className="border-t border-white/10 mt-5 pt-4">
                          <p className="text-sm">{event.date}</p>

                          <p className="text-gray-400 text-xs mt-2">
                            {event.venue}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-5">
                          <button
                            onClick={() => setSelectedExhibition(event)}
                            className="bg-[#d6a437] text-black rounded-full px-5 py-2.5 text-sm font-medium"
                          >
                            {event.format === "Virtual" ? "Watch / View" : "View details"} ↗
                          </button>

                          <button
                            onClick={() => toggleFollowExhibition(event.id)}
                            className="border border-white/20 rounded-full px-5 py-2.5 text-sm"
                          >
                            {followedExhibitions.includes(event.id)
                              ? "✓ Following"
                              : "+ Follow"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {filteredExhibitions.length === 0 && (
                  <p className="text-gray-400 py-12 text-center">
                    No exhibitions found in this category.
                  </p>
                )}

              </div>
            )}

          </div>
        </section>
      )}

      {/* COUNTRY GALLERY */}

      {activePage === "Explore" && view === "main" && selectedCountry && (
        <section className={`min-h-screen ${pageBg}`}>

          <div className="bg-[#080b12] text-white px-6 md:px-12 py-16">
            <button
              onClick={() => {
                setSelectedCountry("");
                setSearch("");
              }}
              className="text-sm text-gray-400 hover:text-white mb-12"
            >
              ← Back to the globe
            </button>

            <p className="text-xs uppercase tracking-[0.3em] text-[#d6a437]">
              Discovering creative cultures
            </p>

            <h1 className="text-5xl md:text-7xl font-semibold mt-5">
              {selectedCountry}
            </h1>

            <p className="text-gray-400 mt-5">
              Explore the artists, artwork and exhibitions of {selectedCountry}.
            </p>
          </div>

          <div className="px-6 md:px-12 py-10">
            <div className="flex flex-wrap gap-3 border-b border-black/10 dark:border-white/10 pb-6 mb-10">
              {["Overview", "Artwork", "Artists", "Exhibitions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExploreTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm ${
                    exploreTab === tab
                      ? "bg-[#d6a437] text-black"
                      : `border ${border} ${muted}`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {exploreTab === "Overview" && (
              <div className="grid md:grid-cols-3 gap-5">
                <button
                  onClick={() => setExploreTab("Artwork")}
                  className={`border rounded-xl p-6 text-left ${panel}`}
                >
                  <h3 className="text-xl font-semibold">Artwork</h3>
                  <p className={`${muted} text-sm mt-3`}>
                    Discover visual works from this country.
                  </p>
                </button>

                <button
                  onClick={() => setExploreTab("Artists")}
                  className={`border rounded-xl p-6 text-left ${panel}`}
                >
                  <h3 className="text-xl font-semibold">Artists</h3>
                  <p className={`${muted} text-sm mt-3`}>
                    Meet artists and explore their creative disciplines.
                  </p>
                </button>

                <button
                  onClick={() => setExploreTab("Exhibitions")}
                  className={`border rounded-xl p-6 text-left ${panel}`}
                >
                  <h3 className="text-xl font-semibold">Exhibitions</h3>
                  <p className={`${muted} text-sm mt-3`}>
                    Discover events and exhibitions taking place here.
                  </p>
                </button>
              </div>
            )}

            {exploreTab === "Artwork" && (
              <>
                <h2 className="text-3xl font-semibold mb-3">
                  Artwork gallery
                </h2>

                <p className={`${muted} mb-6 text-sm`}>
                  Discover creative works from {selectedCountry}.
                </p>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search artwork or artist..."
                  className={`${inputStyle} md:w-80 mb-10`}
                />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArtworks.map((art, i) => (
                    <article key={`${art.title}-${i}`}>
                      <img
                        src={imageUrl(art.image)}
                        alt={art.title}
                        loading="lazy"
                        className="w-full h-80 object-cover"
                      />

                      <h3 className="font-semibold text-lg mt-4">
                        {art.title}
                      </h3>

                      <p className={`${muted} text-sm mt-1`}>
                        By <ArtistLink name={art.artist} />
                      </p>

                      <p className={`${muted} text-xs mt-2`}>
                        {art.category}
                      </p>
                    </article>
                  ))}
                </div>

                {filteredArtworks.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-2xl">No artwork here yet.</p>
                    <p className={`${muted} mt-3`}>
                      This country is waiting for its artists to join e-ART.
                    </p>
                  </div>
                )}
              </>
            )}

            {exploreTab === "Artists" && (
              <>
                <h2 className="text-3xl font-semibold mb-3">
                  Artists of {selectedCountry}
                </h2>

                <div className="flex flex-wrap gap-2 my-7">
                  {exploreCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setExploreCategory(category)}
                      className={`rounded-full px-4 py-2 text-sm border ${
                        exploreCategory === category
                          ? "bg-[#d6a437] text-black border-[#d6a437]"
                          : border
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtists.map((artist) => (
                    <button
                      key={artist.username}
                      onClick={() => openArtist(artist.name)}
                      className={`border rounded-xl p-5 text-left hover:border-[#d6a437] transition ${panel}`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={imageUrl(artist.image)}
                          alt={artist.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="font-semibold">{artist.name}</h3>
                          <p className={`${muted} text-xs mt-1`}>
                            {artist.username}
                          </p>
                          <p className="text-[#b1842d] text-xs mt-1">
                            {artist.category}
                          </p>
                        </div>
                      </div>

                      <p className={`${muted} text-sm mt-4`}>
                        {artist.bio}
                      </p>
                    </button>
                  ))}
                </div>

                {filteredArtists.length === 0 && (
                  <p className={`${muted} py-12 text-center`}>
                    No artists found in this category yet.
                  </p>
                )}
              </>
            )}

            {exploreTab === "Exhibitions" && (
              <>
                <h2 className="text-3xl font-semibold mb-3">
                  Exhibitions in {selectedCountry}
                </h2>

                <p className={`${muted} text-sm mb-8`}>
                  Discover art events and exhibitions in this country.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {countryExhibitions.map((event) => (
                    <article
                      key={event.id}
                      className={`border rounded-xl overflow-hidden ${panel}`}
                    >
                      <img
                        src={imageUrl(event.image)}
                        alt={event.title}
                        className="w-full h-56 object-cover"
                      />

                      <div className="p-5">
                        <p className="text-[#b1842d] text-xs uppercase">
                          {event.type}
                        </p>

                        <h3 className="font-semibold text-xl mt-3">
                          {event.title}
                        </h3>

                        <p className={`${muted} text-sm mt-2`}>
                          {event.city} · {event.venue}
                        </p>

                        <p className={`${muted} text-sm mt-3`}>
                          {event.description}
                        </p>

                        <p className="text-sm mt-4">{event.date}</p>

                        <div className="flex flex-wrap gap-2 mt-5">
                          <button
                            onClick={() => setSelectedExhibition(event)}
                            className="bg-[#d6a437] text-black rounded-full px-5 py-2.5 text-sm"
                          >
                            {event.format === "Virtual" ? "Watch / View" : "Details"} ↗
                          </button>

                          <button
                            onClick={() => toggleFollowExhibition(event.id)}
                            className={`border rounded-full px-5 py-2.5 text-sm ${border}`}
                          >
                            {followedExhibitions.includes(event.id)
                              ? "✓ Following"
                              : "+ Follow"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}

                  {countryExhibitions.length === 0 && (
                    <div className="py-12">
                      <p className="text-xl">No exhibitions listed yet.</p>
                      <p className={`${muted} text-sm mt-3`}>
                        New exhibitions from {selectedCountry} will appear here when added.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* EXHIBITION DETAILS */}

      {selectedExhibition && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl ${panel}`}>
            <img
              src={imageUrl(selectedExhibition.image)}
              alt={selectedExhibition.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-7">
              <div className="flex justify-between items-center gap-3">
                <span className="text-[#b1842d] text-xs uppercase tracking-widest">
                  {selectedExhibition.type}
                </span>

                <button
                  onClick={() => setSelectedExhibition(null)}
                  className={muted}
                >
                  ✕ Close
                </button>
              </div>

              <h2 className="text-3xl font-semibold mt-4">
                {selectedExhibition.title}
              </h2>

              <p className={`${muted} text-sm mt-3`}>
                {selectedExhibition.city}, {selectedExhibition.country}
              </p>

              <p className={`${muted} text-sm mt-5 leading-7`}>
                {selectedExhibition.description}
              </p>

              <div className={`border-t ${border} mt-6 pt-5 space-y-3 text-sm`}>
                <p><strong>Date:</strong> {selectedExhibition.date}</p>
                <p><strong>Venue:</strong> {selectedExhibition.venue}</p>
                <p><strong>Format:</strong> {selectedExhibition.format}</p>
                <p><strong>Status:</strong> {selectedExhibition.status}</p>
              </div>

              {selectedExhibition.format === "Virtual" && (
                <div className={`mt-6 p-4 rounded-xl ${isDark ? "bg-[#111]" : "bg-gray-100"}`}>
                  <p className="font-semibold text-sm">
                    Virtual exhibition
                  </p>
                  <p className={`${muted} text-xs mt-2 leading-5`}>
                    This is a demonstration event. A real streaming or virtual gallery link will be connected when the exhibition provider and backend are integrated.
                  </p>
                </div>
              )}

              <button
                onClick={() => toggleFollowExhibition(selectedExhibition.id)}
                className="w-full bg-[#d6a437] text-black rounded-full py-3 mt-6 font-medium text-sm"
              >
                {followedExhibitions.includes(selectedExhibition.id)
                  ? "✓ Following exhibition"
                  : "Follow exhibition"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHATS */}

      {activePage === "Chats" && view === "main" && (
        <section className="max-w-5xl mx-auto px-5 md:px-10 py-12 min-h-[80vh]">

          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-3">
              Connect with creators
            </p>

            <h1 className="text-4xl font-semibold">
              Your conversations.
            </h1>

            <p className={`${muted} mt-3 text-sm`}>
              Talk about art, exchange ideas and connect with artists.
            </p>
          </div>

          <div className={`${panel} border rounded-xl overflow-hidden`}>
            {demoChats.map((chat) => (
              <div
                key={chat.name}
                className={`w-full flex items-center gap-4 p-5 border-b ${border}`}
              >
                <button
                  onClick={() => openArtist(chat.name)}
                  aria-label={`View ${chat.name}'s profile`}
                >
                  <img
                    src={imageUrl(chat.image)}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </button>

                <button
                  onClick={() => setSelectedChat(chat.name)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex justify-between gap-3">
                    <h3 className="font-semibold text-sm">
                      {chat.name}
                    </h3>

                    <span className={`${muted} text-xs`}>
                      {chat.time}
                    </span>
                  </div>

                  <p className={`${muted} text-sm truncate mt-1`}>
                    {chat.message}
                  </p>
                </button>

                {chat.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#d6a437]" />
                )}
              </div>
            ))}
          </div>

          {selectedChat && (
            <div className={`mt-5 p-5 border rounded-xl ${panel}`}>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => openArtist(selectedChat)}
                  className="font-semibold hover:text-[#b1842d]"
                >
                  {selectedChat} · View profile ↗
                </button>

                <button
                  onClick={() => setSelectedChat("")}
                  className={`text-sm ${muted}`}
                >
                  Close
                </button>
              </div>

              <p className={`${muted} text-sm mt-3`}>
                This is a conversation preview. Real messaging will be
                connected when the chat backend is implemented.
              </p>
            </div>
          )}

          <p className={`${muted} text-center text-xs mt-8`}>
            Demo conversations · Messaging is not connected yet.
          </p>

        </section>
      )}

      {/* YOUR PROFILE */}

      {activePage === "Profile" && view === "main" && (
        <section className="max-w-6xl mx-auto px-5 md:px-10 py-12 min-h-screen">

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-14">

            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Your profile"
                className="w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#e8dfcd] flex items-center justify-center text-4xl font-semibold text-black">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-2">
                Artist profile
              </p>

              <h1 className="text-4xl font-semibold">
                {profile.name}
              </h1>

              <p className={`${muted} mt-2`}>
                {profile.username} · {profile.category} · {profile.country}
              </p>

              <p className={`${muted} text-sm mt-4 max-w-xl leading-7`}>
                {profile.bio}
              </p>

              <div className="flex gap-8 mt-6 text-sm">
                <p><strong>{allArtworks.filter(a => a.artist === profile.name).length}</strong> Artworks</p>
                <p><strong>0</strong> Followers</p>
                <p><strong>0</strong> Following</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditDraft(profile);
                  setView("edit-profile");
                }}
                className={`border ${border} rounded-full px-5 py-3 text-sm hover:border-[#d6a437]`}
              >
                Edit profile
              </button>

              <button
                onClick={() => setView("settings")}
                title="Settings"
                aria-label="Settings"
                className={`border ${border} rounded-full w-12 h-12 text-xl hover:border-[#d6a437]`}
              >
                ⚙
              </button>
            </div>

          </div>

          <div className={`border-t ${border} pt-10`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">My artwork</h2>

              <button
                onClick={() => goTo("Upload")}
                className="text-sm text-[#b1842d] hover:underline"
              >
                + Upload artwork
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allArtworks
                .filter((art) => art.artist === profile.name || artworks.includes(art))
                .map((art, i) => (
                  <article key={`${art.title}-${i}`}>
                    <img
                      src={imageUrl(art.image)}
                      alt={art.title}
                      loading="lazy"
                      className="w-full h-56 md:h-72 object-cover"
                    />

                    <h3 className="font-medium text-sm mt-3">
                      {art.title}
                    </h3>

                    <p className={`${muted} text-xs mt-1`}>
                      {art.category}
                    </p>
                  </article>
                ))}
            </div>
          </div>

        </section>
      )}

      {/* OTHER ARTIST PROFILE */}

      {view === "artist-profile" && selectedArtist && (
        <section className="max-w-6xl mx-auto px-5 md:px-10 py-12 min-h-screen">

          <button
            onClick={() => {
              setView("main");
              setSelectedArtist(null);
            }}
            className={`${muted} text-sm mb-8`}
          >
            ← Back
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">

            <img
              src={imageUrl(selectedArtist.image)}
              alt={selectedArtist.name}
              className="w-32 h-32 rounded-full object-cover"
            />

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-2">
                Artist profile
              </p>

              <h1 className="text-4xl font-semibold">
                {selectedArtist.name}
              </h1>

              <p className={`${muted} mt-2`}>
                {selectedArtist.username} · {selectedArtist.category} · {selectedArtist.country}
              </p>

              <p className={`${muted} mt-4 max-w-2xl leading-7`}>
                {selectedArtist.bio}
              </p>

              <div className="flex gap-8 mt-5 text-sm">
                <p>
                  <strong>
                    {allArtworks.filter(a => a.artist === selectedArtist.name).length}
                  </strong> Artworks
                </p>
                <p><strong>0</strong> Followers</p>
                <p><strong>0</strong> Following</p>
              </div>
            </div>

            <button
              onClick={() => {
                setActivePage("Chats");
                setSelectedChat(selectedArtist.name);
                setView("main");
              }}
              className="bg-[#d6a437] text-black rounded-full px-6 py-3 text-sm font-medium"
            >
              Message artist
            </button>

          </div>

          <div className={`border-t ${border} pt-10`}>
            <h2 className="text-2xl font-semibold mb-8">
              Artwork by {selectedArtist.name}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {allArtworks
                .filter(a => a.artist === selectedArtist.name)
                .map((art, i) => (
                  <article key={`${art.title}-${i}`}>
                    <img
                      src={imageUrl(art.image)}
                      alt={art.title}
                      className="w-full h-64 object-cover"
                    />

                    <h3 className="font-medium mt-3">
                      {art.title}
                    </h3>

                    <p className={`${muted} text-xs mt-1`}>
                      {art.category}
                    </p>
                  </article>
                ))}
            </div>
          </div>

        </section>
      )}

      {/* EDIT PROFILE */}

      {view === "edit-profile" && activePage === "Profile" && (
        <section className="max-w-2xl mx-auto px-5 md:px-10 py-10 min-h-[80vh]">

          <button
            onClick={() => setView("main")}
            className={`${muted} text-sm mb-8`}
          >
            ← Back to profile
          </button>

          <h1 className="text-3xl font-semibold mb-2">
            Edit profile
          </h1>

          <p className={`${muted} text-sm mb-8`}>
            Update how other artists see you on e-ART.
          </p>

          <div className={`border rounded-2xl p-6 space-y-5 ${panel}`}>

            <label className="block text-sm">
              Display name
              <input
                value={editDraft.name}
                onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm">
              Username
              <input
                value={editDraft.username}
                onChange={(e) => setEditDraft({ ...editDraft, username: e.target.value })}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm">
              Country
              <input
                value={editDraft.country}
                onChange={(e) => setEditDraft({ ...editDraft, country: e.target.value })}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm">
              Artist category
              <input
                value={editDraft.category}
                onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                className={inputStyle}
              />
            </label>

            <label className="block text-sm">
              Profile image URL
              <input
                value={editDraft.avatar}
                onChange={(e) => setEditDraft({ ...editDraft, avatar: e.target.value })}
                placeholder="Paste an image URL (optional)"
                className={inputStyle}
              />
            </label>

            <label className="block text-sm">
              Bio
              <textarea
                value={editDraft.bio}
                onChange={(e) => setEditDraft({ ...editDraft, bio: e.target.value })}
                rows={4}
                maxLength={300}
                className={inputStyle}
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setProfile(editDraft);
                  setView("main");
                }}
                className="bg-[#d6a437] text-black rounded-full px-6 py-3 text-sm font-medium"
              >
                Save changes
              </button>

              <button
                onClick={() => setView("main")}
                className={`border ${border} rounded-full px-6 py-3 text-sm`}
              >
                Cancel
              </button>
            </div>

          </div>
        </section>
      )}

      {/* SETTINGS */}

      {view === "settings" && activePage === "Profile" && (
        <section className="max-w-3xl mx-auto px-5 md:px-10 py-10 min-h-screen">

          <button
            onClick={() => setView("main")}
            className={`${muted} text-sm mb-8`}
          >
            ← Back to profile
          </button>

          <p className="text-xs uppercase tracking-[0.25em] text-[#a17a29] mb-3">
            Your account
          </p>

          <h1 className="text-4xl font-semibold mb-2">
            Settings
          </h1>

          <p className={`${muted} text-sm mb-9`}>
            Manage your e-ART experience.
          </p>

          <div className={`border rounded-2xl p-6 mb-5 ${panel}`}>
            <h2 className="text-xl font-semibold">Account</h2>

            <p className={`${muted} text-sm mt-1 mb-5`}>
              Your public account details.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className={muted}>Username</span>
                <span>{profile.username}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className={muted}>Display name</span>
                <span>{profile.name}</span>
              </div>

              <button
                onClick={() => {
                  setEditDraft(profile);
                  setView("edit-profile");
                }}
                className="text-[#b1842d] text-sm mt-2"
              >
                Edit account profile ↗
              </button>
            </div>

            <p className={`${muted} text-xs mt-5`}>
              Email, password, connected accounts and account deletion
              need authentication and a backend.
            </p>
          </div>

          {/* APPEARANCE */}

          <div className={`border rounded-2xl p-6 mb-5 ${panel}`}>
            <h2 className="text-xl font-semibold">Appearance</h2>

            <p className={`${muted} text-sm mt-1 mb-5`}>
              Choose how e-ART looks on this device.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(["light", "dark", "system"] as const).map((choice) => (
                <button
                  key={choice}
                  onClick={() => setTheme(choice)}
                  className={`capitalize border rounded-xl p-4 text-sm ${
                    theme === choice
                      ? "border-[#d6a437] bg-[#d6a437]/10"
                      : border
                  }`}
                >
                  {choice}

                  <span className="block text-xs mt-2 opacity-60">
                    {choice === "light"
                      ? "Bright"
                      : choice === "dark"
                      ? "Low light"
                      : "Device setting"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* NOTIFICATIONS */}

          <div className={`border rounded-2xl p-6 mb-5 ${panel}`}>
            <h2 className="text-xl font-semibold">Notifications</h2>

            <p className={`${muted} text-sm mt-1 mb-4`}>
              Choose what you want to be notified about.
            </p>

            {([
              ["followers", "New followers"],
              ["likes", "Likes on your artwork"],
              ["messages", "New messages"],
              ["activity", "e-ART updates and activity"],
            ] as const).map(([key, label]) => (
              <label
                key={key}
                className={`flex items-center justify-between py-3 border-b last:border-0 ${border} text-sm`}
              >
                <span>{label}</span>

                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      [key]: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-[#d6a437]"
                />
              </label>
            ))}
          </div>

          {/* PRIVACY */}

          <div className={`border rounded-2xl p-6 mb-5 ${panel}`}>
            <h2 className="text-xl font-semibold">
              Privacy & security
            </h2>

            <label className={`flex items-center justify-between gap-4 py-4 border-b ${border} text-sm`}>
              <span>
                <span className="block font-medium">
                  Private profile
                </span>

                <span className={`${muted} text-xs`}>
                  Only approved followers can see your profile.
                </span>
              </span>

              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 accent-[#d6a437]"
              />
            </label>

            <label className="block text-sm pt-4">
              Who can message you

              <select
                value={messagePermission}
                onChange={(e) => setMessagePermission(e.target.value)}
                className={inputStyle}
              >
                <option>Everyone</option>
                <option>People I follow</option>
                <option>No one</option>
              </select>
            </label>

            <p className={`${muted} text-xs mt-4`}>
              These are demo preferences; access control must be
              enforced by a backend before launch.
            </p>
          </div>

          {/* LANGUAGE */}

          <div className={`border rounded-2xl p-6 mb-5 ${panel}`}>
            <h2 className="text-xl font-semibold">
              Language & region
            </h2>

            <p className={`${muted} text-sm mt-2`}>
              Language: English
            </p>

            <p className={`${muted} text-sm mt-1`}>
              Region: {profile.country}
            </p>
          </div>

          {/* ABOUT */}

          <div className={`border rounded-2xl p-6 ${panel}`}>
            <h2 className="text-xl font-semibold">
              About e-ART
            </h2>

            <p className={`${muted} text-sm mt-2`}>
              A world of visual expression.
            </p>

            <div className={`mt-5 pt-4 border-t ${border} flex justify-between text-sm`}>
              <span className={muted}>Version</span>
              <span>0.1.0 demo</span>
            </div>
          </div>

        </section>
      )}

      {/* MOBILE NAVIGATION */}

      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t ${
          isDark
            ? "bg-[#111]/95 border-white/10"
            : "bg-[#faf9f6]/95 border-black/10"
        }`}
      >
        <div className="grid grid-cols-5 items-center">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => goTo(item.name)}
              aria-label={item.name}
              className={`flex flex-col items-center justify-center py-2 gap-1 ${
                activePage === item.name
                  ? "text-[#a17a29]"
                  : "text-gray-400"
              }`}
            >
              {item.name === "Upload" ? (
                <span className="w-11 h-11 rounded-full bg-[#d6a437] text-black flex items-center justify-center text-3xl font-light shadow-lg -mt-6 border-4 border-[#faf9f6]">
                  +
                </span>
              ) : (
                <span className="text-2xl">{item.icon}</span>
              )}

              <span className={`text-[11px] font-medium ${
                item.name === "Upload" ? "mt-0" : ""
              }`}>
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* FOOTER */}

      {activePage === "Home" && view === "main" && (
        <footer className="bg-[#191919] text-white px-6 md:px-12 py-10">
          <h2 className="text-3xl font-black">
            e-ART<span className="text-[#d6a437]">.</span>
          </h2>

          <p className="text-gray-400 text-sm mt-3">
            Art is a language. Speak yours.
          </p>

          <p className="text-gray-600 text-xs mt-8">
            © 2026 e-ART. A world of visual expression.
          </p>
        </footer>
      )}

    </main>
  );
}
