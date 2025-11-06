import { clsx } from "clsx";
import React from "react";

import { FormField, useFormController } from "@bsport/form";
import {
  Body,
  Button,
  Icon,
  Popover,
  RadioGroup,
  type RadioGroupProps,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { DEFAULT_FORM_DATA, type PackFormSchema } from "../schema";

type PackFormVisibilitySelectorProps = {
  fieldIdPrefix: string;
  methods: ReturnType<typeof useFormController<PackFormSchema>>;
};

const OPTION_VISIBLE = "visible";
const OPTION_HIDDEN = "hidden";

export const PackFormVisibilitySelector: React.FC<
  PackFormVisibilitySelectorProps
> = ({ fieldIdPrefix, methods }) => {
  const { t } = useTranslation("details");

  const isHidden = methods.watch("manager_only");

  const visibleTranslations = {
    value: t(
      "formFields.visibilitySection.visibilitySelector.options.visible.fullTitle",
    ),
    buttonLabel: t(
      "formFields.visibilitySection.visibilitySelector.options.visible.shortTitle",
    ),
    helperText: t(
      "formFields.visibilitySection.visibilitySelector.options.visible.description",
    ),
  };

  const hiddenTranslations = {
    value: t(
      "formFields.visibilitySection.visibilitySelector.options.hidden.fullTitle",
    ),
    buttonLabel: t(
      "formFields.visibilitySection.visibilitySelector.options.hidden.shortTitle",
    ),
    helperText: t(
      "formFields.visibilitySection.visibilitySelector.options.hidden.description",
    ),
  };

  const radioOptions = [
    {
      value: OPTION_VISIBLE,
      label: visibleTranslations.value,
      helperText: visibleTranslations.helperText,
    },
    {
      value: OPTION_HIDDEN,
      label: hiddenTranslations.value,
      helperText: hiddenTranslations.helperText,
    },
  ];

  const dropdownButtonLabel = isHidden
    ? hiddenTranslations.buttonLabel
    : visibleTranslations.buttonLabel;

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <>
            <Body size="md" htmlVariant="p">
              {t("formFields.visibilitySection.visibilitySelector.label")}
            </Body>
            <div className="relative">
              <Icon
                className={clsx("absolute top-[12px] left-2xs", {
                  "text-onsurface-status-positive-weak": !isHidden,
                })}
                icon={isHidden ? "circle" : "circle-solid"}
                size="xs"
              />
              <Button
                id={`${fieldIdPrefix}-visibility-dropdown`}
                label={dropdownButtonLabel}
                intent="default"
                color="main"
                size="md"
                iconRight="chevron-down"
                onClick={() => setIsPopoverOpened(true)}
                className="min-w-[240px] justify-between"
              />
            </div>
          </>
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right" className="max-w-[320px]">
        {({ setIsPopoverOpened }) => {
          return (
            <FormField<PackFormData, "manager_only", RadioGroupProps>
              name="manager_only"
              mapProps={({ defaultProps, form }) => {
                const {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  statusText: _,
                  value: isHiddenSelected,
                  ...otherDefaultProps
                } = defaultProps;
                return {
                  ...otherDefaultProps,
                  onChange: (event) => {
                    const hidePack = event.target.value === OPTION_HIDDEN;
                    form.setValue("manager_only", hidePack);
                    if (hidePack) {
                      // Fallback payment methods to default value to avoid hidden errors
                      form.setValue(
                        "available_payment_method_identifiers",
                        DEFAULT_FORM_DATA.available_payment_method_identifiers,
                        { shouldValidate: true, shouldDirty: true },
                      );
                    }
                    setIsPopoverOpened(false);
                  },
                  value: isHiddenSelected ? OPTION_HIDDEN : OPTION_VISIBLE,
                  ref: undefined,
                };
              }}
            >
              <RadioGroup
                id={`${fieldIdPrefix}-visibility-radio-group`}
                options={radioOptions}
              />
            </FormField>
          );
        }}
      </Popover.Content>
    </Popover>
  );
};
