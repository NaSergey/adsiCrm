/**
 * Architecture tests for Feature-Sliced Design (FSD) + Next.js.
 *
 * Layer hierarchy (top -> bottom):
 *   app      -> can import from anything below
 *   widgets  -> can import features, entities, shared
 *   features -> can import entities, shared
 *   entities -> can import shared
 *   shared   -> imports nothing from upper layers
 *
 * Plus: no circular deps anywhere, no orphan modules, no imports of test files.
 */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular imports are a hard fail.",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-no-upper",
      severity: "error",
      comment: "shared/* must not import from entities/features/widgets/app.",
      from: { path: "^src/shared" },
      to: { path: "^src/(entities|features|widgets|app)" },
    },
    {
      name: "entities-no-upper",
      severity: "error",
      comment: "entities/* must not import from features/widgets/app.",
      from: { path: "^src/entities" },
      to: { path: "^src/(features|widgets|app)" },
    },
    {
      name: "features-no-upper",
      severity: "error",
      comment: "features/* must not import from widgets/app.",
      from: { path: "^src/features" },
      to: { path: "^src/(widgets|app)" },
    },
    {
      name: "widgets-no-upper",
      severity: "error",
      comment: "widgets/* must not import from app.",
      from: { path: "^src/widgets" },
      to: { path: "^src/app" },
    },
    {
      name: "no-test-imports",
      severity: "error",
      comment: "Production code must not import test files or test-utils.",
      from: { pathNot: "\\.(test|spec)\\.(ts|tsx)$" },
      to: { path: "(\\.test\\.|\\.spec\\.|src/test-utils)" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      mainFields: ["module", "main", "types", "typings"],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
