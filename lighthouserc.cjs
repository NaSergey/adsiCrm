/**
 * Lighthouse CI configuration.
 *
 * Default usage:
 *   1. Start dev server: `npm run dev` (in another terminal)
 *   2. Run: `npm run lighthouse`
 *
 * For production audits — `npm run build && npm start`, then `npm run lighthouse`.
 *
 * Thresholds are loose at start. Tighten them once metrics stabilize.
 */
module.exports = {
  ci: {
    collect: {
      // Audit these URLs. Requires the app to be running (localhost:3001 by default).
      url: [
        "http://localhost:3001/",
        "http://localhost:3001/affiliates",
        "http://localhost:3001/campaign",
        "http://localhost:3001/dasboard",
        "http://localhost:3001/flow",
        "http://localhost:3001/leads",
        "http://localhost:3001/logs",
        "http://localhost:3001/report",
        "http://localhost:3001/senderLead",
        "http://localhost:3001/service",
        "http://localhost:3001/settings",
        "http://localhost:3001/users",
        "http://localhost:3001/wiki",
      ],
      numberOfRuns: 1,
      // Logs in once per URL before Lighthouse audits the page
      puppeteerScript: "./lighthouse/auth-setup.cjs",
      puppeteerLaunchOptions: {
        headless: true,
      },
      settings: {
        // Mobile by default — switch to "desktop" for a different baseline.
        preset: "desktop",
        chromeFlags: "--no-sandbox --headless=new",
        // Keep cookies set by the auth setup script — without this Lighthouse wipes storage
        disableStorageReset: true,
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],
      },
    },
    upload: {
      // Stores HTML reports locally under .lighthouseci/
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
