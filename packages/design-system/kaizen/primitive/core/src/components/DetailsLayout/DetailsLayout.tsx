import { cva } from "class-variance-authority";
import {
  type CSSProperties,
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
};

const DetailsLayout = forwardRef<LayoutProviderRef, DetailsLayoutProps>(
  ({ children, ...props }, ref) => {
    return (
      <LayoutProvider ref={ref}>
        <Main {...props}>{children}</Main>
      </LayoutProvider>
    );
  },
) as DetailsLayoutComponent;

function Main({ className, ...props }: DetailsLayoutProps) {
  const { hasUnsavedChanges, isPanelOpened } = useLayoutContext();
  const panelWidth = isPanelOpened ? SIDE_PANEL_WIDTH : 0;
  const confirmHeight = hasUnsavedChanges ? "auto" : "0fr";

  return (
    <main
      {...props}
      className={detailsLayout({ className })}
      style={
        {
          overflow: panelWidth ? "hidden" : "auto",
          "--aside-width": `${panelWidth}px`,
          "--confirm-height": confirmHeight,
          gridTemplateColumns: "1fr var(--aside-width)",
          gridTemplateRows: "auto var(--confirm-height) 1fr",
        } as CSSProperties
      }
    />
  );
}

// ----- Header -----
const detailsLayoutHeader = cva(["[grid-area:header]"]);

/**
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-private-headerlayout--docs
 */
const DetailsLayoutHeader = ({ className, ...props }: HeaderLayoutProps) => {
  return (
    <HeaderLayout {...props} className={detailsLayoutHeader({ className })} />
  );
};
DetailsLayout.Header = DetailsLayoutHeader;

// ----- Content -----

const detailsLayoutContent = cva([
  "[grid-area:content]",
  "p-md",
  "overflow-y-scroll",
  "m-[0_auto]",
  "w-full",
  "max-w-component-content-centered",
]);

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
  return (
    <div className={detailsLayoutContent({ className })} {...htmlProps}>
      {children}
    </div>
  );
};

DetailsLayout.Content = DetailsLayoutContent;

// ----- Panel -----

const detailsLayoutPanel = cva([
  "[grid-area:aside]",
  "bg-surface-page-navigation",
  "border-l-stroke-weak",
  "border-l-stroke-thin",
  "overflow-y-scroll",
  "p-md",
  "h-full",
]);

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
  const { isPanelOpened } = useLayoutContext();
  return (
    <aside
      className={detailsLayoutPanel({ className })}
      aria-hidden={!isPanelOpened}
      {...htmlProps}
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
    "items-center",
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
  onDiscard?: () => void;
  onSave?: () => void;
};

/**
 * Wrapper for the unsaved changes confirmation alert
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.onDiscard Optional. Callback to handle discard changes
 * @param props.onSave Optional. Callback to handle save changes
 */
const DetailsLayoutConfirmation: FC<DetailsLayoutConfirmationProps> = ({
  className,
  onDiscard,
  onSave,
  ...htmlProps
}) => {
  const { hasUnsavedChanges, toggleHasUnsavedChanges } = useLayoutContext();
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const handleSave = () => {
    onSave?.();
    toggleHasUnsavedChanges();
  };

  const handleDiscard = () => {
    onDiscard?.();
    toggleHasUnsavedChanges();
  };

  return (
    <div
      className={detailsLayoutConfirmation({ className, hasUnsavedChanges })}
      aria-hidden={!hasUnsavedChanges}
      {...htmlProps}
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
          <Button
            className="ml-[auto]"
            label={t("detailsLayout.confirmation.discard")}
            size="md"
            intent="flat"
            color="default"
            onClick={handleDiscard}
          />
          <Button
            label={t("detailsLayout.confirmation.save")}
            size="md"
            intent="default"
            color="main"
            onClick={handleSave}
          />
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

export default DetailsLayout;
