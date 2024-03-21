import React from 'react';

import DeleteIcon from '@material-ui/icons/Delete';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

import Button from '#components/css-only/Fabrique/Button';

import CouponCodeInput from '#libs/checkout/components/new-checkout-flow/CouponCodeInput.component';
import { CouponErrorCodes } from '#libs/coupon/constants';
import type { OptionCallBackWithKeyedCallbacks } from '../../../../../../state/types';
import type { Coupon } from '#libs/coupon/types';
import '../styles.css';

export type Props = {
  voucher: number | null;
  couponCode: string | null;
  isLoading?: boolean;
  isContractLegalTermsAccepted: boolean;
  onDeleteCoupon: () => void;
  onSubmitCouponForm: (
    formCouponCode: string,
    options: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => Promise<void>;
  contractId: number;
};

const MarketplaceContractPaymentCoupon: React.FC<Props> = React.memo(
  ({
    voucher,
    couponCode,
    isLoading,
    isContractLegalTermsAccepted,
    onDeleteCoupon,
    onSubmitCouponForm,
    contractId,
  }) => {
    // Whenever the paymentMethod changes, we change the state of the billing details
    React.useEffect(() => {
      if (contractId) {
        onSubmitCouponForm(couponCode, {});
      }
    }, [contractId, onSubmitCouponForm, couponCode]);

    return (
      <>
        {!voucher && (
          <CouponCodeInput
            isBasketModificationDisabled={
              isLoading || !isContractLegalTermsAccepted
            }
            onSubmit={onSubmitCouponForm}
          />
        )}

        {!!voucher && (
          <div className="bs-contract-payment__coupon__container">
            <span className="bs-contract-payment__coupon__info">
              {`${couponCode}   -${getCurrencyDisplayWithPrice(
                (voucher || 0).toFixed(2),
              )}`}
            </span>
            <Button
              classes={{ root: 'bs-contract-payment__coupon__delete' }}
              onClick={onDeleteCoupon}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </div>
        )}
      </>
    );
  },
);

export const MarketplaceContractPaymentCouponForStorybook = marketplaceCssHoc()(
  MarketplaceContractPaymentCoupon,
);

export default MarketplaceContractPaymentCoupon;
