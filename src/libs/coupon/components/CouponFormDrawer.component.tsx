import React from 'react';
import { compose } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CouponForm from './CouponForm.component';
import type { Coupon } from '../types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { ShopItem } from '#libs/shop/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { Tag, TagGroupAPI } from '../../tag/types';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  initial?: Coupon | null;
  onSubmit: (data: Coupon) => void;
  processing?: boolean;
  onCancel: () => void;
  paymentPacks: Array<PaymentPack>;
  shopItems: Array<ShopItem>;
  privatePasses: Array<PrivatePass>;
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
};
type Props = OwnProps;

export const CouponFormDrawer = (props: Props) => {
  const { open, onClose } = props;
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={onClose}
      title={t('form.title')}
      subtitle={props.initial?.name}
    >
      <div className={classes.content}>
        <CouponForm {...props} />
      </div>
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>()(CouponFormDrawer);

const useStyles = makeStyles((theme) => ({
  content: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: '30vh',
  },
}));
