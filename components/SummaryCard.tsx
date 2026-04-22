"use client";

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: "green" | "red" | "default";
}

export default function SummaryCard({ label, value, sub, color = "default" }: Props) {
  const valueColor =
    color === "green"
      ? "text-emerald-400"
      : color === "red"
      ? "text-red-400"
      : "text-white";

  return (
    <div className="bg-gray-800 rounded-2xl p-5 flex flex-col gap-1 shadow-lg">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
      {sub && <span className="text-gray-500 text-xs">{sub}</span>}
    </div>
  );
}
