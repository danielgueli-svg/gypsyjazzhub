/** Never let a failed extra take down a public page. */
export async function settle<T>(label: string, fallback: T, task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (err) {
    console.error(`[hub] ${label}`, err);
    return fallback;
  }
}
