import React, { MouseEventHandler, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import mapValues from "lodash/mapValues";
import Icon, { IconName } from "#src/components/Icon";
import Title from "#src/components/Title";
import Body from "#src/components/Body";
import Button from "#src/components/Button";

const defaultClasses = [
  "flex",
  "w-component-toast",
  "p-md",
  "items-start",
  "gap-xs",
  "rounded-md",
  "shadow-xl",
  "text-onsurface-default-onstrong",
] as const;

const variants = {
  status: {
    default: "bg-surface-default-strong",
    positive: "bg-surface-status-positive-strong",
    critical: "bg-surface-status-critical-strong",
  },
} as const;

export const statuses = mapValues(variants.status, (_, key) => key) as {
  [key in keyof typeof variants.status]: key;
};

const toast = cva(defaultClasses, {
  variants,
});

export type ToastProps = React.HTMLAttributes<HTMLLIElement> &
  VariantProps<typeof toast> & {
    status: keyof typeof statuses;
    title?: string;
    description?: string;
    icon?: IconName;
    buttonLabel?: string;
    onButtonClick?: MouseEventHandler<HTMLButtonElement>;
    onDismiss?: () => void;
    duration?: number;
  };

/**
 * A component that renders a toast notification.
 * A toast is a short message that appears and disappears automatically after a certain duration.
 *
 * @remarks
 * The Toasts need to be called via the toast function. Check the ToastProvider.tsx file.
 * With the ToastProvider called, it enables you to call the toast function anywhere in your app.
 *
 * @param props.status The status of the toast. Can be one of "default", "positive", "critical".
 * @param props.title Title of the toast.
 * @param props.description Description below the title.
 * @param props.icon The icon to display.
 * @param props.buttonLabel Text label of the button.
 * @param props.onButtonClick Function to call when the button is clicked.
 * @param props.onDismiss Function to call when the toast is dismissed.
 * @param props.duration Time in milliseconds until the toast is dismissed automatically.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-toast--docs
 */
const Toast: React.FC<ToastProps> = ({
  className,
  status,
  title,
  description,
  icon,
  buttonLabel,
  onButtonClick,
  onDismiss,
  duration = 5000,
  ...props
}) => {
  if (duration < 0) {
    console.warn("Duration must be greater than 0");
  }
  if (duration < 1000) {
    console.warn("Toast duration is too short for most users to read.");
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onButtonClick?.(e);
    onDismiss?.();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <li
      className={toast({ className, status })}
      role="alert"
      aria-live="assertive"
      aria-label={`Notification: ${status} - ${title || ""}. ${description || ""}`}
      tabIndex={0}
      {...props}
    >
      {icon && (
        <div>
          <Icon icon={icon} size="md" aria-hidden="true" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2xs">
        {title && (
          <Title htmlVariant="h4" weight="strong">
            {title}
          </Title>
        )}
        {description && <Body htmlVariant="p">{description}</Body>}
      </div>
      {buttonLabel && (
        <div className="flex flex-row gap-sm">
          <Button
            label={buttonLabel}
            intent="default"
            color="main"
            size="sm"
            onClick={handleButtonClick}
            aria-label={`Dismiss ${title || "toast"}`}
          />
        </div>
      )}
    </li>
  );
};

Toast.displayName = "KaizenToast";

export default Toast;
