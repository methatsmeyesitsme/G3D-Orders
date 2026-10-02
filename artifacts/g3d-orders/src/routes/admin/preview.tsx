import { createFileRoute } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MediaFrame } from "@/components/media-frame";
import { useAdminAccess } from "@/lib/admin-access-store";
import {
  DEFAULT_HOME_LAYOUT,
  mergeHomeLayout,
  orderLines,
  posStyle,
  textStyleCss,
  type HomeLayout,
  type LayoutPos,
  type TextStyle,
} from "@/lib/home-layout";
import {
  clearHomeLayoutClient,
  getHomeLayout,
  loadHomeLayoutClient,
  saveHomeLayout,
  saveHomeLayoutClient,
} from "@/lib/home-layout.functions";
import { listLines } from "@/lib/store.functions";
import type { ProductLine } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/preview")({
  component: PreviewPage,
});

type DragKey =
  | "heroEyebrow"
  | "heroTitle"
  | "heroBody"
  | "heroMedia"
  | "linesHeading"
  | `line:${string}`;

function PreviewPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [layout, setLayout] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    key: DragKey;
    startX: number;
    startY: number;
    origin: LayoutPos;
  } | null>(null);
  const [activeDrag, setActiveDrag] = useState<DragKey | null>(null);

  const load = useCallback(async () => {
    try {
      const [home, catalogLines] = await Promise.all([
        getHomeLayout().catch(() => loadHomeLayoutClient()),
        listLines(),
      ]);
      setLayout(mergeHomeLayout(home));
      setLines(catalogLines);
    } catch (e) {
      setLayout(loadHomeLayoutClient());
      toast.error(e instanceof Error ? e.message : "Could not load preview");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const orderedLines = useMemo(
    () => orderLines(lines, layout.lineOrder),
    [lines, layout.lineOrder],
  );

  function patch(partial: Partial<HomeLayout>) {
    setLayout((prev) => mergeHomeLayout({ ...prev, ...partial }));
  }

  function patchStyle(
    key: keyof Pick<
      HomeLayout,
      | "heroEyebrowStyle"
      | "heroTitleStyle"
      | "heroBodyStyle"
      | "linesHeadingStyle"
    >,
    style: Partial<TextStyle>,
  ) {
    setLayout((prev) =>
      mergeHomeLayout({
        ...prev,
        [key]: { ...prev[key], ...style },
      }),
    );
  }

  function setPos(key: DragKey, pos: LayoutPos) {
    setLayout((prev) => {
      const positions = { ...prev.positions, lines: { ...prev.positions.lines } };
      if (key.startsWith("line:")) {
        const id = key.slice(5);
        positions.lines[id] = pos;
      } else {
        (positions as any)[key] = pos;
      }
      return mergeHomeLayout({ ...prev, freeLayout: true, positions });
    });
  }

  function getPos(key: DragKey): LayoutPos | null {
    if (key.startsWith("line:")) {
      return layout.positions.lines[key.slice(5)] ?? null;
    }
    return (layout.positions as any)[key] ?? null;
  }

  function defaultPosFor(key: DragKey): LayoutPos {
    // Sensible starting points when first picking up an item
    if (key === "heroEyebrow") return { x: 4, y: 4 };
    if (key === "heroTitle") return { x: 4, y: 10 };
    if (key === "heroBody") return { x: 4, y: 28 };
    if (key === "heroMedia") return { x: 52, y: 4 };
    if (key === "linesHeading") return { x: 4, y: 48 };
    // line cards: stagger
    const id = key.slice(5);
    const idx = Math.max(0, orderedLines.findIndex((l) => l.id === id));
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    return { x: 4 + col * 48, y: 56 + row * 22 };
  }

  function onPointerDown(key: DragKey, e: ReactPointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const el = canvasRef.current;
    if (!el) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const origin = getPos(key) ?? defaultPosFor(key);
    if (!getPos(key)) setPos(key, origin);
    dragRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      origin,
    };
    setActiveDrag(key);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    const el = canvasRef.current;
    if (!drag || !el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    const x = Math.min(95, Math.max(0, drag.origin.x + dx));
    const y = Math.min(95, Math.max(0, drag.origin.y + dy));
    setPos(drag.key, { x, y });
  }

  function onPointerUp(e: ReactPointerEvent) {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    dragRef.current = null;
    setActiveDrag(null);
  }

  async function save() {
    setSaving(true);
    try {
      const next = mergeHomeLayout({
        ...layout,
        lineOrder: orderedLines.map((l) => l.id),
      });
      try {
        await saveHomeLayout({ data: { adminCode, layout: next } });
      } catch {
        saveHomeLayoutClient(next);
      }
      setLayout(next);
      toast.success("Home page layout saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function resetAll() {
    if (
      !window.confirm(
        "Reset the front page to default text, styles, and positions?",
      )
    ) {
      return;
    }
    const next = mergeHomeLayout(null);
    setLayout(next);
    clearHomeLayoutClient();
    try {
      await saveHomeLayout({ data: { adminCode, layout: next } });
    } catch {
      saveHomeLayoutClient(next);
    }
    toast.success("Reset to defaults");
  }

  const free = layout.freeLayout;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Preview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag any text or product card in the live preview to place it. Use
            Reset to restore the default layout.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void resetAll()}>
            Reset
          </Button>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save layout"}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,340px)_1fr]">
        <aside className="space-y-6 rounded-xl border border-border bg-card p-4">
          <TextBlockEditor
            label="Hero eyebrow"
            value={layout.heroEyebrow}
            onChange={(v) => patch({ heroEyebrow: v })}
            style={layout.heroEyebrowStyle}
            onStyle={(s) => patchStyle("heroEyebrowStyle", s)}
          />
          <TextBlockEditor
            label="Hero title"
            value={layout.heroTitle}
            onChange={(v) => patch({ heroTitle: v })}
            style={layout.heroTitleStyle}
            onStyle={(s) => patchStyle("heroTitleStyle", s)}
            multiline
          />
          <TextBlockEditor
            label="Hero body"
            value={layout.heroBody}
            onChange={(v) => patch({ heroBody: v })}
            style={layout.heroBodyStyle}
            onStyle={(s) => patchStyle("heroBodyStyle", s)}
            multiline
          />
          <TextBlockEditor
            label="Product lines heading"
            value={layout.linesHeading}
            onChange={(v) => patch({ linesHeading: v })}
            style={layout.linesHeadingStyle}
            onStyle={(s) => patchStyle("linesHeadingStyle", s)}
          />

          {!free ? (
            <fieldset className="space-y-2">
              <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Flow placement
              </legend>
              <label className="flex items-center gap-2 text-sm">
                Hero layout
                <select
                  className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                  value={layout.heroPlacement}
                  onChange={(e) =>
                    patch({
                      heroPlacement: e.target
                        .value as HomeLayout["heroPlacement"],
                    })
                  }
                >
                  <option value="text-left">Text left · media right</option>
                  <option value="text-right">Media left · text right</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                Line grid columns
                <select
                  className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                  value={layout.linesGridCols}
                  onChange={(e) =>
                    patch({
                      linesGridCols: Number(e.target.value) as 1 | 2 | 3,
                    })
                  }
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </label>
              <p className="text-xs text-muted-foreground">
                Drag anything in the preview to switch into free layout mode.
              </p>
            </fieldset>
          ) : (
            <p className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Free layout is on. Drag text and product cards in the canvas.
              Reset clears all custom positions.
            </p>
          )}
        </aside>

        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-border)]">
          <div className="border-b border-border bg-card px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live front page — drag items to move
          </div>
          <div
            ref={canvasRef}
            className={cn(
              "relative min-h-[720px] select-none p-4 sm:p-6",
              free && "bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] bg-[length:16px_16px]",
            )}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {free ? (
              <FreeCanvas
                layout={layout}
                orderedLines={orderedLines}
                activeDrag={activeDrag}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              />
            ) : (
              <FlowCanvas
                layout={layout}
                orderedLines={orderedLines}
                activeDrag={activeDrag}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function dragChrome(active: boolean) {
  return cn(
    "cursor-grab touch-none active:cursor-grabbing",
    active && "z-20 ring-2 ring-ring",
  );
}

function FreeCanvas({
  layout,
  orderedLines,
  activeDrag,
  onPointerDown,
  onPointerUp,
}: {
  layout: HomeLayout;
  orderedLines: ProductLine[];
  activeDrag: DragKey | null;
  onPointerDown: (key: DragKey, e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
}) {
  const p = layout.positions;
  return (
    <>
      <div
        className={cn("max-w-[42%]", dragChrome(activeDrag === "heroEyebrow"))}
        style={posStyle(p.heroEyebrow ?? { x: 4, y: 4 })}
        onPointerDown={(e) => onPointerDown("heroEyebrow", e)}
        onPointerUp={onPointerUp}
      >
        <p
          className="uppercase tracking-[0.28em] text-accent"
          style={textStyleCss(layout.heroEyebrowStyle)}
        >
          {layout.heroEyebrow}
        </p>
      </div>
      <div
        className={cn("max-w-[42%]", dragChrome(activeDrag === "heroTitle"))}
        style={posStyle(p.heroTitle ?? { x: 4, y: 10 })}
        onPointerDown={(e) => onPointerDown("heroTitle", e)}
        onPointerUp={onPointerUp}
      >
        <h1 className="leading-[1.05]" style={textStyleCss(layout.heroTitleStyle)}>
          {layout.heroTitle}
        </h1>
      </div>
      <div
        className={cn("max-w-[42%]", dragChrome(activeDrag === "heroBody"))}
        style={posStyle(p.heroBody ?? { x: 4, y: 28 })}
        onPointerDown={(e) => onPointerDown("heroBody", e)}
        onPointerUp={onPointerUp}
      >
        <p className="text-muted-foreground" style={textStyleCss(layout.heroBodyStyle)}>
          {layout.heroBody}
        </p>
      </div>
      <div
        className={cn(
          "w-[42%] overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
          dragChrome(activeDrag === "heroMedia"),
        )}
        style={posStyle(p.heroMedia ?? { x: 52, y: 4 })}
        onPointerDown={(e) => onPointerDown("heroMedia", e)}
        onPointerUp={onPointerUp}
      >
        <div className="aspect-[16/10]">
          {orderedLines[0]?.coverImageUrl || orderedLines[0]?.coverGifUrl ? (
            <MediaFrame
              src={
                orderedLines[0].coverGifUrl || orderedLines[0].coverImageUrl
              }
              kind={orderedLines[0].coverGifUrl ? "gif" : "image"}
              alt={orderedLines[0].name}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">
              Cover media
            </div>
          )}
        </div>
      </div>
      <div
        className={cn("max-w-[50%]", dragChrome(activeDrag === "linesHeading"))}
        style={posStyle(p.linesHeading ?? { x: 4, y: 48 })}
        onPointerDown={(e) => onPointerDown("linesHeading", e)}
        onPointerUp={onPointerUp}
      >
        <h2 style={textStyleCss(layout.linesHeadingStyle)}>
          {layout.linesHeading}
        </h2>
      </div>
      {orderedLines.map((line, idx) => {
        const key = `line:${line.id}` as DragKey;
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const fallback = { x: 4 + col * 48, y: 56 + row * 22 };
        return (
          <div
            key={line.id}
            className={cn(
              "w-[44%] overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
              dragChrome(activeDrag === key),
            )}
            style={posStyle(p.lines[line.id] ?? fallback)}
            onPointerDown={(e) => onPointerDown(key, e)}
            onPointerUp={onPointerUp}
            title="Drag to move"
          >
            <div className="aspect-[16/10] bg-paper">
              <MediaFrame src={line.coverImageUrl} alt={line.name} />
            </div>
            <div className="space-y-1 p-3">
              <p className="font-display text-base font-semibold">{line.name}</p>
              <p className="text-xs text-muted-foreground">{line.tagline}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}

function FlowCanvas({
  layout,
  orderedLines,
  activeDrag,
  onPointerDown,
  onPointerUp,
}: {
  layout: HomeLayout;
  orderedLines: ProductLine[];
  activeDrag: DragKey | null;
  onPointerDown: (key: DragKey, e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
}) {
  return (
    <>
      <section
        className={cn(
          "grid gap-8 lg:items-end",
          layout.heroPlacement === "text-right"
            ? "lg:grid-cols-[0.9fr_1.1fr]"
            : "lg:grid-cols-[1.1fr_0.9fr]",
        )}
      >
        <div
          className={cn(layout.heroPlacement === "text-right" && "lg:order-2")}
        >
          <p
            className={cn(
              "uppercase tracking-[0.28em] text-accent",
              dragChrome(activeDrag === "heroEyebrow"),
            )}
            style={textStyleCss(layout.heroEyebrowStyle)}
            onPointerDown={(e) => onPointerDown("heroEyebrow", e)}
            onPointerUp={onPointerUp}
          >
            {layout.heroEyebrow}
          </p>
          <h1
            className={cn(
              "mt-4 max-w-xl leading-[1.05]",
              dragChrome(activeDrag === "heroTitle"),
            )}
            style={textStyleCss(layout.heroTitleStyle)}
            onPointerDown={(e) => onPointerDown("heroTitle", e)}
            onPointerUp={onPointerUp}
          >
            {layout.heroTitle}
          </h1>
          <p
            className={cn(
              "mt-5 max-w-md text-muted-foreground",
              dragChrome(activeDrag === "heroBody"),
            )}
            style={textStyleCss(layout.heroBodyStyle)}
            onPointerDown={(e) => onPointerDown("heroBody", e)}
            onPointerUp={onPointerUp}
          >
            {layout.heroBody}
          </p>
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
            layout.heroPlacement === "text-right" && "lg:order-1",
            dragChrome(activeDrag === "heroMedia"),
          )}
          onPointerDown={(e) => onPointerDown("heroMedia", e)}
          onPointerUp={onPointerUp}
        >
          <div className="aspect-[16/10]">
            {orderedLines[0]?.coverImageUrl || orderedLines[0]?.coverGifUrl ? (
              <MediaFrame
                src={
                  orderedLines[0].coverGifUrl || orderedLines[0].coverImageUrl
                }
                kind={orderedLines[0].coverGifUrl ? "gif" : "image"}
                alt={orderedLines[0].name}
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Cover media
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2
          className={cn("mb-6", dragChrome(activeDrag === "linesHeading"))}
          style={textStyleCss(layout.linesHeadingStyle)}
          onPointerDown={(e) => onPointerDown("linesHeading", e)}
          onPointerUp={onPointerUp}
        >
          {layout.linesHeading}
        </h2>
        <div
          className={cn(
            "grid gap-5",
            layout.linesGridCols === 1 && "grid-cols-1",
            layout.linesGridCols === 2 && "sm:grid-cols-2",
            layout.linesGridCols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {orderedLines.map((line) => {
            const key = `line:${line.id}` as DragKey;
            return (
              <div
                key={line.id}
                className={cn(
                  "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
                  dragChrome(activeDrag === key),
                )}
                onPointerDown={(e) => onPointerDown(key, e)}
                onPointerUp={onPointerUp}
                title="Drag to place freely"
              >
                <div className="aspect-[16/10] bg-paper">
                  <MediaFrame src={line.coverImageUrl} alt={line.name} />
                </div>
                <div className="space-y-1 p-4">
                  <p className="font-display text-lg font-semibold">
                    {line.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{line.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function TextBlockEditor({
  label,
  value,
  onChange,
  style,
  onStyle,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  style: TextStyle;
  onStyle: (s: Partial<TextStyle>) => void;
  multiline?: boolean;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </legend>
      {multiline ? (
        <textarea
          className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-muted-foreground">
          Font
          <select
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            value={style.fontFamily}
            onChange={(e) =>
              onStyle({
                fontFamily: e.target.value as TextStyle["fontFamily"],
              })
            }
          >
            <option value="display">Display</option>
            <option value="sans">Sans</option>
            <option value="mono">Mono</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Size (px)
          <input
            type="number"
            min={8}
            max={96}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            value={style.fontSizePx}
            onChange={(e) =>
              onStyle({ fontSizePx: Number(e.target.value) || 16 })
            }
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Weight
          <select
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            value={style.fontWeight}
            onChange={(e) => onStyle({ fontWeight: Number(e.target.value) })}
          >
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semibold</option>
            <option value={700}>Bold</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Color
          <input
            type="color"
            className="mt-1 h-9 w-full cursor-pointer rounded-md border border-input bg-background"
            value={style.color || "#1a1a1a"}
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
