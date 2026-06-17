import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  // Прокси на бэкенд реализован рантайм-роутом src/app/backend/[...slug]/route.ts,
  // а НЕ через rewrites() — последние «запекают» адрес на этапе сборки и не видят
  // INTERNAL_API_URL, переданный при запуске контейнера.
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
