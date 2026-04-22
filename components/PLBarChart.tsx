"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface StockData {
  name: string;
  plPct: number | null;
}

export default function PLBarChart({ stocks }: { stocks: StockData[] }) {
  const data = stocks
    .filter((s) => s.plPct !== null)
    .map((s) => ({ name: s.name, pct: parseFloat(s.plPct!.toFixed(2)) }))
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-lg">
      <h3 className="text-gray-300 font-semibold mb-4">종목별 수익률 (%)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} unit="%" />
          <Tooltip
            formatter={(v) => { const n = Number(v); return [`${n > 0 ? "+" : ""}${n}%`, "수익률"]; }}
            contentStyle={{ background: "#1f2937", border: "none", borderRadius: 8 }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <ReferenceLine y={0} stroke="#6b7280" />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.pct >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
