import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function deriveKey() {
  const secret =
    process.env.ENCRYPTION_KEY ??
    process.env.JWT_SECRET ??
    "dev-encryption-key-change-me!!";
  return crypto.scryptSync(secret, "hyperx-wallet-salt", 32);
}

export function encryptCredential(plaintext: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, deriveKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encryptedCredential: Buffer.concat([encrypted, tag]).toString("base64"),
    credentialIv: iv.toString("base64"),
  };
}

export function decryptCredential(encryptedCredential: string, credentialIv: string) {
  const data = Buffer.from(encryptedCredential, "base64");
  const iv = Buffer.from(credentialIv, "base64");
  const tag = data.subarray(data.length - 16);
  const ciphertext = data.subarray(0, data.length - 16);
  const decipher = crypto.createDecipheriv(ALGORITHM, deriveKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

export function tryDecryptCredential(
  encryptedCredential: string | null,
  credentialIv: string | null,
): { ok: true; value: string } | { ok: false; reason: "missing" | "decrypt_failed" } {
  if (!encryptedCredential || !credentialIv) {
    return { ok: false, reason: "missing" };
  }
  try {
    return { ok: true, value: decryptCredential(encryptedCredential, credentialIv) };
  } catch {
    return { ok: false, reason: "decrypt_failed" };
  }
}
