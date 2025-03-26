import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import HeaderLayout from "#src/components/private/HeaderLayout";

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
]);

/**
 * Define Layout for List pages, with two subcomponents:
 * - ListLayout.Header : See https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 * - ListLayout.Content
 * The Header will stick to the top of the page while the Content
 * will be scrollable if its content exceeds the window height
 * @param props.className Optional. Custom CSS classes for the container.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-listlayout--docs
 */
const ListLayout: React.FC<ListLayoutProps> & {
  Header: typeof HeaderLayout;
  Content: typeof ListLayoutContent;
} = ({ className, children, ...props }: ListLayoutProps) => {
  return (
    <main className={listLayout({ className })} {...props}>
      {children}
    </main>
  );
};

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

const listLayoutContent = cva(["flex", "overflow-y-scroll", "h-full"], {
  variants: contentVariants,
});

type ListLayoutContentProps = {
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof listLayoutContent>;

/**
 * Wrapper for the content handling scrolling behavior
 * @param props.className Optional. Custom CSS classes for the container.
 */
const ListLayoutContent: React.FC<ListLayoutContentProps> = ({
  children,
  className,
  showScrollbar = false,
}) => {
  return (
    <div className={listLayoutContent({ className, showScrollbar })}>
      {children}
    </div>
  );
};

ListLayout.Content = ListLayoutContent;

// ----- Export ListLayout -----

ListLayout.displayName = "KaizenListLayout";

export default ListLayout;
