import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, {
  ReactNode,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";

import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import useOutsideClickListener from "#src/hooks/outside-click-listener";
import {
  Placements,
  useAbsolutePlacementStyles,
} from "#src/hooks/placement-classes.hook";

const defaultClasses = [
  "fixed",
  "z-[999]",
  "rounded-sm",
  "p-xs",
  "gap-xs",
  "bg-surface-default-elevated",
  "border-stroke-thin",
  "border-stroke-default",
  "shadow-lg",
  "transition ease-out duration-default",
] as const;

const popoverClasses = cva("relative w-fit h-fit");

export const PopoverContext = createContext<{
  isPopoverOpened: boolean;
  setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>;
  anchorRef: React.RefObject<HTMLDivElement> | null;
}>({
  isPopoverOpened: false,
  setIsPopoverOpened: () => {},
  anchorRef: null,
});

export type PopoverProps = {
  children: ReactNode;
  className?: string;
  opened?: boolean;
};

/**
 * The Popover component is a compound component that consists of an Anchor and Content.
 * It displays temporary content in a floating overlay, triggered by user actions such as click or hover.
 * The Popover is always positioned relative to a target element, which is specified by the Anchor subcomponent.
 * The Content subcomponent holds the additional information or actions that the Popover provides.
 * @param placement The position of the Popover relative to the Anchor.
 * @param children Node(s) to render inside the Popover, including Anchor and Content components.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-popover--docs
 */
const Popover: React.FC<PopoverProps> & {
  Anchor: typeof Anchor;
  Content: typeof Content;
} = ({ children, className, opened = false }: PopoverProps) => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(opened);
  const popoverRef = useRef(null);
  const anchorRef = useRef(null);

  const handleClose = () => setIsPopoverOpened(false);

  // Close the popover when the escape key is pressed
  useEscapeKeydownListener(handleClose, isPopoverOpened);

  return (
    <PopoverContext.Provider
      value={{ isPopoverOpened, setIsPopoverOpened, anchorRef }}
    >
      <div className={popoverClasses({ className })} ref={popoverRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

/**
 * The Anchor component is a subcomponent of the Popover that is used to define
 * the target element to which the Popover's position is relative. It is responsible
 * for determining when the Popover should be opened or closed based on user
 * interactions.
 * @param children Node(s) to render inside the Anchor.
 */
const Anchor: React.FC<{
  children: (props: {
    isPopoverOpened: boolean;
    setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ReactNode;
}> = ({ children }) => {
  const { isPopoverOpened, setIsPopoverOpened, anchorRef } =
    useContext(PopoverContext);

  return (
    <div ref={anchorRef}>
      {children({ isPopoverOpened, setIsPopoverOpened })}
    </div>
  );
};

/**
 * The Content component is a subcomponent of the Popover that renders the
 * contents of the Popover. It is responsible for displaying the Popover's
 * content and handling its visibility state.
 * @param className Additional classes to apply to the Content.
 * @param children Node(s) to render inside the Content.
 * @param placement The position of the Popover relative to the Anchor.
 * @param maxHeightPx The maximum height of the Popover content in pixels.
 * @param focusedMenuItemIndex The index of the currently focused Menu Item when the Popover opens.
 */
const Content: React.FC<{
  className?: string;
  children: (props: {
    setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>;
    isPopoverOpened: boolean;
    contentRef: React.RefObject<HTMLDivElement>;
  }) => ReactNode;
  placement?: (typeof Placements)[number];
  maxHeightPx?: number;
  focusedMenuItemIndex?: number;
}> = ({
  className,
  children,
  placement = "bottom-left",
  maxHeightPx,
  focusedMenuItemIndex,
}) => {
  const { isPopoverOpened, setIsPopoverOpened, anchorRef } =
    useContext(PopoverContext);

  const contentRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const placementStyles = useAbsolutePlacementStyles(
    placement,
    anchorRef,
    contentRef,
    isVisible,
  );

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
      setIsPopoverOpened(false);
    }, 200);
  }, [setIsPopoverOpened]);

  useEffect(() => {
    if (isPopoverOpened) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      handleClose();
    }
  }, [isPopoverOpened, handleClose, focusedMenuItemIndex]);

  // Handle Tab key press and close popover when tabbing out of the last option
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Tab" && contentRef.current) {
        // Get all focusable elements in the popover
        const focusableElements = Array.from(
          contentRef.current.querySelectorAll(
            "button,[href],input,select,textarea",
          ),
        ).filter(
          (el) =>
            el.hasAttribute("tabindex") && el.getAttribute("tabindex") !== "-1",
        );

        // If there are no focusable elements, do nothing
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // If Shift + Tab on the first item, close popover
        if (document.activeElement === firstFocusable && event.shiftKey) {
          setIsPopoverOpened(false);
        }

        // If Tab on the last item, close popover
        if (document.activeElement === lastFocusable && !event.shiftKey) {
          setIsPopoverOpened(false);
        }
      }
    },
    [setIsPopoverOpened],
  );

  // Use "dialog" role if content is interactive, "tooltip" otherwise.
  const content =
    typeof children === "function"
      ? children({ setIsPopoverOpened, isPopoverOpened, contentRef })
      : children;
  const hasInteractiveContent = (node: ReactNode): boolean => {
    if (isValidElement(node)) {
      if (
        node.type === "button" ||
        node.type === "a" ||
        node.type === "input" ||
        (typeof node.type === "function" &&
          (node.props.onClick || node.props.href || node.props.onChange))
      ) {
        return true;
      }

      if (node.props?.children) {
        return React.Children.toArray(node.props.children).some(
          hasInteractiveContent,
        );
      }
    }
    return false;
  };
  const role = hasInteractiveContent(content) ? "dialog" : "tooltip";

  // Close the popover when clicking outside of it
  useOutsideClickListener(contentRef, handleClose, isPopoverOpened);

  if (!isMounted) return null;

  return ReactDOM.createPortal(
    <div
      tabIndex={-1}
      className={classNames(defaultClasses, className, {
        "top-0 left-0 opacity-transparent": !isVisible,
        "overflow-y-scroll": !!maxHeightPx,
      })}
      role={role}
      aria-hidden={!isMounted}
      onKeyDown={handleKeyDown}
      ref={contentRef}
      style={{
        ...placementStyles,
        ...(maxHeightPx ? { maxHeight: `${maxHeightPx}px` } : {}),
      }}
      data-popover="true"
    >
      {content}
    </div>,
    document.body,
  );
};

Popover.Anchor = Anchor;
Popover.Content = Content;

Popover.displayName = "KaizenPopover";

export default Popover;
