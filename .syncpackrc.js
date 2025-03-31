// @ts-check

/** @tutorial https://jamiemason.github.io/syncpack/guide/getting-started/ */

/** @type {import("syncpack").RcFile} */
const config = {
  dependencyTypes: ["prod", "dev", "local", "peer"],
  versionGroups: [
    // ========== CONSISTENT IMPORT ==========
    //
    // Ensure internal package are only installed with the "workspace:*" protocol
    {
      label: "Internal packages - Workspace protocol only",
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
      label: "@types packages - devDependencies only",
    },
    //
    // Ensure that specified pkgs are installed as `devDependencies` only
    {
      dependencies: ["@bsport/eslint-config-react"],
      dependencyTypes: ["!dev"],
      isBanned: true,
      label: "devDependencies only specific packages",
    },
    //
    // ========== CONSISTENT VERSIONING ==========
    //
    // Ensure react libaries have the same version in our new pkgs and applications
    {
      dependencies: ["react", "react-router", "react-dom"],
      label: "React libraries - Same version in revamped pkgs and apps",
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
