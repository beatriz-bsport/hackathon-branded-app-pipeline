import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImmutableArray } from 'seamless-immutable';
import { OptionCallBackWithKeyedCallbacks } from '../../../../state/types';
import { PaymentPack } from '#libs/payment-packs/types';
import { ShopItem } from '#libs/shop/types';
import { PrivatePass } from '#libs/private-service/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import UniqueCodeCouponForm from './UniqueCodeCouponForm.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { Coupon, UniqueCodeCouponCreationPayload } from '#libs/coupon/types';
import { CouponErrorCodes } from '#libs/coupon/constants';

type Props = {
  uniqueCodeCoupon?: Coupon;
  open: boolean;
  onCancel: () => void;
  onSubmit: (
    data: UniqueCodeCouponCreationPayload,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
  isLoading: boolean;
  isProcessing: boolean;
  paymentPacks: PaymentPack[];
  paymentPacksById: { [key: number]: PaymentPack };
  shopItems: ImmutableArray<ShopItem>;
  shopItemsById: { [key: number]: ShopItem };
  privatePasses: PrivatePass[];
  privatePassesById: { [key: number]: PrivatePass };
  paymentCombos: PaymentCombo[];
  paymentCombosById: { [key: number]: PaymentCombo };
};

const UniqueCodeCouponFormDrawer: React.FC<Props> = ({
  uniqueCodeCoupon,
  open,
  onCancel,
  onSubmit,
  isLoading,
  isProcessing,
  paymentPacks,
  paymentPacksById,
  shopItems,
  shopItemsById,
  privatePasses,
  privatePassesById,
  paymentCombos,
  paymentCombosById,
}) => {
  const { t } = useTranslation('coupon');

  const [withExpirationDate, setWithExpirationDate] = useState<boolean>(false);

  const [isUsagePerMemberLimited, setIsUsagePerMemberLimited] =
    useState<boolean>(false);

  const errorMessages = {
    [CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]: t(
      `form.actions.errors.${CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS}`,
    ),
    [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]: t(
      `form.actions.errors.${CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT}`,
    ),
    [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]: t(
      `form.actions.errors.${CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS}`,
    ),
  };

  useEffect(() => {
    if (open && !!uniqueCodeCoupon) {
      setWithExpirationDate(!!uniqueCodeCoupon.expiration_date);
      setIsUsagePerMemberLimited(!!uniqueCodeCoupon.usage_per_member);
    }
  }, [open, uniqueCodeCoupon]);

  return (
    <GenericResponsiveDrawer
      onClose={onCancel}
      open={open}
      title={t('fabLabels.voucherCodes')}
    >
      <UniqueCodeCouponForm
        errorMessages={errorMessages}
        isLoading={isLoading}
        isProcessing={isProcessing}
        isUsagePerMemberLimited={isUsagePerMemberLimited}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paymentCombos={paymentCombos}
        paymentCombosById={paymentCombosById}
        paymentPacks={paymentPacks}
        paymentPacksById={paymentPacksById}
        privatePasses={privatePasses}
        privatePassesById={privatePassesById}
        setIsUsagePerMemberLimited={setIsUsagePerMemberLimited}
        setWithExpirationDate={setWithExpirationDate}
        shopItems={shopItems}
        shopItemsById={shopItemsById}
        uniqueCodeCoupon={uniqueCodeCoupon}
        withExpirationDate={withExpirationDate}
      />
    </GenericResponsiveDrawer>
  );
};

export default React.memo(UniqueCodeCouponFormDrawer);
