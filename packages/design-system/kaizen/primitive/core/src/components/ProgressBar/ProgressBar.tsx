import { type VariantProps, cva } from "class-variance-authority";
import classNames from "classnames";
import mapValues from "lodash/mapValues";
import React from "react";

import Body from "#src/components/Body";
import Icon from "#src/components/Icon";

const defaultClasses = ["rounded-circle", "overflow-hidden", "w-full"] as const;

const variants = {
  size: {
    sm: ["h-element-2xs"],
    md: ["h-element-xs"],
    lg: ["h-element-sm"],
  },
  status: {
    main: ["bg-surface-main-weak"],
    positive: ["bg-surface-status-positive-weak"],
    critical: ["bg-surface-status-critical-weak"],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const progressBar = cva(defaultClasses, {
  variants,
});

function computeProgressValue(value: number) {
  return value ? Math.min(100, Math.max(0, value)) : 0;
}

function getMessageColor(status: ProgressBarStatuses) {
  if (status === "positive") return "positive";
  if (status === "critical") return "critical";
  return "default";
}

export type ProgressBarStatuses = keyof typeof statuses;

export type ProgressBarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBar> & {
    size: keyof typeof sizes;
    status: ProgressBarStatuses;
    value: number;
    label?: string;
    message?: string;
  };

/**
 * A React component representing a progress bar used in Kaizen, which visually indicates the
 * advancement of a work in progress. The progress bar can be customized in terms of size,
 * color (status), and an optional label, and supports dynamic progression from 0 to 100.
 * The progress bar supports the following statuses (colors):
 * - `main`: Default state.
 * - `positive`: Indicates a positive or successful progress.
 * - `critical`: Indicates a critical or failure state.
 * The component can display an optional label above the progress bar to indicate which work
 * is in progress.
 * The progression rate (value) should be between 0 and 100. If the value is outside this range,
 * it will be automatically rounded to the nearest bound (0 or 100).
 * @param props.size The height of the progress bar. Can be `sm`, `md`, or `lg`.
 * @param props.status The color/status of the progress bar. Can be `main`, `positive`, or `critical`.
 * @param props.label (Optional) A label to display above the progress bar indicating the work in progress.
 * @param props.message (Optional) A message to display under the progress bar, giving some hints about the result.
 * @param props.value The current progress value, from 0 to 100. If outside the range, it will be rounded to the closest bound.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-progressbar--docs
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  size,
  status,
  value,
  label,
  message,
  ...props
}) => {
  const progressValue = computeProgressValue(value);
  const messageColor = getMessageColor(status);

  return (
    <div
      data-component="Kaizen-ProgressBar"
      className="w-full gap-xs flex flex-col items-start"
    >
      {label && (
        <div className="flex flex-row items-center gap-2xs text-onsurface-weak">
          <Icon icon="file-06" size="sm" />
          <span>{label}</span>
        </div>
      )}
      <div
        className={progressBar({ className, size, status })}
        role="progressbar"
        aria-label={`Progress : ${progressValue}`}
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${progressValue}`}
        {...props}
      >
        <div
          className={classNames(
            "rounded-circle h-full",
            "transition-all ease-in-out duration-extra-long",
            {
              "bg-surface-main-strong": status === "main",
              "bg-surface-status-positive-strong": status === "positive",
              "bg-surface-status-critical-strong": status === "critical",
            },
          )}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      {message && (
        <Body htmlVariant="p" size="sm" weight="weak" color={messageColor}>
          {message}
        </Body>
      )}
    </div>
  );
};

ProgressBar.displayName = "KaizenProgressBar";

export default ProgressBar;
