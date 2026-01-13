import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

import DataActionsSection, {
  type DataActionsSectionProps,
} from "./DataActionsSection";
import PageActionsSection, {
  type PageActionsSectionProps,
} from "./PageActionsSection";

const variants = {
  withBottomDivider: {
    true: ["border border-stroke-weak border-b-solid border-b-stroke-thin"],
    false: [],
  },
} as const;

const layoutHeader = cva("", { variants });

export type HeaderLayoutProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof layoutHeader> &
  DataActionsSectionProps &
  PageActionsSectionProps;

/**
 * A configurable header component designed for B2B pages.
 * It provides a consistent layout for all pages, while supporting various features
 * such as breadcrumbs, tabs, filters, and custom actions.
 *
 * @param props.breadcrumbsItems Optional. Array of breadcrumb items to display.
 * @param props.buttons Optional. Array of button configurations to render custom actions.
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.callToActionButton Optional. Button that should be CTA.
 * @param props.endGroupActions Optional. Array of ReactNode to display next to the CTA Button.
 * @param props.filterConfig Optional. Configuration for the filter component.
 * @param props.onDisplayPopover Optional. ReactNode to display inside the popover triggered by the display button.
 * @param props.onEditTitleClick Optional. Callback function triggered when the Edit icon next to the title is clicked.
 * @param props.pageStatusBadge Optional. Configuration for badge displayed new to the page title.
 * @param props.pageStatusChip Optional. Configuration for chip displayed new to the page title.
 * @param props.pageTabs Optional. Configuration for tabs displayed below the page title.
 * @param props.pageTitle Title of the page and it also adds the html title. Limited to 2 lines with truncation & hyphenation when space constrained.
 * @param props.searchConfig Optional. Configuration for search input.
 * @param props.startGroupActions Optional. Array of ReactNode to align with the CTA Button with a Divider separation.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 */
const LayoutHeader: React.FC<HeaderLayoutProps> = ({
  breadcrumbsItems,
  BreadcrumbsItems,
  className,
  callToActionButton,
  endGroupActions,
  filterConfig,
  filterRef,
  onDisplayPopover,
  onEditTitleClick,
  pageStatusBadge,
  pageStatusChip,
  pageTabs,
  pageTitle,
  searchConfig,
  startGroupActions,
  ...props
}) => {
  const hasDataActionsLayer =
    !!filterConfig || !!onDisplayPopover || !!searchConfig;
  // As the Tabs compoennt from the Page Actions Layer has its own Bottom Divider with specific padding,
  // The Header container bottom divider should not be displayed when there are Tabs but no LayerDataActions
  const withoutBottomDivider = !hasDataActionsLayer && !!pageTabs;
  return (
    <div
      data-component="Kaizen-HeaderLayout"
      className={layoutHeader({
        className,
        withBottomDivider: !withoutBottomDivider,
      })}
      {...props}
    >
      <title>{pageTitle}</title>
      <PageActionsSection
        breadcrumbsItems={breadcrumbsItems}
        BreadcrumbsItems={BreadcrumbsItems}
        callToActionButton={callToActionButton}
        endGroupActions={endGroupActions}
        onEditTitleClick={onEditTitleClick}
        pageStatusBadge={pageStatusBadge}
        pageStatusChip={pageStatusChip}
        pageTabs={pageTabs}
        pageTitle={pageTitle}
        startGroupActions={startGroupActions}
      />
      <DataActionsSection
        filterConfig={filterConfig}
        filterRef={filterRef}
        onDisplayPopover={onDisplayPopover}
        searchConfig={searchConfig}
      />
    </div>
  );
};

LayoutHeader.displayName = "KaizenLayoutHeader";

export default LayoutHeader;
