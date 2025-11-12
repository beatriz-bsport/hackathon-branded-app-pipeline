import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import Body from "#src/components/Body";
import Button, { type ButtonProps } from "#src/components/Button";
import { Illustration } from "#src/components/Illustration";
import Title from "#src/components/Title";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const defaultClasses = [
  "py-xl",
  "flex",
  "flex-col",
  "gap-xs",
  "items-center",
  "justify-center",
  "max-w-[600px]",
] as const;

const errorFallback = cva(defaultClasses);

export type ErrorFallbackActionProps = Omit<
  ButtonProps,
  "color" | "size" | "intent" | "label" | "kind" | "icon"
> & {
  label?: string;
};

export type ErrorFallbackProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof errorFallback> & {
    actionProps?: ErrorFallbackActionProps;
    description?: string;
    subtitle?: string;
    title?: string;
  };

/**
 * Component used to display error fallback UI when something goes wrong.
 * Provides a consistent error state with illustration, title, description and action button.
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.actionProps Optional. Props for the action button. If not provided, no button will be shown.
 * @param props.title Optional. Title to display. Defaults to translated "We're sorry —".
 * @param props.subtitle Optional. Subtitle to display under the title. Defaults to translated "something went wrong on our side.".
 * @param props.description Optional. Description to add under the subtitle. Defaults to translated instructions.
 * @link  https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-errorfallback--docs
 */
const DEFAULT_ACTION_PROPS: ErrorFallbackActionProps = {
  onClick: () => window.location.reload(),
};

const ErrorFallback = ({
  actionProps,
  className,
  title,
  subtitle,
  description,
  ...props
}: ErrorFallbackProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const finalTitle = title ?? t("errorFallback.title");
  const finalSubtitle = subtitle ?? t("errorFallback.subtitle");
  const finalDescription = description ?? t("errorFallback.description");
  const defaultActionLabel = t("errorFallback.actionLabel");

  const finalActionProps = actionProps
    ? { ...actionProps, label: actionProps.label ?? defaultActionLabel }
    : undefined;

  return (
    <div
      className={errorFallback({ className })}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <Illustration name="error" />
      {finalTitle && (
        <Title
          htmlVariant="h3"
          weight="stronger"
          color="weak"
          className="text-center"
        >
          {finalTitle} <br />
          {finalSubtitle && finalSubtitle}
        </Title>
      )}
      {finalDescription && (
        <Body
          htmlVariant="p"
          weight="weak"
          color="weak"
          className="text-center whitespace-pre-line"
          size="md"
        >
          {finalDescription}
        </Body>
      )}
      {finalActionProps && (
        <div className="flex flex-row items-center justify-center mt-sm">
          <Button
            {...finalActionProps}
            kind="default"
            color="main"
            size="md"
            intent="default"
          />
        </div>
      )}
    </div>
  );
};

ErrorFallback.displayName = "KaizenErrorFallback";

const ErrorFallbackWithStatics = ErrorFallback as typeof ErrorFallback & {
  DEFAULT_ACTION_PROPS: typeof DEFAULT_ACTION_PROPS;
};

ErrorFallbackWithStatics.DEFAULT_ACTION_PROPS = DEFAULT_ACTION_PROPS;

export default ErrorFallbackWithStatics;
