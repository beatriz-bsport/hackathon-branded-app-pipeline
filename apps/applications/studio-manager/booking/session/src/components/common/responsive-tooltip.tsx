import { FC, cloneElement, isValidElement } from "react";

import {
  Tooltip,
  TooltipProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

export const ResponsiveTooltip: FC<TooltipProps> = ({ children, ...props }) => {
  const isMobile = !useMatchMedia("lg");

  if (isMobile) {
    // For accesibility reasons, we want to use the label as aria-label on mobile, and not render a tooltip, since tooltips are not accessible on mobile.
    return (
      <>
        {props.label && isValidElement(children)
          ? cloneElement(children as React.ReactElement<React.AriaAttributes>, {
              "aria-label": props.label,
            })
          : children}
      </>
    );
  }

  return <Tooltip {...props}>{children}</Tooltip>;
};
