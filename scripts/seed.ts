import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { encryptCredential } from "../src/lib/crypto";
import {
  getDataDir,
  readCollection,
  writeCollection,
  type ApiKeyRecord,
  type AuditLogRecord,
  type SettingRecord,
  type UserRecord,
  type WalletRecord,
} from "../src/lib/store";

async function seed() {
  console.log("数据目录:", getDataDir());

  const existing = readCollection<UserRecord>("users");
  if (existing.length > 0) {
    console.log(`已有 ${existing.length} 条用户数据，跳过种子写入。`);
    console.log("如需重置，请删除 admin/data/*.json 后重新运行。");
    return;
  }

  const now = new Date().toISOString();
  const user1 = randomUUID();
  const user2 = randomUUID();
  const user3 = randomUUID();

  const users: UserRecord[] = [
    {
      id: user1,
      displayName: "Trader_Alpha",
      email: "alpha@example.com",
      walletAddress: "0x8f3a2b1c9d4e5f6789012345678901234567d7e2",
      plan: "Pro",
      timezone: "Asia/Shanghai",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: user2,
      displayName: "DeFi_Whale",
      email: "whale@example.com",
      walletAddress: "0x2b1c9d4e5f6789012345678901234567d7e2a9f4",
      plan: "Pro",
      timezone: "Asia/Shanghai",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: user3,
      displayName: "Copy_Bot",
      email: "bot@example.com",
      walletAddress: "0x7e5d3b8c1a9f4e6789012345678901234567c3b8",
      plan: "Free",
      timezone: "UTC",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const apiKeys: ApiKeyRecord[] = [
    {
      id: randomUUID(),
      userId: user1,
      name: "生产环境 Agent",
      prefix: "hx_live_a8f3",
      secretHash: await bcrypt.hash("demo-secret-key", 10),
      scopes: JSON.stringify(["read:wallet", "read:market", "write:copy"]),
      status: "active",
      createdAt: now,
      lastUsedAt: now,
    },
    {
      id: randomUUID(),
      userId: user2,
      name: "数据分析脚本",
      prefix: "hx_live_c2d9",
      secretHash: await bcrypt.hash("demo-secret-key-2", 10),
      scopes: JSON.stringify(["read:wallet", "read:market"]),
      status: "active",
      createdAt: now,
      lastUsedAt: now,
    },
    {
      id: randomUUID(),
      userId: user3,
      name: "测试环境",
      prefix: "hx_test_7b1e",
      secretHash: await bcrypt.hash("demo-secret-key-3", 10),
      scopes: JSON.stringify(["read:market"]),
      status: "expiring",
      createdAt: now,
      lastUsedAt: null,
    },
  ];

  const pkDemo1 = encryptCredential(
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  );
  const mnemonicDemo = encryptCredential(
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
  );
  const pkDemo2 = encryptCredential(
    "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
  );

  const wallets: WalletRecord[] = [
    {
      id: randomUUID(),
      userId: user1,
      address: "0x8f3a2b1c9d4e5f6789012345678901234567d7e2",
      importType: "privateKey",
      chainId: 42161,
      encryptedCredential: pkDemo1.encryptedCredential,
      credentialIv: pkDemo1.credentialIv,
      connectedAt: now,
      disconnectedAt: null,
    },
    {
      id: randomUUID(),
      userId: user2,
      address: "0x2b1c9d4e5f6789012345678901234567d7e2a9f4",
      importType: "mnemonic",
      chainId: 8453,
      encryptedCredential: mnemonicDemo.encryptedCredential,
      credentialIv: mnemonicDemo.credentialIv,
      connectedAt: now,
      disconnectedAt: null,
    },
    {
      id: randomUUID(),
      userId: user3,
      address: "0x7e5d3b8c1a9f4e6789012345678901234567c3b8",
      importType: "privateKey",
      chainId: 42161,
      encryptedCredential: pkDemo2.encryptedCredential,
      credentialIv: pkDemo2.credentialIv,
      connectedAt: now,
      disconnectedAt: null,
    },
  ];

  const settings: SettingRecord[] = [
    { key: "site_name", value: "HyperX Console", updatedAt: now },
    { key: "api_rate_limit", value: "10000", updatedAt: now },
    { key: "maintenance_mode", value: "false", updatedAt: now },
  ];

  const logs: AuditLogRecord[] = [
    {
      id: randomUUID(),
      action: "seed",
      entity: "system",
      entityId: null,
      detail: "初始化演示数据",
      adminUser: "system",
      createdAt: now,
    },
    {
      id: randomUUID(),
      action: "create",
      entity: "user",
      entityId: user1,
      detail: "创建用户 Trader_Alpha",
      adminUser: "system",
      createdAt: now,
    },
    {
      id: randomUUID(),
      action: "create",
      entity: "api_key",
      entityId: null,
      detail: "创建 API 密钥 hx_live_a8f3",
      adminUser: "system",
      createdAt: now,
    },
  ];

  writeCollection("users", users);
  writeCollection("api_keys", apiKeys);
  writeCollection("wallet_records", wallets);
  writeCollection("system_settings", settings);
  writeCollection("audit_logs", logs);

  console.log("种子数据写入完成：3 用户、3 密钥、3 钱包。");
}

seed().catch(console.error);
