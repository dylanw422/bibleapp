import { create } from "zustand";

interface ToolStore {
  tool: string | null;
  setTool: (tool: string | null) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  tool: null,
  setTool: (tool: string | null) => set({ tool }),
}));
