import type { ReactNode } from "react";

export type SidebarLayoutProps = {
  /**
   * The content to display in the main area (typically ListLayout, DetailsLayout, or custom content)
   */
  children: ReactNode;
  /**
   * Optional className for the wrapper
   */
  className?: string;
};

/**
 * SidebarLayout - Wrapper component that pairs with the Sidebar for responsive layouts
 *
 * This component provides the correct structure for content that sits next to the Sidebar:
 * - On desktop (≥768px): Content appears to the right of the fixed sidebar
 * - On mobile (<768px): Content fills the screen below the mobile header (57px)
 *
 * @example
 * ```tsx
 * // In your page component
 * const MyPage = () => (
 *   <SidebarLayout>
 *     <ListLayout>
 *       <ListLayout.Header pageTitle="My Page" />
 *       <ListLayout.Content>
 *         {// Your content here}
 *       </ListLayout.Content>
 *     </ListLayout>
 *   </SidebarLayout>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With DetailsLayout
 * const DetailPage = () => (
 *   <SidebarLayout>
 *     <DetailsLayout>
 *       {// Your detail content}
 *     </DetailsLayout>
 *   </SidebarLayout>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With custom content
 * const CustomPage = () => (
 *   <SidebarLayout>
 *     <div className="p-4">
 *       {// Your custom layout}
 *     </div>
 *   </SidebarLayout>
 * );
 * ```
 *
 * **Note:** This component is designed to work with the AppWrapper and AuthWrapper
 * which already provide the Sidebar. Do not manually add a Sidebar component
 * when using SidebarLayout.
 *
 * **Layout Structure:**
 * ```
 * AppWrapper
 * └─ AuthWrapper
 *    ├─ Sidebar (responsive, provided by AuthWrapper)
 *    └─ SidebarLayout (this component)
 *       └─ Your content (ListLayout, DetailsLayout, etc.)
 * ```
 */
export const SidebarLayout = ({
  children,
  className = "",
}: SidebarLayoutProps) => {
  return (
    <div
      className={`flex-1 h-layout-content-mobile md:h-layout-content-desktop ${className}`}
    >
      {children}
    </div>
  );
};
