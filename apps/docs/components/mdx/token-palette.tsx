import {
  type ContrastLevel,
  contrastOnBackground,
  formatContrastRatio,
  normalizeHex,
  preferredForeground,
} from "#src/lib/color-contrast";
import { type TokenLeaf, getTokensByCategory } from "#src/lib/tokens";

export type TokenPaletteProps = {
  category: string;
  title?: string;
  description?: string;
};

function titleFromCategory(category: string): string {
  const leaf = category.split(".").pop() ?? category;
  return leaf
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function shadeSortKey(path: string): number {
  const shade = path.split(".").pop() ?? "";
  const numeric = Number.parseInt(shade, 10);
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
}

function sortColorTokens(tokens: TokenLeaf[]): TokenLeaf[] {
  return [...tokens].sort((a, b) => {
    const keyDiff = shadeSortKey(a.path) - shadeSortKey(b.path);
    if (keyDiff !== 0) return keyDiff;
    return a.path.localeCompare(b.path);
  });
}

function ContrastBadge({
  level,
  ratio,
  variant,
}: {
  level: ContrastLevel;
  ratio: number;
  variant: "dark" | "light";
}) {
  const failed = level === "F";

  return (
    <span
      className={[
        "inline-flex min-w-[4.5rem] items-center justify-center rounded px-2 py-0.5 font-mono text-[11px] font-medium tracking-tight",
        variant === "dark" ? "bg-black" : "bg-white ring-1 ring-black/10",
        failed
          ? "text-[color:var(--color-danger)]"
          : variant === "dark"
            ? "text-white"
            : "text-black",
      ].join(" ")}
    >
      {level} {formatContrastRatio(ratio)}
    </span>
  );
}

function TokenPaletteRow({ token }: { token: TokenLeaf }) {
  const background = normalizeHex(token.value);
  const foreground = preferredForeground(background);
  const blackContrast = contrastOnBackground(background, "#000000");
  const whiteContrast = contrastOnBackground(background, "#ffffff");

  return (
    <div
      className="flex flex-col gap-3 px-4 py-3 sm:min-h-12 sm:flex-row sm:items-center sm:justify-between"
      style={{ backgroundColor: background, color: foreground }}
    >
      <code className="font-mono text-sm">{token.path}</code>
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-sm">{background}</code>
        <ContrastBadge
          variant="dark"
          level={blackContrast.level}
          ratio={blackContrast.ratio}
        />
        <ContrastBadge
          variant="light"
          level={whiteContrast.level}
          ratio={whiteContrast.ratio}
        />
      </div>
    </div>
  );
}

export function TokenPalette({
  category,
  title,
  description,
}: TokenPaletteProps) {
  const tokens = sortColorTokens(getTokensByCategory(category));

  if (tokens.length === 0) {
    return (
      <div className="my-4 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] p-4 text-sm text-[color:var(--color-fg-muted)]">
        No tokens found for <code className="font-mono">{category}</code>. Run
        the token pipeline or check the category prefix.
      </div>
    );
  }

  const heading = title ?? titleFromCategory(category);

  return (
    <section className="my-6">
      <header className="mb-3">
        <h3 className="font-bold tracking-tight">{heading}</h3>
        {description ? (
          <p className="mt-1 text-sm text-[color:var(--color-fg-subtle)]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="overflow-hidden rounded-lg ring-1 ring-[color:var(--color-border)]">
        {tokens.map((token) => (
          <TokenPaletteRow key={token.path} token={token} />
        ))}
      </div>
    </section>
  );
}
