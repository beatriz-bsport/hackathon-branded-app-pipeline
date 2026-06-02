export type KeyboardShortcut = {
  keys: string[];
  description: string;
};

export type AccessibilityProps = {
  keyboard?: KeyboardShortcut[];
  aria?: string[];
  notes?: string;
};

export function Accessibility({ keyboard, aria, notes }: AccessibilityProps) {
  return (
    <section className="my-4 flex flex-col gap-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)]/40 p-4">
      {keyboard && keyboard.length > 0 ? (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            Keyboard
          </h4>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[color:var(--color-fg-muted)]">
              <tr>
                <th className="w-40 pb-1 font-medium">Keys</th>
                <th className="pb-1 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {keyboard.map((shortcut, index) => (
                <tr
                  key={index}
                  className="border-t border-[color:var(--color-border)]"
                >
                  <td className="py-1.5">
                    <span className="flex flex-wrap gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex min-w-6 items-center justify-center rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-1.5 py-0.5 font-mono text-[11px]"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </td>
                  <td className="py-1.5 text-[color:var(--color-fg-subtle)]">
                    {shortcut.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {aria && aria.length > 0 ? (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            ARIA
          </h4>
          <ul className="flex flex-col gap-1 text-sm">
            {aria.map((item) => (
              <li key={item} className="text-[color:var(--color-fg-subtle)]">
                <code className="rounded bg-[color:var(--color-bg)] px-1.5 py-0.5 text-xs">
                  {item}
                </code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {notes ? (
        <p className="text-sm text-[color:var(--color-fg-subtle)]">{notes}</p>
      ) : null}
    </section>
  );
}
