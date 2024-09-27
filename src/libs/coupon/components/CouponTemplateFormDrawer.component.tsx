import React from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import CouponTemplateForm from './CouponTemplateForm.component';
import type { CouponTemplate, CouponTemplateAPI } from '#src/libs/coupon/types';
import type { OptionCallback } from '#src/state/types';
type OwnProps = {
  open: boolean;
  onClose: () => void;
  initial?: CouponTemplate | null;
  onSubmit: (
    data: CouponTemplate,
    options?: OptionCallback<CouponTemplateAPI>,
  ) => void;
  processing?: boolean;
  privatePassTemplateList: Array<PrivatePassTemplate>;
  paymentPackTemplateList: Array<PaymentPackTemplate>;
};
type Props = OwnProps;

export const CouponFormDrawer = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      onClose={onClose}
      open={open}
      subtitle={props.initial?.name}
      title={t('form.title')}
      withoutPadding={false}
    >
      <div className={classes.content}>
        <CouponTemplateForm {...props} />
      </div>
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>()(CouponFormDrawer);

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: '30vh',
  },
}));
