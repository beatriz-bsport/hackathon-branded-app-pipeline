import React from 'react';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { PortalContainer } from '#Fabrique/PortalContainer';
import { useCloseModal } from '#Fabrique/hooks';
import getAssociatedDocument from '#Fabrique/utils/getAssociatedDocument';
import getAssociatedWindow from '#Fabrique/utils/getAssociatedWindow';
import { getOffsetTop } from '#Fabrique/utils/getOffsetTop';
import { getOffsetLeft } from '#Fabrique/utils/getOffsetLeft';
import { getTransformOriginValue } from '#Fabrique/utils/getTransformOriginValue';
import type { Horizontal, Vertical } from '#Fabrique/Types';
import { HorizontalEnum, MENU_MARGIN, VerticalEnum } from './constants';
import { DELAY_DURATION, MARGIN_THRESHOLD } from '#Fabrique/constants';
import './styles.css';

export type MenuProps = {
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
}) => {
  const menuRef = React.useRef<HTMLDivElement>(null);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const [isPositioned, setIsPositioned] = React.useState(isOpen);
  const handleOnClose = React.useCallback(() => {
    onClose && onClose();
    setIsPositioned(false);
  }, [onClose]);

  const setPositionedToFalse = React.useCallback(() => {
    setIsPositioned(false);
  }, []);

  const { modalRef } = useCloseModal({
    onClose: handleOnClose,
    openMenuRef,
    setPositionedToFalse,
  });

  const isBelowAnchorElement =
    anchorOriginVertical === VerticalEnum.BOTTOM &&
    transformOriginVertical === VerticalEnum.TOP;

  const isOnTopOfAnchorElement =
    anchorOriginVertical === VerticalEnum.TOP &&
    transformOriginVertical === VerticalEnum.BOTTOM;

  // Returns the top/left offset of the position
  // to attach to on the anchor element (or body if none is provided)
  const getAnchorOffset = React.useCallback(() => {
    // If an anchor element wasn't provided, just use the parent body element of this Popover
    const anchorElement =
      anchorEl && anchorEl.nodeType === Node.ELEMENT_NODE
        ? anchorEl
        : getAssociatedDocument(menuRef.current).body;
    const anchorRect = anchorElement.getBoundingClientRect();

    return {
      top: anchorRect.top + getOffsetTop(anchorRect, anchorOriginVertical),
      left: anchorRect.left + getOffsetLeft(anchorRect, anchorOriginHorizontal),
    };
  }, [anchorEl, anchorOriginHorizontal, anchorOriginVertical, menuRef]);

  // Returns the base transform origin using the element
  const getTransformOrigin = React.useCallback(
    (elemRect: DOMRect) => {
      return {
        vertical: getOffsetTop(elemRect, transformOriginVertical),
        horizontal: getOffsetLeft(elemRect, transformOriginHorizontal),
      };
    },
    [transformOriginHorizontal, transformOriginVertical],
  );

  const getPositioningStyle = React.useCallback(
    (element: HTMLDivElement) => {
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      } as DOMRect;

      // Get the transform origin point on the element itself
      const elementTransformOrigin = getTransformOrigin(elemRect);
      // Get the offset of the anchoring element
      const anchorOffset = getAnchorOffset();
      // Calculate element positioning
      let top = anchorOffset.top - elementTransformOrigin.vertical;
      if (isBelowAnchorElement) {
        top += MENU_MARGIN;
      } else if (isOnTopOfAnchorElement) {
        top -= MENU_MARGIN;
      }
      let left = anchorOffset.left - elementTransformOrigin.horizontal;
      const bottom = top + elemRect.height;
      const right = left + elemRect.width;

      // Use the parent window of the anchorEl if provided
      const containerWindow = getAssociatedWindow(anchorEl);

      // Window thresholds taking required margin into account
      const heightThreshold = containerWindow.innerHeight - MARGIN_THRESHOLD;
      const widthThreshold = containerWindow.innerWidth - MARGIN_THRESHOLD;

      // Check if the vertical axis needs shifting
      if (top < MARGIN_THRESHOLD) {
        const diff = top - MARGIN_THRESHOLD;

        top -= diff;

        elementTransformOrigin.vertical += diff;
      } else if (bottom > heightThreshold) {
        const diff = bottom - heightThreshold;

        top -= diff;

        elementTransformOrigin.vertical += diff;
      }

      // Check if the horizontal axis needs shifting
      if (left < MARGIN_THRESHOLD) {
        const diff = left - MARGIN_THRESHOLD;
        left -= diff;
        elementTransformOrigin.horizontal += diff;
      } else if (right > widthThreshold) {
        const diff = right - widthThreshold;
        left -= diff;
        elementTransformOrigin.horizontal += diff;
      }
      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        transformOrigin: getTransformOriginValue(elementTransformOrigin),
      };
    },
    [
      anchorEl,
      getAnchorOffset,
      getTransformOrigin,
      isBelowAnchorElement,
      isOnTopOfAnchorElement,
    ],
  );

  const setPositioningStyles = React.useCallback(() => {
    const element = menuRef.current;

    if (!element) {
      return;
    }

    const positioning = getPositioningStyle(element);

    if (positioning.top !== null) {
      element.style.top = positioning.top;
    }
    if (positioning.left !== null) {
      element.style.left = positioning.left;
    }
    element.style.transformOrigin = positioning.transformOrigin;
    setIsPositioned(true);
  }, [getPositioningStyle, menuRef]);

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
