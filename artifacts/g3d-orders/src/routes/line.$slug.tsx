import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { MediaFrame } from "@/components/media-frame";
import { getLineBySlug } from "@/lib/store.functions";
import { formatMoney } from "@/lib/utils";

export const Route = createFileRoute("/line/$slug")({
  loader: async ({ params }) => {
    const data = await getLineBySlug({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  component: LinePage,
});

function LinePage() {
  const { line, products } = Route.useLoaderData();
  return (
    <SiteShell>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:py-14">
        <div className="overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-border)]">
          <div className="aspect-[4/3]">
            <MediaFrame
              src={line.coverGifUrl || line.coverImageUrl}
              kind={line.coverGifUrl ? "gif" : "image"}
              alt={line.name}
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
            Product line
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            {line.name}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{line.tagline}</p>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-foreground/80">
            {line.description}
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/line/$slug/p/$productSlug"
              params={{ slug: line.slug, productSlug: product.slug }}
              className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]"
            >
              <div className="aspect-square bg-paper">
                <MediaFrame src={product.imageUrl} alt={product.name} />
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl font-semibold">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-3 text-sm tabular-nums">
                  From {formatMoney(product.basePriceCents)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
