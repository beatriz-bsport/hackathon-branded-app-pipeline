import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import type {
  Coupon,
  UniqueCodeCouponCreationPayload,
} from '#src/libs/coupon/types';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import UniqueCodeCouponForm from './UniqueCodeCouponForm.component';
import { OptionCallBackWithKeyedCallbacks } from '../../../../state/types';

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
};

const UniqueCodeCouponFormDrawer: React.FC<Props> = ({
  uniqueCodeCoupon,
  open,
  onCancel,
  onSubmit,
  isLoading,
  isProcessing,
}) => {
  const { t } = useTranslation('coupon');

  const [withExpirationDate, setWithExpirationDate] = useState<boolean>(false);

  const [isUsagePerMemberLimited, setIsUsagePerMemberLimited] =
    useState<boolean>(false);

  const errorMessages = {
    [CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]: t(
      `uniqueCodeCoupon.form.errors.${CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS}`,
    ),
    [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]: t(
      `uniqueCodeCoupon.form.errors.${CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT}`,
    ),
    [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]: t(
      `uniqueCodeCoupon.form.errors.${CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS}`,
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
        setIsUsagePerMemberLimited={setIsUsagePerMemberLimited}
        setWithExpirationDate={setWithExpirationDate}
        uniqueCodeCoupon={uniqueCodeCoupon}
        withExpirationDate={withExpirationDate}
      />
    </GenericResponsiveDrawer>
  );
};

export default React.memo(UniqueCodeCouponFormDrawer);
