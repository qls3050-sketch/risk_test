"use client";

interface StockRow {
  name: string;
  code: string;
  market: string;
  sector: string;
  buyDate: string;
  qty: number;
  buyPrice: number;
  currentPrice: number | null;
  buyAmountKrw: number;
  currentAmountKrw: number | null;
  plKrw: number | null;
  plPct: number | null;
  usdKrw: number;
}

function holdingDays(buyDate: string): number {
  const buy = new Date(buyDate);
  const today = new Date();
  return Math.floor((today.getTime() - buy.getTime()) / (1000 * 60 * 60 * 24));
}

function formatHolding(days: number): string {
  if (days >= 365) {
    const y = Math.floor(days / 365);
    const m = Math.floor((days % 365) / 30);
    return m > 0 ? `${y}년 ${m}개월` : `${y}년`;
  }
  if (days >= 30) return `${Math.floor(days / 30)}개월`;
  return `${days}일`;
}

const SECTOR_COLOR: Record<string, string> = {
  "반도체":    "bg-indigo-900/50 text-indigo-300",
  "IT/플랫폼": "bg-emerald-900/50 text-emerald-300",
  "바이오":    "bg-pink-900/50 text-pink-300",
  "2차전지":  "bg-orange-900/50 text-orange-300",
  "전기차":   "bg-teal-900/50 text-teal-300",
  "기타":     "bg-gray-700/50 text-gray-400",
};

export default function StockTable({ stocks }: { stocks: StockRow[] }) {
  const isUs = (market: string) => market === "NASDAQ";

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg overflow-x-auto">
      <h3 className="text-gray-300 font-semibold mb-4">종목별 현황</h3>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b border-gray-700 text-xs">
            <th className="pb-2 pr-4 whitespace-nowrap">종목</th>
            <th className="pb-2 pr-4 whitespace-nowrap">시장 / 섹터</th>
            <th className="pb-2 pr-4 text-right whitespace-nowrap">보유수량</th>
            <th className="pb-2 pr-4 text-right whitespace-nowrap">매수단가</th>
            <th className="pb-2 pr-4 text-right whitespace-nowrap">현재가</th>
            <th className="pb-2 pr-4 text-right whitespace-nowrap">평가금액</th>
            <th className="pb-2 pr-4 text-right whitespace-nowrap">손익</th>
            <th className="pb-2 text-right whitespace-nowrap">보유기간</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => {
            const gain = s.plKrw !== null && s.plKrw >= 0;
            const plColor =
              s.plKrw === null ? "text-gray-500" : gain ? "text-emerald-400" : "text-red-400";
            const priceUnit = isUs(s.market) ? "$" : "₩";
            const days = holdingDays(s.buyDate);
            const sectorCls = SECTOR_COLOR[s.sector] ?? SECTOR_COLOR["기타"];

            return (
              <tr
                key={s.code}
                className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div className="font-medium text-white">{s.name}</div>
                  <div className="text-gray-500 text-xs">{s.code}</div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit
                        ${s.market === "KOSPI"
                          ? "bg-blue-900/50 text-blue-300"
                          : s.market === "KOSDAQ"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-amber-900/50 text-amber-300"}`}
                    >
                      {s.market}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${sectorCls}`}>
                      {s.sector}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right text-gray-300">
                  {s.qty.toLocaleString()}주
                </td>
                <td className="py-3 pr-4 text-right text-gray-300">
                  {priceUnit}{s.buyPrice.toLocaleString()}
                </td>
                <td className="py-3 pr-4 text-right text-gray-300">
                  {s.currentPrice !== null ? (
                    `${priceUnit}${s.currentPrice.toLocaleString()}`
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-gray-300">
                  {s.currentAmountKrw !== null
                    ? `${Math.round(s.currentAmountKrw / 10000).toLocaleString()}만원`
                    : `${Math.round(s.buyAmountKrw / 10000).toLocaleString()}만원`}
                </td>
                <td className={`py-3 pr-4 text-right font-medium ${plColor}`}>
                  {s.plKrw !== null ? (
                    <>
                      <div>
                        {gain ? "+" : ""}
                        {Math.round(s.plKrw / 10000).toLocaleString()}만원
                      </div>
                      <div className="text-xs">
                        {gain ? "+" : ""}
                        {s.plPct!.toFixed(2)}%
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-3 text-right text-gray-400 text-xs">
                  {formatHolding(days)}
                  <div className="text-gray-600">{s.buyDate}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
