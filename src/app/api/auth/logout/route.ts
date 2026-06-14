import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST() {
  const session = await getSession();
  if (session) {
    await logAudit("logout", "admin", session.username, undefined, "管理员登出");
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
