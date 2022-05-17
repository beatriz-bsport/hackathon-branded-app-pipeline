import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import { OffersGroup } from '#libs/meta-activity/types';

type Props = {
  open: boolean;
  group: OffersGroup;
  onClose: () => void;
  onSubmit: () => void;
};

export const GroupRulePopup: React.FC<Props> = ({
  open,
  group,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation(['marketplace']);
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={classes.dialog}>
        <DialogContent>
          <Typography>
            {t(
              group.full_booking_only
                ? 'workshop.warningFullBooking'
                : 'workshop.warningPartialBooking',
              { count: group.offers?.length ?? 0 },
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            {t('workshop.cancel')}
          </Button>
          <Button className={classes.button} onClick={onSubmit}>
            {t('workshop.confirm')}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    minWidth: 600,
  },
  button: {
    color: theme.palette.primary.main,
  },
}));

export default GroupRulePopup;
