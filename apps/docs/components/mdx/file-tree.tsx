export type FileTreeEntry = {
  name: string;
  type?: "file" | "dir";
  comment?: string;
  children?: FileTreeEntry[];
};

export type FileTreeProps = {
  entries: FileTreeEntry[];
  rootLabel?: string;
};

function inferType(entry: FileTreeEntry): "file" | "dir" {
  if (entry.type) return entry.type;
  if (entry.children && entry.children.length > 0) return "dir";
  if (entry.name.endsWith("/")) return "dir";
  return "file";
}

function FileTreeNode({
  entry,
  depth,
  isLast,
  prefix,
}: {
  entry: FileTreeEntry;
  depth: number;
  isLast: boolean;
  prefix: string;
}) {
  const type = inferType(entry);
  const branch = depth === 0 ? "" : isLast ? "└─ " : "├─ ";
  const nextPrefix = depth === 0 ? "" : prefix + (isLast ? "   " : "│  ");
  const displayName =
    entry.name.replace(/\/$/, "") + (type === "dir" ? "/" : "");
  const children = entry.children ?? [];

  return (
    <>
      <li className="font-mono text-xs">
        <span className="text-[color:var(--color-fg-muted)]">{prefix}</span>
        <span className="text-[color:var(--color-fg-muted)]">{branch}</span>
        <span
          className={
            type === "dir"
              ? "text-[color:var(--color-fg)]"
              : "text-[color:var(--color-fg-subtle)]"
          }
        >
          {displayName}
        </span>
        {entry.comment ? (
          <span className="ml-3 text-[color:var(--color-fg-muted)]">
            # {entry.comment}
          </span>
        ) : null}
      </li>
      {children.map((child, index) => (
        <FileTreeNode
          key={child.name + index}
          entry={child}
          depth={depth + 1}
          isLast={index === children.length - 1}
          prefix={nextPrefix}
        />
      ))}
    </>
  );
}

export function FileTree({ entries, rootLabel }: FileTreeProps) {
  return (
    <div className="my-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-subtle)] p-3">
      <ul className="flex flex-col gap-0.5">
        {rootLabel ? (
          <li className="font-mono text-xs text-[color:var(--color-fg)]">
            {rootLabel}
          </li>
        ) : null}
        {entries.map((entry, index) => (
          <FileTreeNode
            key={entry.name + index}
            entry={entry}
            depth={0}
            isLast={index === entries.length - 1}
            prefix=""
          />
        ))}
      </ul>
    </div>
  );
}
