import SummaryCard from "@/components/SummaryCard";
import AllocationChart from "@/components/AllocationChart";
import StockTable from "@/components/StockTable";
import PLBarChart from "@/components/PLBarChart";

async function getPrices() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001"}/api/prices`,
      { next: { revalidate: 60 } }
    );
    return res.json();
  } catch {
    return null;
  }
}

function fmt만원(n: number) {
  return `${Math.round(n / 10000).toLocaleString("ko-KR")}만원`;
}

function fmtNow() {
  return new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Dashboard() {
  const data = await getPrices();
  const stocks = data?.stocks ?? [];
  const usdKrw: number = data?.usdKrw ?? 1380;

  const totalBuy = stocks.reduce(
    (s: number, st: { buyAmountKrw: number }) => s + st.buyAmountKrw,
    0
  );
  const totalCurrent = stocks.reduce(
    (s: number, st: { currentAmountKrw: number | null; buyAmountKrw: number }) =>
      s + (st.currentAmountKrw ?? st.buyAmountKrw),
    0
  );
  const totalPL = totalCurrent - totalBuy;
  const totalPLPct = totalBuy > 0 ? (totalPL / totalBuy) * 100 : 0;
  const isGain = totalPL >= 0;

  // 베스트/워스트 종목
  const ranked = [...stocks]
    .filter((s: { plPct: number | null }) => s.plPct !== null)
    .sort((a: { plPct: number }, b: { plPct: number }) => b.plPct - a.plPct);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];

  // 국내 / 해외 비중
  const krBuy = stocks
    .filter((s: { market: string }) => s.market !== "NASDAQ")
    .reduce((sum: number, s: { buyAmountKrw: number }) => sum + s.buyAmountKrw, 0);
  const usBuy = totalBuy - krBuy;
  const krPct = totalBuy > 0 ? ((krBuy / totalBuy) * 100).toFixed(0) : "0";
  const usPct = totalBuy > 0 ? ((usBuy / totalBuy) * 100).toFixed(0) : "0";

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">내 투자 포트폴리오</h1>
          <p className="text-gray-400 text-sm mt-1">
            USD/KRW{" "}
            <span className="text-amber-400 font-medium">{usdKrw.toLocaleString()}원</span>
            &nbsp;·&nbsp;기준 {fmtNow()}
          </p>
        </div>
        <div className="text-xs text-gray-600 text-right">
          데이터: 네이버금융 / Yahoo Finance · 60초 캐시
        </div>
      </div>

      {/* 요약 카드 - 6개 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <SummaryCard label="총 매수금액" value={fmt만원(totalBuy)} />
        <SummaryCard label="총 평가금액" value={fmt만원(totalCurrent)} />
        <SummaryCard
          label="총 손익"
          value={`${isGain ? "+" : ""}${fmt만원(totalPL)}`}
          sub={`${isGain ? "+" : ""}${totalPLPct.toFixed(2)}%`}
          color={isGain ? "green" : "red"}
        />
        <SummaryCard label="보유 종목" value={`${stocks.length}개`} sub="국내 7 / 미국 3" />
        {best && (
          <SummaryCard
            label="최고 수익 종목"
            value={best.name}
            sub={`+${best.plPct!.toFixed(1)}%`}
            color="green"
          />
        )}
        {worst && (
          <SummaryCard
            label="최저 수익 종목"
            value={worst.name}
            sub={`${worst.plPct! >= 0 ? "+" : ""}${worst.plPct!.toFixed(1)}%`}
            color={worst.plPct! >= 0 ? "green" : "red"}
          />
        )}
      </div>

      {/* 국내/해외 비중 바 */}
      <div className="bg-gray-800 rounded-2xl p-5 shadow-lg mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>국내주식 <span className="text-blue-400 font-semibold">{krPct}%</span></span>
          <span>해외주식 <span className="text-amber-400 font-semibold">{usPct}%</span></span>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-gray-700 flex">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${krPct}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${usPct}%` }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>국내: {fmt만원(krBuy)}</span>
          <span>해외: {fmt만원(usBuy)} (환산)</span>
        </div>
      </div>

      {/* 비중 파이차트 3개 */}
      <div className="mb-6">
        <AllocationChart stocks={stocks} />
      </div>

      {/* 수익률 바차트 */}
      <div className="mb-6">
        <PLBarChart stocks={stocks} />
      </div>

      {/* 종목 테이블 */}
      <StockTable stocks={stocks} />

      <p className="text-center text-gray-700 text-xs mt-8">
        본 대시보드는 참고용입니다. 투자 판단의 책임은 본인에게 있습니다.
      </p>
    </main>
  );
}
