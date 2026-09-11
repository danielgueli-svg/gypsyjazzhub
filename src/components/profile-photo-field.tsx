import { useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

const MAX_SIDE = 720;
const MAX_BYTES = 400_000;

export type PendingPhoto = {
  filename: string;
  mime: string;
  data: string;
};

function encodeJpeg(canvas: HTMLCanvasElement, quality: number) {
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressProfilePhoto(file: File): Promise<PendingPhoto> {
  const mime = file.type.toLowerCase();
  if (mime !== "image/jpeg" && mime !== "image/jpg" && mime !== "image/png") {
    throw new Error("Use a JPEG or PNG photo.");
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("That photo could not be opened."));
      image.src = url;
    });
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    if (!width || !height) throw new Error("That photo could not be opened.");
    if (width > MAX_SIDE || height > MAX_SIDE) {
      const scale = MAX_SIDE / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("That photo could not be opened.");
    ctx.drawImage(img, 0, 0, width, height);
    let quality = 0.82;
    let data = encodeJpeg(canvas, quality);
    const payloadSize = (raw: string) => Math.floor(((raw.split(",")[1] ?? "").length * 3) / 4);
    while (payloadSize(data) > MAX_BYTES && quality > 0.45) {
      quality -= 0.12;
      data = encodeJpeg(canvas, quality);
    }
    if (payloadSize(data) > MAX_BYTES) {
      throw new Error("That photo is too large. Try a smaller one.");
    }
    return {
      filename: (file.name.replace(/\.[^.]+$/, "") || "photo") + ".jpg",
      mime: "image/jpeg",
      data,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ProfilePhotoField({
  preview,
  busy,
  onPick,
  onRemove,
}: {
  preview: string;
  busy: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onPick(file);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Profile photo</p>
      <div className="flex flex-wrap items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="size-24 rounded-2xl object-cover shadow-border"
          />
        ) : (
          <div className="size-24 rounded-2xl bg-raised" />
        )}
        <div className="min-w-0 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="sr-only"
            onChange={onChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {preview ? "Change photo" : "Add photo"}
            </Button>
            {preview ? (
              <Button type="button" variant="ghost" disabled={busy} onClick={onRemove}>
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-faint">
            JPEG or PNG. After you save, it shows on your public musician page.
          </p>
        </div>
      </div>
    </div>
  );
}
