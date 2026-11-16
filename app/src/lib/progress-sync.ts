export type Progress = Record<string, unknown>;
export type RemoteProgress = { data: Progress; updated_at: string } | null;
export type SyncStatus = "checking" | "pending" | "saving" | "saved" | "error" | "conflict";
export type ProgressStore = {
  read: () => Promise<RemoteProgress>;
  // null means another computer changed the row before this write completed.
  write: (data: Progress, revision: string | null) => Promise<RemoteProgress>;
};

type SavedBase = { userId: string; base: string; revision: string | null };
const KEY = "deutschA1";
const META = "deutschA1:sync";

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical((value as Progress)[k])}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return {};
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid progress");
  return value as Progress;
}

// The saved base is a server-confirmed snapshot, never a browser clock timestamp.
export class ProgressSync {
  userId: string;
  store: ProgressStore;
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  onStatus: (status: SyncStatus) => void;
  onRemote: () => void;
  base: SavedBase | null = null;
  busy: Promise<boolean> | null = null;
  conflict: RemoteProgress = null;
  status: SyncStatus = "checking";

  constructor(options: {
    userId: string; store: ProgressStore;
    storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
    onStatus: (status: SyncStatus) => void; onRemote: () => void;
  }) {
    this.userId = options.userId; this.store = options.store; this.storage = options.storage;
    this.onStatus = options.onStatus; this.onRemote = options.onRemote;
  }

  setStatus(status: SyncStatus) { this.status = status; this.onStatus(status); }
  local() { return parseProgress(this.storage.getItem(KEY)); }
  remember(remote: RemoteProgress) {
    this.base = { userId: this.userId, base: canonical(remote?.data ?? {}), revision: remote?.updated_at ?? null };
    this.storage.setItem(META, JSON.stringify(this.base));
  }
  backup(label: string) {
    const raw = this.storage.getItem(KEY);
    if (raw) {
      this.storage.setItem(`${KEY}:backup:${label}`, raw);
      this.storage.setItem(`${KEY}:backup:${label}:${Date.now()}`, raw);
    }
  }
  apply(remote: RemoteProgress) {
    this.backup(this.userId);
    this.storage.setItem(KEY, JSON.stringify(remote?.data ?? {}));
    this.remember(remote); this.onRemote();
  }

  async initialize() {
    let saved: SavedBase | null = null;
    try { saved = JSON.parse(this.storage.getItem(META) || "null") as SavedBase | null; } catch { /* legacy local data */ }
    // Never upload another account's local copy to the newly signed-in account.
    if (saved && saved.userId !== this.userId) {
      this.backup(saved.userId); this.storage.removeItem(KEY);
      saved = { userId: this.userId, base: "{}", revision: null };
      this.storage.setItem(META, JSON.stringify(saved));
    }
    const remote = await this.store.read();
    const remoteBase = canonical(remote?.data ?? {});
    const localBase = canonical(this.local());
    if (saved?.userId === this.userId && saved.base !== localBase) {
      this.base = saved;
      if (remoteBase !== saved.base && remoteBase !== localBase) {
        this.conflict = remote; this.setStatus("conflict"); return;
      }
      // The browser may have closed after the server saved but before metadata was updated.
      this.remember(remote);
    } else if (remoteBase !== "{}" && remoteBase !== localBase) {
      const local = this.local();
      const hasActivity = ["xp", "totalAnswered", "totalSessions"].some(k => Number(local[k]) > 0) ||
        ["wordStats", "srs", "lessonNotes", "completedLessons", "completedReadings", "completedWriting", "completedListening"]
          .some(k => local[k] && typeof local[k] === "object" && Object.keys(local[k] as object).length > 0);
      if (!saved && hasActivity) {
        this.base = { userId: this.userId, base: "{}", revision: null };
        this.storage.setItem(META, JSON.stringify(this.base));
        this.conflict = remote; this.setStatus("conflict"); return;
      }
      this.apply(remote);
    } else {
      this.remember(remote);
    }
    this.setStatus(canonical(this.local()) === this.base?.base ? "saved" : "pending");
  }

  markDirty() {
    if (this.status !== "conflict") this.setStatus("pending");
  }

  sync(): Promise<boolean> {
    if (this.busy) return this.busy;
    this.busy = this.performSync().catch(() => {
      this.setStatus("error"); return false;
    }).finally(() => { this.busy = null; });
    return this.busy;
  }

  async performSync(): Promise<boolean> {
    if (!this.base) await this.initialize();
    if (this.status === "conflict") return false;
    const remote = await this.store.read();
    const remoteBase = canonical(remote?.data ?? {});
    const local = this.local();
    const localBase = canonical(local);
    const oldBase = this.base!.base;
    if (remoteBase !== oldBase) {
      if (localBase !== oldBase && localBase !== remoteBase) {
        this.conflict = remote; this.setStatus("conflict"); return false;
      }
      if (localBase !== remoteBase) this.apply(remote);
      else this.remember(remote);
      this.setStatus("saved"); return true;
    }
    this.remember(remote);
    if (localBase === remoteBase) { this.setStatus("saved"); return true; }
    this.setStatus("saving");
    const written = await this.store.write(local, remote?.updated_at ?? null);
    if (!written) { this.setStatus("pending"); return false; }
    if (canonical(written.data) !== localBase) throw new Error("Progress write was not confirmed");
    this.remember(written);
    const clean = canonical(this.local()) === localBase;
    this.setStatus(clean ? "saved" : "pending");
    return clean;
  }

  async resolve(choice: "local" | "remote") {
    if (this.status !== "conflict" || this.busy) return false;
    try {
      const remote = await this.store.read();
      // A user's explicit choice applies only to the version they were shown.
      if (canonical(remote) !== canonical(this.conflict)) {
        this.conflict = remote; this.setStatus("conflict"); return false;
      }
      if (choice === "remote") this.apply(remote);
      else {
        this.storage.setItem(`${KEY}:backup:cloud:${this.userId}:${Date.now()}`, JSON.stringify(remote?.data ?? {}));
        this.remember(remote);
      }
      this.setStatus("pending");
      return await this.sync();
    } catch { this.setStatus("error"); return false; }
  }
}
