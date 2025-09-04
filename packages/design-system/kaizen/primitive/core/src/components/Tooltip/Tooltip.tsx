import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";

import Chip, { ChipProps } from "#src/components/Chip";
import {
  Placements,
  useRelativePlacementClasses,
} from "#src/hooks/placement-classes.hook";

const defaultClasses = [
  "flex",
  "max-w-component-tooltip",
  "w-max",
  "py-2xs",
  "px-xs",
  "items-center",
  "gap-xs",
  "rounded-sm",
  "bg-surface-default-elevated",
  "shadow-[0px_4px_12px_-4px_rgba(32,35,34,0.36)]",
  "z-[999]",
  "transform",
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

  const renderedChip = useMemo(() => chip && <Chip {...chip} />, [chip]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsVisible(false);
    }
  }, []);

  const placementClasses = useRelativePlacementClasses(placement);

  return (
    <div className="relative" {...props}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        aria-label={label}
      >
        {children}
      </div>
      <div
        className={classNames(tooltip({ className }), placementClasses, {
          "opacity-transparent pointer-events-none invisible": !isVisible,
        })}
        role="tooltip"
        aria-hidden={!isVisible}
        title={label}
      >
        <span className="text-wrap text-onsurface-default text-body-sm leading-xs">
          {label}
        </span>
        {renderedChip}
      </div>
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
