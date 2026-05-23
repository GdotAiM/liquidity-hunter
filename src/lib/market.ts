export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
export type AssetClass = "crypto" | "forex";

export const ALL_TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

export const TF_GROUPS: Record<string, Timeframe[]> = {
  scalp: ["1m", "5m", "15m"],
  intraday: ["15m", "1h", "4h"],
  swing: ["1h", "4h", "1d"],
  all: ALL_TIMEFRAMES,
};

export const CRYPTO_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "TONUSDT",
];

export const FOREX_SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "USDCHF",
  "AUDUSD",
  "USDCAD",
  "NZDUSD",
  "EURGBP",
  "EURJPY",
  "GBPJPY",
  "XAUUSD",
  "XAGUSD",
];

export function symbolLabel(s: string, asset: AssetClass) {
  if (asset === "crypto") return s.replace("USDT", "");
  if (s === "XAUUSD") return "GOLD";
  if (s === "XAGUSD") return "SILVER";
  return `${s.slice(0, 3)}/${s.slice(3)}`;
}

async function fetchCryptoCandles(
  symbol: string,
  interval: Timeframe,
  limit = 300,
): Promise<Candle[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Binance ${res.status}`);
  const raw: unknown[][] = await res.json();
  return raw.map((r) => ({
    time: r[0] as number,
    open: parseFloat(r[1] as string),
    high: parseFloat(r[2] as string),
    low: parseFloat(r[3] as string),
    close: parseFloat(r[4] as string),
    volume: parseFloat(r[5] as string),
  }));
}

export async function fetchCandles(
  asset: AssetClass,
  symbol: string,
  interval: Timeframe,
): Promise<Candle[]> {
  if (asset === "crypto") return fetchCryptoCandles(symbol, interval);
  const { fetchForexCandles } = await import("./forex.functions");
  return fetchForexCandles({ data: { symbol, interval } });
}