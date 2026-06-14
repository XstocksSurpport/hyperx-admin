import { getEnrichedAuditLogs } from "@/lib/queries";

export default async function LogsPage() {
  const logs = getEnrichedAuditLogs();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">操作日志</h1>
        <p className="text-sm text-[var(--admin-muted)]">后台操作审计记录</p>
      </div>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
              <th className="px-5 py-3">时间</th>
              <th className="px-5 py-3">操作</th>
              <th className="px-5 py-3">对象</th>
              <th className="px-5 py-3">管理员</th>
              <th className="px-5 py-3">详情</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--admin-muted)]">
                  暂无日志
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-[var(--admin-border)]/60">
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {new Date(log.createdAt).toLocaleString("zh-CN")}
                  </td>
                  <td className="px-5 py-3">{log.action}</td>
                  <td className="px-5 py-3">{log.entity}</td>
                  <td className="px-5 py-3">{log.adminUser}</td>
                  <td className="px-5 py-3 text-xs">
                    {log.detail ? (
                      <div className="space-y-1">
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
                    ) : (
                      "—"
                    )}
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
