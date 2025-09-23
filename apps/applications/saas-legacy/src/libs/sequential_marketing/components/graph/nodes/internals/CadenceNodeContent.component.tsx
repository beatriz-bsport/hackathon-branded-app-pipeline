import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import {
  CADENCE_MARKETING_ACTION_MAX_NUMBER,
  MarketingActions,
  SequentialMarketingColors,
} from '#src/libs/sequential_marketing/constants';
import { getMarketingActionType } from '#src/libs/sequential_marketing/components/form/marketing_actions/utils';

import MarketingActionChip from '#src/libs/sequential_marketing/components/graph/chips/MarketingActionChip.component';
import MenuSelectorTextButton from '#src/components/menu/text';
import useMarketingActionOptions from '#src/libs/sequential_marketing/components/form/marketing_actions/hooks/useMarketingActionOptions.hook';

import type { StepMarketingActions } from '#src/libs/sequential_marketing/types';
import type { Tag } from '#src/libs/tag/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';

export type CadenceNodeContentProps = {
  marketingActionList?: StepMarketingActions[];
  disableAddMarketingAction?: boolean;
  addMarketingAction?: (type: MarketingActions) => void;
  editMarketingAction?: (action: StepMarketingActions) => void;
  getEmailTemplate?: (id: string) => EmailTemplateSummary;
  getTag?: (id: string) => Tag;
};

const CadenceNodeContent: React.FC<CadenceNodeContentProps> = ({
  marketingActionList,
  disableAddMarketingAction,
  addMarketingAction,
  editMarketingAction,
  getEmailTemplate,
  getTag,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const handleEditMarketingAction = React.useCallback(
    (marketingActions: StepMarketingActions) => () =>
      editMarketingAction(marketingActions),
    [editMarketingAction],
  );

  const areMarketingActionsFull = React.useMemo(
    () =>
      !!marketingActionList &&
      marketingActionList?.reduce<StepMarketingActions[]>(
        (acc, currentMarketinAction) => {
          if (!currentMarketinAction?.disabled) {
            acc.push(currentMarketinAction);
          }
          return acc;
        },
        [],
      )?.length >= CADENCE_MARKETING_ACTION_MAX_NUMBER,
    [marketingActionList],
  );

  const marketingActionOptions = useMarketingActionOptions({
    addMarketingAction,
    marketingActionToExclude: (marketingActionList ?? [])?.map(
      (marketingAction) => getMarketingActionType(marketingAction),
    ),
  });

  return (
    <div className={classes.container}>
      {marketingActionList?.length > 0 && (
        <div className={classes.chipSection}>
          {marketingActionList.map(
            (marketingAction) =>
              !!marketingAction && (
                <MarketingActionChip
                  key={marketingAction.id}
                  getEmailTemplate={getEmailTemplate}
                  getTag={getTag}
                  marketingAction={marketingAction}
                  onClick={handleEditMarketingAction(marketingAction)}
                />
              ),
          )}
        </div>
      )}
      {!!addMarketingAction && (
        <MenuSelectorTextButton
          actionList={marketingActionOptions}
          customColor={SequentialMarketingColors.INNER_STEP_COLOR}
          isDisabled={disableAddMarketingAction || areMarketingActionsFull}
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
