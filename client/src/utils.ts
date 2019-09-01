export const isSSR = typeof window === "undefined";

export const setIntervalAsync = (fn: () => Promise<any>, ms: number) => {
  const t = setTimeout(() => {
    fn().finally(() => {
      clearTimeout(t)
      setIntervalAsync(fn, ms)
    })
  }, ms)
}