import { getEnv } from "@bsport/envs";

import { PERMISSIONS_PATHS } from "#src/features/permissions/permissions-paths";
import type { LegacyUrls, Urls } from "#src/types";
import {
  LEGACY_URLS,
  REVAMP_URLS_DEVELOPMENT,
  REVAMP_URLS_PRODUCTION,
} from "#src/urls";
import type { RolePermissionPath } from "#src/utils/permissions";

/**
 * Transform a URL dict in a list of entries, where an entry is :
 * [
 *  keyInTheDict,
 *  {
 *    href: urls[keyInTheDict],
 *    revamped // Parameter provides to the fct
 *  }
 * ]
 */
function generateEntries({
  urls,
  revamped,
}: {
  urls: Partial<Urls>;
  revamped: boolean;
}) {
  return Object.entries(urls).map((entry) => {
    if (!entry[1]) {
      console.warn(`Missing URL for key ${entry[0]}`);
    }

    return [
      entry[0] as keyof Urls,
      {
        href: entry[1],
        revamped,
        urlKey: entry[0] as keyof Urls,
        // Need in all cases the legacyUrl to check restricted paths
        legacyUrl: LEGACY_URLS[entry[0] as keyof LegacyUrls] ?? undefined,
        requiredPermissions: PERMISSIONS_PATHS[entry[0] as keyof Urls],
      },
    ];
  });
}

export type NavigationUrlItem = {
  href: string;
  revamped: boolean;
  legacyUrl?: string;
  requiredPermissions?: Array<RolePermissionPath>;
};

export type NavigationUrls = Record<keyof Urls, NavigationUrlItem>;

/**
 * Generate a record mapping an url key to
 * - an href : either the revamp url (if it exists and revampedBoEnabled to true) or the legacy url
 * - revamped : a boolean indicating whether it's the revamp url
 * @param revampedBoEnabled Whether we allow Navigation to revamped applications
 */
export const getNavigationUrls = ({
  revampedBoEnabled = true,
}: {
  revampedBoEnabled: boolean;
}): NavigationUrls => {
  const legacyEntries = generateEntries({ urls: LEGACY_URLS, revamped: false });

  if (!revampedBoEnabled) {
    return Object.fromEntries(legacyEntries);
  }

  const env = getEnv();
  const revampUrls =
    env === "staging" || env === "production"
      ? REVAMP_URLS_PRODUCTION
      : REVAMP_URLS_DEVELOPMENT;

  const revampEntries = generateEntries({ urls: revampUrls, revamped: true });
  const revampEntriesKeys = revampEntries.map((entry) => entry[0]);
  // Select legacy entries that are not in revamp entries
  const finalEntries = [
    ...legacyEntries.filter((entry) => !revampEntriesKeys.includes(entry[0])),
    ...revampEntries,
  ];

  return Object.fromEntries(finalEntries);
};
