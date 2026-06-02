import { ColorSwatch } from "#src/components/mdx/color-swatch";
import { getTokensByCategory } from "#src/lib/tokens";

export type TokenTableProps = {
  category: string;
};

function isColorCategory(category: string): boolean {
  return category.startsWith("color");
}

export function TokenTable({ category }: TokenTableProps) {
  const tokens = getTokensByCategory(category);

  if (tokens.length === 0) {
    return (
      <div className="my-4 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] p-4 text-sm text-[color:var(--color-fg-muted)]">
        No tokens found for <code className="font-mono">{category}</code>. The
        token pipeline may not have run yet — see Phase G.
      </div>
    );
  }

  const showColor = isColorCategory(category);

  return (
    <div className="docs-table-card">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--color-bg-subtle)] text-left text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
          <tr>
            {showColor ? <th className="px-3 py-2">Swatch</th> : null}
            <th className="px-3 py-2">Token</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">CSS variable</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr
              key={token.path}
              className="border-t border-[color:var(--color-border)]"
            >
              {showColor ? (
                <td className="px-3 py-2">
                  <span
                    aria-hidden="true"
                    className="block size-6 rounded border border-[color:var(--color-border)]"
                    style={{ background: token.value }}
                  />
                </td>
              ) : null}
              <td className="px-3 py-2 font-mono text-xs">{token.path}</td>
              <td className="px-3 py-2 font-mono text-xs">{token.value}</td>
              <td className="px-3 py-2 font-mono text-xs text-[color:var(--color-fg-muted)]">
                {token.cssVariable ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { ColorSwatch };
