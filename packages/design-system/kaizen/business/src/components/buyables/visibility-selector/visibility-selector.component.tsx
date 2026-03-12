import type { ReactElement } from "react";

import { type FieldValues, FormField, useFormContext } from "@bsport/form";
import {
  Body,
  DropdownMenu,
  type DropdownMenuProps,
  Icon,
  type Placement,
  cva,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
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

const button = cva(
  [
    "transition ease-out duration-default",
    // Flex config
    "flex flex-row items-center justify-between",
    "whitespace-nowrap",
    // Background
    "cursor-pointer",
    "bg-surface-action-default-elevated-rest",
    "shadow-action-default-rest",
    // Text
    "text-onsurface-action-main-rest",
    "fill-onsurface-action-main-rest",
    // Container
    "rounded-md p-xs gap-xs",
  ],
  {
    variants: {
      disabled: {
        true: [
          "disabled:shadow-action-default-rest",
          "disabled:opacity-md",
          "disabled:cursor-not-allowed",
        ],
        false: [],
      },
      readonly: {
        // And not disabled
        true: [
          "enabled:aria-readonly:shadow-action-default-rest",
          "enabled:aria-readonly:cursor-default",
        ],
        false: [],
      },
    },
    compoundVariants: [
      {
        disabled: false,
        readonly: false,
        className: [
          // Hover and neither readonly or disabled
          "hover:shadow-action-default-hovered",
          "hover:bg-surface-action-default-elevated-hovered",
          // Active and neither readonly or disabled
          "active:shadow-action-default-pressed",
          "active:bg-surface-action-default-elevated-pressed",
        ],
      },
    ],
  },
);

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
  /** Whether to disable interaction */
  disabled?: boolean;
  /** Whether to enable read only */
  readonly?: boolean;
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

export const VisibilitySelector = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  fieldName,
  buyableName,
  disabled,
  readonly,
  asHiddenSelector = false,
  anchorClassName = "min-w-component-popover-min max-w-full",
  popoverClassName = "w-component-popover-min",
  popoverPlacement = "bottom-right",
}: VisibilitySelectorProps<TFormValues, TFieldName>): ReactElement => {
  const formContext = useFormContext<TFormValues>();

  const { t } = useTranslation("buyables", { i18n: i18nInstance });

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
              onClick={disabled || readonly ? undefined : () => setIsOpen(true)}
              disabled={!!disabled}
              aria-disabled={disabled ? "true" : "false"}
              aria-readonly={readonly ? "true" : "false"}
              className={button({
                className: anchorClassName,
                disabled: !!disabled,
                readonly: !!readonly,
              })}
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

VisibilitySelector.displayName = "KaizenVisibilitySelector";
