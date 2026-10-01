import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /products/…" />
      <Input
        type="file"
        accept={accept ?? "image/*,video/*,.gif"}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") onChange(reader.result);
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}
