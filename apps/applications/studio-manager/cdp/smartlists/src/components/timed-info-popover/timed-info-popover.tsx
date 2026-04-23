import {
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button, Popover } from "@bsport/kaizen-primitive-core";

type TimedInfoPopoverProps = {
  label: string;
  children: ReactNode;
  placement?: ComponentProps<typeof Popover.Content>["placement"];
  buttonColor?: "default" | "main";
  anchorClassName?: string;
  closeDelayMs?: number;
};

const DEFAULT_CLOSE_DELAY_MS = 150;

export const TimedInfoPopover = ({
  label,
  children,
  placement,
  buttonColor = "default",
  anchorClassName,
  closeDelayMs = DEFAULT_CLOSE_DELAY_MS,
}: TimedInfoPopoverProps) => {
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null) {
      return;
    }

    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const handlePopoverOpen = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(true);
  }, [clearCloseTimeout]);

  const handlePopoverClose = useCallback(
    (setIsPopoverOpened: Dispatch<SetStateAction<boolean>>) => {
      clearCloseTimeout();
      closeTimeoutRef.current = setTimeout(() => {
        setIsPopoverOpened(false);
        closeTimeoutRef.current = null;
        setIsOpen(false);
      }, closeDelayMs);
    },
    [clearCloseTimeout, closeDelayMs],
  );

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  return (
    <Popover>
      <Popover.Anchor className={anchorClassName}>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            intent="flat"
            color={buttonColor}
            size="md"
            icon="info-circle"
            label={label}
            aria-controls={contentId}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onMouseEnter={() => {
              handlePopoverOpen();
              setIsPopoverOpened(true);
            }}
            onMouseLeave={() => handlePopoverClose(setIsPopoverOpened)}
            onFocus={() => {
              handlePopoverOpen();
              setIsPopoverOpened(true);
            }}
            onBlur={() => handlePopoverClose(setIsPopoverOpened)}
            onClick={() => {
              handlePopoverOpen();
              setIsPopoverOpened(true);
            }}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement={placement}>
        {({ setIsPopoverOpened }) => (
          <div
            id={contentId}
            onMouseEnter={() => {
              handlePopoverOpen();
              setIsPopoverOpened(true);
            }}
            onMouseLeave={() => handlePopoverClose(setIsPopoverOpened)}
          >
            {children}
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
};
