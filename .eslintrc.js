module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json"],
      },
    },
  },
  extends: [
    "airbnb/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "./tools/eslint-configs/extension-ts.eslintrc.js",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "./tools/eslint-configs/ws-base.eslintrc.js",
  ],
  ignorePatterns: ["**/*.js"],
};
