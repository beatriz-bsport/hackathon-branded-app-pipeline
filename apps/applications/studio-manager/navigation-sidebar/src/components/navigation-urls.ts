import type { Urls } from "#src/types";
import { LEGACY_URLS, REVAMP_URLS } from "#src/urls";

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
    return [
      entry[0] as keyof Urls,
      {
        href: entry[1],
        revamped,
      },
    ];
  });
}

export type NavigationUrls = Record<
  keyof Urls,
  { href: string; revamped: boolean }
>;

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

  const revampEntries = generateEntries({ urls: REVAMP_URLS, revamped: true });
  const revampEntriesKeys = revampEntries.map((entry) => entry[0]);
  // Select legacy entries that are not in revamp entries
  const finalEntries = [
    ...legacyEntries.filter((entry) => !revampEntriesKeys.includes(entry[0])),
    ...revampEntries,
  ];

  return Object.fromEntries(finalEntries);
};
