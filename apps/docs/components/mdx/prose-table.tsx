import type { ComponentPropsWithoutRef } from "react";

export function ProseTable({
  children,
  ...props
}: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="docs-table-card">
      <table {...props}>{children}</table>
    </div>
  );
}
