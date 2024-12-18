import React from 'react';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import type { InfoButtonSeverityType } from '#src/components/css-only/InfoButton/types';
import type { Props as ButtonProps } from '#Fabrique/ButtonV2';
import type { Props as BottomDrawerProps } from '#Fabrique/BottomDrawer';
import type { TooltipProps } from '#Fabrique/Tooltipv2';
import {
  InfoBottomDrawer,
  InfoTooltip,
  InfoButtonSeverityEnum,
  useInfoButtonIcon,
} from '.';

import '#src/components/css-only/InfoButton/styles.css';

export type Props = {
  isMobile: boolean;
  text: string;
  title: string;
  severity: InfoButtonSeverityType;
  buttonProps?: ButtonProps;
  bottomDrawerProps?: BottomDrawerProps;
  toolTipProps?: Partial<TooltipProps>;
};

const InfoButton: React.FC<Props> = ({
  bottomDrawerProps,
  buttonProps,
  toolTipProps,
  isMobile,
  severity = InfoButtonSeverityEnum.INFO,
  text,
  title,
}) => {
  const infoButtonIcon = useInfoButtonIcon(severity);
  if (isMobile) {
    return (
      <InfoBottomDrawer
        bottomDrawerProps={bottomDrawerProps}
        buttonProps={buttonProps}
        icon={infoButtonIcon}
        severity={severity}
        text={text}
        title={title}
      />
    );
  }
  return (
    <InfoTooltip
      icon={infoButtonIcon}
      severity={severity}
      text={text}
      toolTipProps={toolTipProps}
    />
  );
};

export const InfoButtonStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof InfoButton>>()(InfoButton);

export default React.memo(InfoButton);
