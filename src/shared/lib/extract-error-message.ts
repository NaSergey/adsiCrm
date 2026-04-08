export function extractErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const e = error as Record<string, unknown>;
  if (Array.isArray(e.message)) return (e.message as string[]).join(", ");
  if (typeof e.message === "string") return e.message;
  return null;
}
