/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  plugins: ["react", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // RN-specific: console is common for debugging
    "no-console": "off",
    // RN doesn't use DOM types
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
  },
  settings: {
    react: { version: "detect" },
  },
  env: {
    es2022: true,
  },
};