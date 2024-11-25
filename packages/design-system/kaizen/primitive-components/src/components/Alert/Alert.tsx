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
  "flex flex-direction-row gap-md items-stretch",
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
    status: keyof typeof statuses;
    title?: string;
    buttonLabel?: string;
    isClearable?: boolean;
    onClearClick: MouseEventHandler<HTMLButtonElement>;
    onButtonClick: MouseEventHandler<HTMLButtonElement>;
  }>;

/**
 * The Alert component is a visual element that is used to convey important information to users.
 * It can be used to display info, warnings, errors, or success messages.
 * @param props.className Classname to add to the alert.
 * @param props.status Status of the alert. Can be "default", "warning", "info", "critical", or "positive".
 * @param props.title Title of the alert.
 * @param props.buttonLabel Text label of the button.
 * @param props.isClearable Boolean to define if the alert is clearable.
 * @param props.onClearClick Function to call when the alert is cleared.
 * @param props.onButtonClick Function to call when the button is clicked.
 * @param props.children Content of the alert.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-alert--docs
 */
const Alert: React.FC<AlertProps> = ({
  className,
  status,
  title,
  buttonLabel,
  isClearable = true,
  onClearClick,
  onButtonClick,
  children,
  ...props
}) => {
  const isDisplayingActions = buttonLabel || isClearable;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-labelledby={title ? `${title}-title` : undefined}
      className={`${alert({ className, status })}`}
      {...props}
    >
      <div>
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
              aria-label="Clear alert"
            />
          )}
        </div>
      )}
    </div>
  );
};

Alert.displayName = "KaizenAlert";

export default Alert;
