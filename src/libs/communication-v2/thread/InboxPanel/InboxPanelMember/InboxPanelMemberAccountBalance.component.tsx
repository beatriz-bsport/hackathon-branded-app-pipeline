import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { CustomChip } from '#components/chip/CustomChip.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type Props = { accountBalance: number };

const InboxMemberTags: React.FC<Props> = ({ accountBalance }) => {
  const classes = useStyles();

  const { t } = useTranslation('member');
  const theme = useTheme();

  const mainColor =
    accountBalance >= 0 ? theme.palette.success.dark : theme.palette.error.dark;

  return (
    <div className={classes.container}>
      <Typography variant="body1" className={classes.title}>
        {t('creditAccountBalance')}
      </Typography>
      <CustomChip
        displayedValue={getCurrencyDisplayWithPrice(accountBalance)}
        mainColor={mainColor}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[300],
    alignItems: 'flex-start',
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

export default memo(InboxMemberTags);
