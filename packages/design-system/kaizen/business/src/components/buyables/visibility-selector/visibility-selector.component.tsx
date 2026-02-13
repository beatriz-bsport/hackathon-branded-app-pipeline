import { ReactElement } from "react";

import { type FieldValues, FormField, useFormContext } from "@bsport/form";
import {
  Body,
  DropdownMenu,
  type DropdownMenuProps,
  Icon,
  type Placement,
  cx,
} from "@bsport/kaizen-primitive-core";

import {
  useKaizenI18nInstance,
  useTranslation,
  withKaizenBusinessI18n,
} from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

const VISIBILITY_VALUES = {
  visible: "visible",
  hidden: "hidden",
} as const;

const INDICATORS = {
  [VISIBILITY_VALUES.visible]: {
    icon: "circle-solid",
    className: "text-xs text-onsurface-status-positive-weak",
  },
  [VISIBILITY_VALUES.hidden]: {
    icon: "circle",
    className: "text-xs",
  },
} as const;

function getSelectedOption(value: boolean, isInverted: boolean) {
  if (isInverted) {
    return value ? VISIBILITY_VALUES.hidden : VISIBILITY_VALUES.visible;
  }
  return value ? VISIBILITY_VALUES.visible : VISIBILITY_VALUES.hidden;
}

type VisibilitySelectorProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  /** The translation of your buyable. */
  buyableName: string;
  /**
   * Whether the VisibilitySelector should have an opposite logic.
   * Make it mandatory to highlight visibility on this props.
   */
  asHiddenSelector: boolean;
  /** Tailwind classes to provide to the Button Anchor. Default: define size.*/
  anchorClassName?: string;
  /** Tailwind classes to provide to the Content inside the Popover. Default: define size. */
  popoverClassName?: string;
  /** Position of the Popover */
  popoverPlacement?: Placement;
};

const VisibilitySelectorInner = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  fieldName,
  buyableName,
  asHiddenSelector = false,
  anchorClassName = "min-w-component-popover-min max-w-full",
  popoverClassName = "w-component-popover-min",
  popoverPlacement = "bottom-right",
}: VisibilitySelectorProps<TFormValues, TFieldName>): ReactElement => {
  const formContext = useFormContext<TFormValues>();

  const i18n = useKaizenI18nInstance();
  const { t } = useTranslation("buyables", { i18n });

  if (!formContext) {
    throw new Error(
      "Buyables/VisibilitySelector must be used within a ControlledForm or FormProvider",
    );
  }

  const { watch } = formContext;

  const fieldValue = watch(fieldName) ?? false;

  const isVisible =
    getSelectedOption(fieldValue, asHiddenSelector) ===
    VISIBILITY_VALUES.visible;

  const optionVisible = {
    id: "visible",
    label: t("visibilitySelector.optionVisible.label"),
    description: t("visibilitySelector.optionVisible.description", {
      buyable: buyableName,
    }),
    indicator: INDICATORS[VISIBILITY_VALUES.visible],
  };

  const optionHidden = {
    id: "hidden",
    label: t("visibilitySelector.optionHidden.label"),
    description: t("visibilitySelector.optionHidden.description", {
      buyable: buyableName,
    }),
    indicator: INDICATORS[VISIBILITY_VALUES.hidden],
  };

  const activeOption = isVisible ? optionVisible : optionHidden;

  return (
    <FormField<TFormValues, TFieldName, DropdownMenuProps>
      name={fieldName}
      mapProps={({ defaultProps, form }) => {
        const currentFieldValue = defaultProps.value;
        const selectedOption = getSelectedOption(
          currentFieldValue,
          asHiddenSelector,
        );

        return {
          ...defaultProps,
          onSelectedValuesChange: (ids) => {
            const nextSelectedOption = ids[0];
            const nextIsVisible = nextSelectedOption === optionVisible.id;
            const nextValue = asHiddenSelector ? !nextIsVisible : nextIsVisible;

            form.setValue(fieldName, nextValue as TFormValues[TFieldName], {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
          selectedValues: [selectedOption],
        };
      }}
    >
      <DropdownMenu>
        <DropdownMenu.Trigger>
          {({ setIsOpen }) => (
            <button
              role="button"
              type="button"
              onClick={() => setIsOpen(true)}
              className={cx(
                anchorClassName,
                "transition ease-out duration-default",
                "cursor-pointer",
                // Flex config
                "flex flex-row items-center justify-between",
                "whitespace-nowrap",
                // Background
                "bg-surface-action-default-elevated-rest",
                "active:bg-surface-action-default-elevated-pressed",
                "hover:bg-surface-action-default-elevated-hovered",
                // Shadow
                "shadow-action-default-rest",
                "active:shadow-action-default-pressed",
                "hover:shadow-action-default-hovered",
                // Text
                "text-onsurface-action-main-rest",
                "fill-onsurface-action-main-rest",
                // Container
                "rounded-md p-xs gap-xs",
              )}
              aria-label={activeOption.label}
            >
              <Icon
                icon={activeOption.indicator.icon}
                size="xs"
                className={activeOption.indicator.className}
              />
              <Body htmlVariant="span" size="md" className="w-full text-left">
                {activeOption.label}
              </Body>
              <Icon icon="chevron-down" size="sm" />
            </button>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          placement={popoverPlacement}
          popoverContentClassName={popoverClassName}
        >
          {[optionVisible, optionHidden].map((option) => (
            <DropdownMenu.Item
              key={`visibility-selector-option-${option.id}`}
              id={option.id}
              leftSlot={
                <Icon
                  icon={option.indicator.icon}
                  size="xs"
                  className={option.indicator.className}
                />
              }
              description={option.description}
            >
              {option.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </FormField>
  );
};

VisibilitySelectorInner.displayName = "KaizenVisibilitySelector";

export const VisibilitySelector = withKaizenBusinessI18n(
  VisibilitySelectorInner,
) as typeof VisibilitySelectorInner;
