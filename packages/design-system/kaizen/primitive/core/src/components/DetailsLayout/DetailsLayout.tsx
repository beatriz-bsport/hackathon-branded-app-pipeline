import { cva } from "class-variance-authority";
import {
  type FC,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type PropsWithChildren,
  type ReactNode,
  type RefAttributes,
  forwardRef,
} from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import HeaderLayout, {
  HeaderLayoutProps,
} from "#src/components/private/HeaderLayout";
import { useAdaptiveActions } from "#src/components/private/HeaderLayout/use-adaptive-actions";
import LayoutButton from "#src/components/private/LayoutButton";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import {
  LayoutProvider,
  type LayoutProviderRef,
  useLayoutContext,
} from "./LayoutProvider";

const SIDE_PANEL_WIDTH = 320;

export type DetailsLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  withPanel?: boolean;
};

const detailsLayout = cva([
  "h-screen",
  "w-full",
  "grid",
  "border-stroke-page-layout",
  "border-l-stroke-thin",
  "shadow-sm",
  "[grid-template-areas:'header_header''confirm_aside''content_aside']",
  "transition-all",
  "duration-long",
  "relative",
]);

/**
 * Define Layout for Details pages, with five subcomponents:
 * - DetailsLayout.Header : See https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 * - DetailsLayout.Confirmation
 * - DetailsLayout.Content
 * - DetailsLayout.Panel
 * - DetailsLayout.Button : Responsive button that adapts to mobile/desktop screens
 * The Header will stick to the top of the page while the Content
 * will be scrollable if its content exceeds the window height
 * the Panel on the left side will ocuppy the whole height and can be collapsed/expanded -triggered using toggleIsPanelOpened-
 * the Confirmation on the bottom will appear when there are unsaved changes -triggered using toggleHasUnsavedChanges-
 * the placement of the subcomponents is not relevant because they are positioned using grid areas
 *
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.children Required. Place subcomponents here
 * @param props.withPanel Optional. Whether <DetaisLayout.Panel /> will be used. If true, the control button will be included. Default to false.
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-detailslayout--docs
 */
type DetailsLayoutComponent = ForwardRefExoticComponent<
  DetailsLayoutProps & RefAttributes<LayoutProviderRef>
> & {
  Header: typeof HeaderLayout;
  Content: typeof DetailsLayoutContent;
  Panel: typeof DetailsLayoutPanel;
  Confirmation: typeof DetailsLayoutConfirmation;
  Button: typeof LayoutButton;
  useAdaptiveActions: typeof useAdaptiveActions;
};

const DetailsLayout = forwardRef<LayoutProviderRef, DetailsLayoutProps>(
  ({ children, withPanel, ...props }, ref) => {
    return (
      <LayoutProvider ref={ref} withPanel={withPanel}>
        <Main {...props}>{children}</Main>
      </LayoutProvider>
    );
  },
) as DetailsLayoutComponent;

function Main({ className, ...props }: Omit<DetailsLayoutProps, "withPanel">) {
  const { hasUnsavedChanges, isPanelOpened, isMobile } = useLayoutContext();
  // On Mobile, Panel overlaps the Content
  const panelWidth = isPanelOpened && !isMobile ? SIDE_PANEL_WIDTH : 0;
  const confirmGridHeight = hasUnsavedChanges ? "auto" : "0fr";

  return (
    <main
      {...props}
      className={detailsLayout({ className })}
      style={{
        overflow: panelWidth ? "hidden" : "auto",
        "--aside-width": `${panelWidth}px`,
        "--confirm-grid-height": confirmGridHeight,
        gridTemplateColumns: isMobile ? "1fr" : "1fr var(--aside-width)",
        gridTemplateRows: "auto var(--confirm-grid-height) 1fr",
      }}
    />
  );
}

// ----- Header -----
const detailsLayoutHeader = cva(["[grid-area:header]"]);

/**
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 */
const DetailsLayoutHeader = ({
  className,
  endGroupActions,
  ...props
}: HeaderLayoutProps) => {
  const { withPanel, isMobile, toggleIsPanelOpened, isPanelOpened } =
    useLayoutContext();
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const panelButtonResponsiveConfig = isMobile
    ? ({ intent: "default", color: "main" } as const)
    : ({ color: "default", intent: "flat" } as const);

  const endGroupActionsWithPanel = withPanel
    ? [
        ...(endGroupActions ?? []),
        <Button
          key="details-layout-button-control-panel"
          size="md"
          kind="icon-button"
          icon="layout-right"
          aria-expanded={isPanelOpened}
          label={
            isPanelOpened
              ? t("detailsLayout.panelControlButton.closePanel")
              : t("detailsLayout.panelControlButton.openPanel")
          }
          onClick={() => toggleIsPanelOpened()}
          className="layout-toggle"
          {...panelButtonResponsiveConfig}
        />,
      ]
    : endGroupActions;

  return (
    <HeaderLayout
      {...props}
      endGroupActions={endGroupActionsWithPanel}
      className={detailsLayoutHeader({ className })}
    />
  );
};
DetailsLayout.Header = DetailsLayoutHeader;

// ----- Content -----

const detailsLayoutContent = cva(
  [
    "[grid-area:content]",
    "p-md",
    "m-[0_auto]",
    "w-full",
    "max-w-component-content-centered",
  ],
  {
    variants: {
      isPanelOpened: {
        true: "overflow-y-scroll",
        false: "",
      },
    },
  },
);

type DetailsLayoutContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
>;

/**
 * Wrapper for the content handling scrolling behavior
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.children Optional. Elements to place inside the Content
 */
const DetailsLayoutContent: FC<DetailsLayoutContentProps> = ({
  children,
  className,
  ...htmlProps
}) => {
  const { isPanelOpened } = useLayoutContext();

  return (
    <div
      className={detailsLayoutContent({ className, isPanelOpened })}
      {...htmlProps}
    >
      {children}
    </div>
  );
};

DetailsLayout.Content = DetailsLayoutContent;

// ----- Panel -----

const detailsLayoutPanel = cva(
  [
    "[grid-area:aside]",
    "bg-surface-page-navigation",
    "border-l-stroke-weak",
    "border-l-stroke-thin",
    "overflow-y-scroll",
    "h-full",
    "duration-short",
  ],
  {
    variants: {
      isMobile: {
        true: [
          "absolute",
          "right-0",
          // placed at top of grid container, but under confirmation
          "top-[var(--confirm-container-height)]",
          "z-40",
        ],
        false: "",
      },
      isOpenByDevice: {
        "mobile-true": [
          "animate-slide-in-right",
          "translate-x-0",
          "p-md",
          "w-[100vw]",
        ],
        "mobile-false": ["animate-slide-out-right", "translate-x-full", "w-0"],
        "desktop-true": "p-md",
        "desktop-false": "",
      },
    },
  },
);

type DetailsLayoutPanelProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
>;

/**
 * Wrapper for the side panel for extra config
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.children Optional. Elements to place inside the panel
 */
const DetailsLayoutPanel: FC<DetailsLayoutPanelProps> = ({
  className,
  children,
  ...htmlProps
}) => {
  const { isPanelOpened, isMobile, confirmationHeight } = useLayoutContext();
  const isOpenByDevice =
    `${isMobile ? "mobile" : "desktop"}-${isPanelOpened}` as const;
  return (
    <aside
      className={detailsLayoutPanel({
        className,
        isOpenByDevice,
        isMobile,
      })}
      aria-hidden={!isPanelOpened}
      {...htmlProps}
      style={{
        "--confirm-container-height": `${confirmationHeight}px`,
      }}
    >
      {children}
    </aside>
  );
};

DetailsLayout.Panel = DetailsLayoutPanel;

// ----- Confirmation -----

const detailsLayoutConfirmation = cva(
  [
    "[grid-area:confirm]",
    "bg-surface-status-warning-weak",
    "border-b-stroke-thin",
    "border-b-stroke-weak",
    "flex",
    "flex-wrap",
    "items-center",
    "justify-between",
    "gap-xs",
  ],
  {
    variants: {
      hasUnsavedChanges: {
        true: "py-xs px-md",
        false: "p-[0px]",
      },
    },
  },
);

type DetailsLayoutConfirmationProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
> & {
  onDiscard: () => void;
  onSave: () => void;
};

/**
 * Wrapper for the unsaved changes confirmation alert
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.onDiscard Required. Callback to handle discard changes
 * @param props.onSave Required. Callback to handle save changes
 */
const DetailsLayoutConfirmation: FC<DetailsLayoutConfirmationProps> = ({
  className,
  onDiscard,
  onSave,
  ...htmlProps
}) => {
  const { hasUnsavedChanges, confirmationRef } = useLayoutContext();
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return (
    <div
      className={detailsLayoutConfirmation({ className, hasUnsavedChanges })}
      aria-hidden={!hasUnsavedChanges}
      {...htmlProps}
      ref={confirmationRef}
    >
      {hasUnsavedChanges && (
        <>
          <Body
            className="text-onsurface-status-warning-strong"
            size="lg"
            color="inherit"
            weight="weak"
            htmlVariant="span"
          >
            {t("detailsLayout.confirmation.title")}
          </Body>
          <div className="flex flex-row items-center grow">
            <Button
              className="ml-[auto]"
              label={t("detailsLayout.confirmation.discard")}
              size="md"
              intent="flat"
              color="default"
              onClick={onDiscard}
            />
            <Button
              label={t("detailsLayout.confirmation.save")}
              size="md"
              intent="default"
              color="main"
              onClick={onSave}
            />
          </div>
        </>
      )}
    </div>
  );
};

DetailsLayout.Confirmation = DetailsLayoutConfirmation;

// ----- Button -----

/**
 * Responsive button that shows full button on desktop (≥640px)
 * and icon-only button on mobile (<640px)
 */
DetailsLayout.Button = LayoutButton;

// ----- Export DetailsLayout -----

DetailsLayout.displayName = "KaizenDetailsLayout";

// ----- Adaptive Actions (mobile dropdown) -----
// Static export to access the adaptive actions hook directly from the layout
// Usage:
// const adaptive = DetailsLayout.useAdaptiveActions({ endGroupActions: [...] });
// <DetailsLayout.Header pageTitle="..." {...adaptive} />
DetailsLayout.useAdaptiveActions = useAdaptiveActions;

export default DetailsLayout;
