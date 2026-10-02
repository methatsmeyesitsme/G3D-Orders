import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MediaFrame } from "@/components/media-frame";
import { useAdminAccess } from "@/lib/admin-access-store";
import {
  DEFAULT_HOME_LAYOUT,
  mergeHomeLayout,
  orderLines,
  textStyleCss,
  type HomeLayout,
  type TextStyle,
} from "@/lib/home-layout";
import {
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

function PreviewPage() {
  const adminCode = useAdminAccess((s) => s.code);
  const [layout, setLayout] = useState<HomeLayout>(DEFAULT_HOME_LAYOUT);
  const [lines, setLines] = useState<ProductLine[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

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

  function onDragStart(id: string) {
    setDragId(id);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const ids = orderedLines.map((l) => l.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) {
      setDragId(null);
      return;
    }
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    patch({ lineOrder: next });
    setDragId(null);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Preview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit the store front page: copy, fonts, colors, and drag product-line
            cards to reorder them.
          </p>
        </div>
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? "Saving…" : "Save layout"}
        </Button>
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

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Placement
            </legend>
            <label className="flex items-center gap-2 text-sm">
              Hero layout
              <select
                className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                value={layout.heroPlacement}
                onChange={(e) =>
                  patch({
                    heroPlacement: e.target.value as HomeLayout["heroPlacement"],
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

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Product line order
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag cards in the preview (or list below) to change order.
            </p>
            <ul className="mt-2 space-y-1">
              {orderedLines.map((line) => (
                <li
                  key={line.id}
                  draggable
                  onDragStart={() => onDragStart(line.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(line.id)}
                  className={cn(
                    "cursor-grab rounded-md border border-border bg-background px-3 py-2 text-sm active:cursor-grabbing",
                    dragId === line.id && "opacity-60",
                  )}
                >
                  {line.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-border)]">
          <div className="border-b border-border bg-card px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live front page
          </div>
          <div className="p-4 sm:p-6">
            <section
              className={cn(
                "grid gap-8 lg:items-end",
                layout.heroPlacement === "text-right"
                  ? "lg:grid-cols-[0.9fr_1.1fr]"
                  : "lg:grid-cols-[1.1fr_0.9fr]",
              )}
            >
              <div
                className={cn(
                  layout.heroPlacement === "text-right" && "lg:order-2",
                )}
              >
                <p style={textStyleCss(layout.heroEyebrowStyle)} className="uppercase tracking-[0.28em] text-accent">
                  {layout.heroEyebrow}
                </p>
                <h1
                  className="mt-4 max-w-xl leading-[1.05]"
                  style={textStyleCss(layout.heroTitleStyle)}
                >
                  {layout.heroTitle}
                </h1>
                <p
                  className="mt-5 max-w-md text-muted-foreground"
                  style={textStyleCss(layout.heroBodyStyle)}
                >
                  {layout.heroBody}
                </p>
              </div>
              <div
                className={cn(
                  "overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]",
                  layout.heroPlacement === "text-right" && "lg:order-1",
                )}
              >
                <div className="aspect-[16/10]">
                  {orderedLines[0]?.coverImageUrl || orderedLines[0]?.coverGifUrl ? (
                    <MediaFrame
                      src={
                        orderedLines[0].coverGifUrl ||
                        orderedLines[0].coverImageUrl
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
                className="mb-6"
                style={textStyleCss(layout.linesHeadingStyle)}
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
                {orderedLines.map((line) => (
                  <div
                    key={line.id}
                    draggable
                    onDragStart={() => onDragStart(line.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(line.id)}
                    className={cn(
                      "cursor-grab overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] active:cursor-grabbing",
                      dragId === line.id && "ring-2 ring-ring opacity-80",
                    )}
                    title="Drag to reorder"
                  >
                    <div className="aspect-[16/10] bg-paper">
                      <MediaFrame src={line.coverImageUrl} alt={line.name} />
                    </div>
                    <div className="space-y-1 p-4">
                      <p className="font-display text-lg font-semibold">
                        {line.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {line.tagline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
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
