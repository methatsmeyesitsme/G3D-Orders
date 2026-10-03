import type { PointerEvent as ReactPointerEvent } from "react";
import { MediaFrame } from "@/components/media-frame";
import {
  isHidden,
  posStyle,
  textStyleCss,
  type HomeLayout,
  type LayoutPos,
  type TextStyle,
} from "@/lib/home-layout";
import type { Product, ProductLine } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";

type DragKey =
  | "heroEyebrow"
  | "heroTitle"
  | "heroBody"
  | "heroMedia"
  | "linesHeading"
  | `line:${string}`
  | `product:${string}`
  | `text:${string}`;

export function FreeCanvas(props: {
  layout: HomeLayout;
  lines: ProductLine[];
  standalone: Product[];
  selected: DragKey | null;
  activeDrag: DragKey | null;
  onSelect: (k: DragKey | null) => void;
  onPointerDown: (e: ReactPointerEvent, key: DragKey) => void;
}) {
  const { layout, lines, standalone, selected, activeDrag, onSelect, onPointerDown } = props;
  const p = layout.positions;
  const productPos = p.products || {};
  const hidden = (k: string) => isHidden(layout, k);

  return (
    <div className="relative h-full w-full p-2" style={{ minHeight: layout.canvasHeightPx ?? 720 }}>
      {!hidden("heroEyebrow") ? (
        <DragItem
          k="heroEyebrow"
          selected={selected}
          active={activeDrag}
          pos={p.heroEyebrow ?? { x: 4, y: 4 }}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        >
          <p
            className="uppercase tracking-[0.28em] text-accent"
            style={textStyleCss(layout.heroEyebrowStyle)}
          >
            {layout.heroEyebrow}
          </p>
        </DragItem>
      ) : null}
      {!hidden("heroTitle") ? (
        <DragItem
          k="heroTitle"
          selected={selected}
          active={activeDrag}
          pos={p.heroTitle ?? { x: 4, y: 10 }}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        >
          <h1 className="leading-[1.05]" style={textStyleCss(layout.heroTitleStyle)}>
            {layout.heroTitle}
          </h1>
        </DragItem>
      ) : null}
      {!hidden("heroBody") ? (
        <DragItem
          k="heroBody"
          selected={selected}
          active={activeDrag}
          pos={p.heroBody ?? { x: 4, y: 28 }}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        >
          <p
            className="text-muted-foreground"
            style={textStyleCss(layout.heroBodyStyle)}
          >
            {layout.heroBody}
          </p>
        </DragItem>
      ) : null}
      {!hidden("heroMedia") ? (
        <DragItem
          k="heroMedia"
          selected={selected}
          active={activeDrag}
          pos={p.heroMedia ?? { x: 52, y: 4 }}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
          wide
        >
          <div className="aspect-[16/10] overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]">
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Hero media
            </div>
          </div>
        </DragItem>
      ) : null}
      {!hidden("linesHeading") ? (
        <DragItem
          k="linesHeading"
          selected={selected}
          active={activeDrag}
          pos={p.linesHeading ?? { x: 4, y: 48 }}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        >
          <h2 style={textStyleCss(layout.linesHeadingStyle)}>{layout.linesHeading}</h2>
        </DragItem>
      ) : null}
      {lines.map((line, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const fallback = { x: 4 + col * 48, y: 56 + row * 22 };
        return (
          <DragItem
            key={line.id}
            k={`line:${line.id}`}
            selected={selected}
            active={activeDrag}
            pos={p.lines[line.id] ?? fallback}
            onSelect={onSelect}
            onPointerDown={onPointerDown}
            wide
          >
            <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
              <div className="aspect-[16/10] bg-paper">
                <MediaFrame src={line.coverImageUrl} alt={line.name} />
              </div>
              <div className="space-y-1 p-3">
                <p className="font-display text-lg font-semibold">{line.name}</p>
                <p className="text-sm text-muted-foreground">{line.tagline}</p>
              </div>
            </div>
          </DragItem>
        );
      })}
      {standalone.map((product, idx) => {
        const baseY = 56 + Math.ceil(lines.length / 2) * 22;
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const fallback = { x: 4 + col * 48, y: baseY + row * 22 };
        return (
          <DragItem
            key={product.id}
            k={`product:${product.id}`}
            selected={selected}
            active={activeDrag}
            pos={productPos[product.id] ?? fallback}
            onSelect={onSelect}
            onPointerDown={onPointerDown}
            wide
          >
            <div className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]">
              <div className="aspect-[16/10] bg-paper">
                <MediaFrame src={product.imageUrl} alt={product.name} />
              </div>
              <div className="space-y-1 p-3">
                <p className="font-display text-lg font-semibold">{product.name}</p>
                <p className="text-sm tabular-nums text-muted-foreground">
                  From {formatMoney(product.basePriceCents)}
                </p>
              </div>
            </div>
          </DragItem>
        );
      })}
      {layout.customTexts
        .filter((b) => !hidden(`text:${b.id}`))
        .map((block) => (
          <DragItem
            key={block.id}
            k={`text:${block.id}`}
            selected={selected}
            active={activeDrag}
            pos={block.pos}
            onSelect={onSelect}
            onPointerDown={onPointerDown}
          >
            <p style={textStyleCss(block.style)}>{block.text}</p>
          </DragItem>
        ))}
    </div>
  );
}

export function FlowCanvas(props: {
  layout: HomeLayout;
  lines: ProductLine[];
  standalone: Product[];
  selected: DragKey | null;
  activeDrag: DragKey | null;
  onSelect: (k: DragKey | null) => void;
  onPointerDown: (e: ReactPointerEvent, key: DragKey) => void;
}) {
  const { layout, lines, standalone, selected, activeDrag, onSelect, onPointerDown } = props;
  const hidden = (k: string) => isHidden(layout, k);
  const cols = layout.linesGridCols;

  return (
    <div className="space-y-8 p-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {!hidden("heroEyebrow") ? (
            <div
              className={cn(
                "cursor-grab rounded border border-transparent p-1",
                selected === "heroEyebrow" && "border-accent",
              )}
              onClick={() => onSelect("heroEyebrow")}
              onPointerDown={(e) => onPointerDown(e, "heroEyebrow")}
            >
              <p
                className="uppercase tracking-[0.28em] text-accent"
                style={textStyleCss(layout.heroEyebrowStyle)}
              >
                {layout.heroEyebrow}
              </p>
            </div>
          ) : null}
          {!hidden("heroTitle") ? (
            <div
              className={cn(
                "cursor-grab rounded border border-transparent p-1",
                selected === "heroTitle" && "border-accent",
              )}
              onClick={() => onSelect("heroTitle")}
              onPointerDown={(e) => onPointerDown(e, "heroTitle")}
            >
              <h1 className="leading-[1.05]" style={textStyleCss(layout.heroTitleStyle)}>
                {layout.heroTitle}
              </h1>
            </div>
          ) : null}
          {!hidden("heroBody") ? (
            <div
              className={cn(
                "cursor-grab rounded border border-transparent p-1",
                selected === "heroBody" && "border-accent",
              )}
              onClick={() => onSelect("heroBody")}
              onPointerDown={(e) => onPointerDown(e, "heroBody")}
            >
              <p
                className="text-muted-foreground"
                style={textStyleCss(layout.heroBodyStyle)}
              >
                {layout.heroBody}
              </p>
            </div>
          ) : null}
        </div>
        {!hidden("heroMedia") ? (
          <div
            className={cn(
              "cursor-grab rounded border border-transparent p-1",
              selected === "heroMedia" && "border-accent",
            )}
            onClick={() => onSelect("heroMedia")}
            onPointerDown={(e) => onPointerDown(e, "heroMedia")}
          >
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Hero media
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {!hidden("linesHeading") ? (
        <div
          className={cn(
            "cursor-grab rounded border border-transparent p-1",
            selected === "linesHeading" && "border-accent",
          )}
          onClick={() => onSelect("linesHeading")}
          onPointerDown={(e) => onPointerDown(e, "linesHeading")}
        >
          <h2 style={textStyleCss(layout.linesHeadingStyle)}>{layout.linesHeading}</h2>
        </div>
      ) : null}
      <div
        className={cn(
          "grid gap-5",
          cols === 1 && "grid-cols-1",
          cols === 2 && "sm:grid-cols-2",
          cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              "cursor-grab overflow-hidden rounded-xl border border-transparent bg-card shadow-[var(--shadow-border)]",
              selected === `line:${line.id}` && "border-accent",
            )}
            onClick={() => onSelect(`line:${line.id}`)}
            onPointerDown={(e) => onPointerDown(e, `line:${line.id}`)}
          >
            <div className="aspect-[16/10] bg-paper">
              <MediaFrame src={line.coverImageUrl} alt={line.name} />
            </div>
            <div className="space-y-1 p-3">
              <p className="font-display text-lg font-semibold">{line.name}</p>
              <p className="text-sm text-muted-foreground">{line.tagline}</p>
            </div>
          </div>
        ))}
        {standalone.map((product) => (
          <div
            key={product.id}
            className={cn(
              "cursor-grab overflow-hidden rounded-xl border border-transparent bg-card shadow-[var(--shadow-border)]",
              selected === `product:${product.id}` && "border-accent",
            )}
            onClick={() => onSelect(`product:${product.id}`)}
            onPointerDown={(e) => onPointerDown(e, `product:${product.id}`)}
          >
            <div className="aspect-[16/10] bg-paper">
              <MediaFrame src={product.imageUrl} alt={product.name} />
            </div>
            <div className="space-y-1 p-3">
              <p className="font-display text-lg font-semibold">{product.name}</p>
              <p className="text-sm tabular-nums text-muted-foreground">
                From {formatMoney(product.basePriceCents)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {layout.customTexts
        .filter((b) => !hidden(`text:${b.id}`))
        .map((block) => (
          <div
            key={block.id}
            className={cn(
              "cursor-grab rounded border border-transparent p-1",
              selected === `text:${block.id}` && "border-accent",
            )}
            onClick={() => onSelect(`text:${block.id}`)}
            onPointerDown={(e) => onPointerDown(e, `text:${block.id}`)}
          >
            <p style={textStyleCss(block.style)}>{block.text}</p>
          </div>
        ))}
    </div>
  );
}

function DragItem(props: {
  k: DragKey;
  selected: DragKey | null;
  active: DragKey | null;
  pos: LayoutPos;
  onSelect: (k: DragKey | null) => void;
  onPointerDown: (e: ReactPointerEvent, key: DragKey) => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const { k, selected, active, pos, onSelect, onPointerDown, children, wide } =
    props;
  return (
    <div
      className={cn(
        "absolute max-w-[42%] cursor-grab touch-none rounded border border-transparent p-1",
        wide && "w-[44%] max-w-none",
        selected === k && "border-accent ring-1 ring-accent/40",
        active === k && "cursor-grabbing opacity-90",
      )}
      style={posStyle(pos)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(k);
      }}
      onPointerDown={(e) => onPointerDown(e, k)}
    >
      {children}
    </div>
  );
}

export function TextEditor(props: {
  label: string;
  value: string;
  style: TextStyle;
  onChange: (v: string) => void;
  onStyle: (s: Partial<TextStyle>) => void;
  multiline?: boolean;
  active?: boolean;
  onFocusSelect?: () => void;
}) {
  const {
    label,
    value,
    style,
    onChange,
    onStyle,
    multiline,
    active,
    onFocusSelect,
  } = props;
  return (
    <fieldset
      className={cn(
        "space-y-2 rounded-lg border border-border p-3",
        active && "border-accent",
      )}
      onFocus={onFocusSelect}
    >
      <legend className="px-1 text-xs font-medium text-muted-foreground">
        {label}
      </legend>
      {multiline ? (
        <textarea
          className="min-h-[72px] w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <div className="flex flex-wrap gap-2">
        <label className="text-xs text-muted-foreground">
          Size
          <input
            type="number"
            className="ml-1 w-16 rounded border border-border bg-background px-1"
            value={style.fontSizePx}
            onChange={(e) => onStyle({ fontSizePx: Number(e.target.value) || 16 })}
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Weight
          <input
            type="number"
            className="ml-1 w-16 rounded border border-border bg-background px-1"
            value={style.fontWeight}
            onChange={(e) => onStyle({ fontWeight: Number(e.target.value) || 400 })}
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Color
          <input
            type="color"
            className="ml-1"
            value={style.color || "#000000"}
            onChange={(e) => onStyle({ color: e.target.value })}
          />
        </label>
      </div>
      {style.color ? (
        <button
          type="button"
          className="text-xs text-muted-foreground underline"
          onClick={() => onStyle({ color: "" })}
        >
          Use theme default color
        </button>
      ) : null}
    </fieldset>
  );
}
