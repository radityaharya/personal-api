import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/triple-slash-reference": [
        "error",
        {
          path: "never",
          types: "prefer-import",
          lib: "never",
        },
      ],
    },
    ignores: ["src/lib/syncyomi/**"],
  },
];
