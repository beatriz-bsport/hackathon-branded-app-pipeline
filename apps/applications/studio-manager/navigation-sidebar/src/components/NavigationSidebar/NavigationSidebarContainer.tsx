import type { FC, PropsWithChildren } from "react";

type NavigationSidebarContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const NavigationSidebarContainer: FC<
  NavigationSidebarContainerProps
> = ({ className = "", children }) => {
  return (
    <div
      className={[
        "h-screen w-[240px] py-md",
        "shrink-0 flex flex-col",
        "shadow-inner shadow-action-default-rest",
        "bg-surface-page-navigation",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};
