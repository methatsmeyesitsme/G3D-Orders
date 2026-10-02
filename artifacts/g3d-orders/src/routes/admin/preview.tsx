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
  isHidden,
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

const MAX_HISTORY = 40;

function PreviewPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [layout, setLayout] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<DragKey | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HomeLayout[]>([]);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const dragRef = useRef<{
    key: DragKey;
    startX: number;
    startY: number;
    origin: LayoutPos;
    moved: boolean;
  } | null>(null);
  const [activeDrag, setActiveDrag] = useState<DragKey | null>(null);

  const pushHistory = useCallback(() => {
    const snap = mergeHomeLayout(
      JSON.parse(JSON.stringify(layoutRef.current)) as HomeLayout,
    );
    historyRef.current.push(snap);
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current.shift();
    }
    setCanUndo(historyRef.current.length > 0);
  }, []);

  const applyLayout = useCallback(
    (next: HomeLayout, recordHistory = true) => {
      if (recordHistory) pushHistory();
      const merged = mergeHomeLayout(next);
      setLayout(merged);
    },
    [pushHistory],
  );

  const load = useCallback(async () => {
    try {
      const [home, catalogLines] = await Promise.all([
        getHomeLayout().catch(() => loadHomeLayoutClient()),
        listLines(),
      ]);
      historyRef.current = [];
      setCanUndo(false);
      setSelected(null);
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
    () =>
      orderLines(lines, layout.lineOrder).filter(
        (l) => !isHidden(layout, `line:${l.id}`),
      ),
    [lines, layout],
  );

  function patch(partial: Partial<HomeLayout>) {
    applyLayout(mergeHomeLayout({ ...layoutRef.current, ...partial }));
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
    applyLayout(
      mergeHomeLayout({
        ...layoutRef.current,
        [key]: { ...layoutRef.current[key], ...style },
      }),
    );
  }

  function setPos(key: DragKey, pos: LayoutPos, recordHistory = false) {
    const prev = layoutRef.current;
    const positions = { ...prev.positions, lines: { ...prev.positions.lines } };
    if (key.startsWith("line:")) {
      positions.lines[key.slice(5)] = pos;
    } else {
      (positions as any)[key] = pos;
    }
    applyLayout(
      mergeHomeLayout({ ...prev, freeLayout: true, positions }),
      recordHistory,
    );
  }

  function getPos(key: DragKey): LayoutPos | null {
    if (key.startsWith("line:")) {
      return layout.positions.lines[key.slice(5)] ?? null;
    }
    return (layout.positions as any)[key] ?? null;
  }

  function defaultPosFor(key: DragKey): LayoutPos {
    if (key === "heroEyebrow") return { x: 4, y: 4 };
    if (key === "heroTitle") return { x: 4, y: 10 };
    if (key === "heroBody") return { x: 4, y: 28 };
    if (key === "heroMedia") return { x: 52, y: 4 };
    if (key === "linesHeading") return { x: 4, y: 48 };
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
    setSelected(key);
    const origin = getPos(key) ?? defaultPosFor(key);
    if (!getPos(key)) {
      // first free-move: record history once, then set initial pos without stacking
      pushHistory();
      setPos(key, origin, false);
    }
    dragRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      origin,
      moved: false,
    };
    setActiveDrag(key);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    const el = canvasRef.current;
    if (!drag || !el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dxPx = e.clientX - drag.startX;
    const dyPx = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dxPx, dyPx) < 4) return;
    if (!drag.moved) {
      // commit history once at start of actual drag (if not already from first free pos)
      drag.moved = true;
    }
    const dx = (dxPx / rect.width) * 100;
    const dy = (dyPx / rect.height) * 100;
    const x = Math.min(95, Math.max(0, drag.origin.x + dx));
    const y = Math.min(95, Math.max(0, drag.origin.y + dy));
    setPos(drag.key, { x, y }, false);
  }

  function onPointerUp(e: ReactPointerEvent) {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const drag = dragRef.current;
    if (drag?.moved) {
      // position already applied; history was pushed at drag start via first free or we need one
      // If origin had a prior pos, push history once at end is too late — push at start of move instead
    }
    dragRef.current = null;
    setActiveDrag(null);
  }

  function undo() {
    const prev = historyRef.current.pop();
    if (!prev) {
      setCanUndo(false);
      return;
    }
    setLayout(mergeHomeLayout(prev));
    setSelected(null);
    setCanUndo(historyRef.current.length > 0);
    toast.message("Undid last change");
  }

  function deleteSelected() {
    if (!selected) return;
    const prev = layoutRef.current;
    const nextHidden = prev.hiddenElements.includes(selected)
      ? prev.hiddenElements
      : [...prev.hiddenElements, selected];
    applyLayout(mergeHomeLayout({ ...prev, hiddenElements: nextHidden }));
    setSelected(null);
    toast.success("Removed from front page (Save to keep)");
  }

  async function save() {
    setSaving(true);
    try {
      const next = mergeHomeLayout({
        ...layoutRef.current,
        lineOrder: orderLines(lines, layoutRef.current.lineOrder).map(
          (l) => l.id,
        ),
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
    pushHistory();
    const next = mergeHomeLayout(null);
    setLayout(next);
    setSelected(null);
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
            Click an item to select it, then Delete. Drag to move. Undo reverses
            the last change.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={undo}
            disabled={!canUndo}
            title="Undo last change"
          >
            Undo
          </Button>
          <Button
            variant="destructive"
            onClick={deleteSelected}
            disabled={!selected}
            title="Delete selected text or product"
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => void resetAll()}>
            Reset
          </Button>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save layout"}
          </Button>
        </div>
      </div>

      {selected ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {labelForKey(selected, lines)}
          </span>
          — drag to move, or press Delete to remove from the front page.
        </p>
      ) : null}

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
            </fieldset>
          ) : (
            <p className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              Free layout is on. Click items to select, drag to move, Delete to
              remove. Undo undoes the last step.
            </p>
          )}
        </aside>

        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-border)]">
          <div className="border-b border-border bg-card px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live front page — click to select, drag to move
          </div>
          <div
            ref={canvasRef}
            className={cn(
              "relative min-h-[720px] select-none p-4 sm:p-6",
              free &&
                "bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] bg-[length:16px_16px]",
            )}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={() => setSelected(null)}
          >
            {free ? (
              <FreeCanvas
                layout={layout}
                orderedLines={orderedLines}
                activeDrag={activeDrag}
                selected={selected}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
              />
            ) : (
              <FlowCanvas
                layout={layout}
                orderedLines={orderedLines}
                activeDrag={activeDrag}
                selected={selected}
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

function labelForKey(key: DragKey, lines: ProductLine[]) {
  if (key === "heroEyebrow") return "Hero eyebrow";
  if (key === "heroTitle") return "Hero title";
  if (key === "heroBody") return "Hero body";
  if (key === "heroMedia") return "Cover picture";
  if (key === "linesHeading") return "Product lines heading";
  if (key.startsWith("line:")) {
    const id = key.slice(5);
    return lines.find((l) => l.id === id)?.name ?? "Product line";
  }
  return key;
}

function dragChrome(active: boolean, selected: boolean) {
  return cn(
    "cursor-grab touch-none active:cursor-grabbing",
    active && "z-20 ring-2 ring-ring",
    selected && !active && "z-10 ring-2 ring-accent",
  );
}

function FreeCanvas({
  layout,
  orderedLines,
  activeDrag,
  selected,
  onPointerDown,
  onPointerUp,
}: {
  layout: HomeLayout;
  orderedLines: ProductLine[];
  activeDrag: DragKey | null;
  selected: DragKey | null;
  onPointerDown: (key: DragKey, e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
}) {
  const p = layout.positions;
  return (
    <>
      {!isHidden(layout, "heroEyebrow") ? (
        <div
          className={cn(
            "max-w-[42%]",
            dragChrome(activeDrag === "heroEyebrow", selected === "heroEyebrow"),
          )}
          style={posStyle(p.heroEyebrow ?? { x: 4, y: 4 })}
          onPointerDown={(e) => onPointerDown("heroEyebrow", e)}
          onPointerUp={onPointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            className="uppercase tracking-[0.28em] text-accent"
            style={textStyleCss(layout.heroEyebrowStyle)}
          >
            {layout.heroEyebrow}
          </p>
        </div>
      ) : null}
      {!isHidden(layout, "heroTitle") ? (
        <div
          className={cn(
            "max-w-[42%]",
            dragChrome(activeDrag === "heroTitle", selected === "heroTitle"),
          )}
          style={posStyle(p.heroTitle ?? { x: 4, y: 10 })}
          onPointerDown={(e) => onPointerDown("heroTitle", e)}
          onPointerUp={onPointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="leading-[1.05]" style={textStyleCss(layout.heroTitleStyle)}>
            {layout.heroTitle}
          </h1>
        </div>
      ) : null}
      {!isHidden(layout, "heroBody") ? (
        <div
          className={cn(
            "max-w-[42%]",
            dragChrome(activeDrag === "heroBody", selected === "heroBody"),
          )}
          style={posStyle(p.heroBody ?? { x: 4, y: 28 })}
          onPointerDown={(e) => onPointerDown("heroBody", e)}
          onPointerUp={onPointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-muted-foreground" style={textStyleCss(layout.heroBodyStyle)}>
            {layout.heroBody}
          </p>
        </div>
      ) : null}
      {!isHidden(layout, "heroMedia") ? (
        <div
          className={cn(
            "w-[42%] overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
            dragChrome(activeDrag === "heroMedia", selected === "heroMedia"),
          )}
          style={posStyle(p.heroMedia ?? { x: 52, y: 4 })}
          onPointerDown={(e) => onPointerDown("heroMedia", e)}
          onPointerUp={onPointerUp}
          onClick={(e) => e.stopPropagation()}
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
      ) : null}
      {!isHidden(layout, "linesHeading") ? (
        <div
          className={cn(
            "max-w-[50%]",
            dragChrome(
              activeDrag === "linesHeading",
              selected === "linesHeading",
            ),
          )}
          style={posStyle(p.linesHeading ?? { x: 4, y: 48 })}
          onPointerDown={(e) => onPointerDown("linesHeading", e)}
          onPointerUp={onPointerUp}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={textStyleCss(layout.linesHeadingStyle)}>
            {layout.linesHeading}
          </h2>
        </div>
      ) : null}
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
              dragChrome(activeDrag === key, selected === key),
            )}
            style={posStyle(p.lines[line.id] ?? fallback)}
            onPointerDown={(e) => onPointerDown(key, e)}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
            title="Click to select, drag to move"
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
  selected,
  onPointerDown,
  onPointerUp,
}: {
  layout: HomeLayout;
  orderedLines: ProductLine[];
  activeDrag: DragKey | null;
  selected: DragKey | null;
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
          {!isHidden(layout, "heroEyebrow") ? (
            <p
              className={cn(
                "uppercase tracking-[0.28em] text-accent",
                dragChrome(
                  activeDrag === "heroEyebrow",
                  selected === "heroEyebrow",
                ),
              )}
              style={textStyleCss(layout.heroEyebrowStyle)}
              onPointerDown={(e) => onPointerDown("heroEyebrow", e)}
              onPointerUp={onPointerUp}
              onClick={(e) => e.stopPropagation()}
            >
              {layout.heroEyebrow}
            </p>
          ) : null}
          {!isHidden(layout, "heroTitle") ? (
            <h1
              className={cn(
                "mt-4 max-w-xl leading-[1.05]",
                dragChrome(activeDrag === "heroTitle", selected === "heroTitle"),
              )}
              style={textStyleCss(layout.heroTitleStyle)}
              onPointerDown={(e) => onPointerDown("heroTitle", e)}
              onPointerUp={onPointerUp}
              onClick={(e) => e.stopPropagation()}
            >
              {layout.heroTitle}
            </h1>
          ) : null}
          {!isHidden(layout, "heroBody") ? (
            <p
              className={cn(
                "mt-5 max-w-md text-muted-foreground",
                dragChrome(activeDrag === "heroBody", selected === "heroBody"),
              )}
              style={textStyleCss(layout.heroBodyStyle)}
              onPointerDown={(e) => onPointerDown("heroBody", e)}
              onPointerUp={onPointerUp}
              onClick={(e) => e.stopPropagation()}
            >
              {layout.heroBody}
            </p>
          ) : null}
        </div>
        {!isHidden(layout, "heroMedia") ? (
          <div
            className={cn(
              "overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
              layout.heroPlacement === "text-right" && "lg:order-1",
              dragChrome(activeDrag === "heroMedia", selected === "heroMedia"),
            )}
            onPointerDown={(e) => onPointerDown("heroMedia", e)}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
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
        ) : null}
      </section>

      <section className="mt-12">
        {!isHidden(layout, "linesHeading") ? (
          <h2
            className={cn(
              "mb-6",
              dragChrome(
                activeDrag === "linesHeading",
                selected === "linesHeading",
              ),
            )}
            style={textStyleCss(layout.linesHeadingStyle)}
            onPointerDown={(e) => onPointerDown("linesHeading", e)}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
          >
            {layout.linesHeading}
          </h2>
        ) : null}
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
                  dragChrome(activeDrag === key, selected === key),
                )}
                onPointerDown={(e) => onPointerDown(key, e)}
                onPointerUp={onPointerUp}
                onClick={(e) => e.stopPropagation()}
                title="Click to select"
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
