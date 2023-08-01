import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import MarketingActionChip from '#libs/sequential_marketing/components/graph/chips/MarketingActionChip.component';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';

export type CadenceNodeContentProps = {
  marketingActionList?: StepMarketingActions[];
  disableAddMarketingAction?: boolean;
  addMarketingAction?: () => void;
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
      )?.length >= 5,
    [],
  );

  const handleAddMarketingAction = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      addMarketingAction?.();
    },
    [addMarketingAction],
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
        <Button
          className={classes.button}
          color="inherit"
          disabled={
            disableAddMarketingAction ||
            isFullOfMarketingActions(marketingActionList)
          }
          onClick={handleAddMarketingAction}
          variant="text"
        >
          + {t('cadence.marketingAction.addAction')}
        </Button>
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
  button: {
    elevation: 5,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    color: SequentialMarketingColors.MARKETING_ACTION_COLOR,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export default React.memo(CadenceNodeContent);
