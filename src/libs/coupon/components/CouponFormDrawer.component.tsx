// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';

import { useTranslation } from 'react-i18next';
import { OptionCallback } from '../../../state/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CouponForm from './CouponForm.component';
import type { Coupon } from '../types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { ShopItem } from '#libs/shop/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Tag, TagGroupAPI } from '../../tag/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  initial?: Coupon | null;
  onSubmit: (data: Coupon) => void;
  processing?: boolean;
  onCancel: () => void;
  paymentPacks: Array<PaymentPack>;
  allPaymentPacksById: { [key: number]: PaymentPack };
  shopItems: Array<ShopItem>;
  allShopItemsById: { [key: number]: ShopItem };
  privatePasses: Array<PrivatePass>;
  allPrivatePassesById: { [key: number]: PrivatePass };
  paymentCombos: Array<PaymentCombo>;
  allPaymentCombosById: { [key: number]: PaymentCombo };
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
  fetchSelectedPaymentPacks: (ids: Number[]) => void;
  fetchSelectedShopItems: (
    companyId: Number | undefined,
    ids: Number[],
  ) => void;
  fetchSelectedPrivatePasses: (ids: Number[]) => void;
  fetchSelectedPaymentCombos: (
    params: { company: Number; id__in?: Number[] },
    options?: OptionCallback<PaymentCombo[]>,
  ) => void;
};
type Props = OwnProps;

export const CouponFormDrawer = (props: Props) => {
  const { open, onClose, initial } = props;
  const { t } = useTranslation('coupon');
  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={onClose}
      title={t('form.title')}
      subtitle={props.initial?.name}
      trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.Coupon}
      trackingObjectId={initial?.id}
    >
      <CouponForm {...props} />
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>()(CouponFormDrawer);
