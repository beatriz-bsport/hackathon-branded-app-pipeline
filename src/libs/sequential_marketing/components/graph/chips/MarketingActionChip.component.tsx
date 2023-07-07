import React from 'react';

import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import { CadenceChip } from './CadenceChip.component';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';
import {
  getMarketingActionChipIcon,
  getMarketingActionChipName,
} from '../../icons/utils';

export type MarketingActionChipProps = {
  marketingAction: StepMarketingActions;
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
};

const MarketingActionChip: React.FC<MarketingActionChipProps> = ({
  marketingAction,
  getTag,
  getEmailTemplate,
}) => {
  return (
    <CadenceChip
      name={getMarketingActionChipName({
        marketingAction,
        getTag,
        getEmailTemplate,
      })}
      icon={getMarketingActionChipIcon(marketingAction)}
      color={SequentialMarketingColors.MARKETING_ACTION_COLOR}
    />
  );
};

export default React.memo(MarketingActionChip);
