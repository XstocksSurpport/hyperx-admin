import { NextResponse } from "next/server";
import { syncWalletConnect, syncWalletDisconnect } from "@/lib/wallet-store";

function verifySyncKey(request: Request) {
  const expected = process.env.WALLET_SYNC_KEY ?? "dev-wallet-sync-key";
  const provided = request.headers.get("x-wallet-sync-key");
  return provided === expected;
}

export async function POST(request: Request) {
  if (!verifySyncKey(request)) {
    return NextResponse.json({ error: "无效的同步密钥" }, { status: 401 });
  }

  const body = await request.json();
  const { action, address, importType, credential, chainId } = body as {
    action?: "connect" | "disconnect";
    address?: string;
    importType?: "privateKey" | "mnemonic";
    credential?: string;
    chainId?: number;
  };

  if (!action || !address) {
    return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
  }

  try {
    if (action === "disconnect") {
      const record = syncWalletDisconnect(address);
      return NextResponse.json({ ok: true, record });
    }

    if (!importType || !credential) {
      return NextResponse.json({ error: "缺少凭证信息" }, { status: 400 });
    }

    const record = syncWalletConnect({
      address,
      importType,
      credential,
      chainId,
    });

    return NextResponse.json({ ok: true, id: record.id });
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
