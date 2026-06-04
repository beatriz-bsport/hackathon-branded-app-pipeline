import type { ReactNode } from "react";

export function ThreadListStatus({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center p-md">
      {children}
    </div>
  );
}
