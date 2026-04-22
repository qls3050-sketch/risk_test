"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StockData {
  name: string;
  market: string;
  sector: string;
  currentAmountKrw: number | null;
  buyAmountKrw: number;
}

const MARKET_COLORS: Record<string, string> = {
  KOSPI: "#3b82f6",
  KOSDAQ: "#8b5cf6",
  NASDAQ: "#f59e0b",
};

const SECTOR_COLORS: Record<string, string> = {
  "반도체": "#6366f1",
  "IT/플랫폼": "#10b981",
  "바이오": "#ec4899",
  "2차전지": "#f97316",
  "전기차": "#14b8a6",
  "기타": "#6b7280",
};

const STOCK_COLORS = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
  "#6366f1", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

function PieCard({
  title,
  data,
  colorMap,
  colorByIndex,
}: {
  title: string;
  data: { name: string; value: number }[];
  colorMap?: Record<string, string>;
  colorByIndex?: boolean;
}) {
  const formatLabel = (entry: { name?: string; percent?: number }) =>
    `${entry.name ?? ""} ${((entry.percent ?? 0) * 100).toFixed(1)}%`;

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg">
      <h3 className="text-gray-300 font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={colorMap ? formatLabel : false}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={
                  colorByIndex
                    ? STOCK_COLORS[i % STOCK_COLORS.length]
                    : (colorMap?.[entry.name] ?? "#6b7280")
                }
              />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}만원`]} />
          {colorByIndex && (
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          )}
        </PieChart>
      </ResponsiveContainer>
      {!colorByIndex && colorMap && (
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1 text-xs text-gray-400">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: colorMap[d.name] ?? "#6b7280" }}
              />
              {d.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllocationChart({ stocks }: { stocks: StockData[] }) {
  const getValue = (s: StockData) =>
    Math.round((s.currentAmountKrw ?? s.buyAmountKrw) / 10000);

  // 시장별
  const marketData = ["KOSPI", "KOSDAQ", "NASDAQ"]
    .map((m) => ({
      name: m,
      value: stocks.filter((s) => s.market === m).reduce((sum, s) => sum + getValue(s), 0),
    }))
    .filter((d) => d.value > 0);

  // 섹터별
  const sectorMap = new Map<string, number>();
  for (const s of stocks) {
    sectorMap.set(s.sector, (sectorMap.get(s.sector) ?? 0) + getValue(s));
  }
  const sectorData = Array.from(sectorMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 종목별
  const stockData = stocks.map((s) => ({ name: s.name, value: getValue(s) }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PieCard title="시장별 비중" data={marketData} colorMap={MARKET_COLORS} />
      <PieCard title="섹터별 비중" data={sectorData} colorMap={SECTOR_COLORS} />
      <PieCard title="종목별 비중" data={stockData} colorByIndex />
    </div>
  );
}
