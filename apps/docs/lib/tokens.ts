import generatedTokens from "#src/lib/generated/tokens.json";

export type TokenLeaf = {
  name: string;
  path: string;
  value: string;
  type?: string;
  cssVariable?: string;
  alias?: string;
  description?: string;
};

export type TokensJson = {
  tokens: TokenLeaf[];
};

export type DesignTokenType =
  | "color"
  | "border-radius"
  | "border-width"
  | "spacing"
  | "font-size"
  | "line-height"
  | "font-family"
  | "font-weight"
  | "shadow"
  | "opacity"
  | "motion.duration"
  | "motion.easing"
  | "z-index"
  | "width"
  | "height";

const BASE_COLOR_PALETTES = new Set([
  "luna-grey",
  "terra-green",
  "neptune-blue",
  "aurora-orange",
  "cupid-red",
  "bsport-turquoise",
]);

export function getAllTokens(): TokensJson {
  return generatedTokens as TokensJson;
}

export function getTokensByCategory(prefix: string): TokenLeaf[] {
  const { tokens } = getAllTokens();
  const normalized = prefix.replace(/\//g, ".");
  return tokens.filter((token) => token.path.startsWith(normalized + "."));
}

export function getTokenByPath(tokenPath: string): TokenLeaf | undefined {
  const { tokens } = getAllTokens();
  return tokens.find((token) => token.path === tokenPath);
}

function normalizeValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function resolveTokenValue(
  value: string,
  depth = 0,
  visited = new Set<string>(),
): string {
  if (depth > 12) return normalizeValue(value);

  const normalized = normalizeValue(value);
  const varMatch = normalized.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i);
  if (!varMatch) return normalized;

  const cssVariable = varMatch[1];
  if (visited.has(cssVariable)) return normalized;
  visited.add(cssVariable);

  const token = getAllTokens().tokens.find(
    (entry) => entry.cssVariable === cssVariable,
  );
  if (!token) return normalized;

  return resolveTokenValue(token.value, depth + 1, visited);
}

export function isBaseColorToken(path: string): boolean {
  const segments = path.split(".");
  if (segments[0] !== "color" || segments.length < 3) return false;

  const palette = segments[1];
  if (BASE_COLOR_PALETTES.has(palette)) return true;
  if (palette.startsWith("base-transparent-")) return true;

  return false;
}

export function getDesignTokens(options: {
  type: DesignTokenType;
  prefix?: string;
  semanticOnly?: boolean;
}): TokenLeaf[] {
  const { tokens } = getAllTokens();
  const normalizedPrefix = options.prefix?.replace(/\//g, ".");

  return tokens
    .filter((token) => {
      if (token.type !== options.type) return false;
      if (normalizedPrefix && !token.path.startsWith(normalizedPrefix)) {
        return false;
      }
      if (
        options.semanticOnly &&
        options.type === "color" &&
        isBaseColorToken(token.path)
      ) {
        return false;
      }
      if (token.path === "color.test") return false;
      return true;
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function formatDesignTokenTitle(path: string): string {
  const segments = path.split(".");
  const name = segments.slice(1).join(" ").replace(/-/g, " ");
  const category = segments[0].replace(/-/g, " ");
  return `${titleCase(category)} ${titleCase(name)}`.trim();
}

export type DesignTokenGroup = {
  key: string;
  label: string;
  tokens: TokenLeaf[];
};

const COLOR_GROUP_ORDER = ["surface", "stroke", "onsurface", "shadow"] as const;

export function getColorTokenGroupKey(token: TokenLeaf): string {
  const kebab =
    token.cssVariable?.slice(2) ?? token.path.replace(/^color\./, "color-");
  const parts = kebab.split("-");
  return parts[2] ?? "other";
}

export function formatDesignTokenGroupLabel(groupKey: string): string {
  if (groupKey === "onsurface") return "On surface";
  return titleCase(groupKey.replace(/-/g, " "));
}

export function groupDesignTokens(
  tokens: TokenLeaf[],
  type: DesignTokenType,
): DesignTokenGroup[] {
  if (type !== "color") {
    return tokens.length ? [{ key: "all", label: "All", tokens }] : [];
  }

  const grouped = new Map<string, TokenLeaf[]>();

  for (const token of tokens) {
    const key = getColorTokenGroupKey(token);
    const bucket = grouped.get(key);
    if (bucket) bucket.push(token);
    else grouped.set(key, [token]);
  }

  const sortGroups = (a: string, b: string) => {
    const aIndex = COLOR_GROUP_ORDER.indexOf(
      a as (typeof COLOR_GROUP_ORDER)[number],
    );
    const bIndex = COLOR_GROUP_ORDER.indexOf(
      b as (typeof COLOR_GROUP_ORDER)[number],
    );
    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    }
    return a.localeCompare(b);
  };

  return [...grouped.entries()]
    .sort(([a], [b]) => sortGroups(a, b))
    .map(([key, groupTokens]) => ({
      key,
      label: formatDesignTokenGroupLabel(key),
      tokens: groupTokens.sort((a, b) => a.path.localeCompare(b.path)),
    }));
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
