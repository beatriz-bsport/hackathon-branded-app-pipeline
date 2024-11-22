import React from "react";

export const AnchorTypeValues = [
  "top",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "bottom",
  "left",
  "right",
] as const;
export type AnchorType = (typeof AnchorTypeValues)[number];

export const TransitionStyleValues = ["slide", "appear", "default"] as const;
export type TransitionStyleType = (typeof TransitionStyleValues)[number];

export const useContainerPosition = ({
  containerRef,
  anchor,
  parentId,
  offset = { top: 0, left: 0 },
}: {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  parentId: string;
  anchor?: AnchorType;
  offset?: { top: number; left: number };
}) => {
  const getPositioningStyle = React.useCallback(
    (parentElement: HTMLElement, containerElement: HTMLElement) => {
      const parentRect = parentElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      const containerHeight = containerRect.height;
      const containerWidth = containerRect.width;
      const parentWidth = parentRect.width;
      const parentHeight = parentRect.height;

      const { top: offsetTop, left: offsetLeft } = offset;

      let calculatedTop = 0;
      let calculatedLeft = 0;

      const centeredDiv = containerWidth / 2 - parentWidth / 2;

      // Switch for different anchor positions
      switch (anchor) {
        case "top":
          calculatedTop = -containerHeight - offsetTop;
          calculatedLeft = -centeredDiv;
          break;
        case "top-left":
          calculatedTop = -containerHeight - offsetTop;
          calculatedLeft = offsetLeft;
          break;
        case "top-right":
          calculatedTop = -containerHeight - offsetTop;
          calculatedLeft = -containerWidth - offsetLeft + parentWidth;
          break;
        case "bottom":
          calculatedTop = parentWidth + offsetTop;
          calculatedLeft = -centeredDiv;
          break;
        case "bottom-left":
          calculatedTop = parentWidth + offsetTop;
          calculatedLeft = parentHeight - offsetLeft - parentWidth;
          break;
        case "bottom-right":
          calculatedTop = parentWidth + offsetTop;
          calculatedLeft = parentHeight - (containerWidth + offsetLeft);
          break;
        case "right":
          calculatedTop = (containerHeight / 2 - parentHeight / 2) * -1;
          calculatedLeft = parentWidth + offsetLeft;
          break;
        case "left":
          calculatedTop = (containerHeight / 2 - parentHeight / 2) * -1;
          calculatedLeft = -containerWidth - offsetLeft;
          break;
        default:
          calculatedTop = 0 + offsetTop;
          calculatedLeft = 0 + offsetLeft;
      }

      return {
        top: Math.round(calculatedTop),
        left: Math.round(calculatedLeft),
      };
    },
    [offset],
  );

  const setPositioningStyles = React.useCallback(
    (transitionStyle: TransitionStyleType) => {
      const containerElement = containerRef.current;
      const parentElement = document.getElementById(parentId);

      if (!containerElement || !parentElement) {
        return;
      }

      const positioning = getPositioningStyle(parentElement, containerElement);

      if (transitionStyle === "slide") {
        containerElement.style.transition = "transform 300ms";
        containerElement.style.transform = `translateX(${positioning.left}px) translateY(${positioning.top}px)`;
      } else if (transitionStyle === "appear") {
        containerElement.style.visibility = "visible";
        containerElement.style.opacity = "1";
        containerElement.style.transitionDelay = "0ms";
        containerElement.style.top = `${positioning.top}px`;
        containerElement.style.left = `${positioning.left}px`;
      } else {
        containerElement.style.top = `${positioning.top}px`;
        containerElement.style.left = `${positioning.left}px`;
      }
      containerElement.style.position = "relative";
    },
    [getPositioningStyle, containerRef],
  );

  return {
    getPositioningStyle,
    setPositioningStyles,
  };
};
