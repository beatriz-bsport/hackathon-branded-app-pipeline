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
  const hasStartGroupActions = !!startGroupActions?.length;
  const hasEndSection = !!callToActionButton || !!endGroupActions?.length;
  if (!hasStartGroupActions && !hasEndSection) return null;

  return (
    <div
      data-component="Kaizen-HeaderLayout-CustomActionsSection"
      className="flex flex-row gap-sm items-stretch"
    >
      {hasStartGroupActions && (
        <>
          <div className="flex flex-row gap-2xs items-center">
            {startGroupActions}
          </div>
          {hasEndSection && (
            <Divider orientation="vertical" weight="extra-thin" />
          )}
        </>
      )}
      {hasEndSection && (
        <div className="flex flex-row gap-2xs items-center">
          {endGroupActions}
          {callToActionButton}
        </div>
      )}
    </div>
  );
};

export default CustomActionsSection;
