import React from 'react';
import type { Horizontal, Vertical } from '#Fabrique/Types';
import { getTransformOriginValue } from '#Fabrique/utils/getTransformOriginValue';
import { VerticalEnum } from './constants';
import { getOffsetTop } from '#Fabrique/utils/getOffsetTop';
import { getOffsetLeft } from '#Fabrique/utils/getOffsetLeft';
import getAssociatedDocument from '#Fabrique/utils/getAssociatedDocument';
import getAssociatedWindow from '#Fabrique/utils/getAssociatedWindow';

/**
 * Custom React hook for handling menu modal closure.
 *
 * @param {() => void} onClose - Function to be called to close the modal.
 * @param {React.MutableRefObject<HTMLDivElement | null>} [openMenuRef] - The ref used to identify the div element wrapping the menu.
 *
 *   This allows the selector to flicker for example(when clicking on selector, it closes the menu instead of reopening it).
 * @param {() => void} [setPositionedToFalse] - Function to set the position-related state to false.
 *
 *   This is triggered when clicking on the div wrapping the menu.
 */
export const useCloseModal = ({
  onClose,
  openMenuRef,
  setPositionedToFalse,
}: {
  onClose: () => void;
  openMenuRef?: React.MutableRefObject<HTMLDivElement | null>;
  setPositionedToFalse?: () => void;
}) => {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handleOnClickAway = (event: Event) => {
      const hasBeenClickedFromSelector =
        !!openMenuRef?.current &&
        event?.target &&
        openMenuRef.current?.contains(event?.target as Node);

      if (
        !!modalRef.current &&
        event?.target &&
        !modalRef.current.contains(event.target as Node) &&
        !hasBeenClickedFromSelector
      ) {
        event?.stopPropagation();
        onClose?.();
      } else if (hasBeenClickedFromSelector) {
        setPositionedToFalse?.();
      }
    };
    const closeOnEscapeKey = (event: KeyboardEvent) => {
      event.key === 'Escape' && onClose?.();
      if (event.key === 'Escape' && openMenuRef?.current) {
        openMenuRef.current.focus?.();
      }
    };
    document?.addEventListener('keydown', closeOnEscapeKey);
    document?.addEventListener('mousedown', handleOnClickAway);
    return () => {
      document?.removeEventListener('mousedown', handleOnClickAway);
      document?.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [modalRef, onClose, openMenuRef, setPositionedToFalse]);

  return { modalRef };
};

export const usePopoverPositioning = ({
  margin = 0,
  margin_threshold = 0,
  ref,
  isOpen,
  anchorEl,
  anchorOriginHorizontal,
  anchorOriginVertical,
  transformOriginHorizontal,
  transformOriginVertical,
}: {
  margin: number;
  margin_threshold: number;
  ref: React.MutableRefObject<HTMLDivElement>;
  isOpen: boolean;
  anchorEl?: HTMLElement;
  anchorOriginHorizontal?: Horizontal;
  anchorOriginVertical?: Vertical;
  transformOriginHorizontal?: Horizontal;
  transformOriginVertical?: Vertical;
}) => {
  const [isPositioned, setIsPositioned] = React.useState(!!isOpen);

  const isBelowAnchorElement =
    anchorOriginVertical === VerticalEnum.BOTTOM &&
    transformOriginVertical === VerticalEnum.TOP;

  const isOnTopOfAnchorElement =
    anchorOriginVertical === VerticalEnum.TOP &&
    transformOriginVertical === VerticalEnum.BOTTOM;

  const getAnchorOffset = React.useCallback(() => {
    // If an anchor element wasn't provided, just use the parent body element of this Popover
    const anchorElement =
      anchorEl && anchorEl.nodeType === Node.ELEMENT_NODE
        ? anchorEl
        : getAssociatedDocument(ref.current).body;
    const anchorRect = anchorElement.getBoundingClientRect();

    return {
      top: anchorRect.top + getOffsetTop(anchorRect, anchorOriginVertical),
      left: anchorRect.left + getOffsetLeft(anchorRect, anchorOriginHorizontal),
    };
  }, [anchorEl, anchorOriginHorizontal, anchorOriginVertical, ref]);

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
        top += margin;
      } else if (isOnTopOfAnchorElement) {
        top -= margin;
      }

      let left = anchorOffset.left - elementTransformOrigin.horizontal;
      const bottom = top + elemRect.height;
      const right = left + elemRect.width;

      // Use the parent window of the anchorEl if provided
      const containerWindow = getAssociatedWindow(anchorEl);

      // Window thresholds taking required margin into account
      const heightThreshold = containerWindow.innerHeight - margin_threshold;
      const widthThreshold = containerWindow.innerWidth - margin_threshold;

      // Check if the vertical axis needs shifting
      if (top < margin_threshold) {
        const diff = top - margin_threshold;

        top -= diff;

        elementTransformOrigin.vertical += diff;
      } else if (bottom > heightThreshold) {
        const diff = bottom - heightThreshold;

        top -= diff;

        elementTransformOrigin.vertical += diff;
      }

      // Check if the horizontal axis needs shifting
      if (left < margin_threshold) {
        const diff = left - margin_threshold;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      anchorEl,
      getAnchorOffset,
      getTransformOrigin,
      isBelowAnchorElement,
      isOnTopOfAnchorElement,
    ],
  );

  /**
   * @description This hook calculates the dimensions of the anchor element in order to properly position a component using the PortalContainer on the DOM.
   * To ensure the component element matches the width of the element it was opened for, the hook uses the anchor element's dimensions provided by the ref.
   *
   * @returns {{height: number | undefined, width: number | undefined}} An object containing the height and width of the anchor element. Returns undefined if anchorEl is not provided.
   */
  const anchorElementDimensions = React.useMemo(
    () =>
      anchorEl
        ? { height: anchorEl.clientHeight, width: anchorEl.clientWidth }
        : { height: undefined, width: undefined },
    [anchorEl],
  );
  const setPositionedToFalse = React.useCallback(() => {
    setIsPositioned(false);
  }, []);
  const setPositioningStyles = React.useCallback(() => {
    const element = ref.current;

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
  }, [getPositioningStyle, ref]);

  return {
    isPositioned,
    setIsPositioned,
    isBelowAnchorElement,
    isOnTopOfAnchorElement,
    getAnchorOffset,
    getPositioningStyle,
    setPositioningStyles,
    setPositionedToFalse,
    anchorElementDimensions,
  };
};
