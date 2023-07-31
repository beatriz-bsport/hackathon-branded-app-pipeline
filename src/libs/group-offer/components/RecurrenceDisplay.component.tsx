import React from 'react';
import { useTranslation } from 'react-i18next';

import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import { RecurrenceRuleGroupOffer } from '#libs/group-offer/types';
import { getRecurrenceTrad } from '#libs/group-offer/utils';

type Props = {
  recurrenceRule: RecurrenceRuleGroupOffer;
  withoutUntil?: boolean;
};

export const ReccurenceDisplay: React.FC<Props> = ({
  recurrenceRule,
  withoutUntil = false,
}) => {
  const { t } = useTranslation(['metaActivity']);
  const classes = useStyles();

  if (!recurrenceRule || Object.keys(recurrenceRule).length === 0) return null;

  return (
    <div className={classes.row}>
      <RefreshIcon color="disabled" className={classes.icon} />
      <Typography color="textSecondary">
        {getRecurrenceTrad(
          {
            ...recurrenceRule,
            until: !withoutUntil ? recurrenceRule.until : undefined,
          },
          t,
        )}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  icon: {
    height: theme.spacing(2),
  },
}));

export default React.memo(ReccurenceDisplay);
