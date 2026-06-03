import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useState,
} from "react";

import { cx } from "#src/lib/cx";

export type TabProps = {
  children: ReactNode;
};

export function Tab({ children }: TabProps) {
  return <div className="prose-doc">{children}</div>;
}

export type TabsProps = {
  items: string[];
  defaultIndex?: number;
  children: ReactNode;
};

export function Tabs({ items, defaultIndex = 0, children }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child),
  );

  return (
    <div className="my-4 rounded-lg border border-[color:var(--color-border)]">
      <div
        role="tablist"
        className="flex gap-1 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] px-2 pt-2"
      >
        {items.map((label, index) => {
          const isActive = index === active;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(index)}
              className={cx(
                "rounded-t-md border-b-2 px-3 py-1.5 text-sm font-medium",
                isActive
                  ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
                  : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="px-4 py-3">
        {panels[active] ?? null}
      </div>
    </div>
  );
}
