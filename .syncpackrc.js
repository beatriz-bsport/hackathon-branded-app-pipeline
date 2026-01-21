// @ts-check

/** @tutorial https://jamiemason.github.io/syncpack/guide/getting-started/ */

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ["prod", "dev", "local", "peer"],
  source: [
    // Lookup all package.json files
    "**",
    // Exclude lookup with '!'
    "!**/*-legacy",
    "!**/dist",
    "!**/build",
    "!**/storybook-static",
  ],
  versionGroups: [
    // ========== CONSISTENT IMPORT ==========
    //
    // Ensure internal package are only installed with the "workspace:*" protocol
    {
      label: "Internal packages - Use workspace protocol only",
      pinVersion: "workspace:*",
      dependencyTypes: ["prod", "dev", "peer"],
      dependencies: ["@bsport/*"],
    },
    //
    // Ensure `@types` are only installed as `devDepencies`
    {
      dependencies: ["@types/**"], // Target all @types pkg
      dependencyTypes: ["!dev"], // Match deps anywhere except in devDependencies
      isBanned: true, // Forbid this behavior
      label: "@types packages - Installed in devDependencies only",
    },
    //
    // ========== CONSISTENT VERSIONING ==========
    //
    // Ensure react libaries have the same version in our new pkgs and applications
    {
      dependencies: ["react", "react-router", "react-dom"],
      label: "React libraries - Use same version in all revamped pkgs and apps",
      packages: [
        // Exclude legacy packages
        "!@bsport/saas-legacy",
        "!@bsport/common",
        "!@bsport/widget-legacy",
      ],
    },
    // Ensure luxon has the same version in our new pkgs and applications
    {
      dependencies: ["luxon"],
      label: "Luxon - Use same version in all revamped pkgs and apps",
      packages: [
        // Exclude legacy packages
        "!@bsport/saas-legacy",
        "!@bsport/common",
        "!@bsport/widget-legacy",
      ],
    },
  ],
};

module.exports = config;
