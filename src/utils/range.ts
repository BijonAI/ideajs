export function range(start: number, end: number) {
  return {
    start,
    end,
    realize: () => Array.from({ length: end - start + 1 }, (_, i) => start + i),
  }
}
