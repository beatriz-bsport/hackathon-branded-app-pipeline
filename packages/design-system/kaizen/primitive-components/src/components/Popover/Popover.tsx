import React, {
  createContext,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import usePlacementClasses, {
  Placements,
} from "#src/hooks/placement-classes.hook";
import useEscapeKeydownListener from "#src/hooks/escape-keydown-listener.hook";
import useOutsideClickListener from "#src/hooks/outside-click-listener";
import { cva } from "class-variance-authority";

const defaultClasses = [
  "absolute",
  "min-w-component-popover-min",
  "max-w-component-popover-max",
  "rounded-sm",
  "p-xs",
  "gap-xs",
  "bg-surface-default-elevated",
  "border-stroke-thin",
  "border-stroke-default",
  "shadow-lg",
  "transition ease-out duration-default",
] as const;

const popoverClasses = cva("relative w-fit");

export const PopoverContext = createContext<{
  isPopoverOpened: boolean;
  setIsPopoverOpened: (isOpen: boolean) => void;
}>({
  isPopoverOpened: false,
  setIsPopoverOpened: () => {},
});

export type PopoverProps = {
  children: ReactNode;
  className?: string;
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
} = ({ children, className }) => {
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);
  const popoverRef = useRef(null);

  const handleClose = () => setIsPopoverOpened(false);

  // Close the popover when the escape key is pressed or when a click occurs outside
  useEscapeKeydownListener(handleClose, isPopoverOpened);
  useOutsideClickListener(popoverRef, handleClose, isPopoverOpened);

  return (
    <PopoverContext.Provider value={{ isPopoverOpened, setIsPopoverOpened }}>
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
    setIsPopoverOpened: (isOpen: boolean) => void;
  }) => ReactNode;
}> = ({ children }) => {
  const { isPopoverOpened, setIsPopoverOpened } = useContext(PopoverContext);

  return <>{children({ isPopoverOpened, setIsPopoverOpened })}</>;
};

/**
 * The Content component is a subcomponent of the Popover that renders the
 * contents of the Popover. It is responsible for displaying the Popover's
 * content and handling its visibility state.
 * @param className Additional classes to apply to the Content.
 * @param children Node(s) to render inside the Content.
 */
const Content: React.FC<{
  className?: string;
  children: (props: {
    setIsPopoverOpened: (isOpen: boolean) => void;
  }) => ReactNode;
  placement?: (typeof Placements)[number];
}> = ({ className, children, placement = "bottom-left" }) => {
  const { isPopoverOpened, setIsPopoverOpened } = useContext(PopoverContext);
  const placementClasses = usePlacementClasses(placement);

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsMounted(false);
      setIsPopoverOpened(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (isPopoverOpened) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      handleClose();
    }
  }, [isPopoverOpened, handleClose]);

  // Use "dialog" role if content is interactive, "tooltip" otherwise.
  const content =
    typeof children === "function"
      ? children({ setIsPopoverOpened })
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

  if (!isMounted) return null;

  return (
    <div
      tabIndex={-1}
      className={classNames(defaultClasses, placementClasses, className, {
        "opacity-transparent scale-95": !isVisible,
      })}
      role={role}
      aria-hidden={!isVisible}
    >
      {content}
    </div>
  );
};

Popover.Anchor = Anchor;
Popover.Content = Content;

Popover.displayName = "KaizenPopover";

export default Popover;
