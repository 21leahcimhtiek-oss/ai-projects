/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],

    // Imports
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
        "newlines-between": "always",
        "alphabetize": { order: "asc", caseInsensitive: true }
      }
    ],
    "import/no-duplicates": "error",
    "import/no-cycle": "warn",
    "import/no-default-export": "off",

    // General
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always", { null: "ignore" }],
    "curly": ["error", "all"],
  },
  settings: {
    "import/resolver": {
      typescript: { alwaysTryTypes: true },
      node: true,
    },
  },
  ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/", "*.config.js", "*.config.ts"],
};