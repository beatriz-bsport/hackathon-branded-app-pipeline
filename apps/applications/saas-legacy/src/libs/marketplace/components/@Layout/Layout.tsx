import React, { ReactNode } from 'react';
import HeaderLayout, {
  type PageTabs,
} from '#src/libs/marketplace/components/@Layout/HeaderLayout';
import './style.css';

export type LayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  pageTitle: string;
  pageTabs: PageTabs;
};

/**
 * Layout component for Marketplace pages.
 *
 * This component provides a consistent layout structure for Marketplace pages,
 * including a header with a title, tabs and filters, followed by the main content.
 *
 * @component
 * @param {string} props.pageTitle - The title to be displayed in the header.
 * @param {PageTabs} props.pageTabs - The tabs to be displayed in the header.
 * @param {ReactNode} props.children - The main content to be rendered within the layout.
 * @param {string} [props.className] - Additional CSS class names to apply to the main container.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props...] - Additional HTML attributes to apply to the main container.
 * @returns {JSX.Element} The rendered layout component.
 *
 */
const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  pageTabs,
  pageTitle,
  ...props
}) => {
  return (
    <main className="bs-marketplace-layout" {...props}>
      <HeaderLayout pageTabs={pageTabs} pageTitle={pageTitle} />
      <div className="bs-marketplace-layout__content">{children}</div>
    </main>
  );
};

export default Layout;
