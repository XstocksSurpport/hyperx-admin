import fs from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  displayName: string;
  email: string | null;
  walletAddress: string | null;
  plan: string;
  timezone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyRecord {
  id: string;
  userId: string | null;
  name: string;
  prefix: string;
  secretHash: string;
  scopes: string;
  status: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface WalletRecord {
  id: string;
  userId: string | null;
  address: string;
  importType: string;
  chainId: number | null;
  encryptedCredential: string | null;
  credentialIv: string | null;
  connectedAt: string;
  disconnectedAt: string | null;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  detail: string | null;
  adminUser: string;
  createdAt: string;
}

export interface SettingRecord {
  key: string;
  value: string;
  updatedAt: string;
}

type CollectionName = "users" | "api_keys" | "wallet_records" | "audit_logs" | "system_settings";

function resolveDataDir() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "hyperx-admin-data");
  }

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "data"),
    path.join(cwd, "admin", "data"),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "users.json"))) {
      return dir;
    }
  }

  if (cwd.endsWith(`${path.sep}admin`) || cwd.endsWith("/admin")) {
    return path.join(cwd, "data");
  }

  return path.join(cwd, "admin", "data");
}

const DATA_DIR = resolveDataDir();

function seedDataIfNeeded() {
  ensureDataDir();
  const seedDir = path.join(process.cwd(), "data-seed");
  if (!fs.existsSync(seedDir)) return;

  for (const file of fs.readdirSync(seedDir)) {
    if (!file.endsWith(".json")) continue;
    const target = path.join(DATA_DIR, file);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(path.join(seedDir, file), target);
    }
  }
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: CollectionName) {
  return path.join(DATA_DIR, `${name}.json`);
}

export function getDataDir() {
  ensureDataDir();
  return DATA_DIR;
}

export function readCollection<T>(name: CollectionName): T[] {
  ensureDataDir();
  seedDataIfNeeded();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, "utf-8")) as T[];
}

export function writeCollection<T>(name: CollectionName, data: T[]) {
  ensureDataDir();
  seedDataIfNeeded();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

export function nowIso() {
  return new Date().toISOString();
}
