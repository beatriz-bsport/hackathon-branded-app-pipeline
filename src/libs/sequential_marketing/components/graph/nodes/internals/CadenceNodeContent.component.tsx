import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CadenceChip from '../../chips/CadenceChip.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import type { GlobalCadenceChip } from '#libs/sequential_marketing/types';

export type CadenceNodeContentProps = {
  marketingActionChipList?: GlobalCadenceChip[];
  addMarketingAction?: () => void;
  disableAddMarketingAction?: boolean;
};

const CadenceNodeContent: React.FC<CadenceNodeContentProps> = ({
  marketingActionChipList,
  addMarketingAction,
  disableAddMarketingAction,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

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
      {!!marketingActionChipList && marketingActionChipList.length > 0 && (
        <div className={classes.chipSection}>
          {marketingActionChipList.map(
            (chip) =>
              !!chip && (
                <CadenceChip
                  key={chip.name}
                  name={chip.name}
                  icon={chip.icon}
                  color={SequentialMarketingColors.MARKETING_ACTION_COLOR}
                  withBackground={false}
                  blackText
                />
              ),
          )}
        </div>
      )}
      {!!addMarketingAction && (
        <Button
          onClick={handleAddMarketingAction}
          className={classes.button}
          variant="text"
          color="inherit"
          disabled={disableAddMarketingAction}
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
