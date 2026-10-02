import type { OptionChoice } from "@/lib/types";

export const DEFAULT_SHAPES: OptionChoice[] = [
  { id: "gumdrop", label: "Gumdrop", priceDelta: 0, g3dpgValue: "gumdrop" },
  { id: "cube", label: "Square / Cube", priceDelta: 0, g3dpgValue: "cube" },
  { id: "sphere", label: "Ball / Sphere", priceDelta: 0, g3dpgValue: "sphere" },
  { id: "cylinder", label: "Cylinder", priceDelta: 200, g3dpgValue: "cylinder" },
  { id: "ring", label: "Ring / Torus", priceDelta: 400, g3dpgValue: "ring" },
];

export const DEFAULT_COLORS: OptionChoice[] = [
  { id: "black", label: "Black", hex: "#171717", priceDelta: 0 },
  { id: "red", label: "Red", hex: "#c2302a", priceDelta: 0 },
  { id: "white", label: "White", hex: "#f4f1ea", priceDelta: 0 },
  { id: "blue", label: "Blue", hex: "#1e4f8f", priceDelta: 0 },
  { id: "yellow", label: "Yellow", hex: "#d9a800", priceDelta: 0 },
  { id: "orange", label: "Orange", hex: "#e06a2c", priceDelta: 0 },
];

/** Soft / Medium / Hard — each step +$0.25 */
export const DEFAULT_FIRMNESS: OptionChoice[] = [
  {
    id: "soft",
    label: "Soft",
    priceDelta: 0,
    meta: { thickness: 1.2, periods: 2.2 },
  },
  {
    id: "medium",
    label: "Medium",
    priceDelta: 25,
    meta: { thickness: 1.5, periods: 2.5 },
  },
  {
    id: "hard",
    label: "Hard",
    priceDelta: 50,
    meta: { thickness: 2.4, periods: 3.0 },
  },
];

/** None / Little / Medium / Max — each step above None +$0.25 */
export const DEFAULT_TEXTURE: OptionChoice[] = [
  {
    id: "none",
    label: "None",
    priceDelta: 0,
    meta: { toggle: false, amount: 0 },
  },
  {
    id: "little",
    label: "Little",
    priceDelta: 25,
    meta: { toggle: true, amount: 25 },
  },
  {
    id: "medium",
    label: "Medium",
    priceDelta: 50,
    meta: { toggle: true, amount: 50 },
  },
  {
    id: "max",
    label: "Max",
    priceDelta: 75,
    meta: { toggle: true, amount: 90 },
  },
];
