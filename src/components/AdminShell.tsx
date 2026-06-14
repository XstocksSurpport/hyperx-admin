"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Database,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

const nav = [
  { href: "/", label: "仪表盘", icon: LayoutDashboard },
  { href: "/users", label: "用户管理", icon: Users },
  { href: "/wallets", label: "钱包记录", icon: Wallet },
  { href: "/api-keys", label: "API 密钥", icon: KeyRound },
  { href: "/logs", label: "操作日志", icon: Activity },
  { href: "/settings", label: "系统设置", icon: Settings },
];

export default function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[var(--admin-bg)]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] lg:flex">
        <div className="border-b border-[var(--admin-border)] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--admin-accent)]/20">
              <Database className="h-5 w-5 text-[var(--admin-accent)]" />
            </div>
            <div>
              <div className="text-sm font-semibold">HyperX Admin</div>
              <div className="font-mono text-[10px] text-[var(--admin-muted)]">admin.hyperx.trade</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--admin-accent)]/15 font-medium text-[var(--admin-accent)]"
                    : "text-[var(--admin-muted)] hover:bg-[var(--admin-surface)] hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--admin-border)] p-4">
          <div className="mb-2 text-xs text-[var(--admin-muted)]">当前管理员</div>
          <div className="mb-3 text-sm font-medium">{username}</div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg border border-[var(--admin-border)] px-3 py-2 text-sm text-[var(--admin-muted)] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-[var(--admin-border)] px-4 lg:px-8">
          <div className="text-sm text-[var(--admin-muted)]">独立后台 · 数据存储与管理</div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--admin-border)] px-3 py-1.5 text-xs text-[var(--admin-muted)] hover:text-white lg:hidden"
          >
            <LogOut className="h-3.5 w-3.5" />
            退出
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
