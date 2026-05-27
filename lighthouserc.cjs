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
        "http://localhost:3001/campaign",
        "http://localhost:3001/leads",
      ],
      numberOfRuns: 1,
      settings: {
        // Mobile by default — switch to "desktop" for a different baseline.
        preset: "desktop",
        chromeFlags: "--no-sandbox --headless=new",
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
