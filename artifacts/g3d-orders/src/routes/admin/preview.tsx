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
  DEFAULT_CUSTOM_TEXT_STYLE,
  DEFAULT_HOME_LAYOUT,
  isHidden,
  mergeHomeLayout,
  newCustomTextId,
  orderLines,
  posStyle,
  textStyleCss,
  type CustomTextBlock,
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
  | `line:${string}`
  | `text:${string}`;

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
    if (key.startsWith("text:")) {
      const id = key.slice(5);
      const customTexts = prev.customTexts.map((block) =>
        block.id === id ? { ...block, pos } : block,
      );
      applyLayout(
        mergeHomeLayout({ ...prev, freeLayout: true, customTexts }),
        recordHistory,
      );
      return;
    }
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
    if (key.startsWith("text:")) {
      const id = key.slice(5);
      return layout.customTexts.find((b) => b.id === id)?.pos ?? null;
    }
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
    if (key.startsWith("line:")) {
      const id = key.slice(5);
      const idx = orderedLines.findIndex((l) => l.id === id);
      const col = Math.max(0, idx) % 2;
      const row = Math.floor(Math.max(0, idx) / 2);
      return { x: 4 + col * 48, y: 56 + row * 22 };
    }
    return { x: 12, y: 40 };
  }

  function addText() {
    const id = newCustomTextId();
    const block: CustomTextBlock = {
      id,
      text: "New text",
      style: { ...DEFAULT_CUSTOM_TEXT_STYLE },
      pos: { x: 12, y: 40 + (layoutRef.current.customTexts.length % 5) * 6 },
    };
    applyLayout(
      mergeHomeLayout({
        ...layoutRef.current,
        freeLayout: true,
        customTexts: [...layoutRef.current.customTexts, block],
      }),
    );
    setSelected(`text:${id}`);
  }

  function updateCustomText(id: string, patchBlock: Partial<CustomTextBlock>) {
    const customTexts = layoutRef.current.customTexts.map((block) =>
      block.id === id
        ? {
            ...block,
            ...patchBlock,
            style: { ...block.style, ...(patchBlock.style || {}) },
            pos: patchBlock.pos ? { ...block.pos, ...patchBlock.pos } : block.pos,
          }
        : block,
    );
    applyLayout(mergeHomeLayout({ ...layoutRef.current, customTexts }));
  }

  function deleteSelected() {
    if (!selected) return;
    const key = selected;
    if (key.startsWith("text:")) {
      const id = key.slice(5);
      applyLayout(
        mergeHomeLayout({
          ...layoutRef.current,
          customTexts: layoutRef.current.customTexts.filter((b) => b.id !== id),
        }),
      );
    } else {
      const hidden = Array.from(
        new Set([...layoutRef.current.hiddenElements, key]),
      );
      applyLayout(mergeHomeLayout({ ...layoutRef.current, hiddenElements: hidden }));
    }
    setSelected(null);
  }

  function undo() {
    const prev = historyRef.current.pop();
    if (!prev) return;
    setCanUndo(historyRef.current.length > 0);
    setLayout(mergeHomeLayout(prev));
    setSelected(null);
  }

  function resetLayout() {
    applyLayout(mergeHomeLayout(null));
    setSelected(null);
  }

  async function save() {
    setSaving(true);
    try {
      const next = mergeHomeLayout(layoutRef.current);
      saveHomeLayoutClient(next);
      if (adminCode) {
        await saveHomeLayout({ data: { adminCode, layout: next } });
      }
      setLayout(next);
      toast.success("Layout saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function onPointerDown(e: ReactPointerEvent, key: DragKey) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const origin = getPos(key) ?? defaultPosFor(key);
    // Record history at drag start so first move is undoable
    if (!getPos(key)) {
      setPos(key, origin, true);
    } else {
      pushHistory();
    }
    dragRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      origin,
      moved: false,
    };
    setActiveDrag(key);
    setSelected(key);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dx = ((e.clientX - drag.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.startY) / rect.height) * 100;
    if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) drag.moved = true;
    const pos: LayoutPos = {
      x: Math.min(95, Math.max(0, drag.origin.x + dx)),
      y: Math.min(95, Math.max(0, drag.origin.y + dy)),
    };
    setPos(drag.key, pos, false);
  }

  function onPointerUp() {
    dragRef.current = null;
    setActiveDrag(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-2xl font-semibold">Preview</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant="outline" onClick={addText} title="Add a text block">
            Add text
          </Button>
          <Button
            variant="outline"
            onClick={undo}
            disabled={!canUndo}
            title="Undo last change"
          >
            Undo
          </Button>
          <Button
            variant="outline"
            onClick={deleteSelected}
            disabled={!selected}
            title="Delete selected element"
          >
            Delete
          </Button>
          <Button variant="outline" onClick={resetLayout}>
            Reset
          </Button>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Add text, click to select, Delete to remove, drag to move. Undo reverses
        the last change. Save writes the live store layout.
      </p>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div
          ref={canvasRef}
          className="relative min-h-[720px] overflow-hidden rounded-xl border border-border bg-background"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {layout.freeLayout ? (
            <FreeCanvas
              layout={layout}
              lines={orderedLines}
              selected={selected}
              activeDrag={activeDrag}
              onSelect={setSelected}
              onPointerDown={onPointerDown}
            />
          ) : (
            <FlowCanvas
              layout={layout}
              lines={orderedLines}
              selected={selected}
              activeDrag={activeDrag}
              onSelect={setSelected}
              onPointerDown={onPointerDown}
            />
          )}
        </div>
        <aside className="space-y-4">
          <TextEditor
            label="Eyebrow"
            value={layout.heroEyebrow}
            style={layout.heroEyebrowStyle}
            onChange={(v) => patch({ heroEyebrow: v })}
            onStyle={(s) => patchStyle("heroEyebrowStyle", s)}
          />
          <TextEditor
            label="Title"
            value={layout.heroTitle}
            style={layout.heroTitleStyle}
            onChange={(v) => patch({ heroTitle: v })}
            onStyle={(s) => patchStyle("heroTitleStyle", s)}
          />
          <TextEditor
            label="Body"
            value={layout.heroBody}
            style={layout.heroBodyStyle}
            onChange={(v) => patch({ heroBody: v })}
            onStyle={(s) => patchStyle("heroBodyStyle", s)}
            multiline
          />
          <TextEditor
            label="Lines heading"
            value={layout.linesHeading}
            style={layout.linesHeadingStyle}
            onChange={(v) => patch({ linesHeading: v })}
            onStyle={(s) => patchStyle("linesHeadingStyle", s)}
          />
          {layout.customTexts.map((block) => (
            <TextEditor
              key={block.id}
              label={`Custom text (${block.id.slice(-5)})`}
              value={block.text}
              style={block.style}
              onChange={(v) => updateCustomText(block.id, { text: v })}
              onStyle={(s) => updateCustomText(block.id, { style: s })}
              multiline
              active={selected === `text:${block.id}`}
              onFocusSelect={() => setSelected(`text:${block.id}`)}
            />
          ))}
        </aside>
      </div>
    </div>
  );
}

function FreeCanvas(props: {
  layout: HomeLayout;
  lines: ProductLine[];
  selected: DragKey | null;
  activeDrag: DragKey | null;
  onSelect: (k: DragKey | null) => void;
  onPointerDown: (e: ReactPointerEvent, key: DragKey) => void;
}) {
  const { layout, lines, selected, activeDrag, onSelect, onPointerDown } = props;
  const p = layout.positions;
  const hidden = (k: string) => isHidden(layout, k);

  return (
    <div className="relative h-full min-h-[720px] w-full p-2">
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

function FlowCanvas(props: {
  layout: HomeLayout;
  lines: ProductLine[];
  selected: DragKey | null;
  activeDrag: DragKey | null;
  onSelect: (k: DragKey | null) => void;
  onPointerDown: (e: ReactPointerEvent, key: DragKey) => void;
}) {
  const { layout, lines, selected, activeDrag, onSelect, onPointerDown } = props;
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
              <h1 style={textStyleCss(layout.heroTitleStyle)}>{layout.heroTitle}</h1>
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
              "cursor-grab overflow-hidden rounded-xl border border-transparent bg-paper",
              selected === "heroMedia" && "border-accent",
            )}
            onClick={() => onSelect("heroMedia")}
            onPointerDown={(e) => onPointerDown(e, "heroMedia")}
          >
            <div className="flex aspect-[16/10] items-center justify-center text-sm text-muted-foreground">
              Hero media
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
          "grid gap-4",
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

function TextEditor(props: {
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
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-muted-foreground">
          Font
          <select
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
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
            max={120}
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            value={style.fontSizePx}
            onChange={(e) => onStyle({ fontSizePx: Number(e.target.value) || 16 })}
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Weight
          <input
            type="number"
            min={100}
            max={900}
            step={100}
            className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            value={style.fontWeight}
            onChange={(e) =>
              onStyle({ fontWeight: Number(e.target.value) || 400 })
            }
          />
        </label>
        <label className="text-xs text-muted-foreground">
          Color
          <input
            type="color"
            className="mt-1 h-8 w-full rounded-md border border-border bg-background"
            value={style.color || "#111111"}
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
