import { type ReactNode } from "react";

import { type PropDef, getProps } from "#src/lib/props";

const PROP_CODE_CLASS =
  "rounded bg-[color:var(--color-bg-subtle)] px-1 py-0.5 font-mono text-[0.9em]";

function PropCode({ children }: { children: ReactNode }) {
  return <code className={PROP_CODE_CLASS}>{children}</code>;
}

/** Renders TS string-literal unions with `<code>` chips instead of `"quotes"`. */
function formatPropType(type: string): ReactNode {
  const regex = /"([^"]*)"/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(type)) !== null) {
    if (match.index > lastIndex) {
      parts.push(type.slice(lastIndex, match.index));
    }
    parts.push(<PropCode key={key++}>{match[1]}</PropCode>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < type.length) {
    parts.push(type.slice(lastIndex));
  }

  return parts.length > 0 ? parts : type;
}

export type PropOverride = {
  description?: string;
  defaultValue?: string;
  type?: string;
};

export type PropsTableProps = {
  component: string;
  overrides?: Record<string, PropOverride>;
};

function applyOverrides(
  props: PropDef[],
  overrides?: Record<string, PropOverride>,
): PropDef[] {
  if (!overrides) return props;
  return props.map((p) => {
    const o = overrides[p.name];
    if (!o) return p;
    return {
      ...p,
      description: o.description ?? p.description,
      defaultValue: o.defaultValue ?? p.defaultValue,
      type: o.type ?? p.type,
    };
  });
}

export function PropsTable({ component, overrides }: PropsTableProps) {
  const raw = getProps(component);

  if (!raw) {
    return (
      <div className="my-4 rounded-md border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] p-4 text-sm text-[color:var(--color-fg-muted)]">
        Props for <code className="font-mono">{component}</code> are not yet
        extracted. Run the props pipeline (see Phase F).
      </div>
    );
  }

  const propDefs = applyOverrides(raw, overrides);

  return (
    <div className="docs-table-card">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--color-bg-subtle)] text-left text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
          <tr>
            <th className="px-3 py-2">Prop</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Default</th>
            <th className="px-3 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {propDefs.map((prop) => (
            <tr
              key={prop.name}
              className="border-t border-[color:var(--color-border)] align-top"
            >
              <td className="px-3 py-2 font-mono text-xs">
                {prop.name}
                {prop.required ? (
                  <span className="ml-1 text-[color:var(--color-danger)]">
                    *
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-[color:var(--color-fg-subtle)]">
                {formatPropType(prop.type)}
              </td>
              <td className="px-3 py-2 text-xs text-[color:var(--color-fg-muted)]">
                {prop.defaultValue ? (
                  <PropCode>{prop.defaultValue}</PropCode>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2 text-[color:var(--color-fg-subtle)]">
                {prop.description ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
