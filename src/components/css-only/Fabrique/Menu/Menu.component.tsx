import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { PortalContainer } from '#Fabrique/PortalContainer';
import { useCloseModal, usePopoverPositioning } from '#Fabrique/hooks';
import type { Horizontal, Vertical } from '#Fabrique/Types';
import { MENU_MARGIN } from './constants';
import {
  DELAY_DURATION,
  MARGIN_THRESHOLD,
  HorizontalEnum,
  VerticalEnum,
} from '#Fabrique/constants';
import './styles.css';

type MenuProps = {
  /**
   * An HTML Element used to set the position of the menu.
   */
  anchorEl?: HTMLElement;
  /**
   * Refers to the x coordinate on the anchor where the menu will attach to.
   * @type {Horizontal}
   */
  anchorOriginHorizontal?: Horizontal;
  /**
   * Refers to the y coordinate on the anchor where the menu will attach to.
   * @type {Vertical}
   */
  anchorOriginVertical?: Vertical;
  /**
   *Menu contents, normally MenuItems
   */
  children: React.ReactNode;
  /**
   *Override or extend the styles applied to the component.
   */
  className?: string;
  /**
   *Override or extend the styles applied to the a targeted element.
   */
  classes?: {
    menuContent: string;
  };
  /**
   *If true, the component is shown.
   */
  isOpen: boolean;
  /**
   * The id of the menu
   */
  id: string;
  /**
   * Callback fired when closing the menu, by clicking outside or by pressing Escape
   */
  onClose?: () => void;
  /**
   * The id used to identify the DOM element where the Menu will be rendered
   * @default {'bs-setup-variable'}
   */
  targetElementId?: string;
  /**
   * Refers to the x coordinate of the menu that will attach to the anchor's origin.
   * @type {Horizontal}
   */
  transformOriginHorizontal?: Horizontal;
  /**
   * Refers to the y coordinate of the menu that will attach to the anchor's origin.
   * @type {Vertical}
   */
  transformOriginVertical?: Vertical;
  /**
   * An optional string to set the class of the div element wrapping the menu
   * @type {string}
   */
  wrapperClass?: string;
  /**
   * The id used to identify the div element wrapping the menu
   * @type {string}
   * @default {'bs-fabrique-portal-container'}
   */
  wrapperId?: string;
  /**
   * The ref used to identify the div element wrapping the menu
   *
   * @type {React.MutableRefObject<HTMLDivElement>}
   */
  openMenuRef?: React.MutableRefObject<HTMLDivElement>;
  /**
   * An option to make the menu fit the width of the element used as ref.
   * @type {boolean}
   */
  isMenuWidthControlledByRef?: boolean;
};

const Menu: React.FC<MenuProps> = ({
  anchorEl,
  anchorOriginHorizontal = HorizontalEnum.LEFT,
  anchorOriginVertical = VerticalEnum.BOTTOM,
  isOpen,
  children,
  classes,
  className,
  targetElementId,
  transformOriginHorizontal = HorizontalEnum.LEFT,
  transformOriginVertical = VerticalEnum.TOP,
  wrapperClass,
  wrapperId,
  onClose,
  id,
  openMenuRef,
  isMenuWidthControlledByRef = false,
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const {
    isPositioned,
    setIsPositioned,
    setPositioningStyles,
    setPositionedToFalse,
    anchorElementDimensions,
    isBelowAnchorElement,
  } = usePopoverPositioning({
    margin: MENU_MARGIN,
    margin_threshold: MARGIN_THRESHOLD,
    ref: menuRef,
    isOpen,
    anchorEl,
    anchorOriginHorizontal,
    anchorOriginVertical,
    transformOriginHorizontal,
    transformOriginVertical,
  });
  const handleOnClose = React.useCallback(() => {
    onClose?.();
    setIsPositioned(false);
  }, [onClose, setIsPositioned]);

  const { modalRef } = useCloseModal({
    onClose: handleOnClose,
    openMenuRef,
    setPositionedToFalse,
  });

  // Need this to recalculate the position when scrolling
  React.useEffect(() => {
    window.addEventListener('scroll', setPositioningStyles);

    return () => window.removeEventListener('scroll', setPositioningStyles);
  }, [anchorEl, setPositioningStyles]);

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', setPositioningStyles);
      setTimeout(setPositioningStyles, DELAY_DURATION);
    } else {
      window.removeEventListener('scroll', setPositioningStyles);
    }
  });

  React.useEffect(() => {
    if (isOpen && isPositioned && contentRef.current) {
      // Focus on the menu or the first item when the menu is open
      contentRef.current.focus();
    }
  }, [isOpen, isPositioned]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && contentRef.current) {
      // Get all focusable elements inside the menu
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as NodeListOf<HTMLDivElement>;
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (document.activeElement === lastFocusable) {
        // When Tab pressed on the last element, move focus to the first
        event.preventDefault();
        focusableElements[0].focus();
      }
    }
  };

  // TODO: need to create a debounce function to listen to the window size

  if (!isOpen) return null;

  return (
    <PortalContainer
      targetElementId={targetElementId}
      wrapperClass={wrapperClass}
      wrapperId={wrapperId}
    >
      <div ref={modalRef} className="bs-fabrique-menu-container">
        <div
          ref={menuRef}
          className={classNames(
            'bs-fabrique-menu',
            {
              'bs-fabrique-menu--unpositioned': !isPositioned,
              'bs-fabrique-menu--below': isBelowAnchorElement,
            },
            className,
          )}
          id={id}
          style={{
            ...(isMenuWidthControlledByRef && anchorElementDimensions?.width
              ? { width: anchorElementDimensions?.width }
              : {}),
          }}
        >
          <div
            ref={contentRef}
            className={classNames(
              'bs-fabrique-menu-content',
              classes?.menuContent,
            )}
            onKeyDown={handleKeyDown}
            role="menu"
            tabIndex={0}
          >
            {children}
          </div>
        </div>
      </div>
    </PortalContainer>
  );
};

export const MenuStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Menu>>()(Menu);

export default React.memo(Menu);
