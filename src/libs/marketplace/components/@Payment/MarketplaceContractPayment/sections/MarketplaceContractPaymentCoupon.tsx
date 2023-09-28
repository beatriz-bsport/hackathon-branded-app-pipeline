import React from 'react';

import { useTranslation } from 'react-i18next';
import DeleteIcon from '@material-ui/icons/Delete';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import MarketplaceCouponFormModal from '#marketplacecomponents/@Coupon/MarketplaceCouponFormModal';

import { OptionCallback } from '../../../../../../state/types';

import Button from '#components/css-only/Fabrique/Button';
import '../styles.css';

export type Props = {
  voucher: number | null;
  couponCode: string | null;
  isLoading?: boolean;
  isContractLegalTermsAccepted: boolean;
  isCouponFormOpen: boolean;
  onOpenCouponForm: () => void;
  onDeleteCoupon: () => void;
  onCancelCouponForm: () => void;
  onSubmitCouponForm: (
    formCouponCode: string,
    options: OptionCallback & { onNotFound: () => void },
  ) => Promise<void>;
};

const MarketplaceContractPaymentCoupon: React.FC<Props> = React.memo(
  ({
    voucher,
    couponCode,
    isLoading,
    isContractLegalTermsAccepted,
    isCouponFormOpen,
    onOpenCouponForm,
    onDeleteCoupon,
    onCancelCouponForm,
    onSubmitCouponForm,
  }) => {
    const { t } = useTranslation('coupon');

    return (
      <>
        {!voucher && (
          <Button
            classes={{ root: 'bs-contract-payment__pricing__promo__button' }}
            isDisabled={isLoading || !isContractLegalTermsAccepted}
            onClick={onOpenCouponForm}
          >
            {t('coupon:code.addCoupon.label')}
          </Button>
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

        <MarketplaceCouponFormModal
          isOpen={isCouponFormOpen}
          onCancel={onCancelCouponForm}
          onSubmit={onSubmitCouponForm}
        />
      </>
    );
  },
);

export const MarketplaceContractPaymentCouponForStorybook = marketplaceCssHoc()(
  MarketplaceContractPaymentCoupon,
);

export default MarketplaceContractPaymentCoupon;
