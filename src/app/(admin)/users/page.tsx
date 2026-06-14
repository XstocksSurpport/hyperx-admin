"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface UserRow {
  id: string;
  displayName: string;
  email: string | null;
  walletAddress: string | null;
  plan: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ displayName: "", email: "", walletAddress: "", plan: "Free" });

  const load = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ displayName: "", email: "", walletAddress: "", plan: "Free" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除该用户？")) return;
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">用户管理</h1>
          <p className="text-sm text-[var(--admin-muted)]">管理注册用户与账户信息</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[var(--admin-accent)] px-4 py-2 text-sm font-medium text-black"
        >
          <Plus className="h-4 w-4" />
          新增用户
        </button>
      </div>

      {showForm && (
        <div className="admin-panel space-y-3 p-5">
          <h2 className="text-sm font-semibold">新增用户</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["displayName", "显示名称"],
                ["email", "邮箱"],
                ["walletAddress", "钱包地址"],
                ["plan", "订阅计划"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-[var(--admin-muted)]">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm outline-none"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCreate} className="rounded-lg bg-[var(--admin-accent)] px-4 py-2 text-sm font-medium text-black">
              保存
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-sm text-[var(--admin-muted)]">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="admin-panel overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-sm text-[var(--admin-muted)]">加载中…</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
                <th className="px-5 py-3">名称</th>
                <th className="px-5 py-3">邮箱</th>
                <th className="px-5 py-3">钱包</th>
                <th className="px-5 py-3">计划</th>
                <th className="px-5 py-3">状态</th>
                <th className="px-5 py-3">创建时间</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[var(--admin-border)]/60">
                  <td className="px-5 py-3 font-medium">{u.displayName}</td>
                  <td className="px-5 py-3 text-[var(--admin-muted)]">{u.email ?? "—"}</td>
                  <td className="max-w-[140px] truncate px-5 py-3 font-mono text-xs">{u.walletAddress ?? "—"}</td>
                  <td className="px-5 py-3">{u.plan}</td>
                  <td className="px-5 py-3">
                    <span className="admin-badge admin-badge-active">{u.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {new Date(u.createdAt).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-5 py-3">
                    <button type="button" onClick={() => handleDelete(u.id)} className="text-[var(--admin-muted)] hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
