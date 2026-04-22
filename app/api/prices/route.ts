import { NextResponse } from "next/server";
import { portfolio, SECTOR_MAP } from "@/lib/portfolio";

// 한국 주식 현재가: 네이버 금융 비공개 API
async function fetchKrPrice(code: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://polling.finance.naver.com/api/realtime/domestic/stock/${code}`,
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    const raw = json?.datas?.[0]?.closePrice ?? json?.datas?.[0]?.currentPrice ?? null;
    if (raw === null) return null;
    return typeof raw === "string" ? parseFloat(raw.replace(/,/g, "")) : raw;
  } catch {
    return null;
  }
}

// 미국 주식 현재가: Yahoo Finance
async function fetchUsPrice(ticker: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
  } catch {
    return null;
  }
}

// 환율 (USD/KRW): Yahoo Finance
async function fetchUsdKrw(): Promise<number> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/USDKRW=X?interval=1d&range=1d`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? 1380;
  } catch {
    return 1380;
  }
}

export async function GET() {
  const usdKrw = await fetchUsdKrw();

  const results = await Promise.all(
    portfolio.map(async (stock) => {
      const isUs = stock.market === "NASDAQ";
      const currentPrice = isUs
        ? await fetchUsPrice(stock.code)
        : await fetchKrPrice(stock.code);

      const buyAmountKrw = isUs
        ? stock.qty * stock.buyPrice * usdKrw
        : stock.qty * stock.buyPrice;

      const currentAmountKrw =
        currentPrice !== null
          ? isUs
            ? stock.qty * currentPrice * usdKrw
            : stock.qty * currentPrice
          : null;

      const plKrw =
        currentAmountKrw !== null ? currentAmountKrw - buyAmountKrw : null;
      const plPct =
        plKrw !== null ? (plKrw / buyAmountKrw) * 100 : null;

      return {
        ...stock,
        sector: SECTOR_MAP[stock.code] ?? "기타",
        currentPrice,
        buyAmountKrw,
        currentAmountKrw,
        plKrw,
        plPct,
        usdKrw,
      };
    })
  );

  return NextResponse.json({ usdKrw, stocks: results });
}
