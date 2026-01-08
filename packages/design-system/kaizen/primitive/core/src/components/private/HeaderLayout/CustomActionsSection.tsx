import React, { ReactNode } from "react";

import Divider from "#src/components/Divider";

export type CustomActionsSectionProps = {
  callToActionButton?: ReactNode;
  endGroupActions?: Array<ReactNode>;
  startGroupActions?: Array<ReactNode>;
};

const CustomActionsSection: React.FC<CustomActionsSectionProps> = ({
  callToActionButton,
  endGroupActions,
  startGroupActions,
}) => {
  if (!callToActionButton && !endGroupActions && !startGroupActions)
    return null;

  return (
    <div
      data-component="Kaizen-HeaderLayout-CustomActionsSection"
      className="flex flex-row gap-sm items-stretch"
    >
      {startGroupActions && (
        <>
          <div className="flex flex-row gap-2xs items-center">
            {startGroupActions}
          </div>
          <Divider orientation="vertical" weight="thin" />
        </>
      )}
      {(endGroupActions || callToActionButton) && (
        <div className="flex flex-row gap-2xs items-center">
          {endGroupActions}
          {callToActionButton}
        </div>
      )}
    </div>
  );
};

export default CustomActionsSection;
