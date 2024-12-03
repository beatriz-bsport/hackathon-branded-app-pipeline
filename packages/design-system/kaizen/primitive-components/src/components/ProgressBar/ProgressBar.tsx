import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import classNames from "classnames";
import Icon from "../Icon";

const defaultClasses = ["rounded-circle", "overflow-hidden"] as const;

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

export type ProgressBarProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBar> & {
    size: keyof typeof sizes;
    status: keyof typeof statuses;
    value: number;
    label?: string;
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
 * @param props.value The current progress value, from 0 to 100. If outside the range, it will be rounded to the closest bound.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-progressbar--docs
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  size,
  status,
  value,
  label,
  ...props
}) => {
  const progressValue = computeProgressValue(value);

  return (
    <div>
      {label && (
        <div className="flex flex-row items-center gap-2xs mb-sm text-onsurface-weak">
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
    </div>
  );
};

ProgressBar.displayName = "KaizenProgressBar";

export default ProgressBar;
