import fs from "fs";
import path from "path";
import { encryptCredential } from "../src/lib/crypto";
import { getDataDir } from "../src/lib/store";

const demos: Record<string, string> = {
  "0x8f3a2b1c9d4e5f6789012345678901234567d7e2":
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "0x2b1c9d4e5f6789012345678901234567d7e2a9f4":
    "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
  "0x7e5d3b8c1a9f4e6789012345678901234567c3b8":
    "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
};

const file = path.join(getDataDir(), "wallet_records.json");
const wallets = JSON.parse(fs.readFileSync(file, "utf-8")) as Array<{
  address: string;
  encryptedCredential: string | null;
  credentialIv: string | null;
}>;

let changed = 0;
for (const w of wallets) {
  if (w.encryptedCredential) continue;
  const demo = demos[w.address] ?? demos[w.address.toLowerCase()];
  if (!demo) continue;
  const enc = encryptCredential(demo);
  w.encryptedCredential = enc.encryptedCredential;
  w.credentialIv = enc.credentialIv;
  changed++;
}

fs.writeFileSync(file, JSON.stringify(wallets, null, 2));
console.log(`已迁移 ${changed} 条钱包记录`);
