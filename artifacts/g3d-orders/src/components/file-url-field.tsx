import { useRef, useState } from "react";
import { ImagePlus, Link2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MAX_EDGE = 1280;
const JPEG_QUALITY = 0.82;
const MAX_DATA_URL_CHARS = 380_000;

function isImageFile(file: File) {
  return file.type.startsWith("image/") && file.type !== "image/gif";
}

function isGifFile(file: File) {
  return file.type === "image/gif" || /\.gif$/i.test(file.name);
}

async function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read file."));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

async function compressImageFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return readAsDataUrl(file);
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let quality = JPEG_QUALITY;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);
    while (dataUrl.length > MAX_DATA_URL_CHARS && quality > 0.45) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    if (dataUrl.length > MAX_DATA_URL_CHARS) {
      const tighter = Math.min(1, 960 / Math.max(width, height));
      canvas.width = Math.max(1, Math.round(width * tighter));
      canvas.height = Math.max(1, Math.round(height * tighter));
      const again = canvas.getContext("2d");
      if (again) {
        const bmp2 = await createImageBitmap(file);
        again.drawImage(bmp2, 0, 0, canvas.width, canvas.height);
        bmp2.close();
        dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      }
    }
    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function previewKind(src: string, accept?: string): "image" | "video" | "none" {
  if (!src) return "none";
  if (src.startsWith("data:video/") || /\.(mp4|webm|ogg)(\?|$)/i.test(src)) return "video";
  if (src.startsWith("data:image/") || accept?.includes("image")) return "image";
  if (/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(src)) return "image";
  return "image";
}

export function FileUrlField({
  label,
  value,
  onChange,
  accept,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(Boolean(value) && !value.startsWith("data:"));
  const kind = previewKind(value, accept);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      let next: string;
      if (isImageFile(file)) {
        next = await compressImageFile(file);
      } else if (isGifFile(file) || file.type.startsWith("video/")) {
        next = await readAsDataUrl(file);
        if (next.length > MAX_DATA_URL_CHARS) {
          throw new Error(
            "That file is too large to store. Try a smaller GIF/video or a JPG/PNG photo.",
          );
        }
      } else {
        next = await readAsDataUrl(file);
        if (next.length > MAX_DATA_URL_CHARS) {
          throw new Error("That file is too large to store.");
        }
      }
      onChange(next);
      setShowUrl(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-card/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-medium">{label}</Label>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => {
              onChange("");
              setError("");
            }}
          >
            <Trash2 className="size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>

      {value && kind !== "none" ? (
        <div className="overflow-hidden rounded-lg border border-border bg-paper">
          {kind === "video" ? (
            <video
              src={value}
              className="max-h-48 w-full object-contain"
              controls
              muted
              playsInline
            />
          ) : (
            <img
              src={value}
              alt=""
              className="max-h-48 w-full object-contain"
            />
          )}
        </div>
      ) : (
        <div className="grid h-28 place-items-center rounded-lg border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground">
          No media yet
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          {busy ? "Processing…" : "Upload from device"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-11"
          onClick={() => setShowUrl((v) => !v)}
        >
          <Link2 className="size-4" />
          {showUrl ? "Hide URL" : "Paste URL"}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? "image/*,video/*,.gif"}
        className="sr-only"
        onChange={(event) => {
          void handleFile(event.target.files?.[0]);
        }}
      />

      {showUrl ? (
        <Input
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /products/…"
        />
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Photos are resized automatically so they save cleanly. GIFs and videos stay as uploaded.
        </p>
      )}
    </div>
  );
}
