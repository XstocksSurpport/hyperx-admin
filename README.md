# HyperX Admin

HyperX 后台管理系统，部署于 [Vercel](https://vercel.com)。

## 本地开发

```bash
npm install
cp .env.example .env.local
npm run db:seed
npm run dev
```

默认登录：`admin` / `admin123`

## 环境变量

| 变量 | 说明 |
|------|------|
| `ADMIN_USERNAME` | 管理员用户名 |
| `ADMIN_PASSWORD` | 管理员密码 |
| `JWT_SECRET` | 会话签名密钥 |
| `ENCRYPTION_KEY` | 钱包凭证加密密钥 |
| `WALLET_SYNC_KEY` | 前端钱包同步密钥 |

## 部署

推送到 `main` 分支后 Vercel 自动部署。生产地址：https://hyperx-admin.vercel.app

前端 Console 需配置：

```
ADMIN_API_URL=https://hyperx-admin.vercel.app
WALLET_SYNC_KEY=<与后台一致>
```
