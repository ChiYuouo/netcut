import { create } from 'zustand';
import { buildShareUrl, createNoteId } from '../utils/crypto';

export type Permission = 'readonly' | 'editable';
export type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
export type TtlPreset = 'burn' | '1h' | '1d' | '3d' | 'forever';

export type NoteTab = {
  localId: string;
  noteId: string;
  pageId: string;
  title: string;
  content: string;
  ttl: TtlPreset;
  permission: Permission;
  burnAfterRead: boolean;
  isOwner: boolean;
  password?: string;
  passwordProtected: boolean;
  shareUrl: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
  saveState: SaveState;
  error?: string;
};

export type SavedWorkspace = {
  v: 1;
  passwordProtected?: boolean;
  tabs: Array<{
    pageId: string;
    title: string;
    content: string;
  }>;
  activePageId?: string;
};

type NoteStore = {
  tabs: NoteTab[];
  activeId: string;
  lastSelectedTTL: TtlPreset;
  addTab: (noteId: string) => NoteTab;
  ensureWorkspace: (noteId: string) => NoteTab;
  replaceWorkspace: (noteId: string, payload: SavedWorkspace, patch: Partial<NoteTab>) => void;
  closeTab: (localId: string) => void;
  setActive: (localId: string) => void;
  setLastSelectedTTL: (ttl: TtlPreset) => void;
  updateActive: (patch: Partial<NoteTab>) => void;
  updateWorkspace: (noteId: string, patch: Partial<NoteTab>) => void;
  updateTab: (localId: string, patch: Partial<NoteTab>) => void;
  reset: () => void;
};

export const ttlOptions: Array<{ value: TtlPreset; label: string; seconds: number | null; burn: boolean }> = [
  { value: 'burn', label: '阅后即焚', seconds: 60 * 60 * 24, burn: true },
  { value: '1h', label: '1小时', seconds: 60 * 60, burn: false },
  { value: '1d', label: '1天', seconds: 60 * 60 * 24, burn: false },
  { value: '3d', label: '3天', seconds: 60 * 60 * 24 * 3, burn: false },
  { value: 'forever', label: '永久', seconds: null, burn: false },
];

export const useNoteStore = create<NoteStore>((set, get) => ({
  tabs: [],
  activeId: '',
  lastSelectedTTL: '1d',

  addTab: (noteId) => {
    const index = get().tabs.filter((item) => item.noteId === noteId).length + 1;
    const tab = createBlankTab(noteId, `标签 ${index}`, undefined, get().lastSelectedTTL);
    set((state) => ({ tabs: [...state.tabs, tab], activeId: tab.localId }));
    return tab;
  },

  ensureWorkspace: (noteId) => {
    const existing = get().tabs.find((tab) => tab.noteId === noteId);
    if (existing) {
      set({ activeId: existing.localId });
      return existing;
    }

    const tab = createBlankTab(noteId, '标签 1', undefined, get().lastSelectedTTL);
    set((state) => ({ tabs: [...state.tabs, tab], activeId: tab.localId }));
    return tab;
  },

  replaceWorkspace: (noteId, payload, patch) => {
    const ttl = patch.ttl || get().lastSelectedTTL;
    const workspaceTabs = payload.tabs.length > 0 ? payload.tabs : [{ pageId: createNoteId(), title: '标签 1', content: '' }];
    const nextTabs = workspaceTabs.map((item, index) => ({
      ...createBlankTab(noteId, item.title || `标签 ${index + 1}`, item.pageId, ttl),
      ...patch,
      content: item.content,
      title: item.title || `标签 ${index + 1}`,
      passwordProtected: Boolean(payload.passwordProtected || patch.passwordProtected),
      shareUrl: buildShareUrl(noteId, ''),
      saveState: 'saved' as SaveState,
    }));
    const activePageId = payload.activePageId || workspaceTabs[0]?.pageId;
    const nextActive = nextTabs.find((tab) => tab.pageId === activePageId) || nextTabs[0];

    set((state) => ({
      tabs: [...state.tabs.filter((tab) => tab.noteId !== noteId), ...nextTabs],
      activeId: nextActive.localId,
      lastSelectedTTL: ttl,
    }));
  },

  closeTab: (localId) => {
    const { tabs, activeId } = get();
    const target = tabs.find((tab) => tab.localId === localId);
    if (!target) return;

    const sameWorkspaceTabs = tabs.filter((tab) => tab.noteId === target.noteId);
    if (sameWorkspaceTabs.length <= 1) return;

    const index = tabs.findIndex((tab) => tab.localId === localId);
    const nextTabs = tabs.filter((tab) => tab.localId !== localId);
    const nextActive =
      activeId === localId ? nextTabs[Math.max(0, index - 1)]?.localId || nextTabs[0].localId : activeId;

    set({ tabs: nextTabs, activeId: nextActive });
  },

  setActive: (localId) => set({ activeId: localId }),

  setLastSelectedTTL: (ttl) => set({ lastSelectedTTL: ttl }),

  updateActive: (patch) => {
    const activeId = get().activeId;
    if (activeId) get().updateTab(activeId, patch);
  },

  updateWorkspace: (noteId, patch) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.noteId === noteId ? mergeTab(tab, patch) : tab)),
      lastSelectedTTL: patch.ttl || state.lastSelectedTTL,
    }));
  },

  updateTab: (localId, patch) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.localId === localId ? mergeTab(tab, patch) : tab)),
      lastSelectedTTL: patch.ttl || state.lastSelectedTTL,
    }));
  },

  reset: () => set({ tabs: [], activeId: '' }),
}));

function createBlankTab(noteId: string, title: string, pageId = createNoteId(), ttl: TtlPreset = '1d'): NoteTab {
  return {
    localId: crypto.randomUUID(),
    noteId,
    pageId,
    title,
    content: '',
    ttl,
    permission: 'editable',
    burnAfterRead: ttl === 'burn',
    isOwner: true,
    passwordProtected: false,
    shareUrl: buildShareUrl(noteId, ''),
    saveState: 'idle',
  };
}

function mergeTab(tab: NoteTab, patch: Partial<NoteTab>): NoteTab {
  const next = { ...tab, ...patch };
  if (patch.ttl) {
    next.burnAfterRead = patch.ttl === 'burn';
  }
  if (patch.noteId !== undefined) {
    next.shareUrl = buildShareUrl(next.noteId, '');
  }
  return next;
}
