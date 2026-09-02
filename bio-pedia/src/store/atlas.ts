import { create } from "zustand";

export type AtlasView = "graph" | "article" | "split";
export type RailTab = "files" | "search" | "graph" | "tags" | "starred";

export type AtlasSettings = {
  showLabels: boolean;
  colorGroups: boolean;
  dimUnrelated: boolean;
  localMode: boolean;
  showArrows: boolean;
};

type AtlasState = {
  view: AtlasView;
  rail: RailTab;
  selectedId: string | null;
  openArticleId: string | null;
  hoveredId: string | null;
  explorerFilter: string;
  searchOpen: boolean;
  explorerOpen: boolean;
  inspectorOpen: boolean;
  expandedFolders: string[];
  bookmarks: string[];
  recent: string[];
  settings: AtlasSettings;
  setView: (view: AtlasView) => void;
  setRail: (rail: RailTab) => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  openArticle: (id: string) => void;
  closeArticle: () => void;
  setExplorerFilter: (filter: string) => void;
  setSearchOpen: (open: boolean) => void;
  toggleExplorer: () => void;
  toggleInspector: () => void;
  toggleFolder: (id: string) => void;
  toggleBookmark: (id: string) => void;
  patchSettings: (patch: Partial<AtlasSettings>) => void;
};

export const useAtlas = create<AtlasState>((set) => ({
  view: "graph",
  rail: "files",
  selectedId: "knowledge-atlas",
  openArticleId: null,
  hoveredId: null,
  explorerFilter: "",
  searchOpen: false,
  explorerOpen: true,
  inspectorOpen: true,
  expandedFolders: ["atlas"],
  bookmarks: [],
  recent: [],
  settings: {
    showLabels: true,
    colorGroups: true,
    dimUnrelated: true,
    localMode: false,
    showArrows: true,
  },
  setView: (view) => set({ view }),
  setRail: (rail) => set({ rail }),
  select: (id) =>
    set((state) => ({
      selectedId: id,
      recent: id
        ? [id, ...state.recent.filter((recentId) => recentId !== id)].slice(0, 12)
        : state.recent,
    })),
  hover: (id) => set({ hoveredId: id }),
  openArticle: (id) =>
    set((state) => ({
      selectedId: id,
      openArticleId: id,
      view: "article",
      recent: [id, ...state.recent.filter((recentId) => recentId !== id)].slice(0, 12),
    })),
  closeArticle: () => set({ openArticleId: null }),
  setExplorerFilter: (explorerFilter) => set({ explorerFilter }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  toggleExplorer: () => set((state) => ({ explorerOpen: !state.explorerOpen })),
  toggleInspector: () => set((state) => ({ inspectorOpen: !state.inspectorOpen })),
  toggleFolder: (id) =>
    set((state) => ({
      expandedFolders: state.expandedFolders.includes(id)
        ? state.expandedFolders.filter((folderId) => folderId !== id)
        : [...state.expandedFolders, id],
    })),
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.includes(id)
        ? state.bookmarks.filter((bookmarkId) => bookmarkId !== id)
        : [...state.bookmarks, id],
    })),
  patchSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
}));
