import { getDashboardStats } from "@/lib/queries";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("zh-CN", { hour12: false });
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">仪表盘</h1>
        <p className="text-sm text-[var(--admin-muted)]">HyperX 后台数据概览</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "注册用户", value: stats.users },
          { label: "API 密钥", value: stats.apiKeys },
          { label: "钱包记录", value: stats.wallets },
          { label: "操作日志", value: stats.auditLogs },
        ].map((s) => (
          <div key={s.label} className="admin-panel p-5">
            <div className="mb-1 text-xs text-[var(--admin-muted)]">{s.label}</div>
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-panel">
          <div className="border-b border-[var(--admin-border)] px-5 py-4">
            <h2 className="text-sm font-semibold">最近用户</h2>
          </div>
          <div className="divide-y divide-[var(--admin-border)]/60">
            {stats.recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--admin-muted)]">暂无数据</p>
            ) : (
              stats.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium">{u.displayName}</div>
                    <div className="text-xs text-[var(--admin-muted)]">{u.email ?? "—"}</div>
                  </div>
                  <span className="admin-badge admin-badge-active">{u.plan}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-panel">
          <div className="border-b border-[var(--admin-border)] px-5 py-4">
            <h2 className="text-sm font-semibold">最近操作</h2>
          </div>
          <div className="divide-y divide-[var(--admin-border)]/60">
            {stats.recentLogs.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--admin-muted)]">暂无日志</p>
            ) : (
              stats.recentLogs.map((log) => (
                <div key={log.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm">
                      {log.action} · {log.entity}
                    </span>
                    <span className="text-xs text-[var(--admin-muted)]">
                      {formatTime(log.createdAt)}
                    </span>
                  </div>
                  {log.detail && (
                    <div className="mt-1 space-y-1 text-xs">
                      {log.detail.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className={
                            i > 0
                              ? "break-all font-mono text-[var(--admin-fg)]"
                              : "text-[var(--admin-muted)]"
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
