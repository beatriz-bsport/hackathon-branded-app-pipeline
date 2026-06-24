import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  Body,
  Chip,
  Icon,
  Popover,
  TooltipProps,
} from "@bsport/kaizen-primitive-core";

import {
  SERIES_BOOKING_RULE_CHIP_COLORS,
  type SeriesBookingRuleChipColor,
} from "#src/utils/series-booking-rule";

type BookingRuleInfoLabels = {
  description: string;
  fullSeries: string;
  fullSeriesDescription: string;
  openSeries: string;
  openSeriesDescription: string;
  singleClass: string;
  singleClassDescription: string;
  title: string;
};

type SeriesListHeaderInfoPopoverProps = {
  children: ReactNode;
  placement?: TooltipProps["placement"];
  label: string;
};

type SeriesListHeaderWithInfoProps = {
  label: string;
  placement?: TooltipProps["placement"];
  tooltipContent: ReactNode;
};

type BookingRuleInfoPopoverRowProps = {
  children: ReactNode;
  color: SeriesBookingRuleChipColor;
  label: string;
};

type BookingRuleInfoPopoverContentProps = {
  labels: BookingRuleInfoLabels;
};

const BookingRuleInfoPopoverRow = ({
  children,
  color,
  label,
}: BookingRuleInfoPopoverRowProps) => (
  <div className="flex items-start gap-md">
    <div className="shrink-0">
      <Chip label={label} color={color} type="weak" size="lg" />
    </div>
    <Body htmlVariant="p" size="md" color="weak">
      {children}
    </Body>
  </div>
);

export const SeriesListHeaderInfoPopover = ({
  children,
  placement = "bottom",
  label,
}: SeriesListHeaderInfoPopoverProps) => {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  const handleOpen = useCallback(
    (setIsPopoverOpened: Dispatch<SetStateAction<boolean>>) => {
      clearCloseTimeout();
      setIsPopoverOpened(true);
    },
    [clearCloseTimeout],
  );

  const handleClose = useCallback(
    (setIsPopoverOpened: Dispatch<SetStateAction<boolean>>) => {
      clearCloseTimeout();
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpened(false);
      }, 100);
    },
    [clearCloseTimeout],
  );

  return (
    <Popover>
      <Popover.Anchor className="h-full flex items-center justify-center">
        {({ setIsPopoverOpened }) => (
          <span
            role="button"
            tabIndex={0}
            className="inline-flex text-onsurface-weak"
            aria-label={label}
            onFocus={() => handleOpen(setIsPopoverOpened)}
            onBlur={() => handleClose(setIsPopoverOpened)}
            onMouseEnter={() => handleOpen(setIsPopoverOpened)}
            onMouseLeave={() => handleClose(setIsPopoverOpened)}
          >
            <Icon icon="info-circle" size="sm" />
          </span>
        )}
      </Popover.Anchor>
      <Popover.Content placement={placement} maxWidthPx={400}>
        {({ setIsPopoverOpened }) => (
          <div
            role="presentation"
            onFocus={() => handleOpen(setIsPopoverOpened)}
            onBlur={() => handleClose(setIsPopoverOpened)}
            onMouseEnter={() => handleOpen(setIsPopoverOpened)}
            onMouseLeave={() => handleClose(setIsPopoverOpened)}
          >
            {children}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};

export const SeriesListHeaderWithInfo = ({
  label,
  placement,
  tooltipContent,
}: SeriesListHeaderWithInfoProps) => (
  <Body htmlVariant="span" size="lg" className="flex items-center gap-2xs">
    {label}
    <SeriesListHeaderInfoPopover label={label} placement={placement}>
      {tooltipContent}
    </SeriesListHeaderInfoPopover>
  </Body>
);

export const SeriesListBookingRuleInfoPopoverContent = ({
  labels,
}: BookingRuleInfoPopoverContentProps) => (
  <div className="flex flex-col gap-md">
    <div className="flex flex-col gap-2xs">
      <Body htmlVariant="p" size="lg" weight="strong">
        {labels.title}
      </Body>
      <Body htmlVariant="p" size="md">
        {labels.description}
      </Body>
    </div>
    <div className="flex flex-col gap-sm">
      <BookingRuleInfoPopoverRow
        label={labels.fullSeries}
        color={SERIES_BOOKING_RULE_CHIP_COLORS.fullSeries}
      >
        {labels.fullSeriesDescription}
      </BookingRuleInfoPopoverRow>
      <BookingRuleInfoPopoverRow
        label={labels.openSeries}
        color={SERIES_BOOKING_RULE_CHIP_COLORS.openSeries}
      >
        {labels.openSeriesDescription}
      </BookingRuleInfoPopoverRow>
      <BookingRuleInfoPopoverRow
        label={labels.singleClass}
        color={SERIES_BOOKING_RULE_CHIP_COLORS.singleClass}
      >
        {labels.singleClassDescription}
      </BookingRuleInfoPopoverRow>
    </div>
  </div>
);
