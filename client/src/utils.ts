import Web3 from "web3";

// check if page was rendered on server
export const isSSR = typeof window === "undefined";

// promisified interval that waits for promise either resolve or reject
export const setIntervalAsync = (fn: () => Promise<any>, ms: number) => {
  const t = setTimeout(() => {
    fn().finally(() => {
      clearTimeout(t);
      setIntervalAsync(fn, ms);
    });
  }, ms);
};

// promisified timeout
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const rawAddrToStr = (raw: string) =>
  Web3.utils.toChecksumAddress(`0x${raw.slice(24, 64)}`);
export const rawUint256ToStr = (raw: string) => String(parseInt(raw, 16));
export const rawHexToStr = (raw: string) => Web3.utils.hexToString(`0x${raw}`);

export const getNumberWithOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
