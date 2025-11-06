import { type VariantProps, cva } from "class-variance-authority";
import type { FC, HTMLAttributes } from "react";

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
  "max-w-[320px]",
] as const;

const emptyState = cva(defaultClasses);

export type EmptyStateProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyState> & {
    children?: React.ReactNode;
    ctaButtonConfig?: Omit<
      Partial<ButtonProps>,
      "kind" | "icon" | "size" | "intent"
    > & {
      label: string;
    };
    secondaryButtonConfig?: Omit<
      Partial<ButtonProps>,
      "kind" | "icon" | "size" | "intent" | "color"
    > & {
      label: string;
    };
    subtitle?: string;
    title?: string;
    variant?: "empty-state" | "no-results-found";
  };

/**
 * Internal component used to display empty list states, with two variants :
 * Whether the list is empty by filtering (no-results-found) or not (empty-state, default variant).
 * @param props.children Optional. Additional ReactNode to add at the bottom of the component.
 * @param props.className Optional. Custom CSS classes for the container.
 * @param props.ctaButtonConfig Optional. Props to provide to the CTA button. The CTA style is enforced.
 * @param props.secondaryButtonConfig Optional. Props to provide to the secondary button. THe secondary style is enforced.
 * @param props.title Optional. Title to display main information.
 * @param props.subtitle Optional. Body to add under the title to add hints.
 * @param props.variant Optional. Define the icon to display (`empty-state` or `no-results-found`).
 * @link  https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/components-emptystate--docs
 */
const EmptyState: FC<EmptyStateProps> = ({
  children,
  ctaButtonConfig,
  className,
  secondaryButtonConfig,
  title,
  subtitle,
  variant = "empty-state",
  ...props
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  let defaultTitle = "";
  let defaultSecondaryButtonConfig:
    | Partial<Omit<ButtonProps, "kind" | "icon" | "size" | "intent" | "color">>
    | undefined;
  if (variant === "no-results-found") {
    // Set some default parameters
    defaultTitle = t("emptyState.noResultsFound.title");
    defaultSecondaryButtonConfig = {
      label: t("emptyState.noResultsFound.clearFilters"),
      iconLeft: "x",
    };
  }

  const finalTitle = title ?? defaultTitle;
  const finalSecondaryButtonConfig = secondaryButtonConfig
    ? { ...defaultSecondaryButtonConfig, ...secondaryButtonConfig }
    : undefined;

  return (
    <div className={emptyState({ className })} {...props}>
      <Illustration
        name={variant === "no-results-found" ? "no-search" : "empty"}
      />
      {finalTitle && (
        <Title
          htmlVariant="h3"
          weight="stronger"
          color="weak"
          className="text-center"
        >
          {finalTitle}
        </Title>
      )}
      {subtitle && (
        <Body
          htmlVariant="p"
          weight="weak"
          color="weak"
          className="text-center"
          size="lg"
        >
          {subtitle}
        </Body>
      )}
      {(ctaButtonConfig || finalSecondaryButtonConfig) && (
        <div className="flex flex-row items-center justify-center gap-xs mt-sm">
          {finalSecondaryButtonConfig && (
            <Button
              {...finalSecondaryButtonConfig}
              kind="default"
              color="main"
              size="md"
              intent="default"
            />
          )}
          {ctaButtonConfig && (
            <Button
              {...ctaButtonConfig}
              kind="default"
              color="main"
              size="md"
              intent="call-to-action"
            />
          )}
        </div>
      )}
      {children}
    </div>
  );
};

EmptyState.displayName = "KaizenEmptyState";

export default EmptyState;
