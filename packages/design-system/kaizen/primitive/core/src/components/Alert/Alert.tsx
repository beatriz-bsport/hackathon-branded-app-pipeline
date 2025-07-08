import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { MouseEventHandler } from "react";

import Body from "#src/components/Body";
import Button from "#src/components/Button";
import Icon, { type IconName } from "#src/components/Icon";
import Title from "#src/components/Title";

const defaultClasses = [
  "rounded-lg",
  "font-weak",
  "p-md",
  "flex flex-direction-row gap-md items-stretch",
] as const;

const variants = {
  statusByType: {
    "weak:default": [
      "bg-surface-default-weakest",
      "shadow-border-thin-default",
      "text-onsurface-default",
    ],
    "weak:warning": [
      "bg-surface-status-warning-weak",
      "shadow-border-thin-warning",
      "text-onsurface-status-warning-strong",
    ],
    "weak:info": [
      "bg-surface-status-info-weak",
      "shadow-border-thin-info",
      "text-onsurface-status-info-strong",
    ],
    "weak:critical": [
      "bg-surface-status-critical-weak",
      "shadow-border-thin-critical",
      "text-onsurface-status-critical-strong",
    ],
    "weak:positive": [
      "bg-surface-status-positive-weak",
      "shadow-border-thin-positive",
      "text-onsurface-status-positive-strong",
    ],
    "strong:default": ["bg-surface-default-strong"],
    "strong:warning": ["bg-surface-status-warning-strong"],
    "strong:info": ["bg-surface-status-info-strong"],
    "strong:critical": ["bg-surface-status-critical-strong"],
    "strong:positive": ["bg-surface-status-positive-strong"],
  },
} as const;

const iconByStatus: Record<(typeof statuses)[number], IconName> = {
  default: "message-text-square-02",
  warning: "message-alert-square",
  info: "message-question-square",
  critical: "message-x-square",
  positive: "message-check-square",
} as const;

export const statuses = [
  "default",
  "warning",
  "info",
  "critical",
  "positive",
] as const;

export const types = ["weak", "strong"] as const;

const alert = cva(defaultClasses, {
  variants,
});

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  status: (typeof statuses)[number];
  type?: (typeof types)[number];
  title?: string;
  buttonLabel?: string;
  onClearClick?: MouseEventHandler<HTMLButtonElement>;
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
};

/**
 * The Alert component is a visual element that is used to convey important information to users.
 * It can be used to display info, warnings, errors, or success messages.
 * @param props.className Classname to add to the alert.
 * @param props.status Status of the alert. Can be "default", "warning", "info", "critical", or "positive".
 * @param props.type Type of the alert. Can be "weak" or "strong".
 * @param props.title Title of the alert.
 * @param props.buttonLabel Text label of the button.
 * @param props.onClearClick Function to call when the alert is cleared.
 * @param props.onButtonClick Function to call when the button is clicked.
 * @param props.children Content of the alert.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-alert--docs
 */
const Alert: React.FC<AlertProps> = ({
  className,
  status,
  type = "weak",
  title,
  buttonLabel,
  onClearClick,
  onButtonClick,
  children,
  ...props
}) => {
  const isClearable = !!onClearClick;
  const isDisplayingActions = buttonLabel || isClearable;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-labelledby={title ? `${title}-title` : undefined}
      className={classNames(
        `${alert({ className, statusByType: `${type}:${status}` as keyof typeof variants.statusByType })}`,
        { "text-onsurface-default-onstrong": type === "strong" },
      )}
      {...props}
    >
      <div>
        <Icon
          icon={iconByStatus[status]}
          size="md"
          className={classNames({
            "text-onsurface-main-strong":
              status === "default" && type === "weak",
            "text-onsurface-main-onstrong":
              status === "default" && type === "strong",
          })}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2xs">
        {title && (
          <Title htmlVariant="h4" weight="stronger">
            {title}
          </Title>
        )}
        {children && typeof children === "string" ? (
          <Body
            htmlVariant="p"
            size="md"
            weight="weak"
            color={type === "weak" ? status : "onstrong"}
          >
            {children}
          </Body>
        ) : (
          <>{children}</>
        )}
      </div>
      {isDisplayingActions && (
        <div className="flex flex-row items-center gap-sm">
          {buttonLabel && (
            <Button
              label={buttonLabel}
              intent="default"
              color="main"
              size="sm"
              onClick={onButtonClick}
            />
          )}
          {isClearable && (
            <Button
              intent="flat"
              color={type === "weak" ? "default" : "onstrong"}
              size="sm"
              iconLeft="x-close"
              onClick={onClearClick}
              loading={false}
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
