import { cn } from "@/lib/utils";

export function MediaFrame({
  src,
  kind,
  alt,
  className,
}: {
  src: string;
  kind?: "image" | "gif" | "video";
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "grid aspect-square place-items-center bg-paper text-sm text-muted-foreground",
          className,
        )}
      >
        No media
      </div>
    );
  }
  const isVideo =
    kind === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(src);
  if (isVideo) {
    return (
      <video
        className={cn("h-full w-full object-cover", className)}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={alt}
      />
    );
  }
  return (
    <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />
  );
}
