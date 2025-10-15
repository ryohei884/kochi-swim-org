import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/app/generated/**",
    ],
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "{react,react-dom/**,react-router-dom}",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@src/**",
              group: "parent",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
          },
          "newlines-between": "always",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
    },
  },
  ...compat.config({
    extends: [
      "eslint:recommended",
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
    ],
  }),
];

export default eslintConfig;
