import { create } from "zustand";

interface Verse {
  book: string;
  chapter: string;
  verse: number;
  text: string;
  uuid: string;
}

interface VerseStore {
  verse: Verse | null;
  setVerse: (verse: Verse | null) => void;
}

export const useVerseStore = create<VerseStore>((set) => ({
  verse: null,
  setVerse: (verse: Verse | null) => set({ verse }),
}));
