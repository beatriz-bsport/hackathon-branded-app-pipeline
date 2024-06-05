import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import { Form } from 'formik';
import type { PaymentPackTemplate } from '#libs/payment-packs/types';
import type { PrivatePassTemplate } from '#libs/private-service/types';
import type { CouponTemplate } from '#libs/coupon/types';
import CouponTemplateInstanceForm, {
  CouponTemplateInstanceFormikHOC,
} from './CouponTemplateInstanceForm.component';

// @ts-expect-error
import { Submit } from '../../../components/forms';
import type { FranchiseCompany } from '../../franchise/types';

type Props = {
  onClose: () => void;
  open?: boolean;
  isSubmitting?: boolean;
  companies: Array<FranchiseCompany>;
  couponTemplate: CouponTemplate;
  paymentPackTemplateList: Array<PaymentPackTemplate>;
  privatePassTemplateList: Array<PrivatePassTemplate>;
};

const CouponTemplateInstanceFormDialog = (props: Props) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  const { isSubmitting } = props;
  return (
    <Dialog open>
      <Form>
        <DialogTitle>{t('couponTemplateInstance.create.title')}</DialogTitle>
        <DialogContent>
          {/* @ts-expect-error */}
          <CouponTemplateInstanceForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} onClick={props.onClose}>
            {t('paymentPack:paymentPackTemplateInstance.form.actions.close')}
          </Button>
          <Submit disabled={isSubmitting}>
            {isSubmitting && (
              <CircularProgress
                className={classes.progress}
                color="inherit"
                size={12}
              />
            )}
            {t('paymentPack:paymentPackTemplateInstance.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  progress: { marginRight: theme.spacing(1) },
}));

export default CouponTemplateInstanceFormikHOC(
  // @ts-expect-error
  CouponTemplateInstanceFormDialog,
);
