import { type Tree, addProjectConfiguration, readJson } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { describe, expect, it } from "vitest";

import { migrateToLibraryGenerator } from "./generator";

const appRoot = "apps/applications/studio-manager/buyables/giftcard";
const hostRoot = "apps/applications/studio-manager/host";

const giftcardPackageJson = `{
  "name": "@bsport/sm-giftcard",
  "version": "0.1.0",
  "private": true,
  "description": "Pages to manage giftcard for studio managers : List, Archived list, Details",
  "author": "David Bretaud <david.bretaud@bsport.io>",
  "type": "module",
  "scripts": {
    "build": "tsc -b && vite build --logLevel warn",
    "build:preview": "vite build --mode preview",
    "ci:compile": "tsc -b",
    "dev": "concurrently \\\"pnpm run --silent -w federate:navigation\\\" \\\"vite\\\"",
    "dev:single": "vite",
    "format": "prettier --write '**/*.{ts,tsx,js,jsx,cjs,mjs,scss,css,json,md,mdx,html,svg}'",
    "format:check": "prettier --check '**/*.{ts,tsx,js,jsx,cjs,mjs}'",
    "lint": "eslint .",
    "preview": "vite preview --mode preview",
    "translation:update": "pnpm run -w translation:update"
  },
  "dependencies": {
    "@bsport/currency": "workspace:*",
    "@bsport/fetch": "workspace:*",
    "@bsport/form": "workspace:*",
    "@bsport/kaizen-business-components": "workspace:*",
    "@bsport/store-buyables-giftcard": "workspace:*",
    "@bsport/store-cdp-tag": "workspace:*",
    "@bsport/use-async": "workspace:*",
    "@bsport/use-pagination-query-params": "workspace:*",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@bsport/config-eslint-react": "workspace:*",
    "@bsport/config-federation": "workspace:*",
    "@types/luxon": "^3.4.2",
    "autoprefixer": "^10.4.20",
    "classnames": "^2.5.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.11"
  },
  "peerDependencies": {
    "@bsport/i18n": "workspace:*",
    "@bsport/kaizen-primitive-core": "workspace:*",
    "@bsport/sm-backbone": "workspace:*",
    "luxon": "^3.4.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router": "^7.2.0",
    "zod": "^3.25.64"
  },
  "federation": {
    "devPort": 4150,
    "exposes": {
      "./App": "./src/App"
    },
    "remotes": {
      "sm-navigation-sidebar": {
        "devPort": 4050,
        "watchPath": "../../navigation-sidebar/src/**/*"
      }
    }
  },
  "nx": {
    "tags": [
      "application:revamp",
      "scope:studio"
    ]
  }
}
`;

const giftcardViteConfig = `import { defineConfig } from "vite";

import { getConfig } from "@bsport/config-federation";

import packageJson from "./package.json";

export default defineConfig(({ mode }) => {
  return getConfig({
    mode,
    packageJson,
    appType: "buyables",
    rootDir: __dirname,
  });
});
`;

const giftcardNamespacesJson = `["common", "imageUpload", "giftcard-details"]
`;

const giftcardI18nUtils = `import { type TFunctionGeneric, instanciateAppI18n } from "@bsport/i18n";

import namespaces from "#src/i18n/namespaces.json";
import type commonTranslations from "#src/i18n/source/common.json";
import type giftcardDetailsTranslations from "#src/i18n/source/giftcard-details.json";
import type imageUploadTranslations from "#src/i18n/source/imageUpload.json";

type Translations = {
  common: typeof commonTranslations;
  imageUpload: typeof imageUploadTranslations;
  "giftcard-details": typeof giftcardDetailsTranslations;
};

const applicationName = __GIFTCARD__.__I18N_NAMESPACE_PREFIX__;
const applicationUrl = __GIFTCARD__.__APPLICATION_BASE_URL__;

export const {
  i18nInstance,
  useTranslation,
  withTranslation,
  getFixedNamespace,
  AppI18nextProvider,
} = instanciateAppI18n<Translations>({
  applicationName,
  applicationUrl,
  namespaces,
  debug: import.meta.env.DEV,
});

export type TFunction = TFunctionGeneric<Translations>;

export { Trans, LANGUAGES, LOCALES, type Locale } from "@bsport/i18n";
`;

const hostPackageJson = `{
  "name": "@bsport/sm-host",
  "version": "0.0.1",
  "private": true,
  "description": "Studio Manager - Module Federation host app",
  "author": "Osmel Mora <osmel.mora@bsport.io>",
  "type": "module",
  "scripts": {
    "build": "tsc && vite build --logLevel warn",
    "build:preview": "vite build --mode preview",
    "ci:build:mfe": "./scripts/ci-build.sh",
    "ci:compile": "tsc",
    "ci:deploy:mfe": "./scripts/ci-deploy.sh",
    "dev": "./scripts/run-dev-all.sh",
    "dev:single": "vite",
    "format": "prettier --write '**/*.{ts,tsx,js,jsx,cjs,mjs,scss,css,json,md,mdx,html,svg}'",
    "format:check": "prettier --check '**/*.{ts,tsx,js,jsx,cjs,mjs}'",
    "lint": "eslint .",
    "preview": "vite preview --mode preview",
    "translation:update": "pnpm run -w translation:update"
  },
  "dependencies": {
    "@bsport/analytics": "workspace:*",
    "@bsport/currency": "workspace:*",
    "@bsport/datetime-formatting": "workspace:*",
    "@bsport/envs": "workspace:*",
    "@bsport/fetch": "workspace:*",
    "@bsport/form": "workspace:*",
    "@bsport/i18n": "workspace:*",
    "@bsport/intercom": "workspace:*",
    "@bsport/kaizen-primitive-core": "workspace:*",
    "@bsport/onboarding-manager": "workspace:*",
    "@bsport/request-from-header": "workspace:*",
    "@bsport/sentry": "workspace:*",
    "@bsport/sm-backbone": "workspace:*",
    "@bsport/sm-marketing-notification": "workspace:*",
    "@bsport/sm-referral-program": "workspace:*",
    "react": "^19.2.0"
  },
  "federation": {
    "devPort": 4000,
    "remotes": {
      "sm-navigation-sidebar": {
        "devPort": 4050,
        "watchPath": "../navigation-sidebar/src/**/*"
      },
      "sm-giftcard": {
        "devPort": 4150,
        "watchPath": "../buyables/giftcard/src/**/*"
      }
    }
  }
}
`;

const hostRootTsx = `import { lazy } from "react";

const Giftcard = lazy(() => import("sm-giftcard/App"));
const ReferralProgram = lazy(() => import("@bsport/sm-referral-program"));
`;

const hostModulesDts = `interface BaseApp {
  App: React.VFC;
  NavigationSidebar: React.VFC;
}

declare module "sm-giftcard/App" {
  const App: BaseApp["App"];
  export default App;
}

declare module "sm-order/App" {
  const App: BaseApp["App"];
  export default App;
}
`;

const referralProgramPackageJson = `{
  "name": "@bsport/sm-referral-program",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./build/lib.es.d.ts",
      "import": "./build/lib.es.js"
    }
  },
  "devDependencies": {
    "@bsport/config-library": "workspace:*"
  }
}
`;

type AppPackageJson = {
  exports?: Record<string, unknown>;
  scripts?: Record<string, string | undefined>;
  devDependencies?: Record<string, string | undefined>;
  nx?: {
    tags?: string[];
  };
};

type HostPackageJson = {
  dependencies?: Record<string, string | undefined>;
  federation?: {
    remotes?: Record<string, unknown>;
  };
};

function setupGiftcardTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();

  addProjectConfiguration(tree, "@bsport/sm-giftcard", {
    root: appRoot,
    projectType: "application",
    sourceRoot: `${appRoot}/src`,
    targets: {},
  });

  tree.write(`${appRoot}/package.json`, giftcardPackageJson);
  tree.write(`${appRoot}/vite.config.ts`, giftcardViteConfig);
  tree.write(`${appRoot}/src/i18n/namespaces.json`, giftcardNamespacesJson);
  tree.write(`${appRoot}/src/utils/i18n.ts`, giftcardI18nUtils);

  tree.write(`${hostRoot}/package.json`, hostPackageJson);
  tree.write(`${hostRoot}/src/Root.tsx`, hostRootTsx);
  tree.write(`${hostRoot}/src/modules.d.ts`, hostModulesDts);

  return tree;
}

describe("migrateToLibraryGenerator", () => {
  it("runs full migration and applies all transforms", () => {
    const tree = setupGiftcardTree();

    migrateToLibraryGenerator(tree, { appName: "sm-giftcard" });

    const appPackage = readJson<AppPackageJson>(
      tree,
      `${appRoot}/package.json`,
    );
    expect(appPackage.exports).toEqual({
      ".": {
        types: "./build/lib.es.d.ts",
        import: "./build/lib.es.js",
      },
    });
    expect(appPackage.devDependencies?.["@bsport/config-library"]).toBe(
      "workspace:*",
    );
    expect(appPackage.scripts?.build).toContain("--mode production");
    expect(appPackage.nx?.tags).toEqual(["scope:studio"]);

    const appViteConfig = tree.read(`${appRoot}/vite.config.ts`, "utf-8");
    expect(appViteConfig).toContain("getLibConfig");

    const appI18nIndex = tree.read(`${appRoot}/src/i18n/index.ts`, "utf-8");
    expect(appI18nIndex).toContain("i18nNamespacePrefix");

    const appI18nUtils = tree.read(`${appRoot}/src/utils/i18n.ts`, "utf-8");
    expect(appI18nUtils).not.toContain("#src/i18n/namespaces.json");
    expect(appI18nUtils).toContain("applicationName: i18nNamespacePrefix");

    expect(tree.exists(`${appRoot}/src/i18n/namespaces.json`)).toBe(false);

    const hostPackage = readJson<HostPackageJson>(
      tree,
      `${hostRoot}/package.json`,
    );
    expect(hostPackage.dependencies?.["@bsport/sm-giftcard"]).toBe(
      "workspace:*",
    );
    expect(hostPackage.federation?.remotes?.["sm-giftcard"]).toBeUndefined();

    const rootTsx = tree.read(`${hostRoot}/src/Root.tsx`, "utf-8");
    expect(rootTsx).toContain('import("@bsport/sm-giftcard")');

    const modulesDts = tree.read(`${hostRoot}/src/modules.d.ts`, "utf-8");
    expect(modulesDts).not.toContain('declare module "sm-giftcard/App"');
  });

  it("throws when app is already migrated", () => {
    const tree = createTreeWithEmptyWorkspace();

    addProjectConfiguration(tree, "@bsport/sm-referral-program", {
      root: "apps/applications/studio-manager/cdp/referral-program",
      projectType: "application",
      sourceRoot: "apps/applications/studio-manager/cdp/referral-program/src",
      targets: {},
    });
    tree.write(
      "apps/applications/studio-manager/cdp/referral-program/package.json",
      referralProgramPackageJson,
    );

    expect(() =>
      migrateToLibraryGenerator(tree, { appName: "sm-referral-program" }),
    ).toThrowError(/already migrated/);
  });

  it("normalizes appName inputs to same migration target", () => {
    const inputs = ["sm-giftcard", "@bsport/sm-giftcard", "giftcard"];

    for (const appName of inputs) {
      const tree = setupGiftcardTree();

      migrateToLibraryGenerator(tree, { appName });

      const hostPackage = readJson<HostPackageJson>(
        tree,
        `${hostRoot}/package.json`,
      );
      const rootTsx = tree.read(`${hostRoot}/src/Root.tsx`, "utf-8");

      expect(hostPackage.dependencies?.["@bsport/sm-giftcard"]).toBe(
        "workspace:*",
      );
      expect(hostPackage.federation?.remotes?.["sm-giftcard"]).toBeUndefined();
      expect(rootTsx).toContain('import("@bsport/sm-giftcard")');
    }
  });
});
