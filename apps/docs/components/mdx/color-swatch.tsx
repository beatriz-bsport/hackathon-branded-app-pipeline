export type ColorSwatchProps = {
  token?: string;
  value: string;
  label?: string;
};

export function ColorSwatch({ token, value, label }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3 py-2">
      <span
        aria-hidden="true"
        className="block size-10 shrink-0 rounded-md border border-[color:var(--color-border)]"
        style={{ background: value }}
      />
      <div className="flex flex-col text-sm">
        <code className="text-xs">{token ?? label}</code>
        <span className="text-[color:var(--color-fg-muted)]">{value}</span>
      </div>
    </div>
  );
}
