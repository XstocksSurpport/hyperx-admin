"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "登录失败");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--admin-accent)]/20">
            <Database className="h-7 w-7 text-[var(--admin-accent)]" />
          </div>
          <h1 className="text-xl font-semibold">HyperX Admin</h1>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">后台管理系统登录</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-panel space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs text-[var(--admin-muted)]">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--admin-accent)]/50"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-[var(--admin-muted)]">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm outline-none focus:border-[var(--admin-accent)]/50"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--admin-accent)] py-2.5 text-sm font-semibold text-black hover:bg-[var(--admin-accent-hover)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            登录
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--admin-muted)]">
          默认账号见 admin/.env.example
        </p>
      </div>
    </div>
  );
}
