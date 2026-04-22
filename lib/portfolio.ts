export type Market = "KOSPI" | "KOSDAQ" | "NASDAQ";

export interface Stock {
  name: string;
  code: string;
  market: Market;
  buyDate: string;
  qty: number;
  buyPrice: number; // KRW for KR stocks, USD for US stocks
}

export const portfolio: Stock[] = [
  { name: "삼성전자",      code: "005930", market: "KOSPI",  buyDate: "2025-01-15", qty: 230, buyPrice: 58000 },
  { name: "SK하이닉스",    code: "000660", market: "KOSPI",  buyDate: "2025-02-10", qty: 75,  buyPrice: 185000 },
  { name: "NAVER",        code: "035420", market: "KOSPI",  buyDate: "2025-03-05", qty: 50,  buyPrice: 210000 },
  { name: "카카오",        code: "035720", market: "KOSPI",  buyDate: "2025-04-20", qty: 160, buyPrice: 48000 },
  { name: "셀트리온",      code: "068270", market: "KOSPI",  buyDate: "2025-05-12", qty: 60,  buyPrice: 180000 },
  { name: "에코프로비엠",  code: "247540", market: "KOSDAQ", buyDate: "2025-06-18", qty: 40,  buyPrice: 260000 },
  { name: "LG에너지솔루션",code: "373220", market: "KOSPI",  buyDate: "2025-08-01", qty: 22,  buyPrice: 380000 },
  { name: "Apple",        code: "AAPL",   market: "NASDAQ", buyDate: "2025-07-10", qty: 50,  buyPrice: 195 },
  { name: "NVIDIA",       code: "NVDA",   market: "NASDAQ", buyDate: "2025-09-22", qty: 30,  buyPrice: 118 },
  { name: "Tesla",        code: "TSLA",   market: "NASDAQ", buyDate: "2025-11-05", qty: 22,  buyPrice: 275 },
];

export const SECTOR_MAP: Record<string, string> = {
  "005930": "반도체",
  "000660": "반도체",
  "035420": "IT/플랫폼",
  "035720": "IT/플랫폼",
  "068270": "바이오",
  "247540": "2차전지",
  "373220": "2차전지",
  "AAPL":   "IT/플랫폼",
  "NVDA":   "반도체",
  "TSLA":   "전기차",
};
