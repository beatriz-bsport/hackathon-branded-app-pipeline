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

const getAbsoluteStyles = (
  placement: (typeof Placements)[number],
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
 * Returns the tailwind classes for a given placement.
 * This is useful for positioning elements that are direct siblings of the anchor.
 * @param placement The placement of the element.
 */
const useRelativePlacementClasses = (
  placement: (typeof Placements)[number],
) => {
  return useMemo(
    () => ["absolute", ...placementClasses[placement]],
    [placement],
  );
};

/**
 * Returns the inline styles for a given placement.
 * This is useful for positioning elements that are created in a portal.
 *
 * @param placement The placement of the element.
 * @param anchorRef The DOMRect of the anchor element.
 * @param contentRef The DOMRect of the content element.
 * @param isVisible Whether the content element is mounted and visible.
 */
const useAbsolutePlacementStyles = (
  placement: (typeof Placements)[number],
  anchorRef: React.RefObject<HTMLElement> | null,
  contentRef: React.RefObject<HTMLElement> | null,
  isVisible: boolean,
) => {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    const updateStyles = () => {
      if (anchorRef?.current && contentRef?.current) {
        const anchorRect = anchorRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        setStyles(getAbsoluteStyles(placement, anchorRect, contentRect));
      }
    };

    updateStyles();

    const resizeObserver = new ResizeObserver(updateStyles);
    if (anchorRef?.current) resizeObserver.observe(anchorRef.current);
    if (contentRef?.current) resizeObserver.observe(contentRef.current);

    window.addEventListener("resize", updateStyles);
    window.addEventListener("scroll", updateStyles);

    return () => {
      window.removeEventListener("resize", updateStyles);
      window.removeEventListener("scroll", updateStyles);
      resizeObserver.disconnect();
    };
  }, [isVisible, placement, anchorRef, contentRef]);

  return styles;
};

export { useAbsolutePlacementStyles, useRelativePlacementClasses };
