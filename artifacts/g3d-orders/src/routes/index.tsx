import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { MediaFrame } from "@/components/media-frame";
import {
  orderLines,
  posStyle,
  textStyleCss,
  type HomeLayout,
} from "@/lib/home-layout";
import { getHomeLayout } from "@/lib/home-layout.functions";
import { listLines, getLineBySlug } from "@/lib/store.functions";
import { cn, formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [lines, layout] = await Promise.all([
      listLines(),
      getHomeLayout().catch(() => null),
    ]);
    const ordered = orderLines(lines, layout?.lineOrder ?? []);
    const featuredLine = ordered[0] ?? lines[0];
    const featured = featuredLine
      ? await getLineBySlug({ data: { slug: featuredLine.slug } })
      : null;
    return { lines: ordered, featured, layout: layout as HomeLayout | null };
  },
  component: Home,
});

function Home() {
  const { lines, featured, layout } = Route.useLoaderData();
  const cover = featured?.line.coverGifUrl || featured?.line.coverImageUrl;
  const L = layout;
  const free = Boolean(L?.freeLayout);

  const heroEyebrow = L?.heroEyebrow ?? "Product studio";
  const heroTitle = L?.heroTitle ?? "Lattice you can hold.";
  const heroBody =
    L?.heroBody ??
    "G3D Squish is printed to the options on the ticket. Shape, filament, yield, grain — then GO sends the same spec into G3DPG.";
  const linesHeading = L?.linesHeading ?? "Product lines";
  const placement = L?.heroPlacement ?? "text-left";
  const cols = L?.linesGridCols ?? 2;
  const p = L?.positions;

  if (free && p) {
    return (
      <SiteShell>
        <div className="relative mx-auto min-h-[720px] w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div
            className="max-w-[42%]"
            style={posStyle(p.heroEyebrow ?? { x: 4, y: 4 })}
          >
            <p
              className="uppercase tracking-[0.28em] text-accent"
              style={L ? textStyleCss(L.heroEyebrowStyle) : undefined}
            >
              {heroEyebrow}
            </p>
          </div>
          <div
            className="max-w-[42%]"
            style={posStyle(p.heroTitle ?? { x: 4, y: 10 })}
          >
            <h1
              className="leading-[1.05]"
              style={L ? textStyleCss(L.heroTitleStyle) : undefined}
            >
              {heroTitle}
            </h1>
          </div>
          <div
            className="max-w-[42%]"
            style={posStyle(p.heroBody ?? { x: 4, y: 28 })}
          >
            <p
              className="text-muted-foreground"
              style={L ? textStyleCss(L.heroBodyStyle) : undefined}
            >
              {heroBody}
            </p>
          </div>
          <div
            className="w-[42%] overflow-hidden rounded-xl shadow-[var(--shadow-border)]"
            style={posStyle(p.heroMedia ?? { x: 52, y: 4 })}
          >
            {cover ? (
              <div className="aspect-[16/10]">
                <MediaFrame
                  src={cover}
                  kind={featured?.line.coverGifUrl ? "gif" : "image"}
                  alt="G3D Squish"
                />
              </div>
            ) : null}
          </div>
          <div style={posStyle(p.linesHeading ?? { x: 4, y: 48 })}>
            <h2 style={L ? textStyleCss(L.linesHeadingStyle) : undefined}>
              {linesHeading}
            </h2>
          </div>
          {lines.map((line, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const fallback = { x: 4 + col * 48, y: 56 + row * 22 };
            return (
              <Link
                key={line.id}
                to="/line/$slug"
                params={{ slug: line.slug }}
                className="w-[44%] overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
                style={posStyle(p.lines[line.id] ?? fallback)}
              >
                <div className="aspect-[16/10] overflow-hidden bg-paper">
                  <MediaFrame src={line.coverImageUrl} alt={line.name} />
                </div>
                <div className="space-y-1 p-4">
                  <p className="font-display text-lg font-semibold">
                    {line.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{line.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section
        className={cn(
          "mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:items-end lg:py-16",
          placement === "text-right"
            ? "lg:grid-cols-[0.9fr_1.1fr]"
            : "lg:grid-cols-[1.1fr_0.9fr]",
        )}
      >
        <div className={cn(placement === "text-right" && "lg:order-2")}>
          <p
            className="uppercase tracking-[0.28em] text-accent"
            style={L ? textStyleCss(L.heroEyebrowStyle) : undefined}
          >
            {heroEyebrow}
          </p>
          <h1
            className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl"
            style={L ? textStyleCss(L.heroTitleStyle) : undefined}
          >
            {heroTitle}
          </h1>
          <p
            className="mt-5 max-w-md text-base text-muted-foreground"
            style={L ? textStyleCss(L.heroBodyStyle) : undefined}
          >
            {heroBody}
          </p>
        </div>
        <div
          className={cn(
            "overflow-hidden rounded-xl shadow-[var(--shadow-border)]",
            placement === "text-right" && "lg:order-1",
          )}
        >
          {cover ? (
            <div className="aspect-[16/10] sm:aspect-[16/9]">
              <MediaFrame
                src={cover}
                kind={featured?.line.coverGifUrl ? "gif" : "image"}
                alt="G3D Squish"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2
            className="font-display text-2xl font-semibold"
            style={L ? textStyleCss(L.linesHeadingStyle) : undefined}
          >
            {linesHeading}
          </h2>
        </div>
        <div
          className={cn(
            "grid gap-5",
            cols === 1 && "grid-cols-1",
            cols === 2 && "sm:grid-cols-2",
            cols === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {lines.map((line) => (
            <Link
              key={line.id}
              to="/line/$slug"
              params={{ slug: line.slug }}
              className="group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-paper">
                <MediaFrame
                  src={line.coverImageUrl}
                  alt={line.name}
                  className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="space-y-1 p-5">
                <p className="font-display text-xl font-semibold">{line.name}</p>
                <p className="text-sm text-muted-foreground">{line.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured?.products.length ? (
        <section className="border-t border-border bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-2xl font-semibold">
              {L?.featuredHeadingPrefix ?? "In"} {featured.line.name}
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {featured.products.map((product) => (
                <Link
                  key={product.id}
                  to="/line/$slug/p/$productSlug"
                  params={{
                    slug: featured.line.slug,
                    productSlug: product.slug,
                  }}
                  className="group overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
                >
                  <div className="aspect-square bg-paper">
                    <MediaFrame src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{product.name}</p>
                    <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                      From {formatMoney(product.basePriceCents)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
