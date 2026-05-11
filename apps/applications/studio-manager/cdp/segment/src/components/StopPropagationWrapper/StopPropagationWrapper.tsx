import type { MouseEvent, ReactNode } from "react";

type StopPropagationWrapperProps = {
  children: ReactNode;
  /**
   * When `true`, also calls `event.preventDefault()` on intercepted click events.
   *
   * Use sparingly — only when the wrapped element sits inside an anchor or form
   * where the browser default action must be suppressed alongside propagation.
   *
   * @default false
   */
  preventDefault?: boolean;
};

/**
 * Prevents click events from bubbling past this boundary.
 *
 * Wraps children in a non-interactive `<div>` that calls `event.stopPropagation()`
 * on every click, isolating the subtree from parent click handlers (e.g. row navigation).
 *
 * @example
 * ```tsx
 * // Inside a clickable table row — prevent the dropdown from triggering row navigation
 * <StopPropagationWrapper>
 *   <DropdownMenu items={items} onSelectOption={handleSelect} />
 * </StopPropagationWrapper>
 *
 * // Also suppress the browser default action (e.g. inside an anchor)
 * <StopPropagationWrapper preventDefault>
 *   <Popover>...</Popover>
 * </StopPropagationWrapper>
 * ```
 */
export const StopPropagationWrapper = ({
  children,
  preventDefault = false,
}: StopPropagationWrapperProps) => {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (preventDefault) {
      event.preventDefault();
    }
  };

  return <div onClick={handleClick}>{children}</div>;
};
