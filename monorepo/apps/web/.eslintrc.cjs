/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@storyforge/eslint-config/react"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Web-app specific overrides
    "import/no-default-export": "off", // Vite pages use default exports
  },
};