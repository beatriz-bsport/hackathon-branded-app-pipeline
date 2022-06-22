import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[700],
  },
  greyText: {
    color: theme.palette.grey[700],
  },
}));

type OwnProps = {
  onClose: () => void;
  onSubmit: () => void;
};

type Props = OwnProps;

export const CouponTemplateUpdateWarningDialog = (props: Props) => {
  const classes = useStyles();

  const { t } = useTranslation('coupon');

  return (
    <Dialog open>
      <DialogTitle>{t('couponTemplate.warningDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography className={classes.content}>
          {t('couponTemplate.warningDialog.content1')}
        </Typography>
        <Typography className={classes.content}>
          {t('couponTemplate.warningDialog.content2')}
        </Typography>
        <Typography className={classes.greyText}>
          {t('couponTemplate.warningDialog.content3')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('common:cancel')}</Button>
        <RedButton onClick={props.onSubmit} delayBeforeActivation={5}>
          {t('common:confirm')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default CouponTemplateUpdateWarningDialog;
