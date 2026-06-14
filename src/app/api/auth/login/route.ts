import { NextResponse } from "next/server";
import { createSession, verifyAdminCredentials } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  await createSession(username);
  await logAudit("login", "admin", username, undefined, "管理员登录");

  return NextResponse.json({ ok: true });
}
