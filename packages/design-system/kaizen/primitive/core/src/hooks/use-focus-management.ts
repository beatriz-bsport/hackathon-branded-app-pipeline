import { useEffect, useRef } from "react";

/**
 * A hook that manages focus behavior for overlay components (modals, sidebars, dialogs).
 * THIS IS NOT A FULLY ACCESSIBLE IMPLEMENTATION BUT covers most of common use cases.
 *
 * When an overlay opens, this hook:
 * 1. Saves the currently focused element
 * 2. Moves focus to the first interactive element inside the overlay
 *    (button, link, input, select, textarea, or tabbable element)
 * 3. Falls back to focusing the container itself if no interactive elements are found
 *
 * When the overlay closes, this hook:
 * 1. Restores focus to the originally focused element before the overlay opened
 *
 * This improves keyboard navigation and accessibility by ensuring users can immediately
 * interact with the overlay content without needing to tab through the entire page.
 *
 * @template T - The HTML element type for the container (defaults to HTMLElement)
 * @param isOpen - Boolean indicating whether the overlay is currently open
 * @returns A ref object to be attached to the overlay container element
 *
 * @example
 * ```tsx
 * const MyDialog = ({ isOpen, onClose }) => {
 *   const dialogRef = useFocusManagement<HTMLDivElement>(isOpen);
 *
 *   return (
 *     <div ref={dialogRef} role="dialog" aria-modal="true">
 *       <button onClick={onClose}>Close</button>
 *       <input placeholder="First focusable element" />
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * const MySidebar = ({ isOpen }) => {
 *   const sidebarRef = useFocusManagement<HTMLElement>(isOpen);
 *
 *   return (
 *     <aside ref={sidebarRef} role="navigation">
 *       <nav>
 *         <a href="/home">Home</a>
 *         <a href="/about">About</a>
 *       </nav>
 *     </aside>
 *   );
 * };
 * ```
 */
export const useFocusManagement = <T extends HTMLElement = HTMLElement>(
  isOpen: boolean,
) => {
  const containerRef = useRef<T | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      previousFocusRef.current?.blur();

      requestAnimationFrame(() => {
        if (containerRef.current) {
          const firstFocusable =
            containerRef.current.querySelector<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );

          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            containerRef.current.focus();
          }
        }
      });
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isOpen]);

  return containerRef;
};
