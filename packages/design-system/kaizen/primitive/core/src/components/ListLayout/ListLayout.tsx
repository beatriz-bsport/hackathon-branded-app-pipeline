import { type VariantProps, cva } from "class-variance-authority";
import React, { ReactNode } from "react";

import HeaderLayout from "#src/components/private/HeaderLayout";
import { useAdaptiveActions } from "#src/components/private/HeaderLayout/use-adaptive-actions";
import LayoutButton from "#src/components/private/LayoutButton";

export type ListLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const listLayout = cva([
  "h-screen",
  "w-full",
  "flex",
  "flex-col",
  "border-stroke-page-layout",
  "border-l-stroke-thin",
  "shadow-sm",
  // This is required to align a potential table with the header layout.
  "[&_.table-row>.table-cell:first-child]:pl-md",
]);

/**
 * Define Layout for List pages, with three subcomponents:
 * - ListLayout.Header : See https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 * - ListLayout.Content
 * - ListLayout.Button : Responsive button that adapts to mobile/desktop screens
 * The Header will stick to the top of the page while the Content
 * will be scrollable if its content exceeds the window height
 * @param props.className Optional. Custom CSS classes for the container.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-listlayout--docs
 */
interface ListLayoutStatics {
  Header: typeof HeaderLayout;
  Content: typeof ListLayoutContent;
  Button: typeof LayoutButton;
  useAdaptiveActions: typeof useAdaptiveActions;
}

const ListLayoutComponent: React.FC<ListLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <main
      data-component="Kaizen-ListLayout"
      className={listLayout({ className })}
      {...props}
    >
      {children}
    </main>
  );
};

const ListLayout = ListLayoutComponent as React.FC<ListLayoutProps> &
  ListLayoutStatics;

// ----- Header -----

/**
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 */
ListLayout.Header = HeaderLayout;

// ----- Content -----

const contentVariants = {
  showScrollbar: {
    true: [],
    false: ["hide-scrollbar"],
  },
};

const listLayoutContent = cva(["overflow-y-scroll", "h-full"], {
  variants: contentVariants,
});

type ListLayoutContentProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof listLayoutContent>;

/**
 * Wrapper for the content handling scrolling behavior
 * @param children The content to be displayed inside the ListLayout.
 * @param className Optional. Custom CSS classes for the container.
 * @param showScrollbar Optional. If true, the scrollbar will be shown.
 */
const ListLayoutContent: React.FC<ListLayoutContentProps> = ({
  children,
  className,
  showScrollbar = false,
}) => {
  return (
    <div
      data-component="Kaizen-ListLayout-Content"
      className={listLayoutContent({ className, showScrollbar })}
    >
      {children}
    </div>
  );
};

ListLayout.Content = ListLayoutContent;

// ----- Button -----

/**
 * Responsive button that shows full button on desktop (≥640px)
 * and icon-only button on mobile (<640px)
 */
ListLayout.Button = LayoutButton;

// ----- Export ListLayout -----

ListLayout.displayName = "KaizenListLayout";

// ----- Adaptive Actions (mobile dropdown) -----
// Static export to access the adaptive actions hook directly from the layout
// Usage:
// const adaptive = ListLayout.useAdaptiveActions({ endGroupActions: [...] });
// <ListLayout.Header pageTitle="..." {...adaptive} />
ListLayout.useAdaptiveActions = useAdaptiveActions;

export default ListLayout;
