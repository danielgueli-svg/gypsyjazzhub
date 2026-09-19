import { createServerFn } from "@tanstack/react-start";
import type { DetectedLocale } from "@/lib/locale-detect";

export const getRequestLocale = createServerFn({ method: "GET" }).handler(
  async (): Promise<DetectedLocale> => {
    const { readRequestLocale } = await import("@/lib/locale-detect.server");
    return readRequestLocale();
  },
);
