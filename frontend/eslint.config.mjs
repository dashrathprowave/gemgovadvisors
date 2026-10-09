import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Dependencies and generated output — linting them reports build artefacts
    // as errors and makes `npm run lint` useless.
    "node_modules/**",
    "deploy/**",
    ".next-standalone/**",
    // Stored customer submissions (personal data) and their CSV exports.
    "data/**",
    "exports/**",
  ]),
]);

export default eslintConfig;
