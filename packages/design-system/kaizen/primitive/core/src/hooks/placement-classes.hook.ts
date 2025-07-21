import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * Available placement positions for the positioned element
 */
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

/**
 * CSS classes for relative positioning of elements based on placement
 * Each placement maps to Tailwind classes for positioning
 */
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

/**
 * Priority order for placement fallbacks when preferred placement doesn't fit
 * Primary placement is tried first, then fallback placement
 */
const placementsPriority: Record<Placement, Placement[]> = {
  top: ["top", "bottom"],
  bottom: ["bottom", "top"],
  left: ["left", "right"],
  right: ["right", "left"],
  "top-left": ["top-left", "bottom-left"],
  "top-right": ["top-right", "bottom-right"],
  "bottom-left": ["bottom-left", "top-left"],
  "bottom-right": ["bottom-right", "top-right"],
};

/**
 * Calculates maximum height available for top/bottom placements
 * Used to determine maxHeight constraint when content doesn't fit naturally
 *
 * @param placement - The current placement position
 * @param anchorRect - Bounding rectangle of the anchor element
 * @returns Maximum height in pixels, or null if placement doesn't support height constraints
 */
const calculateTopPosition = (
  placement: Placement,
  anchorRect: DOMRect,
): number | null => {
  if (placement.startsWith("top")) {
    // For top placements: available space from top of viewport to anchor
    return anchorRect.top - 15; // 15px buffer for spacing
  } else if (placement.startsWith("bottom")) {
    // For bottom placements: available space from anchor to bottom of viewport
    return window.innerHeight - anchorRect.bottom - 15; // 15px buffer for spacing
  }
  // Left/right placements don't need height constraints
  return null;
};

/**
 * Determines the placement with the most available space when both primary placements fail
 * Uses viewport center as reference point to choose between top/bottom orientations
 *
 * @param placementToCheck - The placement to analyze for free space
 * @param anchorRect - Bounding rectangle of the anchor element
 * @returns Placement with the most available space
 */
const getPlacementWithMostFreeSpace = (
  placementToCheck: Placement,
  anchorRect: DOMRect,
): Placement => {
  // Calculate anchor's vertical center position relative to viewport center
  const anchorVerticalCenter = anchorRect.top + anchorRect.height / 2;
  const viewportVerticalCenter = window.innerHeight / 2;

  if (anchorVerticalCenter < viewportVerticalCenter) {
    // Anchor is in upper half of viewport - prefer bottom placement for more space
    return placementToCheck.replace("top", "bottom") as Placement;
  } else {
    // Anchor is in lower half of viewport - prefer top placement for more space
    return placementToCheck.replace("bottom", "top") as Placement;
  }
};

/**
 * Generates absolute positioning styles based on placement and element dimensions
 * Calculates exact pixel positions for top, left properties
 *
 * @param placement - Desired placement position
 * @param anchorRect - Bounding rectangle of the anchor element
 * @param contentRect - Bounding rectangle of the content element (optional)
 * @returns CSS properties object with positioning styles
 */
const getAbsoluteStyles = (
  placement: Placement,
  anchorRect: DOMRect,
  contentRect?: DOMRect,
): React.CSSProperties => {
  // Calculate available height for height-constrained placements
  const topPosition = calculateTopPosition(placement, anchorRect) ?? 0;
  const contentRectHeight = contentRect?.height || 0;

  // Use constrained height if content is larger than available space
  const contentHeight =
    topPosition > 0 && contentRectHeight > topPosition
      ? topPosition // Use constrained height
      : contentRectHeight; // Use natural content height

  const contentWidth = contentRect?.width || 0;

  switch (placement) {
    case "top":
      // Center horizontally above the anchor
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left + anchorRect.width / 2 - contentWidth / 2}px`,
      };
    case "top-left":
      // Align left edge with anchor, position above
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left}px`,
      };
    case "top-right":
      // Align right edge with anchor, position above
      return {
        top: `${anchorRect.top - contentHeight - 5}px`,
        left: `${anchorRect.left + anchorRect.width - contentWidth}px`,
      };
    case "bottom":
      // Center horizontally below the anchor
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left + anchorRect.width / 2 - contentWidth / 2}px`,
      };
    case "bottom-left":
      // Align left edge with anchor, position below
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left}px`,
      };
    case "bottom-right":
      // Align right edge with anchor, position below
      return {
        top: `${anchorRect.top + anchorRect.height + 5}px`,
        left: `${anchorRect.left + anchorRect.width - contentWidth}px`,
      };
    case "left":
      // Center vertically to the left of anchor
      return {
        top: `${anchorRect.top + anchorRect.height / 2 - contentHeight / 2}px`,
        left: `${anchorRect.left - contentWidth - 5}px`,
      };
    case "right":
      // Center vertically to the right of anchor
      return {
        top: `${anchorRect.top + anchorRect.height / 2 - contentHeight / 2}px`,
        left: `${anchorRect.left + anchorRect.width + 5}px`,
      };
    default:
      // Fallback for unknown placements
      return {};
  }
};

/**
 * Calculates the bounding box of content when placed at a specific position
 * Used for viewport collision detection
 *
 * @param placement - The placement position to test
 * @param anchorRect - Bounding rectangle of the anchor element
 * @param contentRect - Bounding rectangle of the content element
 * @returns Bounding box coordinates of the positioned content
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
 * Finds the closest scrollable parent element
 * Used to attach scroll event listeners for position updates
 *
 * @param node - The element to start searching from
 * @returns The scrollable parent element or window if none found
 */
const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
  if (!node) return window;

  let parent = node.parentElement;
  while (parent) {
    const overflowY = getComputedStyle(parent).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") {
      // Found a scrollable parent
      return parent;
    }
    parent = parent.parentElement;
  }

  // No scrollable parent found, use window
  return window;
};

/**
 * React hook for generating relative placement CSS classes
 * Memoized to prevent unnecessary re-renders
 *
 * @param placement - The desired placement position
 * @returns Array of CSS classes for relative positioning
 */
const useRelativePlacementClasses = (placement: Placement) => {
  return React.useMemo(
    () => ["absolute", ...placementClasses[placement]],
    [placement],
  );
};

/**
 * Checks if content fits naturally at a placement without constraints
 * Used to determine when to remove maxHeight restrictions
 *
 * @param placement - The placement to test
 * @param anchorRect - Bounding rectangle of the anchor element
 * @param contentRect - Bounding rectangle of the content element
 * @param viewport - The viewport window object
 * @returns True if content fits without viewport collisions
 */
const contentFitsNaturally = (
  placement: Placement,
  anchorRect: DOMRect,
  contentRect: DOMRect,
  viewport: typeof window,
): boolean => {
  const box = getContentRectForPlacement(placement, anchorRect, contentRect);

  // Check if content extends beyond any viewport edge
  return !(
    (
      box.right > viewport.innerWidth || // Extends beyond right edge
      box.left < 0 || // Extends beyond left edge
      box.bottom > viewport.innerHeight || // Extends beyond bottom edge
      box.top < 0
    ) // Extends beyond top edge
  );
};

/**
 * React hook for managing absolute positioning styles of floating elements
 * Handles placement calculation, viewport collision detection, and constraint application
 *
 * @param placement - Initial preferred placement position
 * @param anchorRef - React ref to the anchor element
 * @param contentRef - React ref to the content element
 * @param isVisible - Whether the positioned element should be visible
 * @returns CSS styles object for absolute positioning
 */
const useAbsolutePlacementStyles = (
  placement: Placement,
  anchorRef: React.RefObject<HTMLElement> | null,
  contentRef: React.RefObject<HTMLElement> | null,
  isVisible: boolean,
) => {
  // State for the computed positioning styles
  const [styles, setStyles] = useState<React.CSSProperties>({});

  // Refs to track state without triggering re-renders
  const currentPlacementRef = useRef<Placement>(placement); // Currently active placement
  const isConstrainedRef = useRef<boolean>(false); // Whether maxHeight constraint is active
  const originalPlacementRef = useRef<Placement>(placement); // Original requested placement
  const lastNaturalContentHeightRef = useRef<number>(0); // Previous content height for comparison
  const lastViewportDimensionsRef = useRef({ width: 0, height: 0 }); // Previous viewport size for change detection
  const animationFrameRef = useRef<number | null>(null); // RAF ID for throttling updates
  const lastCalculatedStylesRef = useRef<React.CSSProperties>({}); // Previous styles for change detection

  // Reset state when placement prop changes
  useEffect(() => {
    // Store the new original placement
    originalPlacementRef.current = placement;
    // Reset current placement to the new preference
    currentPlacementRef.current = placement;
    // Clear any existing constraints
    isConstrainedRef.current = false;
  }, [placement]);

  /**
   * Checks if a bounding box extends beyond the viewport boundaries
   * Memoized to prevent function recreation on every render
   */
  const isOutOfViewport = useCallback(
    (
      box: { top: number; left: number; right: number; bottom: number },
      viewport: typeof window,
    ) =>
      box.right > viewport.innerWidth || // Right edge collision
      box.left < 0 || // Left edge collision
      box.bottom > viewport.innerHeight || // Bottom edge collision
      box.top < 0, // Top edge collision
    [],
  );

  /**
   * Wrapper for getContentRectForPlacement with memoization
   * Prevents function recreation on every render
   */
  const getBox = useCallback(
    (placement: Placement, anchorRect: DOMRect, contentRect: DOMRect) =>
      getContentRectForPlacement(placement, anchorRect, contentRect),
    [],
  );

  /**
   * Main positioning calculation function
   * Handles placement logic, constraint application, and style updates
   */
  const updateStyles = useCallback(() => {
    // Early return if required elements are not available
    if (!anchorRef?.current || !contentRef?.current || !isVisible) {
      const emptyStyles = {};
      // Only update if styles actually changed to prevent unnecessary re-renders
      if (
        JSON.stringify(lastCalculatedStylesRef.current) !==
        JSON.stringify(emptyStyles)
      ) {
        lastCalculatedStylesRef.current = emptyStyles;
        setStyles(emptyStyles);
      }
      return;
    }

    // Get current element dimensions
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // Get placement priority order based on original preference
    const priorities = placementsPriority[originalPlacementRef.current] || [
      originalPlacementRef.current,
    ];

    // Track viewport dimension changes for recalculation triggers
    const currentViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Consider viewport "changed" if dimensions differ by more than 10px
    const viewportChanged =
      Math.abs(
        lastViewportDimensionsRef.current.width - currentViewport.width,
      ) > 10 ||
      Math.abs(
        lastViewportDimensionsRef.current.height - currentViewport.height,
      ) > 10;

    // Update stored viewport dimensions
    lastViewportDimensionsRef.current = currentViewport;

    // Track content size changes for constraint removal logic
    const naturalContentHeight = contentRect.height;

    // Consider content "changed" if height differs by more than 5px
    const hasContentSizeChanged =
      Math.abs(lastNaturalContentHeightRef.current - naturalContentHeight) > 5;

    // Update stored content height
    lastNaturalContentHeightRef.current = naturalContentHeight;

    // Initialize calculation variables
    let nextPlacement = currentPlacementRef.current;
    let style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);

    // CONSTRAINT MODE: Element is currently limited by maxHeight
    if (isConstrainedRef.current) {
      // Only recalculate if there are significant changes to avoid infinite loops
      if (hasContentSizeChanged || viewportChanged) {
        // Check if we can remove constraints (content got smaller)
        if (
          hasContentSizeChanged &&
          naturalContentHeight < lastNaturalContentHeightRef.current - 20 // 20px threshold for stability
        ) {
          // Test if content now fits naturally at original placement
          if (
            contentFitsNaturally(
              originalPlacementRef.current,
              anchorRect,
              contentRect,
              window,
            )
          ) {
            // Content fits! Remove constraints and return to original placement
            isConstrainedRef.current = false;
            nextPlacement = originalPlacementRef.current;
            currentPlacementRef.current = originalPlacementRef.current;
            style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
          } else {
            // Content still doesn't fit, maintain constraints at current placement
            const maxHeightPx = calculateTopPosition(nextPlacement, anchorRect);
            style = {
              ...getAbsoluteStyles(nextPlacement, anchorRect, contentRect),
              ...(maxHeightPx
                ? { maxHeight: `${maxHeightPx}px`, overflowY: "auto" as const }
                : {}),
            };
          }
        } else {
          // Content grew or viewport changed, maintain constraints
          const maxHeightPx = calculateTopPosition(nextPlacement, anchorRect);
          style = {
            ...getAbsoluteStyles(nextPlacement, anchorRect, contentRect),
            ...(maxHeightPx
              ? { maxHeight: `${maxHeightPx}px`, overflowY: "auto" as const }
              : {}),
          };
        }
      } else {
        // No significant changes, maintain current constrained state
        const maxHeightPx = calculateTopPosition(nextPlacement, anchorRect);
        style = {
          ...getAbsoluteStyles(nextPlacement, anchorRect, contentRect),
          ...(maxHeightPx
            ? { maxHeight: `${maxHeightPx}px`, overflowY: "auto" as const }
            : {}),
        };
      }
    } else {
      // NORMAL MODE: No constraints currently applied

      // Calculate bounding box for current placement
      const contentBox = getBox(nextPlacement, anchorRect, contentRect);

      if (isOutOfViewport(contentBox, window)) {
        // Current placement causes viewport collision, try alternatives

        // Find alternative placement from priority list
        const altPlacement =
          priorities.find((p) => p !== currentPlacementRef.current) || // First different priority
          priorities[1] || // Second priority option
          originalPlacementRef.current; // Fallback to original

        // Test alternative placement
        const altBox = getBox(altPlacement, anchorRect, contentRect);

        if (!isOutOfViewport(altBox, window)) {
          // Alternative placement fits! Use it without constraints
          nextPlacement = altPlacement;
          currentPlacementRef.current = nextPlacement;
          style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
        } else {
          // Both primary placements fail, apply constraints

          // Choose placement with most available space
          const placementWithMostFreeSpace = getPlacementWithMostFreeSpace(
            altPlacement,
            anchorRect,
          );

          // Update placement and activate constraint mode
          nextPlacement = placementWithMostFreeSpace;
          currentPlacementRef.current = nextPlacement;
          isConstrainedRef.current = true;

          // Calculate and apply maxHeight constraint
          const maxHeightPx = calculateTopPosition(
            placementWithMostFreeSpace,
            anchorRect,
          );

          style = {
            ...getAbsoluteStyles(nextPlacement, anchorRect, contentRect),
            ...(maxHeightPx
              ? { maxHeight: `${maxHeightPx}px`, overflowY: "auto" as const }
              : {}),
          };
        }
      } else if (currentPlacementRef.current !== originalPlacementRef.current) {
        // Current placement fits, but we're not at original preference
        // Try to return to original placement if it now fits

        const origBox = getBox(
          originalPlacementRef.current,
          anchorRect,
          contentRect,
        );

        if (!isOutOfViewport(origBox, window)) {
          // Original placement now fits! Return to it
          nextPlacement = originalPlacementRef.current;
          currentPlacementRef.current = originalPlacementRef.current;
          style = getAbsoluteStyles(nextPlacement, anchorRect, contentRect);
        }
        // If original doesn't fit, continue with current placement (no else needed)
      }
      // If current placement fits and we're already at original, no changes needed
    }

    // Only update React state if styles actually changed
    const styleChanged =
      JSON.stringify(lastCalculatedStylesRef.current) !== JSON.stringify(style);

    if (styleChanged) {
      // Store new styles and trigger re-render
      lastCalculatedStylesRef.current = style;
      setStyles(style);
    }
  }, [anchorRef, contentRef, isVisible, isOutOfViewport, getBox]);

  /**
   * Throttled update function using requestAnimationFrame
   * Prevents excessive calculations during rapid events (scroll, resize)
   */
  const updateStylesRaf = useCallback(() => {
    // Prevent multiple RAF calls from queuing up
    if (animationFrameRef.current !== null) return;

    // Schedule update for next animation frame
    animationFrameRef.current = requestAnimationFrame(() => {
      updateStyles();
      animationFrameRef.current = null; // Reset RAF ID
    });
  }, [updateStyles]);

  /**
   * Effect for setting up event listeners and observers
   * Handles component lifecycle and cleanup
   */
  useEffect(() => {
    // Skip setup if element should not be visible
    if (!isVisible) return;

    // Perform initial positioning calculation
    updateStyles();

    // Set up scroll parent detection for scroll event listening
    const scrollParent = getScrollParent(anchorRef?.current ?? null);

    // Set up ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(updateStylesRaf);

    // Observe anchor element size changes (affects positioning)
    if (anchorRef?.current) resizeObserver.observe(anchorRef.current);

    // Observe content element size changes (affects constraint calculations)
    if (contentRef?.current) resizeObserver.observe(contentRef.current);

    // Set up global event listeners with passive flag for performance
    window.addEventListener("resize", updateStylesRaf, { passive: true });
    window.addEventListener("scroll", updateStylesRaf, { passive: true });

    // Set up scroll parent listener if different from window
    if (scrollParent !== window) {
      scrollParent.addEventListener("scroll", updateStylesRaf, {
        passive: true,
      });
    }

    // Cleanup function
    return () => {
      // Remove global event listeners
      window.removeEventListener("resize", updateStylesRaf);
      window.removeEventListener("scroll", updateStylesRaf);

      // Remove scroll parent listener if it was added
      if (scrollParent !== window) {
        scrollParent.removeEventListener("scroll", updateStylesRaf);
      }

      // Clean up ResizeObserver
      resizeObserver.disconnect();

      // Cancel any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, updateStyles, updateStylesRaf, anchorRef, contentRef]);

  // Return the calculated positioning styles
  return styles;
};

export { useAbsolutePlacementStyles, useRelativePlacementClasses };
