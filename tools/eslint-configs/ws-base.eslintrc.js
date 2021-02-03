module.exports = {
  rules: {
    // Require explicit return types on functions and class methods
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    // * Rule is disable because of heavily used callbacks for 3rd party libs
    // * where return type is 3-level 15-parameters generic type from the lib.
    // * It is tons of efforts to figure out the type,
    // * but inferred return type works too.
    "@typescript-eslint/explicit-function-return-type": "off",

    // Ensure consistent use of file extension within the import path
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    // * It is here to forbid .ts and .tsx extensions
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],

    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    // * It is here to allow devDependencies in tests and tools
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.spec.ts*", "tools/**"] },
    ],

    // Enforce a convention in module import order
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    // * It is here because we need strict ordering for imports with aliases
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
      },
    ],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-default-export.md
    // * Enforce to use default export
    // ! NOTE: there are case when default export is required (for example, in storybook).
    // ! In such cases create override to change rules only for those places
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",

    // Disallow Reassignment of Function Parameters
    // https://eslint.org/docs/rules/no-param-reassign
    // * It is here to override a list of ignorePropertyModificationsFor
    "no-param-reassign": [
      "error",
      {
        ignorePropertyModificationsFor: [
          "draft", // for immer produce draft
          "acc", // for reduce accumulators
          "accumulator", // for reduce accumulators
        ],
      },
    ],

    // disallow dangling underscores in identifiers
    // https://eslint.org/docs/rules/no-underscore-dangle
    // * Rule is disable because underscores are ok
    // * From docs: Whether or not you choose to allow dangling underscores in identifiers
    // * is purely a convention and has no effect on performance, readability, or complexity.
    // * It's purely a preference
    "no-underscore-dangle": "off",
  },
};
