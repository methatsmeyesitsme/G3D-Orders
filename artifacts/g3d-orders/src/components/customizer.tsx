import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatMoney } from "@/lib/utils";
import type { OptionChoice, Product, Selection } from "@/lib/types";
import { unitPriceCents } from "@/lib/pricing";

function OptionGrid({
  label,
  options,
  value,
  onChange,
  swatches,
}: {
  label: string;
  options: OptionChoice[];
  value: string;
  onChange: (id: string) => void;
  swatches?: boolean;
}) {
  if (!options.length) return null;
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </legend>
      <div className={cn("flex flex-wrap gap-2", swatches && "gap-3")}>
        {options.map((option) => {
          const selected = option.id === value;
          if (swatches) {
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange(option.id)}
                className={cn(
                  "relative size-11 rounded-full border border-border",
                  selected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
                )}
                style={{ background: option.hex ?? "var(--muted)" }}
                aria-pressed={selected}
                aria-label={option.label}
                title={option.label}
              />
            );
          }
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "min-h-11 rounded-md border px-3 text-sm",
                selected
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
              aria-pressed={selected}
            >
              <span>{option.label}</span>
              {option.priceDelta ? (
                <span className="ml-2 text-xs opacity-70">
                  {option.priceDelta > 0 ? "+" : ""}
                  {formatMoney(option.priceDelta)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {swatches ? (
        <p className="text-sm text-muted-foreground">
          {options.find((o) => o.id === value)?.label}
        </p>
      ) : null}
    </fieldset>
  );
}

export function Customizer({
  product,
  selection,
  onChange,
}: {
  product: Product;
  selection: Selection;
  onChange: (next: Selection) => void;
}) {
  const price = unitPriceCents(product, selection);
  const patch = (partial: Partial<Selection>) =>
    onChange({ ...selection, ...partial });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          maxLength={40}
          placeholder="Name on this piece"
          value={selection.personalization}
          onChange={(e) => patch({ personalization: e.target.value })}
          autoComplete="name"
        />
        <p className="text-xs text-muted-foreground">
          Required — used on the order.
        </p>
      </div>

      <OptionGrid
        label="Shape"
        options={product.shapes}
        value={selection.shape}
        onChange={(shape) => patch({ shape })}
      />
      <OptionGrid
        label="Color"
        options={product.colors}
        value={selection.color}
        onChange={(color) => patch({ color })}
        swatches
      />
      <OptionGrid
        label="Firmness"
        options={product.firmnessOptions}
        value={selection.firmness}
        onChange={(firmness) => patch({ firmness })}
      />
      {product.textureEnabled ? (
        <OptionGrid
          label="Texture"
          options={product.textureOptions}
          value={selection.texture}
          onChange={(texture) => patch({ texture })}
        />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="qty">Quantity</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Decrease quantity"
            onClick={() =>
              patch({ quantity: Math.max(1, selection.quantity - 1) })
            }
          >
            <Minus />
          </Button>
          <Input
            id="qty"
            className="w-20 text-center tabular-nums"
            type="number"
            min={1}
            max={99}
            value={selection.quantity}
            onChange={(e) =>
              patch({
                quantity: Math.max(1, Math.min(99, Number(e.target.value) || 1)),
              })
            }
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Increase quantity"
            onClick={() =>
              patch({ quantity: Math.min(99, selection.quantity + 1) })
            }
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-border pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Price
          </p>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {formatMoney(price * selection.quantity)}
          </p>
          {selection.quantity > 1 ? (
            <p className="text-sm text-muted-foreground tabular-nums">
              {formatMoney(price)} each
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
