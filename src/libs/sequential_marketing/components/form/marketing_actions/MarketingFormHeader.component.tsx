import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { marketingActionIconDict } from '#libs/sequential_marketing/components/helpers/utils';

import {
  MarketingActions,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';

type Props = {
  marketingActionType: MarketingActions;
  deleteAction: () => void;
};

const MarketingActionHeader: React.FC<Props> = ({
  marketingActionType,
  deleteAction,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const handleDeleteAction = React.useCallback(
    () => deleteAction?.(),
    [deleteAction],
  );

  return (
    <div className={classes.header}>
      <CustomMuiIcon
        defaultBackGround
        customColor={SequentialMarketingColors.INNER_STEP_COLOR}
        icon={marketingActionIconDict[marketingActionType]}
        withBackground={false}
      />
      <Typography variant="body1">
        {t(`cadence.form.marketing_action.${marketingActionType}`)}
      </Typography>
      <IconButton
        className={classes.deleteButton}
        onClick={handleDeleteAction}
        size="small"
      >
        <CustomMuiIcon defaultBackGround icon="Cancel" withBackground={false} />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
}));

export default React.memo(MarketingActionHeader);
