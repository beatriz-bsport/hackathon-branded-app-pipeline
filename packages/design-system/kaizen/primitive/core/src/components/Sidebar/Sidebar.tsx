import { type VariantProps, cva, cx } from "class-variance-authority";
import React, { useCallback, useEffect, useId, useState } from "react";
import { createPortal, flushSync } from "react-dom";

import Button from "#src/components/Button";
import { useDocumentOverflow } from "#src/components/private/Dialog/use-document-overflow";
import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import { useFocusManagement } from "#src/hooks/use-focus-management";
import { useMatchMedia } from "#src/hooks/use-match-media";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const defaultClasses = [
  "w-layout-sidebar py-md",
  "shrink-0",
  "border-r-stroke-default border-r-stroke-thin",
  "bg-surface-page-navigation",
  "will-change-transform",
] as const;

const variants = {
  platform: {
    desktop: "hidden md:flex md:flex-col md:h-screen",
    mobile:
      "flex flex-col fixed left-0 top-layout-mobile-sidebar-offset h-layout-content-mobile shadow-lg",
  },
  state: {
    open: "animate-slide-in-left",
    closed: "animate-slide-out-left",
  },
} as const;

const sidebar = cva(defaultClasses, {
  variants,
  compoundVariants: [
    {
      platform: "desktop",
      state: "open",
      class: "!animate-none",
    },
    {
      platform: "desktop",
      state: "closed",
      class: "!animate-none",
    },
  ],
  defaultVariants: {
    platform: "desktop",
    state: "open",
  },
});

type InternalVariants = "platform" | "state";
type VariantSidebarProps = Omit<VariantProps<typeof sidebar>, InternalVariants>;

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantSidebarProps & {
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    withPortal?: boolean;
    topbarSlot?: React.ReactNode;
    /**
     * Controlled state for mobile sidebar open/close.
     * When provided, the component becomes controlled.
     */
    isOpen?: boolean;
    /**
     * Callback fired when the sidebar open state changes.
     * Use with `isOpen` for controlled behavior.
     */
    onOpenChange?: (isOpen: boolean) => void;
  };

type MobileOverlayProps = {
  children: React.ReactNode;
  isOpen: boolean;
  shouldRender: boolean;
  onBackdropClick: () => void;
  onAnimationEnd: (event: React.AnimationEvent<HTMLElement>) => void;
  className?: string;
  sidebarId: string;
  withPortal: boolean;
  ariaLabel: string;
};

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  children,
  isOpen,
  shouldRender,
  onBackdropClick,
  onAnimationEnd,
  className,
  sidebarId,
  ariaLabel,
  withPortal = true,
}) => {
  const containerRef = useFocusManagement<HTMLElement>(isOpen);

  if (!shouldRender) {
    return null;
  }

  const content = (
    <>
      <div
        className="fixed left-0 right-0 bottom-0 top-layout-mobile-sidebar-offset bg-black/20"
        onClick={onBackdropClick}
        aria-hidden="true"
      />
      <aside
        id={sidebarId}
        ref={containerRef as React.RefObject<HTMLElement>}
        className={sidebar({
          className,
          platform: "mobile",
          state: isOpen ? "open" : "closed",
        })}
        onAnimationEnd={onAnimationEnd}
        role="navigation"
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </aside>
    </>
  );

  return withPortal ? createPortal(content, document.body) : content;
};

const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = "",
  ariaLabel,
  withPortal = true,
  topbarSlot,
  isOpen: controlledIsOpen,
  onOpenChange,
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [shouldRenderMobileSidebar, setShouldRenderMobileSidebar] =
    useState(false);
  const { setOverflowHidden, resetOverflow } = useDocumentOverflow();
  const sidebarId = useId();
  const isDesktop = useMatchMedia("md");

  // Support both controlled and uncontrolled mode
  const isControlled = controlledIsOpen !== undefined;
  const isMobileMenuOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalIsOpen(value);
      }
    },
    [isControlled, onOpenChange],
  );

  const resolvedAriaLabel = ariaLabel ?? t("sidebar.ariaLabel");

  const handleOpenMenu = () => {
    flushSync(() => setShouldRenderMobileSidebar(true));
    setIsOpen(true);
    setOverflowHidden();
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    if (isMobileMenuOpen) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  };

  const handleBackdropClick = () => {
    handleCloseMenu();
  };

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!isMobileMenuOpen && shouldRenderMobileSidebar) {
      setShouldRenderMobileSidebar(false);
      resetOverflow();
    }
  };

  useEscapeKeydownListener(handleCloseMenu, isMobileMenuOpen);

  useEffect(() => {
    if (isDesktop && (isMobileMenuOpen || shouldRenderMobileSidebar)) {
      setIsOpen(false);
      setShouldRenderMobileSidebar(false);
      resetOverflow();
    }
  }, [
    isDesktop,
    isMobileMenuOpen,
    shouldRenderMobileSidebar,
    resetOverflow,
    setIsOpen,
  ]);

  return (
    <>
      <aside
        className={sidebar({ className })}
        role="navigation"
        aria-label={resolvedAriaLabel}
        {...props}
      >
        {children}
      </aside>

      <div className="md:hidden">
        <div
          className={cx(
            "p-sm h-layout-mobile-header box-border",
            "bg-surface-page-navigation",
            "flex items-center justify-between",
            "border-b-stroke-thin border-b-stroke-weak",
          )}
        >
          <Button
            kind="icon-button"
            label={
              isMobileMenuOpen ? t("sidebar.closeMenu") : t("sidebar.openMenu")
            }
            icon="layout-left"
            intent="default"
            size="md"
            color="main"
            onClick={toggleMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls={sidebarId}
          />
          {topbarSlot}
        </div>

        {!isDesktop && (
          <MobileOverlay
            isOpen={isMobileMenuOpen}
            shouldRender={shouldRenderMobileSidebar}
            onBackdropClick={handleBackdropClick}
            onAnimationEnd={handleAnimationEnd}
            className={className}
            sidebarId={sidebarId}
            withPortal={withPortal}
            ariaLabel={resolvedAriaLabel}
          >
            {children}
          </MobileOverlay>
        )}
      </div>
    </>
  );
};

Sidebar.displayName = "KaizenSidebar";

export default Sidebar;
