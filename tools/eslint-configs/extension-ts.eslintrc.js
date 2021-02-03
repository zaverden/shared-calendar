module.exports = {
  // In some cases, ESLint provides a rule itself, but it doesn't support TypeScript syntax;
  // either it crashes, or it ignores the syntax, or it falsely reports against it.
  // In these cases, we create what we call an extension rule; a rule within our plugin
  // that has the same functionality, but also supports TypeScript.
  // See more: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#extension-rules
  rules: {
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": "error",

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    // * It is here to mirror airbnb config for no-unused-vars
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
      },
    ],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
    // * It is here to allow usage for hoisted declarations
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        functions: false, // Function declarations are hoisted, so it's safe
        typedefs: false, // Type declarations are hoisted, so it's safe
      },
    ],
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "react/destructuring-assignment": "off",
  },
};
