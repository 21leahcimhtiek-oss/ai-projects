/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@storyforge/eslint-config/react-native"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};