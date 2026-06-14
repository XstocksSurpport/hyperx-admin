import { getAllApiKeys } from "@/lib/queries";

export default async function ApiKeysPage() {
  const keys = await getAllApiKeys();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">API 密钥</h1>
        <p className="text-sm text-[var(--admin-muted)]">用户创建的 API 访问密钥</p>
      </div>

      <div className="admin-panel overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border)] text-xs text-[var(--admin-muted)]">
              <th className="px-5 py-3">名称</th>
              <th className="px-5 py-3">前缀</th>
              <th className="px-5 py-3">权限</th>
              <th className="px-5 py-3">状态</th>
              <th className="px-5 py-3">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--admin-muted)]">
                  暂无 API 密钥
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="border-b border-[var(--admin-border)]/60">
                  <td className="px-5 py-3 font-medium">{k.name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{k.prefix}••••</td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {(JSON.parse(k.scopes) as string[]).join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <span className="admin-badge admin-badge-active">{k.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--admin-muted)]">
                    {new Date(k.createdAt).toLocaleString("zh-CN")}
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
