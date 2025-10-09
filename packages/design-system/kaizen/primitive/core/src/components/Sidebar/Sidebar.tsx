import { type VariantProps, cva } from "class-variance-authority";
import React, { useEffect, useId, useState } from "react";
import { createPortal, flushSync } from "react-dom";

import Button from "#src/components/Button";
import { useDocumentOverflow } from "#src/components/private/Dialog/use-document-overflow";
import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import { useFocusManagement } from "#src/hooks/use-focus-management";
import { useMatchMedia } from "#src/hooks/use-match-media";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

// padding bottom|top + icon button height + border
const MOBILE_HEADER_HEIGHT = 2 * 12 + 32 + 1;

const defaultClasses = [
  "h-screen w-[300px] py-md",
  "shrink-0 flex flex-col",
  "shadow-inner shadow-action-default-rest",
  "bg-surface-page-navigation",
  "will-change-transform",
] as const;

const variants = {
  display: {
    desktop: "hidden md:flex",
    mobile: "fixed left-0",
  },
  animation: {
    "slide-in": "animate-slide-in-left",
    "slide-out": "animate-slide-out-left",
    none: "",
  },
} as const;

const sidebar = cva(defaultClasses, { variants });

type InternalVariants = "display" | "animation";
type VariantSidebarProps = Omit<VariantProps<typeof sidebar>, InternalVariants>;

export type SidebarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantSidebarProps & {
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
    withPortal?: boolean;
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

  const mobilePanelStyle: React.CSSProperties = {
    top: MOBILE_HEADER_HEIGHT,
    height: `calc(100vh - ${MOBILE_HEADER_HEIGHT}px)`,
  };

  const backdropStyle: React.CSSProperties = {
    top: MOBILE_HEADER_HEIGHT,
  };

  const content = (
    <>
      <div
        className="fixed left-0 right-0 bottom-0 bg-black/20"
        style={backdropStyle}
        onClick={onBackdropClick}
        aria-hidden="true"
      />
      <aside
        id={sidebarId}
        ref={containerRef as React.RefObject<HTMLElement>}
        className={sidebar({
          className,
          display: "mobile",
          animation: isOpen ? "slide-in" : "slide-out",
        })}
        onAnimationEnd={onAnimationEnd}
        style={mobilePanelStyle}
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
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldRenderMobileSidebar, setShouldRenderMobileSidebar] =
    useState(false);
  const { setOverflowHidden, resetOverflow } = useDocumentOverflow();
  const sidebarId = useId();
  const isDesktop = useMatchMedia("md");

  const resolvedAriaLabel = ariaLabel ?? t("sidebar.ariaLabel");

  const handleOpenMenu = () => {
    flushSync(() => setShouldRenderMobileSidebar(true));
    setIsMobileMenuOpen(true);
    setOverflowHidden();
  };

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
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
      setIsMobileMenuOpen(false);
      setShouldRenderMobileSidebar(false);
      resetOverflow();
    }
  }, [isDesktop, isMobileMenuOpen, shouldRenderMobileSidebar, resetOverflow]);

  return (
    <>
      <aside
        className={sidebar({ className, display: "desktop" })}
        role="navigation"
        aria-label={resolvedAriaLabel}
        {...props}
      >
        {children}
      </aside>

      <div className="md:hidden">
        <div
          className="p-sm bg-surface-page-navigation border-b-stroke-thin border-b-[var(--kz-color-shadow-weak)] border-solid"
          style={{ height: MOBILE_HEADER_HEIGHT, boxSizing: "border-box" }}
        >
          <Button
            intent="default"
            size="md"
            color="main"
            iconLeft="layout-left"
            onClick={toggleMenu}
            aria-label={
              isMobileMenuOpen ? t("sidebar.closeMenu") : t("sidebar.openMenu")
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls={sidebarId}
          />
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
