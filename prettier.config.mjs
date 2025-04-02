/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  // Native options from prettier : https://prettier.io/docs/options
  singleQuote: false, // Whether to use single quotes instead of double quotes
  tabWidth: 2, // Specify the line length that the printer will wrap on.
  trailingComma: "all", // Print trailing commas wherever possible in multi-line comma-separated syntactic structures.
  semi: true, // Print semicolons at the ends of statements.

  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-packagejson",
  ],

  // Custom options from @trivago/prettier-plugin-sort-imports : https://github.com/trivago/prettier-plugin-sort-imports
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@bsport/(.*)$",
    "^#src/(.*)$",
    "^[./](?!.*\\.(css|scss)$)", // not .css or .scss file
    ".*\\.(css|scss)$", // .css and .scss file
  ],
  importOrderSeparation: true, // Enable the new line separation between sorted import declarations group.
  importOrderSortSpecifiers: true, // Enable sorting of the specifiers in an import declarations.
  importOrderCaseInsensitive: false, // Enable case insensitivity. If disabled, Capital letters come first

  // Overrides
  overrides: [
    {
      files: "*.svg",
      options: {
        parser: "html",
      },
    },
  ],
};
