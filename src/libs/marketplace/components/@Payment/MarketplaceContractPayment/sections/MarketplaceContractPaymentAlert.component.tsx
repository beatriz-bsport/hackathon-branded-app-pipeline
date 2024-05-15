import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useTranslation } from 'react-i18next';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { computeProrataPriceForSubscription } from '#libs/subscription/utils';
import type { Contract } from '#libs/subscription/types';
import { formatAsDate } from '#src/utils/datetime';

type Props = {
  contract: Contract;
  billingStartDate: string;
  voucher: number | null;
};

const MarketplaceContractPaymentAlert: React.FC<Props> = ({
  contract,
  billingStartDate,
  voucher,
}) => {
  const { t } = useTranslation('subscription');

  const contractPrice = React.useMemo(() => {
    if (contract?.month_billing_day) {
      const firstInvoiceProrataPrice = computeProrataPriceForSubscription(
        billingStartDate,
        contract?.month_billing_day,
        contract.recurrent_price.toString(),
      );
      return Math.max(
        parseFloat(firstInvoiceProrataPrice) - (voucher || 0),
        0,
      ).toFixed(2);
    }
    return (parseFloat(contract.recurrent_price) - (voucher || 0)).toFixed(2);
  }, [
    contract?.month_billing_day,
    contract.recurrent_price,
    billingStartDate,
    voucher,
  ]);

  if (!contract?.month_billing_day) return null;
  return (
    <div className="bs-contract-payment__alert">
      <InfoOutlinedIcon className="bs-contract-payment__alert__icon" />
      <span className="bs-contract-payment__alert__text">
        {t('subscription.prorata.helperOnSusscribe', {
          priceWithCurrency: getCurrencyDisplayWithPrice(contractPrice),
          firstBillingDate: formatAsDate(billingStartDate),
          recurrentPrice: `${getCurrencyDisplayWithPrice(
            parseFloat((contract?.recurrent_price ?? 0).toString()).toFixed(2),
          )}`,
          monthBillingDay: contract.month_billing_day,
        })}
      </span>
    </div>
  );
};

export default React.memo(MarketplaceContractPaymentAlert);
