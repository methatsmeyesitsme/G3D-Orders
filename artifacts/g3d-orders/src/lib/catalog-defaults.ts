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

export const DEFAULT_FIRMNESS: OptionChoice[] = [
  {
    id: "super-soft",
    label: "Super Soft",
    priceDelta: 0,
    meta: { thickness: 0.8, periods: 2.0 },
  },
  {
    id: "soft",
    label: "Soft",
    priceDelta: 0,
    meta: { thickness: 1.2, periods: 2.2 },
  },
  {
    id: "medium",
    label: "Medium",
    priceDelta: 200,
    meta: { thickness: 1.5, periods: 2.5 },
  },
  {
    id: "firm",
    label: "Firm",
    priceDelta: 300,
    meta: { thickness: 2.1, periods: 2.8 },
  },
  {
    id: "super-firm",
    label: "Super Firm",
    priceDelta: 500,
    meta: { thickness: 2.8, periods: 3.2 },
  },
];

export const DEFAULT_TEXTURE: OptionChoice[] = [
  {
    id: "none",
    label: "Smooth",
    priceDelta: 0,
    meta: { toggle: false, amount: 0 },
  },
  {
    id: "light",
    label: "Light grain",
    priceDelta: 100,
    meta: { toggle: true, amount: 25 },
  },
  {
    id: "moderate",
    label: "Moderate",
    priceDelta: 200,
    meta: { toggle: true, amount: 50 },
  },
  {
    id: "heavy",
    label: "Heavy grain",
    priceDelta: 400,
    meta: { toggle: true, amount: 85 },
  },
];
