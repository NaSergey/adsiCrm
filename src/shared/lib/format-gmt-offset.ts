/**
 * Returns GMT offset string (e.g. "+3", "-5").
 */
export function formatGMTOffset(): string {
  const offset = -new Date().getTimezoneOffset() / 60;
  return `${offset >= 0 ? "+" : "-"}${Math.abs(offset)}`;
}
