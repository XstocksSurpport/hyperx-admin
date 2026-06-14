import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { createUser, deleteUser, getAllUsers } from "@/lib/queries";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  return NextResponse.json(getAllUsers());
}

export async function POST(request: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const { displayName, email, walletAddress, plan } = body as {
    displayName?: string;
    email?: string;
    walletAddress?: string;
    plan?: string;
  };

  if (!displayName?.trim()) {
    return NextResponse.json({ error: "显示名称不能为空" }, { status: 400 });
  }

  const user = createUser({
    displayName: displayName.trim(),
    email: email?.trim() || null,
    walletAddress: walletAddress?.trim() || null,
    plan: plan?.trim() || "Free",
  });

  logAudit("create", "user", session.username, user.id, `创建用户 ${displayName}`);

  return NextResponse.json({ id: user.id }, { status: 201 });
}

export async function DELETE(request: Request) {
  let session;
  try {
    session = await requireSession();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  deleteUser(id);
  logAudit("delete", "user", session.username, id, "删除用户");

  return NextResponse.json({ ok: true });
}
