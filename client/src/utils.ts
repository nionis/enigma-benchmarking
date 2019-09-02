import Web3 from "web3"

export const isSSR = typeof window === "undefined";

export const setIntervalAsync = (fn: () => Promise<any>, ms: number) => {
  const t = setTimeout(() => {
    fn().finally(() => {
      clearTimeout(t)
      setIntervalAsync(fn, ms)
    })
  }, ms)
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const rawAddrToStr = (raw: string) => Web3.utils.toChecksumAddress(`0x${raw.slice(24, 64)}`);
export const rawUint256ToStr = (raw: string) => String(parseInt(raw, 16));
export const rawHexToStr = (raw: string) => Web3.utils.hexToString(`0x${raw}`);

export const getDatasetsInfo = (output: string) => {
  const rawOutput = output.match(/.{1,64}/g);
  const trimmedLeft = rawOutput.splice(3, rawOutput.length);
  const arraySize = (trimmedLeft.length - 1) / 2;

  const ids = trimmedLeft.slice(0, arraySize);
  const names = trimmedLeft.slice(arraySize + 1, trimmedLeft.length);

  return {
    ids: ids.map(rawUint256ToStr),
    names: names.map(rawHexToStr),
  }
}