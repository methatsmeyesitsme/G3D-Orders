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
import { listLines, listStandaloneProducts } from "@/lib/store.functions";
import type { Product, ProductLine } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";
import { FreeCanvas, FlowCanvas, TextEditor } from "@/components/preview-canvas";

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
  | `product:${string}`
  | `text:${string}`;

const MAX_HISTORY = 40;

function PreviewPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [layout, setLayout] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [standalone, setStandalone] = useState<Product[]>([]);
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
      const [home, catalogLines, standaloneProducts] = await Promise.all([
        getHomeLayout().catch(() => loadHomeLayoutClient()),
        listLines(),
        listStandaloneProducts().catch(() => [] as Product[]),
      ]);
      historyRef.current = [];
      setCanUndo(false);
      setSelected(null);
      setLayout(mergeHomeLayout(home));
      setLines(catalogLines);
      setStandalone(standaloneProducts);
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
    const positions = {
      ...prev.positions,
      lines: { ...prev.positions.lines },
      products: { ...(prev.positions.products || {}) },
    };
    if (key.startsWith("line:")) {
      positions.lines[key.slice(5)] = pos;
    } else if (key.startsWith("product:")) {
      positions.products[key.slice(8)] = pos;
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
    if (key.startsWith("product:")) {
      return (layout.positions.products || {})[key.slice(8)] ?? null;
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
    if (key.startsWith("product:")) {
      const id = key.slice(8);
      const visible = standalone.filter((p) => !isHidden(layoutRef.current, `product:${p.id}`));
      const idx = Math.max(0, visible.findIndex((p) => p.id === id));
      const baseY = 56 + Math.ceil(orderedLines.length / 2) * 22;
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      return { x: 4 + col * 48, y: baseY + row * 22 };
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
          <div className="flex items-center gap-1 rounded-md border border-border px-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              title="Shorter canvas"
              onClick={() =>
                patch({
                  canvasHeightPx: Math.max(
                    480,
                    (layoutRef.current.canvasHeightPx ?? 720) - 120,
                  ),
                })
              }
            >
              −
            </Button>
            <span
              className="min-w-[4.5rem] text-center text-xs tabular-nums text-muted-foreground"
              title="Canvas height"
            >
              {layout.canvasHeightPx ?? 720}px
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              title="Taller canvas"
              onClick={() =>
                patch({
                  canvasHeightPx: Math.min(
                    3200,
                    (layoutRef.current.canvasHeightPx ?? 720) + 120,
                  ),
                })
              }
            >
              +
            </Button>
          </div>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Add text, click to select, Delete to remove, drag to move (including standalone products). Use − / + to make the canvas shorter or taller. Undo reverses the last change. Save writes the live store layout.
      </p>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div
          ref={canvasRef}
          className="relative overflow-hidden rounded-xl border border-border bg-background"
          style={{ minHeight: layout.canvasHeightPx ?? 720 }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {layout.freeLayout ? (
            <FreeCanvas
              layout={layout}
              lines={orderedLines}
              standalone={standalone.filter((p) => !isHidden(layout, `product:${p.id}`))}
              selected={selected}
              activeDrag={activeDrag}
              onSelect={setSelected}
              onPointerDown={onPointerDown}
            />
          ) : (
            <FlowCanvas
              layout={layout}
              lines={orderedLines}
              standalone={standalone.filter((p) => !isHidden(layout, `product:${p.id}`))}
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
