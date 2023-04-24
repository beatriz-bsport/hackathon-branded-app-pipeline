// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { OptionCallback } from '../../../state/types';
import RedButton from '../../../components/button/RedButton.component';
import { CouponTemplate } from '../types';

type Props = {
  onClose: () => void;
  onSubmit: (id: number, options: OptionCallback) => void;
  couponTemplate: CouponTemplate;
  companyId: number;
};

const CouponTemplateInstanceDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['coupon']);
  const classes = useStyles();

  const [processing, setProcessing] = React.useState(false);

  return (
    <Dialog open>
      <DialogTitle>{t('couponTemplateInstance.delete.title')}</DialogTitle>
      <DialogContent>
        <Typography className={classes.greyText}>
          {t('couponTemplateInstance.delete.explain1', {
            name: props.couponTemplate.companies.find(
              (c) => c.id === props.companyId,
            ).name,
          })}
        </Typography>
        <Typography className={classes.greyText}>
          {t('couponTemplateInstance.delete.explain2')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={processing}>
          {t(
            'paymentPack:paymentPackTemplateInstance.deleteForm.actions.close',
          )}
        </Button>
        <RedButton
          disabled={processing}
          delayBeforeActivation={5}
          onClick={() =>
            props.onSubmit(
              props.couponTemplate.coupon_template_instances.find(
                (cti) => cti.company === props.companyId,
              ).id,
              {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              },
            )
          }
        >
          {processing && (
            <CircularProgress
              className={classes.circularProgress}
              color="inherit"
              size={12}
            />
          )}
          {t(
            'paymentPack:paymentPackTemplateInstance.deleteForm.actions.submit',
          )}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  greyText: {
    color: theme.palette.grey[700],
  },
  circularProgress: {
    marginRight: theme.spacing(2),
  },
}));

export default CouponTemplateInstanceDeleteDialog;
