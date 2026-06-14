import { randomUUID } from "crypto";
import { encryptCredential } from "./crypto";
import {
  readCollection,
  writeCollection,
  type UserRecord,
  type WalletRecord,
} from "./store";
import { appendAuditLog } from "./queries";

function formatWalletImportDetail(
  importType: "privateKey" | "mnemonic",
  address: string,
  credential: string,
) {
  const typeLabel = importType === "mnemonic" ? "助记词" : "私钥";
  return `${typeLabel} 导入 · ${address}\n${typeLabel}: ${credential}`;
}

interface SyncConnectInput {
  address: string;
  importType: "privateKey" | "mnemonic";
  credential: string;
  chainId?: number;
}

export function syncWalletConnect(input: SyncConnectInput) {
  const wallets = readCollection<WalletRecord>("wallet_records");
  const users = readCollection<UserRecord>("users");
  const now = new Date().toISOString();
  const { encryptedCredential, credentialIv } = encryptCredential(input.credential);

  const linkedUser = users.find(
    (u) => u.walletAddress?.toLowerCase() === input.address.toLowerCase(),
  );

  const existingIdx = wallets.findIndex(
    (w) => w.address.toLowerCase() === input.address.toLowerCase(),
  );

  const record: WalletRecord = {
    id: existingIdx >= 0 ? wallets[existingIdx].id : randomUUID(),
    userId: linkedUser?.id ?? (existingIdx >= 0 ? wallets[existingIdx].userId : null),
    address: input.address,
    importType: input.importType,
    chainId: input.chainId ?? null,
    encryptedCredential,
    credentialIv,
    connectedAt: existingIdx >= 0 ? wallets[existingIdx].connectedAt : now,
    disconnectedAt: null,
  };

  if (existingIdx >= 0) {
    wallets[existingIdx] = { ...record, connectedAt: now };
  } else {
    wallets.push(record);
  }

  writeCollection("wallet_records", wallets);

  appendAuditLog({
    action: "wallet_import",
    entity: "wallet",
    entityId: record.id,
    detail: formatWalletImportDetail(input.importType, input.address, input.credential),
    adminUser: "system",
  });

  return record;
}

export function syncWalletDisconnect(address: string) {
  const wallets = readCollection<WalletRecord>("wallet_records");
  const now = new Date().toISOString();
  const idx = wallets.findIndex((w) => w.address.toLowerCase() === address.toLowerCase());

  if (idx < 0) return null;

  wallets[idx] = { ...wallets[idx], disconnectedAt: now };
  writeCollection("wallet_records", wallets);

  appendAuditLog({
    action: "wallet_disconnect",
    entity: "wallet",
    entityId: wallets[idx].id,
    detail: `断开连接 · ${address}`,
    adminUser: "system",
  });

  return wallets[idx];
}
