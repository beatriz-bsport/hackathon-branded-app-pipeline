import { getTokenByPath } from "#src/lib/tokens";

export type TokenAliasProps = {
  chain?: string[];
  from?: string;
};

function expandChain(start: string, maxDepth = 6): string[] {
  const chain: string[] = [start];
  let cursor = getTokenByPath(start);
  let lastResolvedValue: string | undefined = cursor?.value;
  let depth = 0;
  while (cursor && cursor.alias && depth < maxDepth) {
    chain.push(cursor.alias);
    const next = getTokenByPath(cursor.alias);
    if (!next) break;
    cursor = next;
    lastResolvedValue = cursor.value;
    depth += 1;
  }
  if (lastResolvedValue && chain[chain.length - 1] !== lastResolvedValue) {
    chain.push(lastResolvedValue);
  }
  return chain;
}

export function TokenAlias({ chain, from }: TokenAliasProps) {
  const resolved = chain ?? (from ? expandChain(from) : []);

  if (resolved.length === 0) {
    return (
      <div className="my-2 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-3 py-2 text-xs text-[color:var(--color-fg-muted)]">
        TokenAlias: provide `chain` or `from`.
      </div>
    );
  }

  const last = resolved[resolved.length - 1];
  const looksLikeColor = /^#|^oklch|^rgb|^hsl/i.test(last);

  return (
    <div className="my-3 flex flex-wrap items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-3 py-2 text-sm">
      {resolved.map((step, index) => (
        <span key={step + index} className="flex items-center gap-2">
          <code className="rounded bg-[color:var(--color-bg)] px-1.5 py-0.5 font-mono text-xs">
            {step}
          </code>
          {index < resolved.length - 1 ? (
            <span
              aria-hidden="true"
              className="text-[color:var(--color-fg-muted)]"
            >
              →
            </span>
          ) : null}
        </span>
      ))}
      {looksLikeColor ? (
        <span
          aria-hidden="true"
          className="ml-2 inline-block size-5 rounded border border-[color:var(--color-border)]"
          style={{ background: last }}
        />
      ) : null}
    </div>
  );
}
