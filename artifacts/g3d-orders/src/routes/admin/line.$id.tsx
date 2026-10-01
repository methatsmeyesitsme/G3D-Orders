import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FileUrlField } from "@/components/file-url-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminAccess } from "@/lib/admin-access-store";
import { listCatalog, upsertLine } from "@/lib/store.functions";
import type { ProductLine } from "@/lib/types";

export const Route = createFileRoute("/admin/line/$id")({
  component: LineEditor,
});

function LineEditor() {
  const { id } = Route.useParams();
  const adminCode = useAdminAccess((s) => s.code);
  const navigate = useNavigate();
  const [line, setLine] = useState<ProductLine | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void listCatalog({ data: { adminCode } }).then((catalog) => {
      setLine(catalog.lines.find((item) => item.id === id) ?? null);
    });
  }, [adminCode, id]);

  if (!line) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-sm text-muted-foreground">
        Loading line…
      </div>
    );
  }

  async function save() {
    const current = line;
    if (!current) return;
    setBusy(true);
    try {
      await upsertLine({
        data: {
          adminCode: adminCode,
          id: current.id,
          name: current.name,
          slug: current.slug,
          tagline: current.tagline,
          description: current.description,
          coverImageUrl: current.coverImageUrl,
          coverGifUrl: current.coverGifUrl,
          sortOrder: current.sortOrder,
        },
      });
      toast.success("Line saved");
      void navigate({ to: "/admin/catalog" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Link to="/admin/catalog" className="text-sm text-muted-foreground">
        Catalog
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold">Edit line</h1>
      <div className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={line.name}
            onChange={(e) => setLine({ ...line, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input
            value={line.slug}
            onChange={(e) => setLine({ ...line, slug: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input
            value={line.tagline}
            onChange={(e) => setLine({ ...line, tagline: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={line.description}
            onChange={(e) => setLine({ ...line, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Sort</Label>
          <Input
            type="number"
            value={line.sortOrder}
            onChange={(e) =>
              setLine({ ...line, sortOrder: Number(e.target.value) || 0 })
            }
          />
        </div>
        <FileUrlField
          label="Cover picture"
          value={line.coverImageUrl}
          accept="image/*"
          onChange={(coverImageUrl) => setLine({ ...line, coverImageUrl })}
        />
        <FileUrlField
          label="Cover GIF / video"
          value={line.coverGifUrl}
          accept="image/gif,video/*"
          onChange={(coverGifUrl) => setLine({ ...line, coverGifUrl })}
        />
        <Button disabled={busy} onClick={() => void save()}>
          {busy ? "Saving…" : "Save line"}
        </Button>
      </div>
    </div>
  );
}
