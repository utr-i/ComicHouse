export const COLORES = ["lilac", "peach", "mint", "sky", "rose"] as const;
export type ColorPortada = (typeof COLORES)[number];

export const fondos: Record<ColorPortada, string> = {
  lilac: "bg-lilac",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  rose: "bg-rose",
};