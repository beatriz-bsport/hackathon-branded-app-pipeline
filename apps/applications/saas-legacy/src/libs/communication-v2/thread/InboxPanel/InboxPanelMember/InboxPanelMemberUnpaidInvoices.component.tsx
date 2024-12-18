import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { CustomChip } from '#src/components/chip/CustomChip.component';

type Props = { unpaidInvoicesCount: number };

const InboxPanelMemberUnpaidInvoices: React.FC<Props> = ({
  unpaidInvoicesCount,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'communication']);

  const theme = useTheme();

  const mainColor =
    unpaidInvoicesCount > 0
      ? theme.palette.error.dark
      : theme.palette.success.dark;

  const displayedValue =
    unpaidInvoicesCount > 0
      ? `${unpaidInvoicesCount} ${t('unpaidInvoiceTitle', {
          count: unpaidInvoicesCount,
        }).toLowerCase()}`
      : `${t('communication:thread.panel.member.invoices.noUnpaidInvoices')}`;

  const icon = unpaidInvoicesCount > 0 ? 'Cancel' : 'CheckCircle';
  const iconColor =
    unpaidInvoicesCount > 0
      ? theme.palette.error.main
      : theme.palette.success.main;

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="body1">
        {t('communication:thread.panel.member.invoices.title')}
      </Typography>
      <CustomChip
        displayedValue={displayedValue}
        icon={icon}
        iconColor={iconColor}
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
  checkIcon: {
    color: theme.palette.success.main,
  },
}));

export default memo(InboxPanelMemberUnpaidInvoices);
