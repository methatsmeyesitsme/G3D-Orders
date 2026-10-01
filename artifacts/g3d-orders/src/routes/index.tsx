import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { MediaFrame } from "@/components/media-frame";
import { listLines, getLineBySlug } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const lines = await listLines();
    const featured = lines[0]
      ? await getLineBySlug({ data: { slug: lines[0].slug } })
      : null;
    return { lines, featured };
  },
  component: Home,
});

function Home() {
  const { lines, featured } = Route.useLoaderData();
  const cover = featured?.line.coverGifUrl || featured?.line.coverImageUrl;

  return (
    <SiteShell>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Product studio
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Lattice you can hold.
          </h1>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            G3D Squish is printed to the options on the ticket. Shape, filament,
            yield, grain — then GO sends the same spec into G3DPG.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl shadow-[var(--shadow-border)]">
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
          <h2 className="font-display text-2xl font-semibold">Product lines</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
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
              In {featured.line.name}
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
