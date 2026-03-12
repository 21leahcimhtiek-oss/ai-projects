/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@storyforge/eslint-config/node"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};