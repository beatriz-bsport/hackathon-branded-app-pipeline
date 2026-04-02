import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

import Chip, { ChipProps } from "#src/components/Chip";
import {
  Placements,
  useAbsolutePlacementStyles,
} from "#src/hooks/placement-classes.hook";

const defaultClasses = [
  "flex",
  "max-w-component-tooltip",
  "w-max",
  "py-2xs",
  "px-xs",
  "items-center",
  "gap-xs",
  "fixed",
  "rounded-sm",
  "bg-surface-default-elevated",
  "shadow-[0px_4px_12px_-4px_rgba(32,35,34,0.36)]",
  "z-[999]",
  "will-change-[top,left]",
  "transition ease-in duration-default",
  "border-stroke-thin border-stroke-weak",
] as const;

const tooltip = cva(defaultClasses);

export type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  chip?: ChipProps;
  placement?: (typeof Placements)[number];
};

/**
 * React component for a tooltip element. It is a compact component that can be used to
 * represent a small piece of information, such as a hint or a description.
 * @param props.className Classname to add to the tooltip.
 * @param props.label Text to display in the tooltip.
 * @param props.chip Optional configuration for a chip element to be displayed in the tooltip.
 * @param props.children Node(s) to render as the children of the tooltip.
 * @param props.placement Placement of the tooltip relative to the children.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-tooltip--docs
 */
const Tooltip: React.FC<TooltipProps> = ({
  className,
  label,
  chip,
  placement = "top",
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const renderedChip = useMemo(() => chip && <Chip {...chip} />, [chip]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsVisible(false);
    }
  }, []);

  const placementStyles = useAbsolutePlacementStyles(
    placement,
    anchorRef,
    tooltipRef,
    isVisible,
  );

  return (
    <div
      data-component="Kaizen-Tooltip"
      className="relative inline-flex"
      {...props}
    >
      <div
        className="inline-flex"
        ref={anchorRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        aria-label={label}
      >
        {children}
      </div>
      {typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className={classNames(tooltip({ className }), {
              "top-0 left-0 opacity-transparent pointer-events-none invisible":
                !isVisible,
            })}
            role="tooltip"
            aria-hidden={!isVisible}
            title={label}
            style={placementStyles}
            ref={tooltipRef}
          >
            <span className="text-wrap text-onsurface-default text-body-sm leading-xs">
              {label}
            </span>
            {renderedChip}
          </div>,
          document.body,
        )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
