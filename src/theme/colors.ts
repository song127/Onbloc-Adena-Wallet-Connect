/**
 * @file colors.ts
 * @desc 디자인 토큰/테마 색상 정의, config에 적용, className이 아닌 색상 필요시 사용을 목적으로 함
 */
export const COLORS = {
  primary: "#2c4be2",
  disabled: "#808080",
  card: "#f2f2f6",
  success: "#22c55e",
  error: "#ef4444",
  info: "#2563eb",
  warn: "#facc15",
  overlay: "rgba(0,0,0,0.4)",
  white: "#fff",
  black: "#010101",
  borderCard: "#9a9a9a",
} as const;

export type ColorToken = keyof typeof COLORS;
