import { getSystemSettings } from "@/lib/queries";

export default async function SettingsPage() {
  const settings = await getSystemSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">系统设置</h1>
        <p className="text-sm text-[var(--admin-muted)]">全局配置项（存储于数据库）</p>
      </div>

      <div className="admin-panel divide-y divide-[var(--admin-border)]/60">
        {settings.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--admin-muted)]">
            暂无配置，运行 npm run db:seed 初始化
          </p>
        ) : (
          settings.map((s) => (
            <div key={s.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <div className="font-mono text-sm">{s.key}</div>
                <div className="text-xs text-[var(--admin-muted)]">
                  更新于 {new Date(s.updatedAt).toLocaleString("zh-CN")}
                </div>
              </div>
              <code className="rounded-lg bg-[var(--admin-bg)] px-3 py-1.5 text-sm">{s.value}</code>
            </div>
          ))
        )}
      </div>

      <div className="admin-panel p-5 text-sm text-[var(--admin-muted)]">
        <p className="mb-2 font-medium text-white">数据库信息</p>
        <p>存储方式：JSON 文件（`admin/data/*.json`）</p>
        <p className="mt-2">后续可迁移至 SQLite / PostgreSQL，或通过 REST API 与前端同步数据。</p>
      </div>
    </div>
  );
}
