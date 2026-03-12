/** @type {import("prettier").Config} */
module.exports = {
  // Line length — wide enough for modern monitors, tight enough for diffs
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  // Embedded language formatting
  embeddedLanguageFormatting: "auto",
  // Overrides per file type
  overrides: [
    {
      files: ["*.json", "*.jsonc"],
      options: { printWidth: 120 }
    },
    {
      files: ["*.md", "*.mdx"],
      options: { proseWrap: "always", printWidth: 80 }
    },
    {
      files: ["*.yaml", "*.yml"],
      options: { singleQuote: true }
    },
    {
      files: ["*.css", "*.scss"],
      options: { singleQuote: false }
    }
  ]
};