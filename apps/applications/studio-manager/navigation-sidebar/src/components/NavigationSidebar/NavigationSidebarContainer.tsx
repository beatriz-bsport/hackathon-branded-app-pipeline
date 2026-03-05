import type { FC, PropsWithChildren } from "react";

import { cx } from "@bsport/kaizen-primitive-core";

type NavigationSidebarContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const NavigationSidebarContainer: FC<
  NavigationSidebarContainerProps
> = ({ className = "", children }) => {
  return (
    <aside
      role="navigation"
      className={cx(
        // KaizenSidebar default classes
        "w-layout-sidebar py-md",
        "shrink-0",
        "border-r-stroke-default border-r-stroke-thin",
        "bg-surface-page-navigation",
        // KaizenSidebar desktop classes
        "h-screen flex flex-col",
        className,
      )}
    >
      {children}
    </aside>
  );
};
