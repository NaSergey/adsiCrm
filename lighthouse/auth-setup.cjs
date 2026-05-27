/**
 * Puppeteer setup that runs before each Lighthouse audit.
 *
 * Logs in via the Next.js BFF route so the browser gets both:
 *   - refreshToken cookie (HttpOnly, set by backend)
 *   - pixelcrm_access_token cookie (normally set client-side from the JSON response)
 *
 * Credentials are loaded from .env.local (LH_TEST_EMAIL / LH_TEST_PASSWORD).
 */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });

module.exports = async (browser) => {
  const email = process.env.LH_TEST_EMAIL;
  const password = process.env.LH_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error("Set LH_TEST_EMAIL and LH_TEST_PASSWORD in .env.local");
  }
  const origin = "http://localhost:3001";

  const page = await browser.newPage();
  await page.goto(origin + "/", { waitUntil: "domcontentloaded" });

  const result = await page.evaluate(
    async ({ email, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => null);
      return { status: res.status, data };
    },
    { email, password }
  );

  if (result.status !== 201 || !result.data?.accessToken) {
    await page.close();
    throw new Error(
      `Lighthouse auth setup failed: status ${result.status}, body ${JSON.stringify(result.data)}`
    );
  }

  // Replicate what setAccessToken() does client-side after login
  await page.setCookie({
    name: "pixelcrm_access_token",
    value: result.data.accessToken,
    domain: "localhost",
    path: "/",
  });

  await page.close();
};
