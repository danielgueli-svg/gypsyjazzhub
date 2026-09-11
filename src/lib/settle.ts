/** Never let a failed or slow extra take down a public page. */
const EXTRA_MS = 450;

export async function settle<T>(
  label: string,
  fallback: T,
  task: () => Promise<T>,
  ms = EXTRA_MS,
): Promise<T> {
  try {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<T>((resolve) => {
      timer = setTimeout(() => resolve(fallback), ms);
    });
    const work = task().catch((err) => {
      console.error(`[hub] ${label}`, err);
      return fallback;
    });
    const result = await Promise.race([work, timeout]);
    if (timer) clearTimeout(timer);
    return result;
  } catch (err) {
    console.error(`[hub] ${label}`, err);
    return fallback;
  }
}
