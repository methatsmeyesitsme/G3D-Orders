import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OptionChoice, OptionMeta } from "@/lib/types";

function slugPart(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "option"
  );
}

export function OptionEditor({
  title,
  hint,
  options,
  onChange,
  showHex,
  showG3d,
  kind,
}: {
  title: string;
  hint?: string;
  options: OptionChoice[];
  onChange: (next: OptionChoice[]) => void;
  showHex?: boolean;
  showG3d?: boolean;
  kind?: "firmness" | "texture";
}) {
  function patch(index: number, partial: Partial<OptionChoice>) {
    onChange(
      options.map((item, i) => (i === index ? { ...item, ...partial } : item)),
    );
  }

  function patchMeta(index: number, key: keyof OptionMeta, value: number | boolean) {
    const current = options[index];
    patch(index, { meta: { ...current.meta, [key]: value } });
  }

  return (
    <section className="space-y-3 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {hint ? (
            <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([
              ...options,
              {
                id: slugPart(`${title}-${options.length + 1}`),
                label: "New option",
                priceDelta: 0,
                ...(showHex ? { hex: "#888888" } : {}),
                ...(showG3d ? { g3dpgValue: "" } : {}),
                ...(kind === "firmness"
                  ? { meta: { thickness: 1.5, periods: 2.5 } }
                  : {}),
                ...(kind === "texture"
                  ? { meta: { toggle: true, amount: 50 } }
                  : {}),
              },
            ])
          }
        >
          <Plus /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div
            key={`${option.id}-${index}`}
            className="grid grid-cols-2 gap-2 rounded-lg bg-secondary/60 p-3 sm:grid-cols-12"
          >
            <div className="col-span-2 sm:col-span-3">
              <Label>Label</Label>
              <Input
                value={option.label}
                onChange={(e) => patch(index, { label: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Id</Label>
              <Input
                value={option.id}
                onChange={(e) => patch(index, { id: slugPart(e.target.value) })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Price ± cents</Label>
              <Input
                type="number"
                value={option.priceDelta}
                onChange={(e) =>
                  patch(index, { priceDelta: Number(e.target.value) || 0 })
                }
              />
            </div>
            {showHex ? (
              <div className="sm:col-span-2">
                <Label>Hex</Label>
                <Input
                  value={option.hex ?? ""}
                  onChange={(e) => patch(index, { hex: e.target.value })}
                />
              </div>
            ) : null}
            {showG3d ? (
              <div className="sm:col-span-2">
                <Label>G3DPG value</Label>
                <Input
                  value={option.g3dpgValue ?? ""}
                  onChange={(e) => patch(index, { g3dpgValue: e.target.value })}
                />
              </div>
            ) : null}
            {kind === "firmness" ? (
              <>
                <div className="sm:col-span-2">
                  <Label>Thickness mm</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={Number(option.meta?.thickness ?? 1.5)}
                    onChange={(e) =>
                      patchMeta(index, "thickness", Number(e.target.value) || 1.5)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Periods</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={Number(option.meta?.periods ?? 2.5)}
                    onChange={(e) =>
                      patchMeta(index, "periods", Number(e.target.value) || 2.5)
                    }
                  />
                </div>
              </>
            ) : null}
            {kind === "texture" ? (
              <>
                <div className="sm:col-span-2">
                  <Label>Amount 0–100</Label>
                  <Input
                    type="number"
                    value={Number(option.meta?.amount ?? 0)}
                    onChange={(e) =>
                      patchMeta(index, "amount", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <label className="col-span-2 flex items-end gap-2 text-sm sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(option.meta?.toggle)}
                    onChange={(e) => patchMeta(index, "toggle", e.target.checked)}
                  />
                  Enable texture
                </label>
              </>
            ) : null}
            <div className="col-span-2 flex items-end justify-end sm:col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove option"
                onClick={() => onChange(options.filter((_, i) => i !== index))}
              >
                <Trash2 />
              </Button>
            </div>
            {showHex ? (
              <div className="col-span-2 sm:col-span-8">
                <Label>Swatch photo URL</Label>
                <Input
                  value={option.imageUrl ?? ""}
                  onChange={(e) => patch(index, { imageUrl: e.target.value })}
                />
              </div>
            ) : null}
          </div>
        ))}
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">No options yet.</p>
        ) : null}
      </div>
    </section>
  );
}
