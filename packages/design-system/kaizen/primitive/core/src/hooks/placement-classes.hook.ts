import React, { useEffect, useMemo, useState } from "react";

export const Placements = [
  "top",
  "top-left",
  "top-right",
  "bottom",
  "bottom-left",
  "bottom-right",
  "left",
  "right",
] as const;

type Placement = (typeof Placements)[number];

const placementClasses = {
  top: ["bottom-full", "left-1/2", "-translate-x-1/2", "-translate-y-[5px]"],
  "top-left": ["bottom-full", "left-[0]", "-translate-y-[5px]"],
  "top-right": ["bottom-full", "right-[0]", "-translate-y-[5px]"],
  bottom: ["top-full", "left-1/2", "-translate-x-1/2", "translate-y-[5px]"],
  "bottom-left": ["top-full", "left-[0]", "translate-y-[5px]"],
  "bottom-right": ["top-full", "right-[0]", "translate-y-[5px]"],
  left: ["right-full", "top-1/2", "-translate-y-1/2", "-translate-x-[5px]"],
  right: ["left-full", "top-1/2", "-translate-y-1/2", "translate-x-[5px]"],
};

const placementsPriority: Record<Placement, Placement[]> = {
  top: ["top", "bottom", "right", "left"],
  bottom: ["bottom", "top", "right", "left"],
  left: ["left", "right", "top", "bottom"],
  right: ["right", "left", "top", "bottom"],
  "top-left": ["top-left", "bottom-left", "top-right", "bottom-right"],
  "top-right": ["top-right", "bottom-right", "top-left", "bottom-left"],
  "bottom-left": ["bottom-left", "top-left", "bottom-right", "top-right"],
  "bottom-right": ["bottom-right", "top-right", "bottom-left", "top-left"],
};

/**
 * Calculates the absolute CSS `top` and `left` styles for positioning a content element
 * relative to an anchor element, based on the specified placement.
 *
 * @param placement The desired placement of the content relative to the anchor.
 *   Supported values: "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right", "left", "right".
 * @param anchorRect The DOMRect of the anchor element.
 * @param contentRect The DOMRect of the content element.
 * @returns An object with `top` and `left` properties as pixel strings for inline styles.
 */
const getAbsoluteStyles = (
  placement: Placement,
  anchorRect: DOMRect,
  contentRect?: DOMRect,
) => {
  const contentHeight = contentRect?.height || 0;
  const contentWidth = contentRect?.width || 0;

  switch (placement) {
    case "top":
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left + anchorRect.width / 2 - contentWidth / 2}px`,
      };
    case "top-left":
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left}px`,
      };
    case "top-right":
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left + anchorRect.width - contentWidth}px`,
      };
    case "bottom":
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left + anchorRect.width / 2 - contentWidth / 2}px`,
      };
    case "bottom-left":
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left}px`,
      };
    case "bottom-right":
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left + anchorRect.width - contentWidth}px`,
      };
    case "left":
      return {
        top: `${anchorRect.top + anchorRect.height / 2 - contentHeight / 2}px`,
        left: `${anchorRect.left - contentWidth - 5}px`,
      };
    case "right":
      return {
        top: `${anchorRect.top + anchorRect.height / 2 - contentHeight / 2}px`,
        left: `${anchorRect.left + anchorRect.width + 5}px`,
      };
    default:
      return {};
  }
};

/**
 * Calculates the bounding rectangle for the content element based on the given placement.
 *
 * @param placement - The desired placement of the content relative to the anchor.
 * @param anchorRect - The DOMRect of the anchor element.
 * @param contentRect - The DOMRect of the content element.
 * @returns An object containing the top, left, right, and bottom coordinates of the content.
 */
const getContentRectForPlacement = (
  placement: Placement,
  anchorRect: DOMRect,
  contentRect: DOMRect,
) => {
  const style = getAbsoluteStyles(placement, anchorRect, contentRect);
  const top = parseFloat(style.top as string);
  const left = parseFloat(style.left as string);
  return {
    top,
    left,
    right: left + contentRect.width,
    bottom: top + contentRect.height,
  };
};

/**
 * Returns the nearest scrollable ancestor of a given HTMLElement.
 *
 * Traverses up the DOM tree from the provided node, checking each ancestor's
 * `overflowY` style. If an ancestor has `overflowY` set to `auto` or `scroll`,
 * that element is returned as the scroll parent. If no such ancestor is found,
 * or if the input node is `null`, the `window` object is returned.
 *
 * @param node The HTMLElement to start searching from.
 * @returns The nearest scrollable ancestor HTMLElement, or `window` if none found.
 */
const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
  if (!node) return window;
  let parent = node.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return window;
};

/**
 * Returns the tailwind classes for a given placement.
 * This is useful for positioning elements that are direct siblings of the anchor.
 * @param placement The placement of the element.
 */
const useRelativePlacementClasses = (placement: Placement) => {
  return useMemo(
    () => ["absolute", ...placementClasses[placement]],
    [placement],
  );
};

/**
 * Returns the inline styles for a given placement.
 * This is useful for positioning elements that are created in a portal.
 * This hook calculates the styles based on the anchor and content element's DOMRect.
 *
 * @param placement The placement of the element.
 * @param anchorRef The DOMRect of the anchor element.
 * @param contentRef The DOMRect of the content element.
 * @param isVisible Whether the content element is mounted and visible.
 */
const useAbsolutePlacementStyles = (
  placement: Placement,
  anchorRef: React.RefObject<HTMLElement> | null,
  contentRef: React.RefObject<HTMLElement> | null,
  isVisible: boolean,
) => {
  const [styles, setStyles] = useState({});
  const [currentPlacement, setCurrentPlacement] =
    useState<Placement>(placement);

  useEffect(() => {
    setCurrentPlacement(placement);
  }, [placement]);

  const isOutOfViewport = (
    box: { top: number; left: number; right: number; bottom: number },
    viewport: typeof window,
  ) =>
    box.right > viewport.innerWidth ||
    box.left < 0 ||
    box.bottom > viewport.innerHeight ||
    box.top < 0;

  const getBox = (
    placement: Placement,
    anchorRect: DOMRect,
    contentRect: DOMRect,
  ) => getContentRectForPlacement(placement, anchorRect, contentRect);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateStyles = () => {
      if (!anchorRef?.current || !contentRef?.current) {
        setStyles({});
        return;
      }
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const priorities = placementsPriority[placement] || [placement];

      let nextPlacement = currentPlacement;
      let style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
      const contentBox = getBox(nextPlacement, anchorRect, contentRect);

      if (isOutOfViewport(contentBox, window)) {
        const altPlacement =
          priorities.find((p) => p !== currentPlacement && p !== placement) ||
          priorities[1] ||
          placement;
        const altBox = getBox(altPlacement, anchorRect, contentRect);
        if (!isOutOfViewport(altBox, window)) {
          nextPlacement = altPlacement;
          style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
          setCurrentPlacement(nextPlacement);
        }
      } else if (currentPlacement !== placement) {
        const origBox = getBox(placement, anchorRect, contentRect);
        if (!isOutOfViewport(origBox, window)) {
          nextPlacement = placement;
          style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
          setCurrentPlacement(nextPlacement);
        }
      }

      setStyles(style);
    };

    const updateStylesRaf = () => {
      if (animationFrameId !== null) return;
      animationFrameId = requestAnimationFrame(() => {
        updateStyles();
        animationFrameId = null;
      });
    };

    updateStyles();

    const scrollParent = getScrollParent(anchorRef?.current ?? null);

    const resizeObserver = new ResizeObserver(updateStylesRaf);
    if (anchorRef?.current) resizeObserver.observe(anchorRef.current);
    if (contentRef?.current) resizeObserver.observe(contentRef.current);

    window.addEventListener("resize", updateStylesRaf, { passive: true });
    window.addEventListener("scroll", updateStylesRaf, { passive: true });
    if (scrollParent !== window) {
      scrollParent.addEventListener("scroll", updateStylesRaf, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("resize", updateStylesRaf);
      window.removeEventListener("scroll", updateStylesRaf);
      if (scrollParent !== window) {
        scrollParent.removeEventListener("scroll", updateStylesRaf);
      }
      resizeObserver.disconnect();
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible, placement, anchorRef, contentRef, currentPlacement]);

  return styles;
};

export { useAbsolutePlacementStyles, useRelativePlacementClasses };
