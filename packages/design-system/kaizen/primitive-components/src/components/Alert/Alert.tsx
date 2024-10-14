import type { SetRequired } from "type-fest";
import React, { MouseEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import Icon, { type IconName } from "../Icon";
import Title from "../Title";
import Body from "../Body";
import Button from "../Button";

const defaultClasses = [
  "border-stroke-thin",
  "rounded-lg",
  "font-weak",
  "p-md",
  "flex flex-direction-row gap-md",
] as const;

const variants = {
  status: {
    default: [
      "bg-surface-default",
      "border-stroke-default/md",
      "border-stroke-thin",
      "fill-onsurface-default",
      "text-onsurface-default",
    ],
    warning: [
      "bg-surface-status-warning-weak",
      "border-stroke-status-warning",
      "fill-onsurface-status-warning-strong",
      "text-onsurface-status-warning-strong",
    ],
    info: [
      "bg-surface-status-info-weak",
      "border-stroke-status-info",
      "fill-onsurface-status-info-strong",
      "text-onsurface-status-info-strong",
    ],
    critical: [
      "bg-surface-status-critical-weak",
      "border-stroke-status-critical",
      "fill-onsurface-status-critical-strong",
      "text-onsurface-status-critical-strong",
    ],
    positive: [
      "bg-surface-status-positive-weak",
      "border-stroke-status-positive",
      "fill-onsurface-status-positive-strong",
      "text-onsurface-status-positive-strong",
    ],
  },
} as const;

const iconByStatus: { [status in keyof typeof variants.status]: IconName } = {
  default: "message-text-square-02",
  warning: "message-alert-square",
  info: "message-question-square",
  critical: "message-x-square",
  positive: "message-check-square",
} as const;

/**
 * Intents available for the button
 */
export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const alert = cva(defaultClasses, {
  variants,
});

type AlertVariantProps = SetRequired<VariantProps<typeof alert>, "status">;

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  AlertVariantProps &
  React.PropsWithChildren<{
    title?: string;
    buttonLabel?: string;
    isClearable?: boolean;
    onClearClick: MouseEventHandler<HTMLButtonElement>;
    onButtonClick: MouseEventHandler<HTMLButtonElement>;
  }>;

const Alert: React.FC<AlertProps> = ({
  className,
  children,
  title,
  status,
  isClearable = true,
  buttonLabel,
  onButtonClick,
  onClearClick,
  ...props
}) => {
  const isDisplayingActions = buttonLabel || isClearable;

  return (
    <div
      className={`${alert({ className, status })} flex items-stretch`}
      {...props}
    >
      <div className="">
        <Icon icon={iconByStatus[status || "default"]} size={"md"} />
      </div>
      <div className="flex-1 flex flex-col gap-2xs">
        {title && (
          <Title htmlVariant="h4" weight="strong">
            {title}
          </Title>
        )}
        {children && <Body htmlVariant="p">{children}</Body>}
      </div>
      {isDisplayingActions && (
        <div className="flex flex-row items-center gap-sm">
          {buttonLabel && (
            <Button
              intent="default"
              size="sm"
              onClick={onButtonClick}
              color="main"
              label={buttonLabel}
            />
          )}
          {isClearable && (
            <Button
              iconLeft="x-close"
              onClick={onClearClick}
              size="sm"
              intent="flat"
              loading={false}
              color="default"
            />
          )}
        </div>
      )}
    </div>
  );
};

Alert.displayName = "KaizenAlert";

export default Alert;
