export type NavItem = {
  slug: string;
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  type: "group";
  slug: string;
  label: string;
  href?: string;
  items: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

export type TopTab = {
  key: string;
  label: string;
  href: string;
  childrenBase: string;
  children: NavEntry[];
};

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "type" in entry && entry.type === "group";
}

export function getActiveTabKey(
  pathname: string,
  topTabs: TopTab[],
): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";

  if (firstSegment === "" || firstSegment === "index.html") {
    const welcome = topTabs.find((t) => t.key === "welcome");
    return welcome?.key ?? null;
  }

  for (const tab of topTabs) {
    if (tab.key === firstSegment) return tab.key;
    if (tab.href === `/${firstSegment}`) return tab.key;
    if (tab.childrenBase === `/${firstSegment}`) return tab.key;
  }
  return null;
}
