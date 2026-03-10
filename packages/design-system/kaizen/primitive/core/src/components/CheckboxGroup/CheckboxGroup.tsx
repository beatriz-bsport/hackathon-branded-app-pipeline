import { cx } from "class-variance-authority";
import React from "react";

import Body, { type BodyColor } from "#src/components/Body";
import {
  CheckboxProvider,
  type CheckboxProviderProps,
} from "#src/contexts/CheckboxContext";

import {
  CheckboxGroupItems,
  type CheckboxGroupItemsProps,
} from "./CheckboxGroupItems";

export type CheckboxGroupProps = React.HTMLAttributes<HTMLDivElement> &
  CheckboxProviderProps &
  Partial<CheckboxGroupItemsProps> & {
    label: string;
    required?: boolean;
    helperText?: string;
    statusText?: string;
    status?: BodyColor;
    Checkboxes?: React.ReactNode[];
    disabled?: boolean;
  };

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  className,
  options = [],
  initialCheckedIds,
  checkedIds,
  setCheckedIds,
  direction = "start",
  helperText,
  label,
  status,
  statusText,
  required,
  Checkboxes = [],
  disabled,
  ...props
}) => {
  const optionIds = options.map((option) => option.id).filter(Boolean);

  return (
    <CheckboxProvider
      valueIds={optionIds}
      initialCheckedIds={initialCheckedIds}
      checkedIds={checkedIds}
      setCheckedIds={setCheckedIds}
    >
      <div className={className} {...props}>
        <div
          className={cx("flex flex-col gap-2xs mb-xs", {
            "items-end": direction === "end",
            "items-start": direction === "start",
          })}
        >
          <Body size="md" htmlVariant="p">
            {label}
            {required && (
              <Body
                htmlVariant="span"
                size="sm"
                color="critical"
                weight="weak"
                className="ml-2xs"
              >
                *
              </Body>
            )}
          </Body>
          {helperText && (
            <Body size="sm" weight="weak" color="weak">
              {helperText}
            </Body>
          )}
          {statusText && (
            <Body size="sm" weight="weak" color={status ?? "default"}>
              {statusText}
            </Body>
          )}
        </div>
        <div
          className={cx("flex flex-col gap-xs", {
            "items-end": direction === "end",
            "items-start": direction === "start",
          })}
        >
          {options?.length > 0 ? (
            <CheckboxGroupItems
              direction={direction}
              options={options}
              disabled={disabled}
            />
          ) : (
            <>{Checkboxes}</>
          )}
        </div>
      </div>
    </CheckboxProvider>
  );
};

CheckboxGroup.displayName = "KaizenCheckboxGroup";

export default CheckboxGroup;
