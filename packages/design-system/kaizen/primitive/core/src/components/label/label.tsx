import { cva } from "class-variance-authority";
import type { FC, LabelHTMLAttributes } from "react";

import Body from "#src/components/Body";

const variants = {
  required: {
    true: [
      "after:text-onsurface-status-critical-weak",
      "after:ml-2xs",
      "after:text-body-sm",
      "after:leading-sm",
      "after:content-['*']",
    ],
    false: [],
  },
} as const;

const labelClassName = cva([], { variants });

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  label?: string;
  required?: boolean;
};

/**
 * React component to display an Indicator for numeric notifications or status updates, appearing beside the content it accompanies.
 * @param props.label Text to display
 * @param props.htmlFor Id of a form element
 * @param props.required Whether to indicate the required red star indicator
 * @link https://docs.infra.bsport.io/storybook/kaizen/dev/index.html?path=/docs/primitive-components-label--docs
 */
export const Label: FC<LabelProps> = ({
  className,
  htmlFor,
  required = false,
  label,
  ...otherProps
}) => {
  if (!label) {
    return null;
  }

  return (
    <label
      data-component="Kaizen-Label"
      htmlFor={htmlFor}
      className={labelClassName({ className, required })}
      {...otherProps}
    >
      <Body size="md" htmlVariant="span" color="default">
        {label}
      </Body>
    </label>
  );
};

Label.displayName = "KaizenLabel";
