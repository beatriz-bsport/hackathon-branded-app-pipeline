import { useState } from "react";

import {
  contrastOnBackground,
  formatContrastRatio,
  normalizeHex,
  parseColor,
  preferredForeground,
} from "#src/lib/color-contrast";
import { headingSlug } from "#src/lib/heading-slug";
import {
  type DesignTokenType,
  type TokenLeaf,
  formatDesignTokenTitle,
  getDesignTokens,
  groupDesignTokens,
  resolveTokenValue,
} from "#src/lib/tokens";

export type DesignTokenListProps = {
  /** Token category — maps to generated token `type` values. */
  type: DesignTokenType;
  /** Optional dot-separated path prefix (e.g. `color.surface`). */
  prefix?: string;
  /** For color tokens, hide base palette swatches and show semantic tokens only. */
  semanticOnly?: boolean;
};

function CopyTokenButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy token to clipboard"}
      className="absolute right-2 top-2 rounded p-1 text-[color:var(--color-fg-muted)] hover:bg-[color:var(--color-bg-subtle)] hover:text-[color:var(--color-fg)]"
    >
      {copied ? (
        <svg
          aria-hidden="true"
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function ColorExample({ token }: { token: TokenLeaf }) {
  const resolved = resolveTokenValue(token.value);
  const parsed = parseColor(resolved);
  const displayValue = parsed ? normalizeHex(resolved) : resolved;
  const foreground = parsed ? preferredForeground(displayValue) : "#ffffff";
  const whiteContrast = parsed
    ? contrastOnBackground(displayValue, "#ffffff")
    : null;

  if (!parsed) {
    return (
      <div className="space-y-2">
        <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-3 text-xs text-[color:var(--color-fg-muted)]">
          {displayValue}
        </div>
        <code className="block font-mono text-xs text-[color:var(--color-fg-muted)]">
          {displayValue}
        </code>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="relative h-16 overflow-hidden rounded-md ring-1 ring-black/10"
        style={{ backgroundColor: displayValue }}
      >
        {whiteContrast ? (
          <span
            className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ color: foreground }}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: foreground }}
            />
            {formatContrastRatio(whiteContrast.ratio)}
          </span>
        ) : null}
      </div>
      <code className="block font-mono text-xs text-[color:var(--color-fg-muted)]">
        {displayValue}
      </code>
    </div>
  );
}

function GenericExample({ token }: { token: TokenLeaf }) {
  const resolved = resolveTokenValue(token.value);

  return (
    <div className="space-y-2">
      <div className="flex h-16 items-center justify-center rounded-md bg-[color:var(--color-bg-subtle)] px-3 ring-1 ring-[color:var(--color-border)]">
        <span className="font-mono text-sm">{resolved}</span>
      </div>
      <code className="block font-mono text-xs text-[color:var(--color-fg-muted)]">
        {resolved}
      </code>
    </div>
  );
}

function DesignTokenRow({
  token,
  showColor,
}: {
  token: TokenLeaf;
  showColor: boolean;
}) {
  const cssVar =
    token.cssVariable ?? `var(--${token.path.replace(/\./g, "-")})`;
  const copyValue = cssVar.startsWith("var(") ? cssVar : `var(${cssVar})`;

  return (
    <tr className="border-t border-[color:var(--color-border)] align-top">
      <td className="w-[28%] px-4 py-4">
        {showColor ? (
          <ColorExample token={token} />
        ) : (
          <GenericExample token={token} />
        )}
      </td>
      <td className="w-[44%] px-4 py-4">
        <p className="font-semibold text-[color:var(--color-fg)]">
          {formatDesignTokenTitle(token.path)}
        </p>
        {token.description ? (
          <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-fg-subtle)]">
            {token.description}
          </p>
        ) : (
          <p className="mt-1 text-sm italic text-[color:var(--color-fg-muted)]">
            No description yet.
          </p>
        )}
      </td>
      <td className="w-[28%] px-4 py-4">
        <div className="relative rounded-md bg-[color:var(--color-bg-subtle)] px-3 py-3 pr-10 ring-1 ring-[color:var(--color-border)]">
          <CopyTokenButton value={copyValue} />
          <code className="break-all font-mono text-sm text-[color:var(--color-accent)]">
            {copyValue}
          </code>
        </div>
      </td>
    </tr>
  );
}

function DesignTokenTable({
  tokens,
  showColor,
}: {
  tokens: TokenLeaf[];
  showColor: boolean;
}) {
  return (
    <table className="w-full min-w-[720px] border-collapse text-left">
      <thead className="bg-[color:var(--color-bg-subtle)] text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
        <tr>
          <th className="px-4 py-3 font-medium">Example</th>
          <th className="px-4 py-3 font-medium">Description</th>
          <th className="px-4 py-3 font-medium">Token</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => (
          <DesignTokenRow
            key={token.path}
            token={token}
            showColor={showColor}
          />
        ))}
      </tbody>
    </table>
  );
}

export function DesignTokenList({
  type,
  prefix,
  semanticOnly = type === "color",
}: DesignTokenListProps) {
  const tokens = getDesignTokens({ type, prefix, semanticOnly });
  const groups = groupDesignTokens(tokens, type);
  const showColor = type === "color";

  if (groups.length === 0) {
    return (
      <div className="my-4 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] p-4 text-sm text-[color:var(--color-fg-muted)]">
        No {type} tokens found
        {prefix ? (
          <>
            {" "}
            for <code className="font-mono">{prefix}</code>
          </>
        ) : null}
        . Run <code className="font-mono">pnpm run generate:tokens</code> after
        updating Kaizen tokens.
      </div>
    );
  }

  const showGroupHeadings = type === "color" && groups.length > 1;

  return (
    <div className="my-6 space-y-8">
      {groups.map((group) => (
        <section key={group.key}>
          {showGroupHeadings ? (
            <h3
              id={headingSlug(group.label)}
              className="mb-3 scroll-mt-24 font-bold tracking-tight"
            >
              {group.label}
            </h3>
          ) : null}
          <div className="docs-table-card">
            <DesignTokenTable tokens={group.tokens} showColor={showColor} />
          </div>
        </section>
      ))}
    </div>
  );
}
