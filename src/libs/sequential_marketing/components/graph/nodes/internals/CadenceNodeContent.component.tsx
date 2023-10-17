import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import {
  CADENCE_MARKETING_ACTION_MAX_NUMBER,
  MarketingActions,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { getMarketingActionOptions } from '#libs/sequential_marketing/components/form/marketing_actions/utils';
import MarketingActionChip from '#libs/sequential_marketing/components/graph/chips/MarketingActionChip.component';
import MenuSelectorTextButton from '#components/menu/text';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';

export type CadenceNodeContentProps = {
  marketingActionList?: StepMarketingActions[];
  disableAddMarketingAction?: boolean;
  addMarketingAction?: (type: MarketingActions) => void;
  getTag?: (id: string) => Tag;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
};

const CadenceNodeContent: React.FC<CadenceNodeContentProps> = ({
  marketingActionList,
  disableAddMarketingAction,
  addMarketingAction,
  getTag,
  getEmailTemplate,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const isFullOfMarketingActions = React.useCallback(
    (marketingActions: StepMarketingActions[]) =>
      !!marketingActions &&
      marketingActions?.reduce<StepMarketingActions[]>(
        (acc, currentMarketinAction) => {
          if (!currentMarketinAction?.disabled) {
            acc.push(currentMarketinAction);
          }
          return acc;
        },
        [],
      )?.length >= CADENCE_MARKETING_ACTION_MAX_NUMBER,
    [],
  );

  return (
    <div className={classes.container}>
      {!!marketingActionList && marketingActionList.length > 0 && (
        <div className={classes.chipSection}>
          {marketingActionList.map(
            (marketingAction) =>
              !!marketingAction && (
                <MarketingActionChip
                  key={marketingAction.id}
                  getEmailTemplate={getEmailTemplate}
                  getTag={getTag}
                  marketingAction={marketingAction}
                />
              ),
          )}
        </div>
      )}
      {!!addMarketingAction && (
        <MenuSelectorTextButton
          actionList={getMarketingActionOptions(t, addMarketingAction)}
          customColor={SequentialMarketingColors.INNER_STEP_COLOR}
          isDisabled={
            disableAddMarketingAction ||
            isFullOfMarketingActions(marketingActionList)
          }
          label={`+ ${t('cadence.marketingAction.addAction')}`}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  chipSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default React.memo(CadenceNodeContent);
