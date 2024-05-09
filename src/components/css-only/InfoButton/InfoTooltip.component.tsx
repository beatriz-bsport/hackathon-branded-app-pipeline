import React from 'react';
import Tooltip, { TooltipProps } from '#Fabrique/Tooltipv2';
import type { InfoButtonSeverityType } from '#csscomponents/InfoButton/types';
import { TOOLTIP_ICON_CLASSNAME_MAP } from '.';
import '#csscomponents/InfoButton/styles.css';

type Props = {
  icon: React.ReactElement;
  severity: InfoButtonSeverityType;
  text: string;
  toolTipProps?: Partial<TooltipProps>;
};

const InfoTooltip: React.FC<Props> = ({
  icon,
  severity,
  toolTipProps,
  text,
}) => {
  const iconContainerClassName = TOOLTIP_ICON_CLASSNAME_MAP[severity];
  return (
    <Tooltip {...toolTipProps} text={text}>
      <div className={iconContainerClassName}>{icon}</div>
    </Tooltip>
  );
};

export default React.memo(InfoTooltip);
