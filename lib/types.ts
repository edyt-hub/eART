export type DisciplineSlug =
  | "painters"
  | "photographers"
  | "sculptors"
  | "illustrators"
  | "digital-artists"
  | "graphic-designers"
  | "mixed-media"
  | "printmakers";

export type Comment = {
  id: string;
  author: string;
  text: string;
};

export type ProcessNote = {
  duration: string;
  note: string;
  stills: string[];
};

export type Artwork = {
  id: string;
  artistId: string;
  title: string;
  description: string;
  medium: string;
  year: number;
  discipline: DisciplineSlug;
  image: string;
  width: number;
  height: number;
  likes: number;
  comments: Comment[];
  process?: ProcessNote;
};

export type Collection = {
  title: string;
  year: string;
  note: string;
  artworkIds: string[];
};

export type Artist = {
  username: string;
  name: string;
  portrait: string;
  countrySlug: string;
  city: string;
  bio: string;
  disciplines: DisciplineSlug[];
  followers: number;
  following: number;
  collections: Collection[];
};

export type Country = {
  slug: string;
  name: string;
  iso: string;
  region: string;
  locus: string;
  lat: number;
  lng: number;
  introduction: string;
  essay: string;
  leadArtworkId: string;
};

export type Discipline = {
  slug: DisciplineSlug;
  name: string;
  line: string;
};

export type ChatMessage = {
  id: string;
  from: "you" | "them";
  text?: string;
  artworkId?: string;
  time: string;
};

export type Conversation = {
  id: string;
  artistId: string;
  messages: ChatMessage[];
};
