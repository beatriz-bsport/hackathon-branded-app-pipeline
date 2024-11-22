import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import PortalContainer from "../../utils/PortalContainer";
import {
  AnchorType,
  TransitionStyleType,
  useContainerPosition,
} from "../../hooks/useContainerPosition";
import useEscapeKeydownListener from "../Modal/escape-keydown-listener.hook";

const defaultClasses = [
  "min-w-component-popover-min",
  "max-w-component-popover-max",
  "rounded-sm",
  "p-xs",
  "gap-xs",
  "bg-surface-default-elevated",
  "border-stroke-thin",
  "border-stroke-default",
] as const;

const variants = {} as const;

const popover = cva(defaultClasses, {
  variants,
});

export type PopoverProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof popover> & {
    parentId: string;
    containerId: string;
    anchor: AnchorType;
    open: boolean;
    transitionStyle: TransitionStyleType;
    onClose: () => void;
  };

/**
 * A Popover Container is a UI component that displays temporary content in a floating
 * overlay, triggered by user actions (e.g., click or hover). It provides additional
 * information or actions without navigating away from the current view. The goal is
 * also to not break the DOM Tree and use a portal to render it outside of the actual
 * tree while linking it to its parent component
 * @param props.className Classname to add to the modal container.
 * @param props.open Whether the modal is open or not.
 * @param props.containerId The Id of the newly created container
 * @param props.anchor The direction wjere the container should be displayed and anchored
 * @param props.transitionStyle The way the container should display on opening
 * @param props.onClose Function to call when the modal is closed.
 * @param props.children Content in the middle of the modal.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-popover--docs
 */
const Popover: React.FC<PopoverProps> = ({
  className,
  children,
  parentId,
  anchor,
  containerId,
  open,
  transitionStyle,
  onClose,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null!);
  const previouslyFocusedRef = React.useRef<HTMLElement>(null!);
  const [inlineStyle, setInlineStyle] = React.useState({});
  const { setPositioningStyles } = useContainerPosition({
    containerRef,
    parentId,
    anchor,
  });

  const handleClose = React.useCallback(() => {
    setTimeout(onClose, 5);
  }, [onClose]);

  const handlePopoverMouseClose = React.useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const parentElement = document.getElementById(parentId);
      if (
        event.target &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        parentElement &&
        !parentElement.contains(event.target as Node)
      ) {
        handleClose();
      }
    },
    [open, onClose, containerRef, parentId],
  );

  React.useEffect(() => {
    if (transitionStyle === "appear") {
      setInlineStyle({
        visibility: "hidden",
        opacity: "0",
        transition: "opacity 150ms ease-in, visibility 0ms ease-in 150ms",
      });
    }
    return () => {
      setInlineStyle({});
    };
  }, [transitionStyle, setInlineStyle]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        setPositioningStyles(transitionStyle);
        previouslyFocusedRef.current = document.activeElement as HTMLElement;
        const containerElem = document.getElementById(containerId);
        containerElem?.focus();
      }, 20);
    } else {
      handleClose();
      previouslyFocusedRef.current?.focus();
    }
  }, [
    open,
    previouslyFocusedRef,
    containerRef,
    handleClose,
    setPositioningStyles,
  ]);

  React.useEffect(() => {
    document.addEventListener("mouseup", handlePopoverMouseClose);
    return () => {
      document.removeEventListener("mouseup", handlePopoverMouseClose);
    };
  }, [handlePopoverMouseClose, previouslyFocusedRef, containerRef]);

  useEscapeKeydownListener(handleClose ?? (() => {}), open);

  if (!open) return null;

  return (
    <PortalContainer {...props} parentId={parentId} containerId={containerId}>
      <div
        ref={containerRef}
        style={inlineStyle}
        className={popover({ className })}
      >
        {children}
      </div>
    </PortalContainer>
  );
};

Popover.displayName = "KaizenPopover";

export default Popover;
