import React from 'react';
import { compose } from 'recompose';

import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import type { Tag, TagGroupAPI } from '../../tag/types';
import type { Coupon } from '../types';
import CouponForm from './CouponForm.component';
import { OptionCallback } from '../../../state/types';

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
      onClose={onClose}
      open={open}
      subtitle={props.initial?.name}
      title={t('form.title')}
      trackingObjectId={initial?.id}
      trackingObjectIdentifier={SegmentAnalyticsFormObjectIdentifier.Coupon}
    >
      <CouponForm {...props} />
    </GenericResponsiveDrawer>
  );
};
export default compose<any, OwnProps>()(CouponFormDrawer);
