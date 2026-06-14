import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { getAllWalletsWithCredentials } from "@/lib/queries";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  return NextResponse.json(getAllWalletsWithCredentials());
}
