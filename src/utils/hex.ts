export function lightenHex(hex: string, factor: number): string {
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // 解析 RGB 分量
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // 调整亮度
  r = Math.min(255, Math.round(r * (1 + factor)));
  g = Math.min(255, Math.round(g * (1 + factor)));
  b = Math.min(255, Math.round(b * (1 + factor)));

  return `#${(r | 256).toString(16).slice(1)}${(g | 256)
    .toString(16)
    .slice(1)}${(b | 256).toString(16).slice(1)}`;
}