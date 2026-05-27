export function makeFakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=+$/, "");
  const body = btoa(JSON.stringify(payload)).replace(/=+$/, "");
  return `${header}.${body}.signature`;
}

export function makeJwtWithExpiry(secondsFromNow: number, extra: Record<string, unknown> = {}): string {
  return makeFakeJwt({
    exp: Math.floor(Date.now() / 1000) + secondsFromNow,
    ...extra,
  });
}
