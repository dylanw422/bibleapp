import { create } from "zustand";

interface BibleStore {
  bibles: { [version: string]: any[] }; // Store Bible data as arrays for each version
  setBible: (version: string, data: any[]) => void;
  loadAllBibles: () => Promise<void>;
}

export const useBibleStore = create<BibleStore>((set) => ({
  bibles: {}, // Initial state as an empty object

  // Set Bible data for a specific version
  setBible: (version: string, data: any[]) =>
    set((state) => ({
      bibles: {
        ...state.bibles,
        [version]: data, // Store the data array for the Bible version
      },
    })),

  // Load and store all Bible versions
  loadAllBibles: async () => {
    const versions = {
      kjv: () => import("../bibles/kjv/KJV").then((module) => module.kjv), // Named export from KJV.js
      nkjv: () => import("../bibles/nkjv/NKJV").then((module) => module.nkjv), // Named export from NKJV.js
      niv: () => import("../bibles/niv/NIV").then((module) => module.niv), // Named export from NIV.js
    };

    for (const [version, loader] of Object.entries(versions)) {
      const bibleData = await loader();
      set((state) => ({
        bibles: {
          ...state.bibles,
          [version]: bibleData, // Store the Bible data array for the corresponding version
        },
      }));
    }
  },
}));
