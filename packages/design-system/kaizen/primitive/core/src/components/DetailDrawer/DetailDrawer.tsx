import { type VariantProps, cva } from "class-variance-authority";
import React, { useCallback, useEffect, useRef, useState } from "react";

import withDelayedUnmount from "#src/HoC/withDelayedUnmount";
import withEscapeHandler from "#src/HoC/withEscapeHandler";
import Button, { ButtonProps } from "#src/components/Button";
import { useScreenType } from "#src/hooks/use-screen-type";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

import { WithTooltip, withTooltip } from "../Tooltip";

// Base drawer styles - positioned fixed for overlay behavior
const defaultClasses = [
  "fixed",
  "bg-surface-default-elevated",
  "border-stroke-default",
  "z-50",
  "flex",
  "flex-col",
] as const;

// Responsive positioning and sizing variants
const variants = {
  // Desktop: slide from right, mobile: slide from bottom
  screenType: {
    desktop: [
      "min-w-[420px]",
      "top-0",
      "right-0",
      "h-full",
      "border-l-stroke-thin",
    ],
    mobile: [
      "bottom-0",
      "left-0",
      "w-full",
      "h-[90vh]", // Partial height on mobile
      "max-h-screen", // Partial height on mobile (iOS issues of height calculations requires this to not have content blocked by the top search bar on safari or other browsers)
      "border-t-stroke-thin",
    ],
  },
  // Controls visibility and transform
  openByOrientation: {
    "mobile-true": ["animate-slide-in-bottom"],
    "mobile-false": ["animate-slide-out-bottom"],
    "desktop-true": ["animate-slide-in-right"],
    "desktop-false": ["animate-slide-out-right"],
  },
} as const;

const detailDrawer = cva(defaultClasses, {
  variants,
  defaultVariants: {
    screenType: "desktop",
    openByOrientation: "desktop-false",
  },
});

// Header section with close button
const headerClasses = [
  "flex",
  "items-center",
  "justify-between",
  "p-md",
  "border-b-stroke-thin",
  "border-b-stroke-divider",
  "bg-surface-default-elevated",
] as const;

const header = cva(headerClasses);

// Content area - scrollable
const contentClasses = [
  "flex-1",
  "overflow-y-auto",
  "p-md",
  "space-y-md",
] as const;

const content = cva(contentClasses);

export type DetailDrawerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof detailDrawer> & {
    /** Controls whether the drawer is visible */
    isOpen: boolean;
    /** String to identify the object in the DOM */
    id: string;
    /** Optional custom content to render instead of default item display */
    children?: React.ReactNode;
    /** Function called when drawer should close */
    onClose: () => void;
    /** Optional - Tupple of two actions to add at the end of the Detail Drawer component*/
    actionsConfig?: [WithTooltip<ButtonProps>, WithTooltip<ButtonProps>];
  };

type ComponentProps = DetailDrawerProps & {
  shouldRender: boolean; // Controls whether to render the drawer content
};

const ButtonWithTooltip = withTooltip(Button);

/**
 * DetailDrawer - A transient, side-mounted container for viewing or minimally editing a selected item within a broader context.
 *
 * The drawer slides in from the right side on desktop and from the bottom on mobile, providing a non-blocking overlay
 * that keeps the main page visible and interactive. It's designed for quick actions, lightweight forms, or displaying
 * metadata without disrupting the user's workflow.
 *
 * Key Features:
 * - Responsive design with different slide directions (right on desktop, bottom on mobile)
 * - Non-blocking overlay with no backdrop - main page remains fully interactive
 * - Keyboard accessible with Escape key support for closing
 * - Navigation controls for cycling through items (previous/next buttons)
 * - Lightweight and focused on single-object interactions
 * - Proper elevation and shadow for visual separation
 * - Semantic HTML with appropriate ARIA roles and labels
 *
 * Design Principles:
 * - Transient: Intended for temporary interactions, not persistent UI
 * - Context-aware: Maintains visual connection to the item that triggered it
 * - Non-modal: Doesn't block access to the underlying page
 * - Focused: Scoped to one object, avoiding complex multi-step workflows
 *
 * @component
 * @example
 * // Basic usage with custom content
 * <DetailDrawer
 *   id="user-drawer"
 *   isOpen={isDrawerOpen}
 *   onClose={() => setIsDrawerOpen(false)}
 * >
 *   <div>
 *     <h3>User Profile</h3>
 *     <p>Name: John Doe</p>
 *     <p>Email: john@example.com</p>
 *   </div>
 * </DetailDrawer>
 *
 * @example
 * // With navigation controls for cycling through items
 * <DetailDrawer
 *   id="product-drawer"
 *   isOpen={isDrawerOpen}
 *   onClose={() => setIsDrawerOpen(false)}
 *   onPrevious={() => selectPreviousProduct()}
 *   onNext={() => selectNextProduct()}
 * >
 *   <ProductDetails product={selectedProduct} />
 * </DetailDrawer>
 *
 * @example
 * // Integrated with a list component
 * const [selectedItem, setSelectedItem] = useState(null);
 * const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 *
 * const handleItemSelect = (item) => {
 *   setSelectedItem(item);
 *   setIsDrawerOpen(true);
 * };
 *
 * return (
 *   <>
 *     <List items={items} onItemClick={handleItemSelect} />
 *     <DetailDrawer
 *       id="item-drawer"
 *       isOpen={isDrawerOpen}
 *       onClose={() => setIsDrawerOpen(false)}
 *     >
 *       <ItemDetails item={selectedItem} />
 *     </DetailDrawer>
 *   </>
 * );
 *
 * @param {boolean} props.isOpen - Controls whether the drawer is visible. When true, the drawer slides in with appropriate animation.
 * @param {string} props.id - Unique identifier for the drawer DOM element. Used for accessibility and DOM targeting.
 * @param {React.ReactNode} [props.children] - Optional custom content to render within the drawer. If not provided, the drawer will render empty content area.
 * @param {Function} props.onClose - Function called when the drawer should close. Triggered by the close button or Escape key press.
 * @param {Function} [props.onPrevious] - Optional function called when clicking the previous button. If not provided, the previous button is not shown.
 * @param {Function} [props.onNext] - Optional function called when clicking the next button. If not provided, the next button is not shown.
 * @param {string} [props.className] - Additional CSS classes to apply to the drawer container.
 * @param {React.HTMLAttributes<HTMLDivElement>} [props...] - Additional HTML attributes to apply to the drawer element.
 *
 * @returns {JSX.Element | null} The rendered drawer component, or null if not open and should not render.
 *
 * @see Button - Used for navigation and close controls
 * @see ListLayout - Common integration pattern for list-based interfaces
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-detaildrawer--docs
 */
const DetailDrawerComponent: React.FC<ComponentProps> = ({
  className,
  id,
  isOpen,
  children,
  onClose,
  actionsConfig,
  shouldRender,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [openByOrientation, setOpenByOrientation] = useState<
    "desktop-true" | "desktop-false" | "mobile-true" | "mobile-false" | null
  >("desktop-false");
  const [cachedContent, setCachedContent] = useState<React.ReactNode>(children);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { isResponsiveRequired } = useScreenType();

  useEffect(() => {
    if (isOpen) {
      setCachedContent(children); // Cache content when opening
    }
  }, [isOpen, children]);

  const getOpenByOrientation = useCallback(() => {
    if (isResponsiveRequired) {
      return isOpen ? "mobile-true" : "mobile-false";
    }
    return isOpen ? "desktop-true" : "desktop-false";
  }, [isOpen, isResponsiveRequired]);

  useEffect(() => {
    setOpenByOrientation(getOpenByOrientation());
  }, [getOpenByOrientation]);

  if (!shouldRender) {
    return null; // Don't render anything if not open
  }

  return (
    <aside
      data-component="Kaizen-DetailDrawer"
      ref={drawerRef}
      className={detailDrawer({
        openByOrientation: openByOrientation,
        screenType: isResponsiveRequired ? "mobile" : "desktop",
        className,
      })}
      role="complementary"
      aria-label={id || "Detail drawer"}
      aria-modal="false" // Not modal - main page remains interactive
      {...props}
    >
      {/* Header with close button */}
      <header className={header()}>
        <ButtonWithTooltip
          id={`close-detail-drawer-${id}`}
          intent="flat"
          size="sm"
          color="default"
          label={t("detailDrawer.tooltip.close")}
          kind="icon-button"
          icon={
            isResponsiveRequired
              ? "chevron-down-double"
              : "chevron-right-double"
          }
          onClick={onClose}
          tooltipProps={{
            label: t("detailDrawer.tooltip.close"),
            placement: "bottom-left",
          }}
        />
        <div className="flex flex-row gap-xs">
          {(actionsConfig || []).map((action) => (
            <ButtonWithTooltip
              key={action.id}
              {...action}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick?.(event);
              }}
            />
          ))}
        </div>
      </header>

      {/* Content area - scrollable and interactive */}
      <div className={content()}>{cachedContent ? cachedContent : null}</div>
    </aside>
  );
};

DetailDrawerComponent.displayName = "KaizenDetailDrawerComponent";

const DetailDrawer = withEscapeHandler(
  withDelayedUnmount(DetailDrawerComponent, {
    animationDuration: 300, // Match the CSS animation duration
  }),
);

DetailDrawer.displayName = "KaizenDetailDrawer";

export default DetailDrawer;
