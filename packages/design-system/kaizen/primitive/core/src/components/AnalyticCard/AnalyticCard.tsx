import classNames from "classnames";
import React, { type ReactNode, useCallback, useEffect, useRef } from "react";

import Body from "#src/components/Body";
import Card from "#src/components/Card";
import Popover from "#src/components/Popover";
import { type Placement, Placements } from "#src/hooks/placement-classes.hook";

import Button from "../Button";

export type AnalyticCardProps = {
  /** Data metric title (e.g. "Delivery rate", "Open rate") */
  title: string;
  /** Main figure to display (e.g. "99%", "50%") */
  figure: string;
  /** Optional subtitle explaining the figure (e.g. "99 emails delivered") */
  subtitle?: string;
  /** Optional content for the info popover (can contain links, formatted text) */
  infoContent?: ReactNode;
  /** Placement of the info popover relative to the icon. Default: "bottom-right" */
  infoPopoverPlacement?: Placement;
  /** When true, the card expands to fill all available space; otherwise it sizes to content. Default: false */
  fullWidth?: boolean;
  className?: string;
};

const HOVER_CLOSE_DELAY_MS = 300;

/**
 * Display-only card for analytics-style metrics. Composes Card, Body, Icon and Popover.
 * Shows a title, a prominent figure, an optional subtitle, and an optional info icon
 * that opens a popover on hover (stays open while hovering icon or content).
 */
const AnalyticCard: React.FC<AnalyticCardProps> = ({
  title,
  figure,
  subtitle,
  infoContent,
  infoPopoverPlacement = "bottom-right",
  fullWidth = false,
  className,
}) => {
  const hoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearHoverCloseTimeout = useCallback(() => {
    if (hoverCloseTimeoutRef.current !== null) {
      clearTimeout(hoverCloseTimeoutRef.current);
      hoverCloseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearHoverCloseTimeout;
  }, [clearHoverCloseTimeout]);

  const scheduleHoverClose = useCallback(
    (setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>) => {
      clearHoverCloseTimeout();
      hoverCloseTimeoutRef.current = setTimeout(() => {
        hoverCloseTimeoutRef.current = null;
        setIsPopoverOpened(false);
      }, HOVER_CLOSE_DELAY_MS);
    },
    [clearHoverCloseTimeout],
  );

  const handleOpenByHover = useCallback(
    (setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>) => {
      clearHoverCloseTimeout();
      setIsPopoverOpened(true);
    },
    [clearHoverCloseTimeout],
  );

  const handleLeaveTriggerOrContent = useCallback(
    (setIsPopoverOpened: React.Dispatch<React.SetStateAction<boolean>>) => {
      scheduleHoverClose(setIsPopoverOpened);
    },
    [scheduleHoverClose],
  );

  useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current !== null) {
        clearTimeout(hoverCloseTimeoutRef.current);
      }
    };
  }, []);

  const cardContent = (
    <div className="flex flex-col gap-md">
      <div className="flex flex-row items-start justify-between gap-xs">
        <Body size="sm" color="weak" htmlVariant="span" className="flex-1">
          {title}
        </Body>
        {infoContent != null && (
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  kind="icon-button"
                  intent="flat"
                  color="default"
                  size="sm"
                  label={title}
                  icon="info-circle"
                  onMouseEnter={() => handleOpenByHover(setIsPopoverOpened)}
                  onMouseLeave={() =>
                    handleLeaveTriggerOrContent(setIsPopoverOpened)
                  }
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement={infoPopoverPlacement}>
              {({ setIsPopoverOpened }) => (
                <div
                  role="presentation"
                  onMouseEnter={() => handleOpenByHover(setIsPopoverOpened)}
                  onMouseLeave={() =>
                    handleLeaveTriggerOrContent(setIsPopoverOpened)
                  }
                >
                  <div className="flex flex-col gap-xs">
                    {typeof infoContent === "string" ? (
                      <Body size="sm" color="default" htmlVariant="p">
                        {infoContent}
                      </Body>
                    ) : (
                      infoContent
                    )}
                  </div>
                </div>
              )}
            </Popover.Content>
          </Popover>
        )}
      </div>
      <Body size="xl" color="default" weight="strong" htmlVariant="p">
        {figure}
      </Body>
      {subtitle != null && (
        <Body size="sm" color="weak" htmlVariant="p">
          {subtitle}
        </Body>
      )}
    </div>
  );

  return (
    <Card
      className={classNames(fullWidth ? "w-full" : "w-fit", className)}
      padding="default"
    >
      {cardContent}
    </Card>
  );
};

AnalyticCard.displayName = "KaizenAnalyticCard";

export default AnalyticCard;
export type { Placement };
export { Placements };
